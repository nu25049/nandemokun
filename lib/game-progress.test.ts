import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';

let gameProgress: typeof import('./game-progress');
let storedValue: string | null;
const getItem = vi.fn();
const setItem = vi.fn();

beforeEach(async () => {
 vi.resetModules();
 gameProgress = await import('./game-progress');
 storedValue = null;
 getItem.mockReset().mockImplementation(() => storedValue);
 setItem.mockReset().mockImplementation((_key: string, value: string) => {storedValue = value;});
 vi.stubGlobal('window', {localStorage: {getItem,setItem}});
});
afterEach(() => vi.unstubAllGlobals());

describe('ゲームの累計スコア', () => {
 it('レベル1から始まり、100点ごとに繰り上げる', () => {
  const {gameLevel} = gameProgress;
  expect(gameLevel(0)).toEqual({level: 1, intoLevel: 0, perLevel: 100});
  expect(gameLevel(99)).toEqual({level: 1, intoLevel: 99, perLevel: 100});
  expect(gameLevel(100)).toEqual({level: 2, intoLevel: 0, perLevel: 100});
  expect(gameLevel(270)).toEqual({level: 3, intoLevel: 70, perLevel: 100});
 });

 it('毎回最新の累計へ加算し、タップの最高記録を保つ', () => {
  const {addGameScore,readGameProgress,GAME_PROGRESS_KEY} = gameProgress;
  expect(readGameProgress()).toEqual({totalScore: 0, bestTap: 0});
  expect(addGameScore(10)).toEqual({totalScore: 10, bestTap: 0});
  // 別タブが累計と最高記録を更新した状態を再現する。
  storedValue = JSON.stringify({totalScore: 42, bestTap: 32});
  expect(addGameScore(10, 8)).toEqual({totalScore: 52, bestTap: 32});
  expect(addGameScore(33, 33)).toEqual({totalScore: 85, bestTap: 33});
  expect(setItem).toHaveBeenLastCalledWith(GAME_PROGRESS_KEY, JSON.stringify({totalScore: 85, bestTap: 33}));
 });

 it('破損・範囲外の値を初期値に戻し、次の点数を保存できる', () => {
  const {addGameScore,readGameProgress} = gameProgress;
  for (const invalid of ['{broken', '[]', 'null', '{"totalScore":-1,"bestTap":1.5}', '{"totalScore":"100","bestTap":1e30}']) {
   storedValue = invalid;
   expect(readGameProgress()).toEqual({totalScore: 0, bestTap: 0});
  }
  expect(addGameScore(10)).toEqual({totalScore: 10, bestTap: 0});
 });

 it('保存できない間も加算し、復旧時に保存済みの点数と合算する', () => {
  const {addGameScore,readGameProgress} = gameProgress;
  storedValue = JSON.stringify({totalScore: 90, bestTap: 30});
  setItem.mockImplementationOnce(() => {throw new Error('storage full');});
  expect(addGameScore(10)).toEqual({totalScore: 100, bestTap: 30});
  expect(readGameProgress()).toEqual({totalScore: 100, bestTap: 30});
  getItem.mockImplementationOnce(() => {throw new Error('storage unavailable');});
  expect(addGameScore(10, 40)).toEqual({totalScore: 110, bestTap: 40});
  storedValue = JSON.stringify({totalScore: 100, bestTap: 35});
  expect(addGameScore(10)).toEqual({totalScore: 130, bestTap: 40});
  expect(readGameProgress()).toEqual({totalScore: 130, bestTap: 40});
 });
});
