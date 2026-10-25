import {describe,expect,it} from 'vitest';
import {CATEGORIES} from './categories';
import {defaultPreferences,parsePreferences,parseRecent,pickPersonalized,visibleRecommendations} from './preferences';
import {recommendations,type Recommendation} from './recommendations';
const pool=()=>recommendations([],[],[],1,false,'play');
describe('提案の傾向',()=>{
 it('保存設定を検証し、不正値・不明な分類・欠落を拒否する',()=>{
  expect(parsePreferences(defaultPreferences())).toEqual(defaultPreferences());
  for(const raw of [null,[],{}, {...defaultPreferences(),version:2},{...defaultPreferences(),avoidRecent:'yes'},{...defaultPreferences(),weights:{...defaultPreferences().weights,calculation:99}},{...defaultPreferences(),weights:{...defaultPreferences().weights,unknown:3}}])expect(()=>parsePreferences(raw)).toThrow();
 });
 it('候補0件・1件と、全分類を出さない場合を正しく扱う',()=>{
  const prefs=defaultPreferences(),one=pool().slice(0,1);
  expect(pickPersonalized([],prefs)).toBeNull();expect(pickPersonalized(one,prefs,[one[0].id])).toEqual(one[0]);
  CATEGORIES.forEach(key=>prefs.weights[key]=0);expect(visibleRecommendations(pool(),prefs)).toEqual([]);expect(pickPersonalized(pool(),prefs)).toBeNull();
 });
 it('出さない分類を履歴からの補充でも復活させない',()=>{
  const prefs=defaultPreferences();prefs.weights.calculation=0;
  for(const random of [0,0.5,1,NaN])expect(pickPersonalized(pool(),prefs,pool().map(p=>p.id),()=>random)?.category).not.toBe('calculation');
 });
 it('分類内の候補数が増えても分類の重みは変わらない',()=>{
  const template=pool()[0];const items:Recommendation[]=[{...template,id:'one',category:'calculation'},...Array.from({length:100},(_,i)=>({...template,id:`many:${i}`,category:'create' as const}))];
  const prefs=defaultPreferences();prefs.avoidRecent=false;const counts={calculation:0,create:0};
  for(let i=0;i<1000;i++){let call=0;const next=pickPersonalized(items,prefs,[],()=>call++%2===0?(i+.5)/1000:0)!;counts[next.category as keyof typeof counts]++;}
  expect(counts).toEqual({calculation:500,create:500});
  prefs.weights.calculation=6;prefs.weights.create=1;expect(pickPersonalized(items,prefs,[],()=>0.7)?.category).toBe('calculation');
 });
 it('新しい候補を優先し、他の時間条件から候補を補充しない',()=>{
  const prefs=defaultPreferences(),items=pool();const next=pickPersonalized(items,prefs,[items[0].id],()=>0)!;expect(next.id).not.toBe(items[0].id);
  const limited=recommendations([],[],[],1,true,'library');for(let i=0;i<30;i++)expect(pickPersonalized(limited,prefs,[],()=>i/30)?.minutes).toBeLessThanOrEqual(1);
 });
 it('履歴の破損や混入したオブジェクトを無視して20件に制限する',()=>{
  expect(parseRecent('{broken')).toEqual([]);expect(parseRecent('[{},1,"valid"]')).toEqual(['valid']);expect(parseRecent(JSON.stringify(Array.from({length:40},(_,i)=>String(i))))).toHaveLength(20);
 });
});
