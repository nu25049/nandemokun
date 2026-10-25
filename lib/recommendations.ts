import type {Action} from './actions';
import type {CanvasTask} from './canvas';
import type {NearbyPlace} from './nearby';
import type {GameKind} from './play';
import {catalog} from './catalog';
import type {Category} from './categories';
export type Source='all'|'play'|'library'|'saved'|'nearby'|'canvas';
export type Recommendation=Action&{source:Exclude<Source,'all'>;category:Category;actionId?:string;game?:GameKind;url?:string;dueAt?:string|null};
export function recommendations(actions:Action[],places:NearbyPlace[],tasks:CanvasTask[],maxMinutes:number|null,indoorOnly:boolean,source:Source):Recommendation[] {
 if(maxMinutes!==null&&(!Number.isInteger(maxMinutes)||maxMinutes<1||maxMinutes>1440))return [];
 const playMinutes=Math.min(maxMinutes??3,10);
 const pool:Recommendation[]=[
  ...actions.map(a=>({...a,id:`saved:${a.id}`,actionId:a.id,source:'saved' as const,category:'saved' as const})),
  {id:'play:calculation',title:`${playMinutes}分の計算チャレンジ`,minutes:playMinutes,place:'indoor',note:'2桁の掛け算と4桁の加減算。正解を入力すると即座に次へ進みます。',source:'play',game:'calculation',category:'calculation'},
  {id:'play:riddle',title:`${playMinutes}分のなぞなぞ・ひらめき問題`,minutes:playMinutes,place:'indoor',note:'論理やひらめきの3択問題。同じ答えを2回タップして確定します。',source:'play',game:'riddle',category:'riddle'},
  {id:'play:sequence',title:`${playMinutes}分の数列・規則チャレンジ`,minutes:playMinutes,place:'indoor',note:'並んだ数の規則を読み取り、次の数を3択から選ぼう。',source:'play',game:'sequence',category:'sequence'},
  {id:'play:word',title:`${playMinutes}分のことば遊び`,minutes:playMinutes,place:'indoor',note:'しりとりと文字数え。同じ答えを2回タップして確定します。',source:'play',game:'word',category:'word'},
  ...catalog.map(item=>({...item,source:'library' as const})),
  ...places.map(p=>({id:`nearby:${p.id}`,title:`「${p.name}」へ行って15分過ごす`,minutes:p.minutes,place:'outdoor' as const,note:`${p.category}・直線で約${p.distance}m。徒歩片道約${p.walkMinutes}分＋滞在15分＋帰りの時間を見込んでいます。営業時間は地図で確認してください。`,source:'nearby' as const,url:p.url,category:'nearby' as const})),
  ...tasks.slice(0,5).map(t=>({id:`canvas:${t.id}`,title:`「${t.name}」${playMinutes<=3?'の提出条件を確認する':'の最初の作業を進める'}`,minutes:playMinutes,place:'indoor' as const,note:playMinutes<=3?`課題を開いて「何を提出するか」「提出期限」「提出方法」の3点を確認。${playMinutes}分たったら終了です。`:`課題を開き、最初の設問や作業を${playMinutes}分進める。課題全体が終わる時間ではありません。`,source:'canvas' as const,url:t.url,dueAt:t.dueAt,category:'canvas' as const})),
 ];
 return pool.filter(item=>(source==='all'||item.source===source)&&(maxMinutes===null||item.minutes<=maxMinutes)&&(!indoorOnly||item.place==='indoor'));
}
