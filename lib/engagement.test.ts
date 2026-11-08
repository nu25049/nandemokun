import {describe,it,expect} from 'vitest';
import {emptyEngagement,parseEngagement,rate,toggleFavorite,learningFactors,MAX_FEEDBACK} from './engagement';
import {recommendations} from './recommendations';
import {defaultPreferences,pickPersonalized} from './preferences';
const pool=recommendations([],[],[],1,false,'all');
const item=pool[0];
describe('端末内の利用記録',()=>{
 it('保存を復元し、不正JSON・形式・巨大データを拒否する',()=>{
  expect(parseEngagement(null,pool)).toEqual(emptyEngagement());
  for(const raw of ['{broken','null','[]','{}',JSON.stringify({...emptyEngagement(),learn:'true'}),' '.repeat(100001)])expect(()=>parseEngagement(raw,pool)).toThrow();
  const state=toggleFavorite(rate(emptyEngagement(),item,'result-1','done',123),item);
  expect(parseEngagement(JSON.stringify(state),pool)).toEqual(state);
 });
 it('店舗・課題・未知の候補と余分な個人情報を保存から除去する',()=>{
  const external={...item,id:'canvas:secret',source:'canvas' as const,category:'canvas' as const,url:'https://nu.instructure.com/private'};
  const state=emptyEngagement();expect(rate(state,external,'x','done')).toBe(state);expect(toggleFavorite(state,external)).toBe(state);
  const raw={version:1,learn:true,favorites:['canvas:secret','nearby:private',item.id],token:'secret',feedback:[{id:'e',recommendationId:external.id,category:'canvas',outcome:'done',at:123},{id:'ok',recommendationId:item.id,category:item.category,outcome:'done',at:123,note:'secret'}]};
  const parsed=parseEngagement(JSON.stringify(raw),[...pool,external]);
  expect(parsed.favorites).toEqual([item.id]);expect(parsed.feedback).toHaveLength(1);expect(JSON.stringify(parsed)).not.toMatch(/secret|token|note|canvas:|nearby:/);
 });
 it('同じ提案への連打や評価の変更は1件だけにする',()=>{
  let state=rate(emptyEngagement(),item,'same','done',1);state=rate(state,item,'same','done',2);state=rate(state,item,'same','skip',3);
  expect(state.feedback).toHaveLength(1);expect(state.feedback[0].outcome).toBe('skip');
  expect(toggleFavorite(toggleFavorite(state,item),item).favorites).toEqual([]);
 });
 it('利用記録を100件に制限し、削除された候補を復活させない',()=>{
  let state=emptyEngagement();for(let i=0;i<150;i++)state=rate(state,item,'result-'+i,'done',i);
  expect(state.feedback).toHaveLength(MAX_FEEDBACK);expect(state.feedback[0].at).toBe(50);
  state=toggleFavorite(state,item);expect(parseEngagement(JSON.stringify(state),[])).toEqual({...emptyEngagement(),learn:false});
 });
 it('評価済みの分類偽装、不正日時、重複IDを正規化する',()=>{
  const entry={id:'same',recommendationId:item.id,category:item.category,outcome:'done',at:1};
  const parsed=parseEngagement(JSON.stringify({...emptyEngagement(),feedback:[entry,{...entry,outcome:'skip'},{...entry,id:'wrong',category:'canvas'},{...entry,id:'time',at:-1}]}),pool);
  expect(parsed.feedback).toHaveLength(1);expect(parsed.feedback[0].outcome).toBe('skip');
 });
 it('提案だけでは評価せず、戻ってから同じ記録を評価できる',()=>{
  const state=rate({...emptyEngagement(),learn:true},item,'pending','pending',1);
  expect(learningFactors(state)[item.category]).toBe(1);
  const rated=rate(state,item,'pending','done',2);expect(rated.feedback).toHaveLength(1);expect(learningFactors(rated)[item.category]).toBeGreaterThan(1);
 });
 it('利用結果を有効にしたときだけ倍率を制限して反映する',()=>{
  let state=emptyEngagement();for(let i=0;i<80;i++)state=rate(state,item,'vote-'+i,'done',i);
  expect(learningFactors(state)).toEqual({});state.learn=true;expect(learningFactors(state)[item.category]).toBe(2);
  for(let i=0;i<30;i++)state=rate(state,item,'skip-'+i,'skip',100+i);
  expect(learningFactors(state)[item.category]).toBe(.5);
 });
 it('学習しても手動0・時間・室内条件と候補0/1件を守る',()=>{
  const prefs=defaultPreferences();prefs.avoidRecent=false;
  let state=rate({...emptyEngagement(),learn:true},item,'a','done',1);const factors=learningFactors(state);
  prefs.weights[item.category]=0;expect(pickPersonalized([item],prefs,[],()=>0,factors)).toBeNull();prefs.weights[item.category]=3;
  expect(pickPersonalized([],prefs,[],()=>0,factors)).toBeNull();expect(pickPersonalized([item],prefs,[item.id],()=>0,factors)).toEqual(item);
  const limited=recommendations([],[],[],1,true,'library');
  for(let i=0;i<20;i++){const selected=pickPersonalized(limited,prefs,[],()=>i/20,factors)!;expect(selected.minutes).toBeLessThanOrEqual(1);expect(selected.place).toBe('indoor');}
 });
 it('分類内の候補数を増やさず、分類の抽選比率だけを調整する',()=>{
  const prefs=defaultPreferences();prefs.avoidRecent=false;const pair=pool.filter(row=>row.source==='play').slice(0,2);
  expect(pickPersonalized(pair,prefs,[],()=>.6)?.id).toBe(pair[1].id);
  expect(pickPersonalized(pair,prefs,[],()=>.6,{[pair[0].category]:2})?.id).toBe(pair[0].id);
  expect(pickPersonalized(pair,prefs,[],()=>.6,learningFactors(emptyEngagement()))?.id).toBe(pair[1].id);
 });
});
