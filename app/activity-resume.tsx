'use client';

import {useEffect,useMemo,useState} from 'react';
import type {Action} from '../lib/actions';
import {remainingActivitySeconds,resolveActivity} from '../lib/activity';
import {ACTIVITY_PROGRESS_KEY,matchesActivityProgress,readActivityProgress,type ActivityProgress} from '../lib/activity-progress';
import {ENGAGEMENT_KEY,parseEngagement,type Feedback} from '../lib/engagement';
import {recommendations} from '../lib/recommendations';

export default function ActivityResume({actions,ready,feedback}:{actions:Action[];ready:boolean;feedback:Feedback[]}){
 const [records,setRecords]=useState<ActivityProgress[]>([]);
 const [now,setNow]=useState(0);

 useEffect(()=>{
  if(!ready)return;
  function refresh(){
   let next:ActivityProgress[]=[];
   try{
    next=readActivityProgress(window.localStorage);
    if(next.length){
     const candidates=recommendations(actions,[],[],null,false,'all');
     const saved=parseEngagement(window.localStorage.getItem(ENGAGEMENT_KEY),candidates);
     const finished=new Set([...feedback,...saved.feedback].filter(entry=>entry.outcome!=='pending').map(entry=>entry.id));
     next=next.filter(record=>!finished.has(record.occurrenceId));
    }
   }catch{/* 読めた進行記録があれば表示を続ける。 */}
   setRecords(next);
   setNow(Date.now());
  }
  function onStorage(event:StorageEvent){
   if(event.key===null||event.key===ACTIVITY_PROGRESS_KEY||event.key===ENGAGEMENT_KEY)refresh();
  }
  refresh();
  window.addEventListener('storage',onStorage);
  window.addEventListener('pageshow',refresh);
  return()=>{
   window.removeEventListener('storage',onStorage);
   window.removeEventListener('pageshow',refresh);
  };
 },[actions,ready,feedback]);

 const rows=useMemo(()=>{
  const recent=[...records].sort((first,second)=>second.updatedAt-first.updatedAt);
  const shown=new Set<string>();
  return recent.flatMap(record=>{
   if(shown.has(record.recommendationId)||shown.size>=3)return [];
   const item=resolveActivity(record.recommendationId,actions);
   if(!item||!matchesActivityProgress(record,item))return [];
   shown.add(item.id);
   return [{item,record}];
  });
 },[actions,records]);

 const ticking=ready&&rows.some(({record})=>!record.timer.paused&&remainingActivitySeconds(record.timer,now)>0);
 useEffect(()=>{
  if(!ticking)return;
  const interval=window.setInterval(()=>setNow(Date.now()),500);
  return()=>window.clearInterval(interval);
 },[ticking]);

 if(!ready||!rows.length)return null;

 return <section className="resume-card" aria-labelledby="activity-resume-title">
  <h2 id="activity-resume-title">途中の行動</h2>
  <p className="resume-card-meta">最近の3件まで再開できます。</p>
  <ul className="resume-card-list">
   {rows.map(({item,record})=>{
    const seconds=remainingActivitySeconds(record.timer,now);
    const clock=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
    return <li className="resume-card-row" key={item.id}>
     <div className="resume-card-copy">
      <h3>{item.title}</h3>
      <p className="resume-card-meta">
       残り <time dateTime={`PT${seconds}S`}>{clock}</time>
       {' · '}{record.checked.length} / {record.steps.length} 手順
       {seconds===0?' · 結果未記録':record.timer.paused?' · 一時停止中':''}
      </p>
     </div>
     <a className="resume-card-link" href={'/activity?id='+encodeURIComponent(item.id)} aria-label={seconds===0?`${item.title}の結果を記録`:`${item.title}を再開`}>
      {seconds===0?'結果を記録':'再開する'}
     </a>
    </li>;
   })}
  </ul>
 </section>;
}
