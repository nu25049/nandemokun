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

 it('種類・カウントダウンの分数を分け、カウントアップは分数を共通にする', () => {
  const {gameRecordKey,recordGameBest,readGameProgress} = gameProgress;
  expect(gameRecordKey('calculation', 1, 'down')).toBe('calculation:down:1');
  expect(gameRecordKey('calculation', 3, 'down')).toBe('calculation:down:3');
  expect(gameRecordKey('riddle', 1, 'down')).toBe('riddle:down:1');
  expect(gameRecordKey('trivia', 1, 'up')).toBe(gameRecordKey('trivia', 60, 'up'));
  for (const [key,score] of [['calculation:down:1', 9], ['calculation:down:3', 18], ['riddle:down:1', 4], ['trivia:up', 2]] as const) {
   recordGameBest(key, score);
  }
  recordGameBest('calculation:down:1', 3);
  expect(readGameProgress()).toEqual({totalScore: 0, bestTap: 0, bestScores: {
   'calculation:down:1': 9, 'calculation:down:3': 18, 'riddle:down:1': 4, 'trivia:up': 2,
  }});
 });

 it('以前の記録を読み、不正な自己ベストだけを除外し、保存サイズを制限する', () => {
  const {readGameProgress,recordGameBest} = gameProgress;
  storedValue = JSON.stringify({totalScore: 250, bestTap: 80});
  expect(readGameProgress()).toEqual({totalScore: 250, bestTap: 80});
  storedValue = JSON.stringify({totalScore: 250, bestTap: 80, bestScores: {
   'word:up': 7, 'calculation:down:1': 0, 'unknown:up': 4,
   'trivia:down:4': 3, 'riddle:up': -1, 'sequence:up': 0.5, 'word:down:1': '4',
  }});
  expect(readGameProgress().bestScores).toEqual({'word:up': 7, 'calculation:down:1': 0});
  storedValue = ' '.repeat(8193);
  expect(readGameProgress()).toEqual({totalScore: 0, bestTap: 0});
  expect(recordGameBest('word:up', 9).bestScores?.['word:up']).toBe(9);
  expect(storedValue!.length).toBeLessThan(8192);
 });

 it('保存失敗中の自己ベストを保ち、復旧時に最新の別タブの記録と最大値で統合する', () => {
  const {readGameProgress,addGameScore,recordGameBest,progressIsSaved} = gameProgress;
  storedValue = JSON.stringify({totalScore: 40, bestTap: 20, bestScores: {'trivia:down:1': 4}});
  expect(progressIsSaved()).toBe(true);
  readGameProgress();
  setItem.mockImplementationOnce(() => {throw new Error('quota');});
  expect(recordGameBest('trivia:down:1', 8).bestScores?.['trivia:down:1']).toBe(8);
  expect(progressIsSaved()).toBe(false);
  // 読むだけでは未保存の点数を保存済みとして扱わない。
  expect(readGameProgress().bestScores?.['trivia:down:1']).toBe(8);
  expect(progressIsSaved()).toBe(false);
  storedValue = JSON.stringify({totalScore: 90, bestTap: 30, bestScores: {'trivia:down:1': 6, 'word:up': 10}});
  expect(addGameScore(10)).toEqual({totalScore: 100, bestTap: 30, bestScores: {'trivia:down:1': 8, 'word:up': 10}});
  expect(progressIsSaved()).toBe(true);
 });

 it('別タブのバックアップ復元で低い記録に置き換わった場合、復元した値へ次の得点を加える', () => {
  const {readGameProgress,addGameScore,recordGameBest} = gameProgress;
  storedValue = JSON.stringify({totalScore: 1000, bestTap: 100, bestScores: {'trivia:down:1': 20, 'word:up': 15}});
  expect(readGameProgress().totalScore).toBe(1000);
  // 明示的な復元は、その時点の保存記録を丸ごと置き換える。
  storedValue = JSON.stringify({totalScore: 200, bestTap: 30, bestScores: {'trivia:down:1': 4}});
  expect(readGameProgress()).toEqual({totalScore: 200, bestTap: 30, bestScores: {'trivia:down:1': 4}});
  expect(addGameScore(10)).toEqual({totalScore: 210, bestTap: 30, bestScores: {'trivia:down:1': 4}});
  expect(recordGameBest('trivia:down:1', 5)).toEqual({totalScore: 210, bestTap: 30, bestScores: {'trivia:down:1': 5}});
  expect(JSON.parse(storedValue!)).toEqual({totalScore: 210, bestTap: 30, bestScores: {'trivia:down:1': 5}});
 });

 it('読み取り失敗を知らせ、無効な自己ベストを書き込まない', () => {
  const {recordGameBest,readGameProgress,progressIsSaved,gameRecordKey} = gameProgress;
  getItem.mockImplementationOnce(() => {throw new Error('blocked');});
  expect(readGameProgress()).toEqual({totalScore: 0, bestTap: 0});
  expect(progressIsSaved()).toBe(false);
  expect(() => gameRecordKey('trivia', 4, 'down')).toThrow();
  for (const [key,score] of [['unknown:up', 2], ['trivia:down:4', 2], ['trivia:up', -1], ['trivia:up', 0.5], ['trivia:up', Infinity], ['trivia:up', Number.MAX_SAFE_INTEGER + 1]] as const) {
   expect(() => recordGameBest(key,score)).toThrow();
  }
  expect(setItem).not.toHaveBeenCalled();
  expect(recordGameBest('trivia:up', 1).bestScores?.['trivia:up']).toBe(1);
  expect(progressIsSaved()).toBe(true);
 });
});
