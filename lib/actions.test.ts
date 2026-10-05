import { describe, expect, it } from 'vitest';
import { initialActions, parseActions, pickAction } from './actions';
describe('行動提案と保存データ',()=>{
 it('候補0件はnull',()=>expect(pickAction([])).toBeNull());
 it('乱数の両端で有効な候補を返す',()=>{expect(pickAction(initialActions,()=>0)).toEqual(initialActions[0]);expect(pickAction(initialActions,()=>0.99999)).toEqual(initialActions.at(-1));});
 it('候補1件ではその候補を返す',()=>expect(pickAction([initialActions[0]],()=>0.7)).toEqual(initialActions[0]));
 it('保存データと空配列を復元できる',()=>{expect(parseActions(JSON.stringify(initialActions))).toEqual(initialActions);expect(parseActions('[]')).toEqual([]);});
 it('壊れたデータと不正な時間を拒否する',()=>{expect(()=>parseActions('{}')).toThrow();expect(()=>parseActions(JSON.stringify([{...initialActions[0],minutes:-1}]))).toThrow();expect(()=>parseActions(JSON.stringify([initialActions[0],initialActions[0]]))).toThrow();});
});
