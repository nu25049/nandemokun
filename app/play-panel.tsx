'use client';
import {useEffect,useRef,useState} from 'react';
import {checkAnswer,nextQuestion,remainingSeconds,type GameKind} from '../lib/play';

export default function PlayPanel({kind,minutes}:{kind:GameKind;minutes:number}) {
 const [question,setQuestion]=useState(()=>nextQuestion(kind));
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState<boolean|null>(null);
 const [score,setScore]=useState(0);
 const [answered,setAnswered]=useState(0);
 const [deadline,setDeadline]=useState(()=>Date.now()+minutes*60000);
 const [seconds,setSeconds]=useState(minutes*60);
 const [ended,setEnded]=useState(false);
 const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  if(ended)return;
  const tick=()=>{const left=remainingSeconds(deadline);setSeconds(left);if(!left)setEnded(true);};
  tick();const timer=setInterval(tick,250);return()=>clearInterval(timer);
 },[deadline,ended]);
 useEffect(()=>{if(!ended && feedback===null)input.current?.focus();},[question,ended,feedback]);
 function submit(value:string) {
  if(ended||feedback!==null)return;
  if(!remainingSeconds(deadline)){setSeconds(0);setEnded(true);return;}
  if(!value.trim())return;
  const correct=checkAnswer(question,value);setFeedback(correct);setAnswered(n=>n+1);if(correct)setScore(n=>n+1);
 }
 function next(){setQuestion(nextQuestion(kind,question.id));setAnswer('');setFeedback(null);}
 function restart(){setQuestion(nextQuestion(kind,question.id));setAnswer('');setFeedback(null);setScore(0);setAnswered(0);setSeconds(minutes*60);setDeadline(Date.now()+minutes*60000);setEnded(false);}
 return <section className="play-panel" aria-label={kind==='calculation'?'計算チャレンジ':'なぞなぞチャレンジ'}>
  <div className="play-top"><span aria-live="off">残り {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span><span>{score}問正解</span></div>
  {ended?<div className="play-summary" role="status"><h3>おつかれさま！</h3><p>{minutes}分チャレンジ：{answered}問中 {score}問正解</p><p>答えた分だけ、頭を動かせました。</p><button className="secondary" onClick={restart}>もう一回遊ぶ</button></div>:<>
   <h3 className={kind==='calculation'?'calculation-question':'riddle-question'}>{question.prompt}</h3>
   {question.choices?<div className="answer-choices">{question.choices.map(choice=><button key={choice} disabled={feedback!==null} onClick={()=>submit(choice)}>{choice}</button>)}</div>:
    <form className="answer-form" onSubmit={e=>{e.preventDefault();submit(answer);}}><label htmlFor="calculation-answer">答え</label><input ref={input} id="calculation-answer" inputMode="numeric" autoComplete="off" value={answer} disabled={feedback!==null} onChange={e=>setAnswer(e.target.value)} maxLength={8}/><button className="secondary" disabled={feedback!==null||!answer.trim()}>答え合わせ</button></form>}
   {feedback!==null&&<div className="answer-feedback" role="status"><strong>{feedback?'正解！':'答えは '+question.answer}</strong><p>{question.explanation}</p><button className="secondary" onClick={next}>次の問題へ →</button></div>}
   <button className="cancel" onClick={()=>setEnded(true)}>ここで終了</button>
  </>}
 </section>;
}
