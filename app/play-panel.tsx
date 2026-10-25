'use client';
import {useEffect,useRef,useState} from 'react';
import {checkAnswer,elapsedSeconds,GAME_LABELS,nextQuestion,questionBank,remainingSeconds,type GameKind,type Question,type TimerMode} from '../lib/play';

export default function PlayPanel({kind,minutes,mode}:{kind:GameKind;minutes:number;mode:TimerMode}) {
 const [question,setQuestion]=useState<Question|null>(null);
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState<boolean|null>(null);
 const [selectedChoice,setSelectedChoice]=useState<string|null>(null);
 const [lastExplanation,setLastExplanation]=useState('');
 const [score,setScore]=useState(0);
 const [startedAt,setStartedAt]=useState<number|null>(null);
 const [seconds,setSeconds]=useState(mode==='down'?minutes*60:0);
 const [ended,setEnded]=useState(false);
 const [announcement,setAnnouncement]=useState('');
 const input=useRef<HTMLInputElement>(null);
 const locked=useRef(false);
 const composing=useRef(false);
 const selected=useRef<string|null>(null);
 const seen=useRef<string[]>([]);
 function draw(){const bank=questionBank(kind);if(bank.length&&seen.current.length>=bank.length)seen.current=seen.current.slice(-1);const next=nextQuestion(kind,seen.current);seen.current.push(next.id);if(kind==='calculation')seen.current=seen.current.slice(-20);return next;}

 // 問題と開始時刻はマウント後に作り、サーバーとブラウザーの表示を一致させる。
 useEffect(()=>{seen.current=[];setQuestion(draw());setStartedAt(Date.now());},[kind]);
 useEffect(()=>{
  if(startedAt===null||ended)return;
  const tick=()=>{
   const value=mode==='down'?remainingSeconds(startedAt+minutes*60000):elapsedSeconds(startedAt);
   setSeconds(value);
   if(mode==='down'&&value===0){locked.current=true;setEnded(true);}
  };
  tick();const timer=setInterval(tick,100);return()=>clearInterval(timer);
 },[startedAt,minutes,mode,ended]);
 useEffect(()=>{locked.current=false;if(question&&!ended)input.current?.focus();},[question,ended]);

 function submit(value:string,explicit=false) {
  if(!question||startedAt===null||ended||locked.current||composing.current||!value.trim())return;
  if(mode==='down'&&!remainingSeconds(startedAt+minutes*60000)){locked.current=true;setSeconds(0);setEnded(true);return;}
  if(kind!=='calculation'&&selected.current!==value){selected.current=value;setSelectedChoice(value);setFeedback(null);setAnnouncement(`「${value}」を選択。もう一度同じ答えをタップすると確定します。`);return;}
  const correct=checkAnswer(question,value);
  if(kind==='calculation') {
   if(correct){
    locked.current=true;setScore(n=>n+1);setAnnouncement('正解！');
    setQuestion(draw());setAnswer('');setFeedback(null);
   } else if(explicit){setAnnouncement('もう一度。答えを入力し直してください。');input.current?.select();}
  } else {
   selected.current=null;setSelectedChoice(null);
   if(correct){locked.current=true;setScore(n=>n+1);setLastExplanation(question.explanation);setAnnouncement('正解！');setFeedback(null);setQuestion(draw());}
   else {setFeedback(false);setAnnouncement('違います。別の答えを選んで、同じ答えをもう一度タップしてください。');}
  }
 }
 return <main className="focus-game">
  <div className="focus-top"><a className="game-back" href="/">← 戻る</a><span className="game-kind">{GAME_LABELS[kind]}</span><span className="game-score" aria-live="polite">{score}問正解</span></div>
  <section className="focus-stage" aria-label={GAME_LABELS[kind]}>
   <div className="game-clock" aria-live="off"><span>{mode==='down'?'残り時間':'経過時間'}</span><time>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</time></div>
   {ended?<div className="game-summary" role="status"><p className="eyebrow">TIME IS UP</p><h1>おつかれさま！</h1><p><strong>{score}</strong>問正解</p><p>{minutes}分のチャレンジ終了。左上から戻れます。</p>{lastExplanation&&<p>最後に正解した問題：{lastExplanation}</p>}</div>:question?<>
    <h1 className={kind==='calculation'?'focus-calculation':'focus-riddle'}>{kind==='calculation'?<><span>{question.prompt.slice(0,-4)}</span><span className="equation-result"> = ?</span></>:question.prompt}</h1>
    {question.choices?<><p className="quiz-instruction">1回タップで選択、同じ答えをもう1回で確定。</p><div className="focus-choices">{question.choices.map(choice=><button key={`${question.id}:${choice}`} aria-pressed={selectedChoice===choice} onClick={()=>submit(choice)}>{choice}</button>)}</div></>:
     <form className="focus-answer" onSubmit={e=>{e.preventDefault();submit(answer,true);}}><label htmlFor="calculation-answer">答え</label><input ref={input} id="calculation-answer" inputMode="numeric" autoComplete="off" autoCapitalize="off" spellCheck={false} value={answer} onChange={e=>{if(locked.current)return;setAnswer(e.target.value);setAnnouncement('');submit(e.target.value);}} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={e=>{composing.current=false;submit(e.currentTarget.value);}} maxLength={8}/><p>2桁×2桁 ／ 4桁＋4桁 ／ 4桁−4桁<br/>正解したらすぐ次へ。ボタンを押す必要はありません。</p></form>}
    {kind!=='calculation'?<div className="focus-feedback" role="status"><p className={feedback===false?'quiz-error':''}>{announcement||'答えをひとつ選んでください。'}</p>{lastExplanation&&<p className="previous-explanation">前の問題の解説：{lastExplanation}</p>}</div>:<p className="speed-feedback" role="status">{announcement}</p>}
   </>:<p role="status">問題を準備しています…</p>}
  </section>
 </main>;
}
