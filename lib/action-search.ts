import type {Action} from './actions';

export type ActionSort='added'|'short'|'long'|'name';
export type ActionPlace='all'|Action['place'];
const normalize=(value:string)=>value.normalize('NFKC').toLowerCase();
const names=new Intl.Collator('ja',{numeric:true,sensitivity:'base'});

export function searchActions(actions:Action[],query:string,sort:ActionSort='added',place:ActionPlace='all'):Action[]{
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 const matches=actions.map((action,index)=>({action,index})).filter(({action})=>{
  if(place!=='all'&&action.place!==place)return false;
  const text=normalize(action.title+' '+action.note);
  return terms.every(term=>text.includes(term));
 });
 matches.sort((a,b)=>{
  let order=0;
  if(sort==='short')order=a.action.minutes-b.action.minutes;
  else if(sort==='long')order=b.action.minutes-a.action.minutes;
  else if(sort==='name')order=names.compare(normalize(a.action.title),normalize(b.action.title));
  return order||a.index-b.index;
 });
 return matches.map(({action})=>action);
}
