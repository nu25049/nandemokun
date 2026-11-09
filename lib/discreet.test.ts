import {describe,expect,it} from 'vitest';
import {initialActions} from './actions';
import {isDiscreetRecommendation} from './discreet';
import {recommendations} from './recommendations';

describe('人目が気になるときの候補', () => {
 it('短い画面内ゲームとその場でできるお題を残し、体を使うお題は除く', () => {
  const pool = recommendations(initialActions, [], [], 1, false, 'all');
  const ids = pool.filter(isDiscreetRecommendation).map(item => item.id);
  expect(ids).toContain('play:calculation');
  expect(ids).toContain('catalog:extra:learn:1');
  expect(pool.some(item => item.id === 'catalog:move:1')).toBe(true);
  expect(ids).not.toContain('catalog:move:1');
 });

 it('手入力・店舗・課題を除き、候補が0件の場合も1件の場合も扱う', () => {
  const places = [{id:'node-1', name:'お店', category:'カフェ', distance:0, walkMinutes:1, minutes:17, url:'https://www.openstreetmap.org/node/1'}];
  const tasks = [{id:'1', name:'課題', url:'https://example.com', dueAt:null}];
  const pool = recommendations(initialActions, places, tasks, null, false, 'all');
  const excluded = pool.filter(item => item.source === 'saved' || item.source === 'nearby' || item.source === 'canvas');
  expect(excluded.length).toBeGreaterThan(initialActions.length);
  expect(excluded.filter(isDiscreetRecommendation)).toEqual([]);

  const only = pool.find(item => item.id === 'catalog:relax:4')!;
  expect([...excluded, only].filter(isDiscreetRecommendation)).toEqual([only]);
 });
});
