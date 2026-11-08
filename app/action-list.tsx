'use client';
import {useState} from 'react';
import type {Action} from '../lib/actions';
import {searchActions,type ActionPlace,type ActionSort} from '../lib/action-search';

export default function ActionList({actions,ready,onEdit,onRemove}:{actions:Action[];ready:boolean;onEdit:(action:Action)=>void;onRemove:(action:Action)=>void}){
 const [query,setQuery]=useState('');
 const [sort,setSort]=useState<ActionSort>('added');
 const [place,setPlace]=useState<ActionPlace>('all');
 const visible=searchActions(actions,query,sort,place);
 const filtered=query.trim()!==''||sort!=='added'||place!=='all';
 function clear(){setQuery('');setSort('added');setPlace('all');}
 return <div className="list-panel">
  <div className="list-heading"><h3>あなたの行動リスト</h3><span>{actions.length} IDEAS</span></div>
  <div className="action-list-tools">
   <label htmlFor="action-search">自分の候補を検索</label><input id="action-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} disabled={!ready} maxLength={200} placeholder="候補名やメモの言葉で探す"/>
   <div className="action-list-filters">
    <div><label htmlFor="action-sort">候補の並び順</label><select id="action-sort" value={sort} onChange={event=>setSort(event.target.value as ActionSort)} disabled={!ready}><option value="added">登録順</option><option value="short">短い時間順</option><option value="long">長い時間順</option><option value="name">名前順</option></select></div>
    <div><label htmlFor="action-filter-place">候補の場所</label><select id="action-filter-place" value={place} onChange={event=>setPlace(event.target.value as ActionPlace)} disabled={!ready}><option value="all">すべて</option><option value="indoor">室内</option><option value="outdoor">屋外</option></select></div>
   </div>
   <p className="action-filter-count" aria-live="polite">{ready?`${visible.length}件を表示 / 全${actions.length}件`:'候補を読み込み中'}</p>
   {filtered&&visible.length>0&&<button className="cancel" type="button" onClick={clear}>検索条件をクリア</button>}
  </div>
  {ready&&actions.length===0?<div className="empty">まだ自分の候補がありません。<br/>画面内の遊びはそのまま利用できます。</div>:ready&&visible.length===0?<div className="empty"><p>検索に合う候補がありません</p><button className="weather-button" type="button" onClick={clear}>検索条件をクリア</button></div>:visible.map((action,index)=><article className="action" key={action.id}>
   <span className="number">{String(index+1).padStart(2,'0')}</span>
   <div className="action-body"><h4>{action.title}</h4><p>{action.place==='indoor'?'室内':'屋外'} <span>·</span> 約{action.minutes}分</p></div>
   <div className="action-buttons"><button onClick={()=>onEdit(action)} aria-label={`${action.title}を編集`}>編集</button><button onClick={()=>onRemove(action)} aria-label={`${action.title}を削除`}>削除</button></div>
  </article>)}
 </div>;
}
