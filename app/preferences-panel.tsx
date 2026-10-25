'use client';
import {useEffect,useRef,useState} from 'react';
import {CATEGORIES,CATEGORY_LABELS} from '../lib/categories';
import {defaultPreferences,parsePreferences,PREFERENCES_KEY,type Preferences} from '../lib/preferences';
type User={id:string;email:string};
const labels:Record<number,string>={0:'出さない',1:'少なめ',3:'標準',6:'多め'};

export default function PreferencesPanel({onChange}:{onChange:(value:Preferences)=>void}){
 const [prefs,setPrefs]=useState(defaultPreferences);
 const [configured,setConfigured]=useState<boolean|null>(null);
 const [user,setUser]=useState<User|null>(null);
 const [busy,setBusy]=useState(true);
 const [email,setEmail]=useState('');
 const [notice,setNotice]=useState('');
 const [accountNotice,setAccountNotice]=useState('');
 const [cooldown,setCooldown]=useState(false);
 const localKey=useRef(PREFERENCES_KEY),controller=useRef<AbortController|null>(null),requestId=useRef(0);
 function local(key:string,fallback=defaultPreferences()){
  try{const raw=localStorage.getItem(key);return raw?parsePreferences(JSON.parse(raw)):fallback;}
  catch{setNotice('保存された好みを読み込めなかったため、初期値に戻しました。選び直して保存できます。');return defaultPreferences();}
 }
 function apply(next:Preferences,save=true){
  setPrefs(next);onChange(next);
  if(save){try{localStorage.setItem(localKey.current,JSON.stringify(next));setNotice('提案の好みをこの端末に保存しました。');}catch{setNotice('端末に保存できませんでした。この画面では反映しますが、再読み込みで失われます。');}}
 }
 async function loadAccount(){
  const id=++requestId.current;controller.current?.abort();const abort=new AbortController();controller.current=abort;setBusy(true);
  try{
   const response=await fetch('/api/account',{cache:'no-store',signal:AbortSignal.any([abort.signal,AbortSignal.timeout(12000)])});
   const data=await response.json();if(id!==requestId.current)return;
   if(!response.ok)throw new Error('ログイン状態を確認できません。端末内の好みは引き続き使えます。');
   setConfigured(data.configured===true);
   const account=data.user&&typeof data.user.id==='string'&&typeof data.user.email==='string'?data.user as User:null;
   setUser(account);localKey.current=account?`${PREFERENCES_KEY}:${account.id}`:PREFERENCES_KEY;
   if(account){
    const fallback=local(PREFERENCES_KEY);
    const next=data.preferences?parsePreferences(data.preferences):local(localKey.current,fallback);
    apply(next,false);
    try{localStorage.setItem(localKey.current,JSON.stringify(next));}catch{setNotice('端末に設定を保存できません。この画面では調整できます。');}
    setAccountNotice(data.warning??(data.preferences?'アカウントの好みを読み込みました。':'この端末の好みをアカウントに保存できます。'));
   }else{apply(local(PREFERENCES_KEY),false);setAccountNotice(new URLSearchParams(window.location.search).get('login')==='failed'?'ログインリンクを確認できませんでした。同じブラウザーで新しいリンクを開いてください。':'');}
  }catch(error){if(id===requestId.current){setAccountNotice(error instanceof Error?error.message:'接続を確認できませんでした。');setUser(null);localKey.current=PREFERENCES_KEY;apply(local(PREFERENCES_KEY),false);}}
  finally{if(id===requestId.current)setBusy(false);}
 }
 useEffect(()=>{apply(local(PREFERENCES_KEY),false);void loadAccount();return()=>{requestId.current++;controller.current?.abort();};},[onChange]);
 useEffect(()=>{if(!cooldown)return;const timer=setTimeout(()=>setCooldown(false),60000);return()=>clearTimeout(timer);},[cooldown]);
 useEffect(()=>{
  function sync(event:StorageEvent){if(event.key===localKey.current)apply(local(localKey.current),false);}
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[onChange]);
 async function accountAction(path:string,body?:unknown){
  setBusy(true);controller.current?.abort();const abort=new AbortController();controller.current=abort;
  const id=++requestId.current;
  try{
   const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body??{}),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(15000)])});
   const data=await response.json();if(id!==requestId.current)return;
   if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'処理を完了できませんでした。');
   if(path.endsWith('/logout')){setUser(null);localKey.current=PREFERENCES_KEY;apply(local(PREFERENCES_KEY),false);setAccountNotice('ログアウトしました。ゲストの好みに戻しました。');}
   else if(path.endsWith('/login')){setCooldown(true);setAccountNotice(data.message);}
   else setAccountNotice('好みをアカウントに保存しました。次にログインした端末にも反映できます。');
  }catch(error){if(id===requestId.current)setAccountNotice(error instanceof Error?error.message:'通信を完了できませんでした。');}
  finally{if(id===requestId.current)setBusy(false);}
 }
 return <section className="preferences-section" id="preferences" aria-labelledby="preferences-title">
  <div className="section-heading"><div><span className="eyebrow">MAKE IT YOUR STYLE</span><h2 id="preferences-title">出てくる提案を、自分好みに。</h2></div><p>ログインなしでも調整できます。</p></div>
  <div className="preferences-columns"><div className="preference-card">
   <h3>提案の傾向</h3><p>「多め」は選ばれやすく、「出さない」は提案から外します。時間と場所の条件はそのまま守ります。</p>
   <div className="weight-grid">{CATEGORIES.map(category=><div key={category}><label htmlFor={`weight-${category}`}>{CATEGORY_LABELS[category]}</label><select id={`weight-${category}`} value={prefs.weights[category]} disabled={busy} onChange={e=>apply({...prefs,weights:{...prefs.weights,[category]:Number(e.target.value)}})}>{[0,1,3,6].map(value=><option key={value} value={value}>{labels[value]}</option>)}</select></div>)}</div>
   <label className="repeat-option"><input type="checkbox" disabled={busy} checked={prefs.avoidRecent} onChange={e=>apply({...prefs,avoidRecent:e.target.checked})}/>最近の提案をなるべく避ける（この端末の直近20件）</label>
   <button className="cancel" disabled={busy} onClick={()=>apply(defaultPreferences())}>提案の傾向を初期値に戻す</button>
   <p className="connection-notice" role="status">{notice}</p>
  </div><div className="preference-card account-card">
   <h3>{user?'ログイン中':'任意のログイン'}</h3>
   {user?<><p className="account-email">{user.email}</p><p>このアカウントの好みを保存・復元できます。ゲストの設定とは分けて扱います。</p><button className="secondary" disabled={busy} onClick={()=>accountAction('/api/account/preferences',prefs)}>この好みをアカウントに保存</button><button className="weather-button" disabled={busy} onClick={()=>void loadAccount()}>アカウントの好みを読み直す</button><button className="cancel" disabled={busy} onClick={()=>accountAction('/api/account/logout')}>ログアウト</button></>:
    configured===false?<p>ログインは準備中です。今はこの端末に好みを保存できます。ログインしなくても、すべての遊び・提案・候補管理を使えます。</p>:
    configured===true?<><p>メールのリンクでログインすると、自分の好みをアカウントに保存できます。パスワードは不要です。</p><form onSubmit={e=>{e.preventDefault();void accountAction('/api/account/login',{email});}}><label htmlFor="account-email">メールアドレス</label><input id="account-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/><button className="secondary" disabled={busy||cooldown||!email.trim()}>{cooldown?'再送信は少し待ってから':'ログインリンクを受け取る'}</button></form></>:
    <p>{busy?'ログインの利用状態を確認しています…':'接続状態を確認できません。ゲストの機能は利用できます。'}</p>}
   {!user&&<button className="cancel" disabled={busy} onClick={()=>void loadAccount()}>接続状態を確認する</button>}
   <p className="connection-notice" role="status">{accountNotice}</p>
   <p className="connection-note">アカウントに保存するのは提案の好みだけです。Canvasトークン・課題・現在地は送信しません。店舗・課題の提案履歴も保存しません。自作の候補は引き続きこのブラウザーに保存します。</p>
  </div></div>
 </section>;
}
