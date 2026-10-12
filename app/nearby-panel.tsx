'use client';
import {useEffect,useRef,useState} from 'react';
import {coordinates,type NearbyPlace} from '../lib/nearby';

export default function NearbyPanel({onChange}:{onChange:(places:NearbyPlace[])=>void}) {
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const [places,setPlaces]=useState<NearbyPlace[]>([]);
 const [lastSearch,setLastSearch]=useState(0);
 const [cooldown,setCooldown]=useState(false);
 const request=useRef(0),controller=useRef<AbortController|null>(null);
 useEffect(()=>()=>{request.current++;controller.current?.abort();},[]);
 useEffect(()=>{if(!lastSearch)return;setCooldown(true);const timer=setTimeout(()=>setCooldown(false),30000);return()=>clearTimeout(timer);},[lastSearch]);
 useEffect(()=>{if(!places.length)return;const timer=setTimeout(()=>{setPlaces([]);onChange([]);setNotice('お店の検索から15分たちました。現在地で検索し直してください。');},15*60000);return()=>clearTimeout(timer);},[places,onChange]);
 function clear(){request.current++;controller.current?.abort();setBusy(false);setPlaces([]);onChange([]);setNotice('お店の候補を解除しました。');}
 async function search(){
  if(busy||cooldown)return;
  const id=++request.current;controller.current?.abort();setBusy(true);setPlaces([]);onChange([]);setNotice('現在地の近くのお店を調べています…');
  try {
   if(!navigator.geolocation)throw new Error('位置情報が使えません。');
   const position=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000,maximumAge:60000}));
   if(request.current!==id)return;
   const point=coordinates(position.coords.latitude,position.coords.longitude);
   const abort=new AbortController();controller.current=abort;
   const response=await fetch('/api/nearby',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(point),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(18000)])});
   if(!response.ok)throw new Error('検索できませんでした。');
   const data=await response.json();
   if(request.current!==id)return;
   if(!Array.isArray(data.places))throw new Error();
   setPlaces(data.places);onChange(data.places);setLastSearch(Date.now());setNotice(data.places.length?`${data.places.length}件見つかりました。移動と15分の滞在が収まるお店を提案に加えます。`:'周囲800mで対象のお店が見つかりませんでした。');
  }catch{if(request.current===id){setPlaces([]);onChange([]);setLastSearch(Date.now());setNotice('お店を取得できませんでした。位置情報の許可と通信を確認してください。画面内の遊びは使えます。');}}
  finally{if(request.current===id)setBusy(false);}
 }
 return <div className="connection-card"><h3>近くのお店に寄り道</h3><p>現在地の周囲800mからカフェ・本屋などを探します。</p><button className="secondary" onClick={search} disabled={busy||cooldown}>{busy?'お店を検索中…':cooldown?'30秒待ってから再検索':'近くのお店を調べる'}</button>{(places.length>0||busy)&&<button className="cancel" onClick={clear}>{busy?'検索をやめる':'お店の候補を解除'}</button>}
  <p className="connection-notice" role="status">{notice}</p>
  {places.length>0&&<ul className="connection-list">{places.slice(0,5).map(p=><li key={p.id}><a href={p.url} target="_blank" rel="noreferrer">{p.name} ↗</a><span>{p.category}・約{p.distance}m・往復と滞在で約{p.minutes}分</span></li>)}</ul>}
  <p className="connection-note">検索したときだけ位置情報を当サイトとOpenStreetMapの検索サービスに送信します。位置や検索結果は保存しません。徒歩時間は直線距離からの概算で、営業中かは未確認です。</p><a className="weather-source" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
 </div>;
}
