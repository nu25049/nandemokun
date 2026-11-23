'use client';
import {useEffect,useRef,useState} from 'react';
import {CATEGORIES,CATEGORY_LABELS} from '../lib/categories';
import {defaultPreferences,parsePreferences,PREFERENCES_KEY,WEIGHT_OPTIONS,type Preferences} from '../lib/preferences';

const labels:Record<number,string>={0:'出さない',1:'少なめ',3:'標準',6:'多め'};

export default function PreferencesPanel({onChange}:{onChange:(value:Preferences)=>void}){
 const [prefs,setPrefs]=useState(defaultPreferences);
 const [ready,setReady]=useState(false);
 const [notice,setNotice]=useState('');
 const notifyChange=useRef(onChange);

 useEffect(()=>{notifyChange.current=onChange;},[onChange]);

 useEffect(()=>{
  function load(external=false){
   let next=defaultPreferences();
   try{
    const raw=localStorage.getItem(PREFERENCES_KEY);
    if(raw!==null)next=parsePreferences(JSON.parse(raw));
    setNotice(external?'別のタブで変更された好みを反映しました。':'');
   }catch{
    setNotice('保存された好みを読み込めなかったため、初期値で表示しています。選び直して保存できます。');
   }
   setPrefs(next);
   notifyChange.current(next);
   setReady(true);
  }
  function sync(event:StorageEvent){
   if(event.key===PREFERENCES_KEY||event.key===null)load(true);
  }
  load();
  window.addEventListener('storage',sync);
  return()=>window.removeEventListener('storage',sync);
 },[]);

 function apply(next:Preferences){
  if(!ready)return;
  setPrefs(next);
  onChange(next);
  try{
   localStorage.setItem(PREFERENCES_KEY,JSON.stringify(next));
   setNotice('提案の好みをこのブラウザーに保存しました。');
  }catch{
   setNotice('端末に保存できませんでした。この画面では反映しますが、再読み込みで失われます。');
  }
 }

 return <section className="preferences-section" id="preferences" aria-labelledby="preferences-title">
  <div className="section-heading"><div><span className="eyebrow">MAKE IT YOUR STYLE</span><h2 id="preferences-title">出てくる提案を、自分好みに。</h2></div><p>設定はこのブラウザーに保存します。</p></div>
  <div className="preference-card">
   <h3>ひとりの提案の傾向</h3><p>「多め」は選ばれやすく、「出さない」は提案から外します。時間と場所の条件も適用されます。</p>
   <div className="weight-grid">{CATEGORIES.map(category=><div key={category}><label htmlFor={`weight-${category}`}>{CATEGORY_LABELS[category]}</label><select id={`weight-${category}`} value={prefs.weights[category]} disabled={!ready} onChange={e=>apply({...prefs,weights:{...prefs.weights,[category]:Number(e.target.value)}})}>{WEIGHT_OPTIONS.map(value=><option key={value} value={value}>{labels[value]}</option>)}</select></div>)}</div>
   <label className="repeat-option"><input type="checkbox" disabled={!ready} checked={prefs.avoidRecent} onChange={e=>apply({...prefs,avoidRecent:e.target.checked})}/>最近の提案をなるべく避ける（この端末の直近20件）</label>
   <button className="cancel" disabled={!ready} onClick={()=>apply(defaultPreferences())}>提案の傾向を初期値に戻す</button>
   <p className="connection-notice" role="status">{notice}</p>
   <p className="connection-note">別のブラウザーには、バックアップファイルから好みを引き継げます。</p>
  </div>
 </section>;
}
