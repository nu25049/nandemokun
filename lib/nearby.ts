export type NearbyPlace = {id:string;name:string;category:string;distance:number;walkMinutes:number;minutes:number;url:string};
export const NEARBY_RADII = [800, 1500, 3000] as const;
export const NEARBY_CATEGORIES = {all:'すべて', cafe:'カフェ', food:'飲食店', shopping:'買い物'} as const;
export type NearbySearchOptions = {radius:typeof NEARBY_RADII[number];category:keyof typeof NEARBY_CATEGORIES};
export const DEFAULT_NEARBY_OPTIONS: NearbySearchOptions = {radius:800, category:'all'};

const storeTags = [
 {key:'amenity', value:'cafe', category:'cafe', label:'カフェ'},
 {key:'amenity', value:'restaurant', category:'food', label:'飲食店'},
 {key:'amenity', value:'fast_food', category:'food', label:'軽食'},
 {key:'shop', value:'bakery', category:'shopping', label:'パン屋'},
 {key:'shop', value:'books', category:'shopping', label:'本屋'},
 {key:'shop', value:'convenience', category:'shopping', label:'コンビニ'},
 {key:'shop', value:'supermarket', category:'shopping', label:'スーパー'}
] as const;

export function parseNearbyOptions(radius:unknown=DEFAULT_NEARBY_OPTIONS.radius, category:unknown=DEFAULT_NEARBY_OPTIONS.category):NearbySearchOptions {
 const knownRadius = NEARBY_RADII.find(value => value === radius);
 if (knownRadius === undefined || typeof category !== 'string' || !Object.prototype.hasOwnProperty.call(NEARBY_CATEGORIES, category)) {
  throw new Error('検索条件が不正です。');
 }
 return {radius:knownRadius, category:category as NearbySearchOptions['category']};
}

export function coordinates(latitude: unknown, longitude: unknown): {latitude:number;longitude:number} {
 if (typeof latitude !== 'number' || typeof longitude !== 'number' || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude)>90 || Math.abs(longitude)>180) throw new Error('位置情報の形式が不正です。');
 return {latitude:Number(latitude.toFixed(4)),longitude:Number(longitude.toFixed(4))};
}
export function distanceMeters(lat1:number,lon1:number,lat2:number,lon2:number):number {
 const radians=(n:number)=>n*Math.PI/180;
 const a=Math.sin(radians(lat2-lat1)/2)**2+Math.cos(radians(lat1))*Math.cos(radians(lat2))*Math.sin(radians(lon2-lon1)/2)**2;
 return Math.round(6371000*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a))));
}
export function parsePlaces(raw:unknown, latitude:number, longitude:number, options:NearbySearchOptions=DEFAULT_NEARBY_OPTIONS):NearbyPlace[] {
 if (!raw || typeof raw!=='object') throw new Error('お店の情報を読み込めませんでした。');
 const data = raw as {elements?:unknown;remark?:unknown};
 if (!Array.isArray(data.elements) || data.remark) throw new Error('お店の情報を読み込めませんでした。');
 const matchingTags = storeTags.filter(tag => options.category==='all' || tag.category===options.category);
 const result:NearbyPlace[]=[];
 for (const item of data.elements.slice(0,500)) {
  if (!item || typeof item!=='object') continue;
  const e=item as {id?:number;type?:string;lat?:number;lon?:number;center?:{lat?:number;lon?:number};tags?:Record<string,string>};
  const lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;
  const name=e.tags?.['name:ja']||e.tags?.name;
  if (!Number.isSafeInteger(e.id) || e.id!<=0 || !['node','way','relation'].includes(e.type??'') || typeof name!=='string' || !name.trim() || name.length>160) continue;
  if (typeof lat!=='number'||typeof lon!=='number'||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180) continue;
  const distance=distanceMeters(latitude,longitude,lat,lon);
  if (distance>options.radius) continue;
  const tag = matchingTags.find(candidate => e.tags?.[candidate.key] === candidate.value);
  if (!tag) continue;
  // 直線距離に迂回係数1.4をかけた概算。経路検索・営業中判定ではない。
  const walkMinutes=Math.max(1,Math.ceil(distance*1.4/80));
  result.push({id:`${e.type}-${e.id}`,name:name.trim(),category:tag.label,distance,walkMinutes,minutes:walkMinutes*2+15,url:`https://www.openstreetmap.org/${e.type}/${e.id}`});
 }
 return result.sort((a,b)=>a.distance-b.distance).filter((place,i,all)=>all.findIndex(p=>p.id===place.id)===i).slice(0,12);
}
export async function fetchPlaces(latitude:number, longitude:number, signal?:AbortSignal, options:NearbySearchOptions=DEFAULT_NEARBY_OPTIONS):Promise<NearbyPlace[]> {
 const point=coordinates(latitude,longitude);
 const validated = parseNearbyOptions(options.radius, options.category);
 const around=`around:${validated.radius},${point.latitude},${point.longitude}`;
 const matchingTags = storeTags.filter(tag => validated.category==='all' || tag.category===validated.category);
 const selectors = ['amenity','shop'].flatMap(key => {
  const values = matchingTags.filter(tag => tag.key===key).map(tag => tag.value);
  return values.length ? [`nwr["${key}"~"^(${values.join('|')})$"](${around});`] : [];
 });
 const query=`[out:json][timeout:12];(${selectors.join('')});out center 500;`;
 const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded','User-Agent':'Himanakimihe/0.1 (https://softwearcreationwhatdo.vercel.app)'},body:new URLSearchParams({data:query}),signal,cache:'no-store',redirect:'error'});
 if (!response.ok) throw new Error('お店の検索サービスが混み合っています。少し待ってから試してください。');
 return parsePlaces(await response.json(), point.latitude, point.longitude, validated);
}
