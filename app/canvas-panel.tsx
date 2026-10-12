'use client';
import {useEffect,useRef,useState} from 'react';
import {CANVAS_ORIGIN,type CanvasTask} from '../lib/canvas';

export default function CanvasPanel({onChange}:{onChange:(tasks:CanvasTask[])=>void}) {
 const [token,setToken]=useState('');
 const [tasks,setTasks]=useState<CanvasTask[]>([]);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const request=useRef(0),controller=useRef<AbortController|null>(null);
 useEffect(()=>()=>{request.current++;controller.current?.abort();},[]);
 useEffect(()=>{if(!tasks.length)return;const timer=setTimeout(()=>{setTasks([]);onChange([]);setNotice('取得から15分たちました。提出状況を確認するため、課題を取得し直してください。');},15*60000);return()=>clearTimeout(timer);},[tasks,onChange]);
 function disconnect(){request.current++;controller.current?.abort();setToken('');setTasks([]);onChange([]);setBusy(false);setNotice('接続情報と取得した課題をこの画面から消しました。');}
 async function connect(e:React.FormEvent){
  e.preventDefault();if(!token.trim()||busy)return;
  if(!/^\S{8,4096}$/.test(token.trim())){setNotice('トークンを確認してください。途中の空白や改行は使用できません。');return;}
  const id=++request.current;controller.current?.abort();const abort=new AbortController();controller.current=abort;
  setBusy(true);setTasks([]);onChange([]);setNotice('CanvasのToDoを確認しています…');
  try {
   const response=await fetch('/api/canvas',{method:'POST',headers:{Authorization:`Bearer ${token.trim()}`},signal:AbortSignal.any([abort.signal,AbortSignal.timeout(15000)])});
   const data=await response.json();if(request.current!==id)return;
   if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'Canvasから取得できませんでした。');
   if(!Array.isArray(data.tasks))throw new Error('課題を読み込めませんでした。');
   setTasks(data.tasks);onChange(data.tasks);setNotice(data.tasks.length?`${data.tasks.length}件の未提出課題を取得しました。${data.partial?'件数が多いため一部の結果です。':''}`:'CanvasのToDoに対象の未提出課題はありません。全コースの課題を網羅する一覧ではありません。');
  }catch(error){if(request.current===id){setTasks([]);onChange([]);setNotice(error instanceof Error && error.name!=='AbortError' && error.name!=='TimeoutError'?error.message:'Canvasとの通信が終了しました。もう一度取得してください。');}}
  finally{if(request.current===id)setBusy(false);}
 }
 return <div className="connection-card"><h3>Canvasの課題を確認</h3><p><a href={CANVAS_ORIGIN} target="_blank" rel="noreferrer">nu.instructure.com ↗</a> のToDoから未提出課題を取得します。</p>
  <form onSubmit={connect}><label htmlFor="canvas-token">Canvas APIトークン</label><input id="canvas-token" type="password" autoComplete="off" spellCheck={false} value={token} maxLength={4096} disabled={busy} onChange={e=>{setToken(e.target.value);if(tasks.length){setTasks([]);onChange([]);setNotice('接続情報を変更しました。課題を取得し直してください。');}}} placeholder="この画面だけで使用します"/><button className="secondary" disabled={!token.trim()||busy}>{busy?'課題を取得中…':'Canvasの課題を取得'}</button></form>
  <button className="cancel" onClick={disconnect}>接続情報と課題を消す</button><p className="connection-notice" role="status">{notice}</p>
  {tasks.length>0&&<ul className="connection-list">{tasks.slice(0,8).map(t=><li key={t.id}><a href={t.url} target="_blank" rel="noreferrer">{t.name} ↗</a><span>{t.dueAt?`期限：${new Date(t.dueAt).toLocaleString('ja-JP')}`:'期限の指定なし'}</span></li>)}</ul>}
  <p className="connection-note">トークンと課題は保存せず、再読み込みで消えます。入力したトークンは当サイト経由でCanvasに送信し、読み取りだけに使います。提出・変更はしません。</p>
  <details className="token-help"><summary>トークンの作り方</summary><p><a href={`${CANVAS_ORIGIN}/profile/settings`} target="_blank" rel="noreferrer">Canvasの設定 ↗</a> の「承認済みの連携」から新しいアクセストークンを作成し、期限を設定します。作成したトークンはこの欄だけに入力してください。項目がない場合は学校側で発行を制限している可能性があります。</p></details>
 </div>;
}
