'use client';
import {useEffect,useRef,useState} from 'react';
import {coordinates,DEFAULT_NEARBY_OPTIONS,NEARBY_CATEGORIES,NEARBY_RADII,type NearbyPlace,type NearbySearchOptions} from '../lib/nearby';

const mapQueries={all:'近くのお店',cafe:'近くのカフェ',food:'近くの飲食店',shopping:'近くのスーパー・コンビニ'};

function radiusLabel(radius:NearbySearchOptions['radius']) {
 return radius<1000?`${radius}m`:`${radius/1000}km`;
}

function locationError(error:unknown) {
 const code=error&&typeof error==='object'&&'code' in error?error.code:undefined;
 if(code===1)return '位置情報が許可されていません。ブラウザーでこのサイトの位置情報を許可してください。';
 if(code===3)return '現在地の取得に時間がかかっています。場所を変えてもう一度試してください。';
 return '現在地を取得できませんでした。端末の位置情報設定を確認してください。';
}

export default function NearbyPanel({onChange}:{onChange:(places:NearbyPlace[])=>void}) {
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const [places,setPlaces]=useState<NearbyPlace[]>([]);
 const [options,setOptions]=useState(DEFAULT_NEARBY_OPTIONS);
 const [lastSearch,setLastSearch]=useState(0);
 const [cooldown,setCooldown]=useState(false);
 const request=useRef(0),controller=useRef<AbortController|null>(null);
 useEffect(()=>()=>{request.current++;controller.current?.abort();},[]);
 useEffect(()=>{if(!lastSearch)return;const timer=setTimeout(()=>setCooldown(false),30000);return()=>clearTimeout(timer);},[lastSearch]);
 useEffect(()=>{if(!places.length)return;const timer=setTimeout(()=>{setPlaces([]);onChange([]);setNotice('お店の検索から15分たちました。現在地で検索し直してください。');},15*60000);return()=>clearTimeout(timer);},[places,onChange]);
 function clear(){request.current++;controller.current?.abort();setBusy(false);setPlaces([]);onChange([]);setNotice('お店の候補を解除しました。');}
 function changeOptions(next:NearbySearchOptions){
  setOptions(next);
  setPlaces([]);
  onChange([]);
  setNotice('検索条件を変更しました。');
 }
 async function search(){
  if(busy||cooldown)return;
  if(!navigator.geolocation){setNotice('この環境では位置情報を利用できません。');return;}
  const id=++request.current;
  controller.current?.abort();
  setBusy(true);
  setPlaces([]);
  onChange([]);
  setNotice('現在地を取得しています…');
  let locating=true;
  try {
   const position=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000,maximumAge:60000}));
   if(request.current!==id)return;
   const point=coordinates(position.coords.latitude,position.coords.longitude);
   locating=false;
   const abort=new AbortController();controller.current=abort;
   setCooldown(true);
   setLastSearch(Date.now());
   setNotice(`${radiusLabel(options.radius)}以内のお店を探しています…`);
   const response=await fetch('/api/nearby',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...point,...options}),signal:AbortSignal.any([abort.signal,AbortSignal.timeout(18000)])});
   if(!response.ok)throw new Error();
   const data=await response.json();
   if(request.current!==id)return;
   if(!Array.isArray(data.places))throw new Error();
   setPlaces(data.places);
   onChange(data.places);
   setNotice(data.places.length
    ?`${data.places.length}件見つかりました。取得したお店を近い順に表示します。店名から地図を開けます。`
    :`${radiusLabel(options.radius)}以内で条件に合うお店が見つかりませんでした。範囲か種類を変えて検索できます。`);
  }catch(error){
   if(request.current===id)setNotice(locating?locationError(error):'お店の検索で通信に失敗しました。接続を確認して、少し待ってから試してください。');
  }
  finally{if(request.current===id)setBusy(false);}
 }
 return <div className="connection-card" id="nearby">
  <h3>近くのお店に寄り道</h3><p>現在地から、指定した範囲と種類のお店を探します。</p>
  <div className="nearby-search-options">
   <label htmlFor="nearby-radius">検索範囲</label>
   <select id="nearby-radius" value={options.radius} disabled={busy} onChange={event=>changeOptions({...options,radius:Number(event.target.value) as NearbySearchOptions['radius']})}>
    {NEARBY_RADII.map(radius=><option key={radius} value={radius}>{radiusLabel(radius)}</option>)}
   </select>
   <label htmlFor="nearby-category">お店の種類</label>
   <select id="nearby-category" value={options.category} disabled={busy} onChange={event=>changeOptions({...options,category:event.target.value as NearbySearchOptions['category']})}>
    {Object.entries(NEARBY_CATEGORIES).map(([category,label])=><option key={category} value={category}>{label}</option>)}
   </select>
  </div>
  <button className="secondary" onClick={search} disabled={busy||cooldown}>{busy?'お店を検索中…':cooldown?'30秒待ってから再検索':'近くのお店を調べる'}</button>
  {(places.length>0||busy)&&<button className="cancel" onClick={clear}>{busy?'検索をやめる':'お店の候補を解除'}</button>}
  <p className="connection-notice" role="status">{notice}</p>
  {places.length>0&&<ul className="connection-list">{places.map(place=><li key={place.id}><a href={place.url} target="_blank" rel="noopener noreferrer">{place.name} ↗</a><span>{place.category}・直線約{place.distance}m・徒歩片道約{place.walkMinutes}分・往復と滞在で約{place.minutes}分</span></li>)}</ul>}
  {!places.length&&!busy&&<p><a href={'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:mapQueries[options.category]})} target="_blank" rel="noopener noreferrer">Google マップで近くのお店を探す ↗</a></p>}
  <p className="connection-note">検索時だけ、丸めた現在地を当サイトとOpenStreetMapの検索サービスに送ります。位置や結果はこのブラウザーに保存しません。徒歩時間は直線距離からの概算で、営業中かは未確認です。</p>
  <a className="weather-source" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
 </div>;
}
