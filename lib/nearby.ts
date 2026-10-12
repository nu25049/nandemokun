export type NearbyPlace = {id:string;name:string;category:string;distance:number;walkMinutes:number;minutes:number;url:string};
export function coordinates(latitude: unknown, longitude: unknown): {latitude:number;longitude:number} {
 if (typeof latitude !== 'number' || typeof longitude !== 'number' || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude)>90 || Math.abs(longitude)>180) throw new Error('位置情報の形式が不正です。');
 return {latitude:Number(latitude.toFixed(4)),longitude:Number(longitude.toFixed(4))};
}
export function distanceMeters(lat1:number,lon1:number,lat2:number,lon2:number):number {
 const radians=(n:number)=>n*Math.PI/180;
 const a=Math.sin(radians(lat2-lat1)/2)**2+Math.cos(radians(lat1))*Math.cos(radians(lat2))*Math.sin(radians(lon2-lon1)/2)**2;
 return Math.round(6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a))));
}
export function parsePlaces(raw:unknown,latitude:number,longitude:number):NearbyPlace[] {
 if (!raw || typeof raw!=='object' || !Array.isArray((raw as {elements?:unknown}).elements)) throw new Error('お店の情報を読み込めませんでした。');
 const result:NearbyPlace[]=[];
 for (const item of (raw as {elements:unknown[]}).elements.slice(0,500)) {
  if (!item || typeof item!=='object') continue;
  const e=item as {id?:number;type?:string;lat?:number;lon?:number;center?:{lat?:number;lon?:number};tags?:Record<string,string>};
  const lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;
  const name=e.tags?.['name:ja']||e.tags?.name;
  if (!Number.isSafeInteger(e.id) || e.id!<=0 || !['node','way','relation'].includes(e.type??'') || typeof name!=='string' || !name.trim() || name.length>160) continue;
  if (typeof lat!=='number'||typeof lon!=='number'||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180) continue;
  const distance=distanceMeters(latitude,longitude,lat,lon);
  if (distance>900) continue;
  // 直線距離に迂回係数1.4をかけた概算。経路検索・営業中判定ではない。
  const walkMinutes=Math.max(1,Math.ceil(distance*1.4/80));
  const labels:Record<string,string>={cafe:'カフェ',restaurant:'飲食店',fast_food:'軽食',bakery:'パン屋',books:'本屋',convenience:'コンビニ'};
  const tag=e.tags?.amenity||e.tags?.shop||'';
  if (!labels[tag]) continue;
  result.push({id:`${e.type}-${e.id}`,name:name.trim(),category:labels[tag],distance,walkMinutes,minutes:walkMinutes*2+15,url:`https://www.openstreetmap.org/${e.type}/${e.id}`});
 }
 return result.sort((a,b)=>a.distance-b.distance).filter((place,i,all)=>all.findIndex(p=>p.id===place.id)===i).slice(0,12);
}
export async function fetchPlaces(latitude:number,longitude:number,signal?:AbortSignal):Promise<NearbyPlace[]> {
 const point=coordinates(latitude,longitude);
 const around=`around:800,${point.latitude},${point.longitude}`;
 const query=`[out:json][timeout:12][maxsize:16777216];(nwr["amenity"~"^(cafe|restaurant|fast_food)$"](${around});nwr["shop"~"^(bakery|books|convenience)$"](${around}););out center tags 100;`;
 const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'Himanakimihe/0.1 (https://softwearcreationwhatdo.vercel.app)'},body:new URLSearchParams({data:query}),signal,cache:'no-store',redirect:'error'});
 if (!response.ok) throw new Error('お店の検索サービスが混み合っています。少し待ってから試してください。');
 return parsePlaces(await response.json(),point.latitude,point.longitude);
}
