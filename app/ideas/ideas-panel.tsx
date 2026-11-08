'use client';
import {useEffect,useRef,useState} from 'react';
import {catalog,type CatalogAction} from '../../lib/catalog';
import {CATEGORY_LABELS} from '../../lib/categories';
import {discover,defaultDiscoveryFilters,type DiscoveryFilters} from '../../lib/discovery';
import {parseActions,STORAGE_KEY,initialActions,type Action} from '../../lib/actions';
import {emptyEngagement,parseEngagement,toggleFavorite,ENGAGEMENT_KEY,type Engagement} from '../../lib/engagement';
import {recommendations} from '../../lib/recommendations';
import {defaultPreferences,parsePreferences,PREFERENCES_KEY,pickPersonalized} from '../../lib/preferences';

export default function IdeasPanel(){
 const [filters,setFilters]=useState(defaultDiscoveryFilters),[limit,setLimit]=useState(12),[state,setState]=useState(emptyEngagement),[ready,setReady]=useState(false),[notice,setNotice]=useState(''),[selected,setSelected]=useState<CatalogAction|null>(null);
 const [prefs,setPrefs]=useState(defaultPreferences);const saved=useRef<Action[]>([]),current=useRef<Engagement>(state);
 useEffect(()=>{
  try{const raw=localStorage.getItem(STORAGE_KEY);saved.current=raw===null?initialActions:parseActions(raw);}catch{setNotice('自分の保存候補を読み込めませんでした。カタログは利用できます。');}
  const pool=recommendations(saved.current,[],[],null,false,'all');
  try{const next=parseEngagement(localStorage.getItem(ENGAGEMENT_KEY),pool);current.current=next;setState(next);}catch{setNotice('お気に入りを読み込めませんでした。カタログは利用できます。');}
  try{const raw=localStorage.getItem(PREFERENCES_KEY);if(raw)setPrefs(parsePreferences(JSON.parse(raw)));}catch{/* 不正な好みは初期値で続ける。 */}
  const controller=new AbortController();
  void fetch('/api/account',{cache:'no-store',signal:controller.signal}).then(response=>response.ok?response.json():null).then(data=>{if(data?.user&&data.preferences&&!controller.signal.aborted)setPrefs(parsePreferences(data.preferences));}).catch(()=>{});
  setReady(true);return()=>controller.abort();
 },[]);
 const items=discover(catalog,filters,state.favorites),visible=items.slice(0,limit);
 function update(next:Partial<DiscoveryFilters>){setFilters(value=>({...value,...next}));setLimit(12);setSelected(null);}
 function favorite(item:CatalogAction){const next=toggleFavorite(current.current,{...item,source:'library'});current.current=next;setState(next);try{localStorage.setItem(ENGAGEMENT_KEY,JSON.stringify(next));setNotice('お気に入りを保存しました。');}catch{setNotice('端末に保存できませんでした。この画面では変更を使えます。');}}
 function choose(){const next=pickPersonalized(items.map(item=>({...item,source:'library' as const})),prefs);setSelected(next);if(!next)setNotice('この条件と提案の好みに合う候補がありません。条件やホームの好みを変更してください。');}
 function card(item:CatalogAction,highlight=false){return <article key={item.id} className={'idea-card'+(highlight?' idea-selected':'')}><div className="idea-meta">{CATEGORY_LABELS[item.category]} · {item.minutes}分 · {item.place==='indoor'?'室内':'屋外'}</div><h2>{item.title}</h2><p>{item.note}</p><div className="idea-actions"><a href={'/activity?id='+encodeURIComponent(item.id)}>これを始める ↗</a><button disabled={!ready} aria-label={item.title+'をお気に入りに'+(state.favorites.includes(item.id)?'解除':'追加')} aria-pressed={state.favorites.includes(item.id)} onClick={()=>favorite(item)}>{state.favorites.includes(item.id)?'★ お気に入り':'☆ お気に入り'}</button></div></article>;}
 return <main className="ideas-page"><header><a className="brand" href="/">暇な君へ</a><a className="nav" href="/">← ホームへ</a></header><section className="ideas-heading"><span className="eyebrow">FIND YOUR NEXT MOVE</span><h1>暇つぶしを探す</h1><p>手順付きの{catalog.length}件から、いま始めたいものを選ぼう。</p></section>
  <section className="idea-filters" aria-label="暇つぶしの検索条件"><div><label htmlFor="idea-query">やりたいこと・キーワード</label><input id="idea-query" type="search" value={filters.query} onChange={e=>update({query:e.target.value})} placeholder="例：紙 描く"/></div><div><label htmlFor="idea-category">暇つぶしの種類</label><select id="idea-category" value={filters.category} onChange={e=>update({category:e.target.value})}><option value="all">すべて</option>{(['create','relax','observe','organize','learn','move'] as const).map(key=><option key={key} value={key}>{CATEGORY_LABELS[key]}</option>)}</select></div><div><label htmlFor="idea-time">探す暇つぶしの時間</label><select id="idea-time" value={filters.minutes??''} onChange={e=>update({minutes:e.target.value===''?null:Number(e.target.value)})}>{[1,3,5,10,15,30,60].map(n=><option key={n} value={n}>{n}分以内</option>)}<option value="">すべての時間</option></select></div><div><label htmlFor="idea-place">暇つぶしの場所</label><select id="idea-place" value={filters.place} onChange={e=>update({place:e.target.value as DiscoveryFilters['place']})}><option value="all">すべて</option><option value="indoor">室内</option><option value="outdoor">屋外</option></select></div><div><label htmlFor="idea-sort">暇つぶしの並び順</label><select id="idea-sort" value={filters.sort} onChange={e=>update({sort:e.target.value as DiscoveryFilters['sort']})}><option value="original">おすすめ順</option><option value="short">短い時間順</option><option value="long">長い時間順</option></select></div><label className="repeat-option"><input type="checkbox" checked={filters.favoritesOnly} onChange={e=>update({favoritesOnly:e.target.checked})}/>お気に入りだけ</label></section>
  <div className="idea-results-top"><p aria-live="polite">{items.length}件見つかりました</p><button className="weather-button" disabled={!ready||!items.length} onClick={choose}>この条件からひとつ選ぶ</button><button className="cancel" onClick={()=>{setFilters(defaultDiscoveryFilters());setLimit(12);setSelected(null);}}>検索条件をリセット</button></div>
  <p className="connection-notice" role="status">{notice}</p>{selected&&items.some(item=>item.id===selected.id)&&<section className="idea-picked" aria-label="選ばれた暇つぶし">{card(selected,true)}</section>}
  {!items.length?<p className="empty">検索に合う暇つぶしがありません。時間やキーワードを変えてください。</p>:<section className="idea-grid" aria-label="暇つぶし一覧">{visible.map(item=>card(item))}</section>}
  {limit<items.length&&<button className="weather-button idea-more" onClick={()=>setLimit(value=>value+12)}>もっと見る（残り{items.length-limit}件）</button>}<footer><a href="/">← ホームへ戻る</a><p>ログインなしで探して、すぐ始められます。</p></footer></main>;
}
