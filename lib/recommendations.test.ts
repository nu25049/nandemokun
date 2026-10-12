import {describe,expect,it} from 'vitest';
import {initialActions,pickNextAction} from './actions';
import {recommendations} from './recommendations';
import type {NearbyPlace} from './nearby';
import type {CanvasTask} from './canvas';
const place:NearbyPlace={id:'node-1',name:'お店',category:'カフェ',distance:200,walkMinutes:4,minutes:23,url:'https://www.openstreetmap.org/node/1'};
const task:CanvasTask={id:'1',name:'演習課題',dueAt:null,url:'https://nu.instructure.com/courses/1/assignments/1'};
describe('時間と種類に合わせる提案',()=>{
 it('保存候補0件でも、1分から外部接続なしで遊べる',()=>{
  const pool=recommendations([],[],[],1,false,'all');expect(pool).toHaveLength(2);
  expect(pool.every(p=>p.source==='play'&&p.minutes===1)).toBe(true);
 });
 it('自分の候補の0件・1件と、種類を限定した連続回避を守る',()=>{
  expect(recommendations([],[],[],1,false,'saved')).toEqual([]);
  const pool=recommendations([initialActions[0]],[],[],30,false,'saved');expect(pool).toHaveLength(1);
  expect(pickNextAction(pool,pool[0].id,true)).toEqual(pool[0]);
  const play=recommendations([],[],[],1,false,'play');expect(pickNextAction(play,play[0].id,true)?.id).toBe(play[1].id);
 });
 it('お店は往復＋滞在を満たす場合だけで、室内限定なら出さない',()=>{
  expect(recommendations([],[place],[],22,false,'nearby')).toHaveLength(0);
  expect(recommendations([],[place],[],23,false,'nearby')).toHaveLength(1);
  expect(recommendations([],[place],[],60,true,'nearby')).toHaveLength(0);
 });
 it('課題は1分なら提出条件確認、長めなら一部着手で完了時間と誤認させない',()=>{
  expect(recommendations([],[],[task],1,false,'canvas')[0].title).toContain('提出条件');
  const choice=recommendations([],[],[task],15,false,'canvas')[0];expect(choice.minutes).toBeLessThanOrEqual(15);expect(choice.note).toContain('課題全体が終わる時間ではありません');
 });
 it('不正な空き時間では提案せず、対象から時間外を選ばない',()=>{
  for(const time of [0,-1,1.5,NaN,1441])expect(recommendations([],[],[],time,false,'all')).toEqual([]);
  for(const time of [1,3,5,10,15,30,60])expect(recommendations(initialActions,[place],[task],time,false,'all').every(p=>p.minutes<=time)).toBe(true);
 });
});
