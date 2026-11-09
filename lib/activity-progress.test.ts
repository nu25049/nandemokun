import {describe,expect,it} from 'vitest';
import {createActivityTimer,resolveActivity} from './activity';
import {ACTIVITY_PROGRESS_KEY,clearActivityProgress,matchesActivityProgress,readActivityProgress,writeActivityProgress,type ActivityProgress} from './activity-progress';
import type {Action} from './actions';

function memoryStorage(){
 const values=new Map<string,string>();
 return {
  getItem:(key:string)=>values.get(key)??null,
  setItem:(key:string,value:string)=>{values.set(key,value);},
  removeItem:(key:string)=>{values.delete(key);}
 };
}

const action:Action={id:'one',title:'丸を描く',minutes:1,place:'indoor',note:'紙を用意する。丸を描く。'};
const initial:ActivityProgress={
 recommendationId:'saved:one',occurrenceId:'first-start',timer:createActivityTimer(1,1000),
 steps:['紙を用意する','丸を描く'],checked:[0],updatedAt:2000
};

describe('行動の進行状況の保存',()=>{
 it('壊れたデータは空で復旧し、混在する不正な記録・手順番号を取り除く',()=>{
  const storage=memoryStorage();
  expect(readActivityProgress(storage)).toEqual([]);
  for(const invalid of ['{broken','null','{"version":2,"items":[]}','{"version":1,"items":{}}']){
   storage.setItem(ACTIVITY_PROGRESS_KEY,invalid);
   expect(readActivityProgress(storage)).toEqual([]);
  }
  storage.setItem(ACTIVITY_PROGRESS_KEY,JSON.stringify({version:1,items:[
   null,
   {...initial,occurrenceId:'bad-time',timer:{...initial.timer,duration:60_001}},
   {...initial,recommendationId:'canvas:private'},
   {...initial,checked:[0,0,1.5,-1,2,'1']}
  ]}));
  expect(readActivityProgress(storage)).toEqual([initial]);
 });

 it('現在の候補と時間・手順が一致する記録だけを復元対象にする',()=>{
  const candidate=resolveActivity('saved:one',[action])!;
  expect(matchesActivityProgress(initial,candidate)).toBe(true);
  expect(matchesActivityProgress(initial,{...candidate,minutes:2})).toBe(false);
  expect(matchesActivityProgress(initial,{...candidate,note:'丸を描く。紙を用意する。'})).toBe(false);
  expect(matchesActivityProgress(initial,{...candidate,id:'saved:another'})).toBe(false);
 });

 it('別の候補を保持し、古い実行からの更新や削除が新しい実行に影響しない',()=>{
  const storage=memoryStorage();
  const second={...initial,recommendationId:'saved:two',occurrenceId:'second-start',updatedAt:3000};
  const restarted={...initial,occurrenceId:'first-restart',checked:[],updatedAt:4000};
  expect(writeActivityProgress(storage,initial)).toBe(true);
  expect(writeActivityProgress(storage,second)).toBe(true);
  expect(writeActivityProgress(storage,restarted,initial.occurrenceId)).toBe(true);
  expect(writeActivityProgress(storage,{...initial,checked:[0,1],updatedAt:5000},initial.occurrenceId)).toBe(false);
  clearActivityProgress(storage,initial.recommendationId,initial.occurrenceId);
  expect(readActivityProgress(storage)).toEqual([restarted,second]);
  clearActivityProgress(storage,restarted.recommendationId,restarted.occurrenceId);
  expect(readActivityProgress(storage)).toEqual([second]);
  clearActivityProgress(storage,second.recommendationId,second.occurrenceId);
  expect(storage.getItem(ACTIVITY_PROGRESS_KEY)).toBeNull();
 });
});
