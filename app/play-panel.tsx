'use client';
import {useEffect,useRef,useState} from 'react';
import {checkAnswer,elapsedSeconds,nextQuestion,remainingSeconds,type GameKind,type Question,type TimerMode} from '../lib/play';

export default function PlayPanel({kind,minutes,mode}:{kind:GameKind;minutes:number;mode:TimerMode}) {
 const [question,setQuestion]=useState<Question|null>(null);
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState<boolean|null>(null);
 const [score,setScore]=useState(0);
 const [startedAt,setStartedAt]=useState<number|null>(null);
 const [seconds,setSeconds]=useState(mode==='down'?minutes*60:0);
 const [ended,setEnded]=useState(false);
 const [announcement,setAnnouncement]=useState('');
 const input=useRef<HTMLInputElement>(null);
 const locked=useRef(false);
 const composing=useRef(false);

 // 問題と開始時刻はマウント後に作り、サーバーとブラウザーの表示を一致させる。
 useEffect(()=>{setQuestion(nextQuestion(kind));setStartedAt(Date.now());},[kind]);
 useEffect(()=>{
  if(startedAt===null||ended)return;
  const tick=()=>{
   const value=mode==='down'?remainingSeconds(startedAt+minutes*60000):elapsedSeconds(startedAt);
   setSeconds(value);
   if(mode==='down'&&value===0){locked.current=true;setEnded(true);}
  };
  tick();const timer=setInterval(tick,100);return()=>clearInterval(timer);
 },[startedAt,minutes,mode,ended]);
 useEffect(()=>{if(kind==='calculation')locked.current=false;if(question&&!ended)input.current?.focus();},[question,ended,kind]);
 useEffect(()=>{
  if(kind!=='riddle'||feedback===null||!question||ended)return;
  const timer=setTimeout(()=>{setQuestion(nextQuestion(kind,question.id));setAnswer('');setFeedback(null);locked.current=false;},5000);
  return()=>clearTimeout(timer);
 },[feedback,question,kind,ended]);

 function submit(value:string,explicit=false) {
  if(!question||startedAt===null||ended||locked.current||composing.current||!value.trim())return;
  if(mode==='down'&&!remainingSeconds(startedAt+minutes*60000)){locked.current=true;setSeconds(0);setEnded(true);return;}
  const correct=checkAnswer(question,value);
  if(kind==='calculation') {
   if(correct){
    locked.current=true;setScore(n=>n+1);setAnnouncement('正解！');
    setQuestion(nextQuestion(kind,question.id));setAnswer('');setFeedback(null);
   } else if(explicit){setAnnouncement('もう一度。答えを入力し直してください。');input.current?.select();}
  } else {locked.current=true;setFeedback(correct);if(correct)setScore(n=>n+1);}
 }
 return <main className="focus-game">
  <div className="focus-top"><a className="game-back" href="/">← 戻る</a><span className="game-kind">{kind==='calculation'?'計算チャレンジ':'なぞなぞ・ひらめき問題'}</span><span className="game-score" aria-live="polite">{score}問正解</span></div>
  <section className="focus-stage" aria-label={kind==='calculation'?'計算チャレンジ':'なぞなぞチャレンジ'}>
   <div className="game-clock" aria-live="off"><span>{mode==='down'?'残り時間':'経過時間'}</span><time>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</time></div>
   {ended?<div className="game-summary" role="status"><p className="eyebrow">TIME IS UP</p><h1>おつかれさま！</h1><p><strong>{score}</strong>問正解</p><p>{minutes}分のチャレンジ終了。左上から戻れます。</p>{feedback!==null&&question&&<p>{question.explanation}</p>}</div>:question?<>
    <h1 className={kind==='calculation'?'focus-calculation':'focus-riddle'}>{question.prompt}</h1>
    {question.choices?<div className="focus-choices">{question.choices.map(choice=><button key={choice} disabled={feedback!==null} onClick={()=>submit(choice)}>{choice}</button>)}</div>:
     <form className="focus-answer" onSubmit={e=>{e.preventDefault();submit(answer,true);}}><label htmlFor="calculation-answer">答え</label><input ref={input} id="calculation-answer" inputMode="numeric" autoComplete="off" autoCapitalize="off" spellCheck={false} value={answer} onChange={e=>{setAnswer(e.target.value);setAnnouncement('');submit(e.target.value);}} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={e=>{composing.current=false;submit(e.currentTarget.value);}} maxLength={8}/><p>正解したらすぐ次へ。ボタンを押す必要はありません。</p></form>}
    {kind==='riddle'?<div className="focus-feedback" role="status">{feedback!==null?<><strong>{feedback?'正解！':`答えは ${question.answer}`}</strong><p>{question.explanation}</p><small>このあと自動で次の問題へ</small></>:<p>答えをひとつ選んでください。</p>}</div>:<p className="speed-feedback" role="status">{announcement}</p>}
   </>:<p role="status">問題を準備しています…</p>}
  </section>
 </main>;
}
