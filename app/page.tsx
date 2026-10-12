'use client';
import { useCallback, useEffect, useState } from 'react';
import { Action, filterByTime, initialActions, parseActions, pickNextAction, refreshInitialActions, STORAGE_KEY } from '../lib/actions';
import WeatherPanel from './weather-panel';
import { filterIndoors } from '../lib/weather';
export default function Home() {
 const [actions,setActions]=useState<Action[]>([]);
 const [ready,setReady]=useState(false);
 const [result,setResult]=useState<Action|null>(null);
 const [message,setMessage]=useState('');
 const [editing,setEditing]=useState<string|null>(null);
 const [title,setTitle]=useState(''); const [minutes,setMinutes]=useState('15');
 const [place,setPlace]=useState<'indoor'|'outdoor'>('indoor'); const [note,setNote]=useState('');
 const [maxMinutes,setMaxMinutes]=useState<number|null>(null);
 const [avoidRepeat,setAvoidRepeat]=useState(false);
 const [indoorOnly,setIndoorOnly]=useState(false);
 const changePlace=useCallback((value:boolean)=>{setIndoorOnly(value);setResult(null);},[]);
 const eligibleActions=filterIndoors(filterByTime(actions,maxMinutes),indoorOnly);
 useEffect(()=>{try {const raw=localStorage.getItem(STORAGE_KEY); setActions(raw===null ? initialActions : refreshInitialActions(parseActions(raw)));} catch {setMessage('保存データを読み込めませんでした。候補を追加して再保存できます。');} setReady(true);},[]);
 function persist(next:Action[]) {setActions(next); try {localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setMessage('この端末に保存しました。');} catch {setMessage('端末への保存に失敗しました。再読み込みすると変更が失われる可能性があります。');}}
 function resetForm(){setEditing(null);setTitle('');setMinutes('15');setPlace('indoor');setNote('');}
 function submit(e:React.FormEvent){e.preventDefault();const n=Number(minutes);if (!title.trim() || title.trim().length>80 || !Number.isInteger(n) || n<1 || n>1440) {setMessage('候補名と1〜1440分の整数を入力してください。');return;} const item:Action={id:editing??crypto.randomUUID(),title:title.trim(),minutes:n,place,note:note.trim()};persist(editing?actions.map(a=>a.id===editing?item:a):[...actions,item]);if(result?.id===editing)setResult(filterIndoors(filterByTime([item],maxMinutes),indoorOnly)[0]??null);resetForm();}
 function edit(a:Action){setEditing(a.id);setTitle(a.title);setMinutes(String(a.minutes));setPlace(a.place);setNote(a.note);document.getElementById('action-title')?.focus();}
 function remove(a:Action){if(!window.confirm(`「${a.title}」を削除しますか？`))return;persist(actions.filter(x=>x.id!==a.id));if(result?.id===a.id)setResult(null);if(editing===a.id)resetForm();}
 function changeTime(value:string){setMaxMinutes(value===''?null:Number(value));setResult(null);}
 function suggest(){setResult(pickNextAction(eligibleActions,result?.id??null,avoidRepeat));setMessage(eligibleActions.length?'対象の候補からランダムに選びました。':'条件を広げるか、候補を追加してください。');}
 return <main>
 <header><a className="brand" href="/">暇な君へ<span className="brand-dot">●</span></a><a className="nav" href="#my-actions">自分の候補 ↗</a></header>
 <section className="hero"><div className="intro"><span className="eyebrow">A LITTLE NUDGE FOR YOUR DAY</span><h1>なにしよう。<br/>その先の、<em>一歩へ。</em></h1><p className="lead">予定のない時間も、あなたの時間。<br/>迷ったら、次にすることをひとつ決めよう。</p><div className="hint"><span>✦</span> 選ぶのを、ちょっとおまかせ。</div></div>
 <div className="suggestion">
  <div className="card-top"><span>YOUR NEXT MOVE</span><span className="pill">{ready?`${actions.length}件の候補`:'読み込み中'}</span></div>
  <div className="orb" aria-hidden="true">↗</div>
  <div className="result" aria-live="polite">
   {result?<><div className="result-meta">{result.place==='indoor'?'室内で':'外に出て'} · 約{result.minutes}分</div><h2>{result.title}</h2>{result.note&&<p>{result.note}</p>}</>:
    ready&&actions.length>0&&!eligibleActions.length?<><h2>{indoorOnly?'この条件に合う室内候補がありません':'この時間でできる候補がありません'}</h2><p>時間・場所の条件を広げるか、<br/>条件に合う候補を追加してみよう。</p></>:
    <><h2>{ready&&!actions.length?'あなたの候補を追加しよう':'今日の余白に、何をする？'}</h2><p>ボタンを押すと、登録した候補から<br/>行動をひとつ提案します。</p></>}
  </div>
  <div className="suggestion-options">
   <label htmlFor="available-time">使える時間</label>
   <select id="available-time" value={maxMinutes??''} onChange={e=>changeTime(e.target.value)} disabled={!ready}>
    <option value="">時間を指定しない</option><option value="5">5分以内</option><option value="15">15分以内</option><option value="30">30分以内</option><option value="60">60分以内</option>
   </select>
   <label className="repeat-option"><input type="checkbox" checked={avoidRepeat} onChange={e=>setAvoidRepeat(e.target.checked)} disabled={!ready}/>同じ候補の連続を避ける</label>
   <p className="eligible-count" aria-live="polite">{ready?`提案できる候補：${eligibleActions.length}件`:'候補を読み込み中'}{avoidRepeat&&eligibleActions.length===1?'（1件のため同じ候補を提案します）':''}</p>
   {ready&&actions.length>0&&!eligibleActions.length&&maxMinutes!==null&&<button className="reset-time" type="button" onClick={()=>changeTime('')}>時間の指定を解除</button>}
   <WeatherPanel indoorOnly={indoorOnly} onChange={changePlace} disabled={!ready}/>
  </div>
  <button className="primary" disabled={!ready||!eligibleActions.length} onClick={suggest}>{result?'もう一度、提案してもらう':'いま、何しよう？'} <span>↗</span></button>
  <small>対象の候補からランダムに選びます</small>
 </div></section>
 <section className="workspace" id="my-actions"><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>自分の「やってみたい」を集めよう。</h2></div><p>いつものことも、気になることも。</p></div><div className="columns"><form onSubmit={submit} className="form-card"><h3>{editing?'候補を編集する':'候補をひとつ追加'}</h3><label htmlFor="action-title">何をする？</label><input id="action-title" value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} required placeholder="例：机の上の物を3つ元の場所に戻す"/><div className="form-row"><div><label htmlFor="minutes">目安の時間（分）</label><input id="minutes" type="number" min="1" max="1440" step="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></div><div><label htmlFor="place">場所</label><select id="place" value={place} onChange={e=>setPlace(e.target.value as Action['place'])}><option value="indoor">室内</option><option value="outdoor">屋外</option></select></div></div><label htmlFor="note">ひとことメモ（任意）</label><textarea id="note" value={note} onChange={e=>setNote(e.target.value)} maxLength={200} placeholder="例：出したままの文房具を戻す。3つ戻したら終わり。"/><button className="secondary" disabled={!ready}>{editing?'変更を保存':'候補を追加'} <span>＋</span></button>{editing&&<button className="cancel" type="button" onClick={resetForm}>編集をキャンセル</button>}<p className="storage-note">候補はこのブラウザーに保存されます。別の端末との同期はまだありません。</p></form><div className="list-panel"><div className="list-heading"><h3>あなたの行動リスト</h3><span>{actions.length} IDEAS</span></div>{ready&&actions.length===0?<div className="empty">まだ候補がありません。<br/>気軽にできることから追加してみよう。</div>:actions.map((a,i)=><article className="action" key={a.id}><span className="number">{String(i+1).padStart(2,'0')}</span><div className="action-body"><h4>{a.title}</h4><p>{a.place==='indoor'?'室内':'屋外'} <span>·</span> 約{a.minutes}分</p></div><div className="action-buttons"><button onClick={()=>edit(a)} aria-label={`${a.title}を編集`}>編集</button><button onClick={()=>remove(a)} aria-label={`${a.title}を削除`}>削除</button></div></article>)}</div></div></section><p className="status" role="status">{message}</p><footer><span>暇な君へ</span><p>余白から、はじめよう。</p><small>天気の利用は任意です。周辺施設の検索は今後追加予定です。</small></footer>
 </main>;
}
