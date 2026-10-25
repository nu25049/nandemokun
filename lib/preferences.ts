import {CATEGORIES,type Category} from './categories';
import type {Recommendation} from './recommendations';
export type Preferences={version:1;weights:Record<Category,number>;avoidRecent:boolean};
export const PREFERENCES_KEY='himanakimihe.preferences.v1';
export const HISTORY_KEY='himanakimihe.recent.v1';
export const WEIGHT_OPTIONS=[0,1,3,6] as const;
export function defaultPreferences():Preferences{return {version:1,weights:Object.fromEntries(CATEGORIES.map(key=>[key,3])) as Record<Category,number>,avoidRecent:true};}
export function parsePreferences(raw:unknown):Preferences {
 if(!raw||typeof raw!=='object')throw new Error('設定の形式が不正です');
 const value=raw as Record<string,unknown>;
 if(value.version!==1||typeof value.avoidRecent!=='boolean'||!value.weights||typeof value.weights!=='object'||Array.isArray(value.weights))throw new Error('設定の形式が不正です');
 const weights=value.weights as Record<string,unknown>;
 if(Object.keys(weights).some(key=>!CATEGORIES.includes(key as Category))||CATEGORIES.some(key=>!WEIGHT_OPTIONS.includes(weights[key] as typeof WEIGHT_OPTIONS[number])))throw new Error('設定の値が不正です');
 return {version:1,weights:Object.fromEntries(CATEGORIES.map(key=>[key,weights[key]])) as Record<Category,number>,avoidRecent:value.avoidRecent};
}
export function visibleRecommendations(pool:Recommendation[],prefs:Preferences):Recommendation[]{return pool.filter(item=>prefs.weights[item.category]>0);}
const unit=(value:number)=>Number.isFinite(value)?Math.min(0.999999999,Math.max(0,value)):0;
export function pickPersonalized(pool:Recommendation[],prefs:Preferences,recent:string[]=[],random=Math.random):Recommendation|null {
 let candidates=visibleRecommendations(pool,prefs);
 if(!candidates.length)return null;
 if(prefs.avoidRecent){const fresh=candidates.filter(item=>!recent.includes(item.id));if(fresh.length)candidates=fresh;}
 const groups=CATEGORIES.map(category=>({category,items:candidates.filter(item=>item.category===category)})).filter(group=>group.items.length);
 let value=unit(random())*groups.reduce((sum,group)=>sum+prefs.weights[group.category],0);
 const group=groups.find(group=>{value-=prefs.weights[group.category];return value<0;})??groups[groups.length-1];
 return group.items[Math.floor(unit(random())*group.items.length)];
}
export function parseRecent(raw:string|null):string[]{
 if(!raw)return [];
 try{const value:unknown=JSON.parse(raw);return Array.isArray(value)?value.filter((item):item is string=>typeof item==='string'&&item.length<=160).slice(-20):[];}catch{return [];}
}
