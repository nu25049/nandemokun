import type {Category} from './categories';
import {CATEGORIES} from './categories';
import type {Recommendation} from './recommendations';

export const ENGAGEMENT_KEY='himanakimihe.engagement.v1';
export const MAX_FEEDBACK=100;
export type Outcome='pending'|'done'|'skip';
export type Feedback={id:string;recommendationId:string;category:Category;outcome:Outcome;at:number};
export type Engagement={version:1;learn:boolean;favorites:string[];feedback:Feedback[]};
export const emptyEngagement=():Engagement=>({version:1,learn:false,favorites:[],feedback:[]});
export const canRemember=(item:Recommendation)=>item.source==='library'||item.source==='play'||item.source==='saved';
export function parseEngagement(raw:string|null,pool:Recommendation[]):Engagement {
 if(raw===null)return emptyEngagement();
 if(raw.length>100000)throw new Error('履歴が大きすぎます');
 const value:unknown=JSON.parse(raw);
 if(!value||typeof value!=='object')throw new Error('履歴の形式が不正です');
 const v=value as Record<string,unknown>;
 if(v.version!==1||typeof v.learn!=='boolean'||!Array.isArray(v.favorites)||!Array.isArray(v.feedback))throw new Error('履歴の形式が不正です');
 const known=new Map(pool.filter(canRemember).map(item=>[item.id,item]));
 const favorites=[...new Set(v.favorites.filter((id):id is string=>typeof id==='string'&&known.has(id)))].slice(-200);
 const feedback:Feedback[]=[];
 for(const rawEntry of v.feedback.slice(-MAX_FEEDBACK)){
  if(!rawEntry||typeof rawEntry!=='object')continue;
  const entry=rawEntry as Record<string,unknown>,item=known.get(String(entry.recommendationId));
  if(!item||typeof entry.id!=='string'||!/^[\w-]{1,80}$/.test(entry.id)||entry.category!==item.category||(entry.outcome!=='pending'&&entry.outcome!=='done'&&entry.outcome!=='skip')||typeof entry.at!=='number'||!Number.isSafeInteger(entry.at)||(entry.at<0||entry.at>8640000000000000))continue;
  const previous=feedback.findIndex(row=>row.id===entry.id);if(previous!==-1)feedback.splice(previous,1);
  feedback.push({id:entry.id,recommendationId:item.id,category:item.category,outcome:entry.outcome,at:entry.at});
 }
 return {version:1,learn:v.learn,favorites,feedback};
}
export function rate(state:Engagement,item:Recommendation,id:string,outcome:Outcome,at=Date.now()):Engagement {
 if(!canRemember(item))return state;
 return {...state,feedback:[...state.feedback.filter(row=>row.id!==id),{id,recommendationId:item.id,category:item.category,outcome,at}].slice(-MAX_FEEDBACK)};
}
export function toggleFavorite(state:Engagement,item:Recommendation):Engagement {
 if(!canRemember(item))return state;
 return {...state,favorites:state.favorites.includes(item.id)?state.favorites.filter(id=>id!==item.id):[...state.favorites,item.id].slice(-200)};
}
export function learningFactors(state:Engagement):Partial<Record<Category,number>> {
 if(!state.learn)return {};
 return Object.fromEntries(CATEGORIES.map(category=>{
  const ratings=state.feedback.filter(row=>row.category===category&&row.outcome!=='pending').slice(-20);
  // Recent explicit feedback only; a smoothed ratio keeps every enabled kind reachable.
  const done=ratings.filter(row=>row.outcome==='done').length,skip=ratings.length-done;
  return [category,Math.min(2,Math.max(.5,(4+done)/(4+skip)))];
 }));
}
