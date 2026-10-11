import { describe, expect, it } from 'vitest';
import { filterByTime, initialActions, parseActions, pickAction, pickNextAction } from './actions';
describe('行動提案と保存データ',()=>{
 it('候補0件はnull',()=>expect(pickAction([])).toBeNull());
 it('乱数の両端で有効な候補を返す',()=>{expect(pickAction(initialActions,()=>0)).toEqual(initialActions[0]);expect(pickAction(initialActions,()=>0.99999)).toEqual(initialActions.at(-1));});
 it('候補1件ではその候補を返す',()=>expect(pickAction([initialActions[0]],()=>0.7)).toEqual(initialActions[0]));
 it('保存データと空配列を復元できる',()=>{expect(parseActions(JSON.stringify(initialActions))).toEqual(initialActions);expect(parseActions('[]')).toEqual([]);});
 it('壊れたデータと不正な時間を拒否する',()=>{expect(()=>parseActions('{}')).toThrow();expect(()=>parseActions(JSON.stringify([{...initialActions[0],minutes:-1}]))).toThrow();expect(()=>parseActions(JSON.stringify([initialActions[0],initialActions[0]]))).toThrow();});
});
describe('第二回：時間条件と連続提案', () => {
 it('時間指定なしはすべての候補を対象にする', () => {
  expect(filterByTime(initialActions, null)).toEqual(initialActions);
 });
 it('指定した時間ちょうどを含め、長い候補は除く', () => {
  expect(filterByTime(initialActions, 15).map(action => action.id)).toEqual(['read', 'desk', 'music']);
  expect(initialActions).toHaveLength(6);
 });
 it('条件に合う候補が0件なら条件を勝手に広げない', () => {
  expect(pickNextAction(filterByTime(initialActions, 1), 'walk', true)).toBeNull();
  expect(filterByTime([], 15)).toEqual([]);
 });
 it('連続回避が有効なら直前の候補を選ばない', () => {
  const eligible = filterByTime(initialActions, 5);
  expect(pickNextAction(eligible, 'desk', true, () => 0)?.id).toBe('music');
  expect(pickNextAction(eligible, 'music', true, () => 0.99999)?.id).toBe('desk');
 });
 it('時間内の候補が1件なら連続回避中もその候補を返す', () => {
  expect(pickNextAction([initialActions[0]], 'walk', true)).toEqual(initialActions[0]);
 });
 it('連続回避が無効なら同じ候補も選べる', () => {
  expect(pickNextAction(initialActions, 'walk', false, () => 0)).toEqual(initialActions[0]);
 });
 it('直前の候補が対象外になっても現在の条件内から選ぶ', () => {
  expect(pickNextAction(filterByTime(initialActions, 5), 'cafe', true, () => 0)?.id).toBe('desk');
 });
});
