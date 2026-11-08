'use client';
import {useEffect,useRef,useState} from 'react';
import {initialActions,parseActions,STORAGE_KEY,type Action} from '../../lib/actions';
import {recommendations,type Recommendation} from '../../lib/recommendations';
import {ENGAGEMENT_KEY,emptyEngagement,parseEngagement,rate,toggleFavorite,type Engagement,type Outcome} from '../../lib/engagement';
import {resolveActivity,activitySteps,createActivityTimer,remainingActivitySeconds,pauseActivityTimer,resumeActivityTimer,type ActivityTimer} from '../../lib/activity';

export default function ActivityPanel({id}:{id:string}){
 const [item,setItem]=useState<Recommendation|null>(null),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 const [state,setState]=useState(emptyEngagement),[timer,setTimer]=useState<ActivityTimer|null>(null),[now,setNow]=useState(0),[checked,setChecked]=useState<number[]>([]),[outcome,setOutcome]=useState<Outcome>('pending');
 const current=useRef<Engagement>(state),session=useRef(''),initialized=useRef<string|null>(null);
 function save(next:Engagement,announce=true){current.current=next;setState(next);try{localStorage.setItem(ENGAGEMENT_KEY,JSON.stringify(next));if(announce)setNotice('このブラウザーに記録しました。');}catch{setNotice('端末に保存できませんでした。この画面では続けられます。');}}
 useEffect(()=>{
  if(initialized.current===id)return;initialized.current=id;
  let actions:Action[]=initialActions;try{const raw=localStorage.getItem(STORAGE_KEY);if(raw!==null)actions=parseActions(raw);}catch{actions=[];setNotice('自分の候補を読み込めませんでした。カタログは利用できます。');}
  const next=resolveActivity(id,actions);setReady(true);if(!next)return;
  let loaded=emptyEngagement();try{loaded=parseEngagement(localStorage.getItem(ENGAGEMENT_KEY),recommendations(actions,[],[],null,false,'all'));}catch{setNotice('保存された利用記録を読み込めませんでした。新しく記録できます。');}
  const pending=loaded.feedback.filter(row=>row.recommendationId===next.id&&row.outcome==='pending').at(-1);
  session.current=pending?.id??crypto.randomUUID();setItem(next);setTimer(createActivityTimer(next.minutes));setNow(Date.now());
  save(rate(loaded,next,session.current,'pending',pending?.at??Date.now()),false);
 },[id]);
 useEffect(()=>{if(!timer||timer.paused)return;const handle=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(handle);},[timer]);
 function finish(value:Outcome){if(!item||!timer)return;save(rate(current.current,item,session.current,value));setOutcome(value);setTimer(pauseActivityTimer(timer));setNow(Date.now());}
 const seconds=timer?remainingActivitySeconds(timer,now):0,steps=item?activitySteps(item.note||item.title):[];
 return <main className="activity-focus"><div className="activity-focus-top"><a href="/">← ホームへ</a><a href="/ideas">ほかの暇つぶしを探す</a></div>
  {!ready?<p>読み込み中…</p>:!item?<section className="activity-focus-card"><h1>この候補は見つかりませんでした</h1><p>削除済みの候補や、お店・課題はこの画面では開けません。ホームから選び直してください。</p></section>:<section className="activity-focus-card"><span className="eyebrow">ONE THING AT A TIME</span><h1>{item.title}</h1>
   <div className="activity-focus-clock"><time>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</time><p>{outcome!=='pending'?'結果を記録しました。':seconds===0?'目安の時間になりました。やってみたか、下のボタンで記録しよう。':timer?.paused?'一時停止中':'あと約'+Math.ceil(seconds/60)+'分。手順をひとつずつ進めよう。'}</p></div>
   <div className="activity-focus-controls"><button disabled={!seconds||outcome!=='pending'} onClick={()=>{if(!timer)return;setTimer(timer.paused?resumeActivityTimer(timer):pauseActivityTimer(timer));setNow(Date.now());}}>{timer?.paused?'再開':'一時停止'}</button><button aria-pressed={state.favorites.includes(item.id)} onClick={()=>save(toggleFavorite(current.current,item))}>{state.favorites.includes(item.id)?'★ お気に入り済み':'☆ お気に入りに追加'}</button></div>
   <h2>やること</h2><p className="activity-focus-progress">{checked.length} / {steps.length}ステップ</p><ul className="activity-focus-checklist">{steps.map((step,index)=><li key={index}><label><input type="checkbox" checked={checked.includes(index)} onChange={e=>setChecked(value=>e.target.checked?[...value,index]:value.filter(n=>n!==index))}/><span>{step}</span></label></li>)}</ul>
   <div className="activity-focus-outcomes"><button aria-pressed={outcome==='done'} onClick={()=>finish('done')}>やってみた</button><button aria-pressed={outcome==='skip'} onClick={()=>finish('skip')}>今回は見送る</button></div><p className="activity-focus-summary">タイマー終了やチェックだけでは評価せず、押した結果を次の提案に使います。結果はホームの利用記録からも変更できます。</p><p className="activity-focus-notice" role="status">{notice}</p>
  </section>}
 </main>;
}
