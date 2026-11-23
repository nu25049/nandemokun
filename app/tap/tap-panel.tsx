'use client';

import {useCallback,useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {addGameScore,GAME_PROGRESS_KEY,gameLevel,progressIsSaved,readGameProgress,type GameProgress} from '../../lib/game-progress';

const ROUND_SECONDS=30;
const CORRECT_POINTS=10;
const WRONG_POINTS=10;
const shapes=[
 {symbol:'●',name:'まる'},
 {symbol:'▲',name:'さんかく'},
 {symbol:'■',name:'しかく'},
 {symbol:'★',name:'ほし'}
] as const;

type Shape=typeof shapes[number];
type Turn={id:number;target:Shape;choices:Shape[]};
type Round={
 deadline:number;
 score:number;
 correct:number;
 wrong:number;
 previousBest:number;
 turn:Turn;
 finished:boolean;
};
type Feedback={message:string;kind:'correct'|'wrong'};

function drawTurn(id:number,previous?:Turn):Turn{
 const targets=shapes.filter(shape=>shape!==previous?.target);
 const target=targets[Math.floor(Math.random()*targets.length)];
 const choices:Shape[]=[...shapes];
 for(let index=choices.length-1;index>0;index--){
  const other=Math.floor(Math.random()*(index+1));
  [choices[index],choices[other]]=[choices[other],choices[index]];
 }
 const position=choices.indexOf(target);
 if(previous&&position===previous.choices.indexOf(previous.target)){
  const other=(position+1+Math.floor(Math.random()*(choices.length-1)))%choices.length;
  [choices[position],choices[other]]=[choices[other],choices[position]];
 }
 return {id,target,choices};
}

function ignoreHeldKey(event:KeyboardEvent<HTMLButtonElement>){
 if(event.repeat&&(event.key==='Enter'||event.key===' '))event.preventDefault();
}

export default function TapPanel(){
 const [round,setRound]=useState<Round|null>(null);
 const [seconds,setSeconds]=useState(ROUND_SECONDS);
 const [feedback,setFeedback]=useState<Feedback|null>(null);
 const [saveFailed,setSaveFailed]=useState(false);
 const [loadedProgress,setProgress]=useState<GameProgress|null>(null);
 const progress=loadedProgress??{totalScore:0,bestTap:0};
 const activeRound=useRef<Round|null>(null);
 const turnId=useRef(0);
 const firstChoice=useRef<HTMLButtonElement>(null);
 const retry=useRef<HTMLButtonElement>(null);
 const playing=round!==null&&!round.finished;
 const {level}=gameLevel(progress.totalScore);
 const goalBase=round?.finished
  ? Math.max(round.previousBest,round.score)
  : round?.previousBest??progress.bestTap;
 const nextGoal=Math.min(Number.MAX_SAFE_INTEGER,goalBase+CORRECT_POINTS);

 useEffect(()=>{
  function syncProgress(){
   setProgress(readGameProgress());
   setSaveFailed(!progressIsSaved());
  }
  function onStorage(event:StorageEvent){
   if(event.key===null||event.key===GAME_PROGRESS_KEY)syncProgress();
  }
  syncProgress();
  window.addEventListener('storage',onStorage);
  window.addEventListener('pageshow',syncProgress);
  return()=>{
   window.removeEventListener('storage',onStorage);
   window.removeEventListener('pageshow',syncProgress);
  };
 },[]);

 const finish=useCallback((current:Round)=>{
  if(activeRound.current!==current)return;
  activeRound.current=null;
  setProgress(addGameScore(0,current.score));
  setSaveFailed(!progressIsSaved());
  setSeconds(0);
  setFeedback(null);
  setRound({...current,finished:true});
 },[]);

 useEffect(()=>{
  if(!playing)return;
  function refreshClock(){
   const current=activeRound.current;
   if(!current)return;
   const milliseconds=current.deadline-Date.now();
   if(milliseconds<=0){finish(current);return;}
   setSeconds(Math.ceil(milliseconds/1000));
  }
  refreshClock();
  const interval=window.setInterval(refreshClock,125);
  window.addEventListener('pageshow',refreshClock);
  document.addEventListener('visibilitychange',refreshClock);
  return()=>{
   window.clearInterval(interval);
   window.removeEventListener('pageshow',refreshClock);
   document.removeEventListener('visibilitychange',refreshClock);
  };
 },[finish,playing]);

 useEffect(()=>{
  if(playing)firstChoice.current?.focus({preventScroll:true});
  else if(round?.finished)retry.current?.focus({preventScroll:true});
 },[playing,round?.finished]);

 useEffect(()=>{
  if(!feedback)return;
  const timeout=window.setTimeout(()=>setFeedback(null),450);
  return()=>window.clearTimeout(timeout);
 },[feedback]);

 function start(){
  if(activeRound.current)return;
  const latestProgress=readGameProgress();
  setProgress(latestProgress);
  setSaveFailed(!progressIsSaved());
  const next:Round={
   deadline:Date.now()+ROUND_SECONDS*1000,
   score:0,
   correct:0,
   wrong:0,
   previousBest:latestProgress.bestTap,
   turn:drawTurn(++turnId.current,round?.turn),
   finished:false,
  };
  activeRound.current=next;
  setRound(next);
  setSeconds(ROUND_SECONDS);
  setFeedback(null);
 }

 function choose(choice:Shape,id:number){
  const current=activeRound.current;
  if(!current||current.turn.id!==id)return;
  if(Date.now()>=current.deadline){finish(current);return;}
  const correct=choice===current.turn.target;
  const score=correct
   ? current.score+CORRECT_POINTS
   : Math.max(0,current.score-WRONG_POINTS);
  const next:Round={
   ...current,
   score,
   correct:current.correct+(correct?1:0),
   wrong:current.wrong+(correct?0:1),
   turn:drawTurn(++turnId.current,current.turn),
  };
  // 正誤どちらも描画前に次の問題へ移し、古い問題への連続イベントを無効にする。
  activeRound.current=next;
  setRound(next);
  if(correct){
   setProgress(addGameScore(CORRECT_POINTS));
   setSaveFailed(!progressIsSaved());
   setFeedback({message:`正解 +${CORRECT_POINTS}点`,kind:'correct'});
  }else{
   const lostPoints=current.score-score;
   const message=lostPoints>0?`誤タップ −${lostPoints}点`:'誤タップ・0点です';
   setFeedback({message,kind:'wrong'});
  }
 }

 return <main className="tap-game">
  <div className="tap-header">
   <a className="tap-back" href="/">← ホーム</a>
   <div className="tap-level"><span>レベル {level}</span><span>累計 {progress.totalScore}点</span></div>
  </div>
  <section className={`tap-card${feedback?.kind==='wrong'?' is-wrong':''}`} aria-labelledby="tap-title">
   <h1 id="tap-title">30秒タップ</h1>
   <dl className="tap-stats">
    <div className="tap-stat"><dt>残り時間</dt><dd><time dateTime={`PT${seconds}S`}>{seconds}秒</time></dd></div>
    <div className="tap-stat"><dt>今回の得点</dt><dd>{round?.score??0}点</dd></div>
    <div className="tap-stat"><dt>自己ベスト</dt><dd>{progress.bestTap}点</dd></div>
   </dl>
   {saveFailed&&<p className="tap-save-warning" role="status">得点を端末に保存できていません。この画面では続けられますが、閉じると今回の記録が失われることがあります。</p>}
   {!round?<>
    <p className="tap-prompt">同じ形をタップ。正解 ＋10点、誤タップ −10点。得点は0点まで下がります。1タップごとに次の形へ進みます。</p>
    <p className="tap-goal">次の目標 {nextGoal}点</p>
    <button className="tap-start" type="button" disabled={!loadedProgress} onKeyDown={ignoreHeldKey} onClick={start}>30秒スタート</button>
   </>:round.finished?<div className="tap-result">
    <h2>30秒終了</h2>
    <p><strong>{round.score}</strong>点</p>
    <p className="tap-counts"><span>正解 {round.correct}回</span><span>誤タップ {round.wrong}回</span></p>
    {round.score>round.previousBest
     ? <p className="tap-record">開始時の自己ベストを更新！ ＋{round.score-round.previousBest}点</p>
     : round.score===round.previousBest&&round.previousBest>0
      ? <p className="tap-record">開始時の自己ベストと同点！</p>
      : <p className="tap-record">開始時の自己ベスト {round.previousBest}点</p>}
    <p className="tap-goal">次の目標 {nextGoal}点</p>
    <div className="tap-actions">
     <button className="tap-start" ref={retry} type="button" onKeyDown={ignoreHeldKey} onClick={start}>もう一度</button>
     <a className="tap-back" href="/">ホームへ戻る</a>
    </div>
   </div>:<>
    <p className="tap-prompt">この形をタップ</p>
    <p className="tap-goal">目標 {nextGoal}点</p>
    <div className="tap-target" aria-live="polite" aria-atomic="true">
     <span className="tap-shape" aria-hidden="true">{round.turn.target.symbol}</span>
     <span>{round.turn.target.name}</span>
    </div>
    <div className="tap-grid">
     {round.turn.choices.map((shape,index)=><button key={index} className="tap-choice" ref={index===0?firstChoice:undefined} type="button" onKeyDown={ignoreHeldKey} onClick={()=>choose(shape,round.turn.id)}>
      <span className="tap-shape" aria-hidden="true">{shape.symbol}</span><span>{shape.name}</span>
     </button>)}
    </div>
    <p className="tap-counts"><span>正解 {round.correct}回</span><span>誤タップ {round.wrong}回</span></p>
    <p className={`tap-feedback${feedback?.kind==='wrong'?' is-wrong':''}`} role="status">{feedback?.message}</p>
   </>}
  </section>
 </main>;
}
