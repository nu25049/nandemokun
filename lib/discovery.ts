import type {CatalogAction} from './catalog';
export type DiscoveryFilters={query:string;category:string;place:'all'|'indoor'|'outdoor';minutes:number|null;favoritesOnly:boolean;sort:'original'|'short'|'long'};
export const defaultDiscoveryFilters=():DiscoveryFilters=>({query:'',category:'all',place:'all',minutes:3,favoritesOnly:false,sort:'original'});
const normalize=(text:string)=>text.normalize('NFKC').toLocaleLowerCase('ja-JP');
export function discover(items:CatalogAction[],filters:DiscoveryFilters,favorites:string[]=[]):CatalogAction[]{
 const terms=normalize(filters.query).trim().split(/\s+/).filter(Boolean),favoriteIds=new Set(favorites);
 const results=items.filter(item=>(filters.category==='all'||item.category===filters.category)&&(filters.place==='all'||item.place===filters.place)&&(filters.minutes===null||item.minutes<=filters.minutes)&&(!filters.favoritesOnly||favoriteIds.has(item.id))&&terms.every(term=>normalize(item.title+' '+item.note).includes(term)));
 if(filters.sort!=='original')results.sort((a,b)=>filters.sort==='short'?a.minutes-b.minutes:b.minutes-a.minutes);
 return results;
}
