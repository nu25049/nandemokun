import {describe, expect, it} from 'vitest';
import {groupActivities, groupCandidates, pickGroupActivity} from './group-activities';

describe('みんなで画面の外で遊ぶ候補', () => {
 it('40件の手順・具体的な始め方・終わり方を持ち、全カテゴリと時間を含む', () => {
  expect(groupActivities).toHaveLength(40);
  expect(new Set(groupActivities.map(activity => activity.id)).size).toBe(40);
  expect(new Set(groupActivities.map(activity => activity.title)).size).toBe(40);
  expect(new Set(groupActivities.map(activity => activity.category)).size).toBe(5);
  expect([...new Set(groupActivities.map(activity => activity.minutes))].sort((a, b) => a - b)).toEqual([1, 3, 5, 10, 15, 30]);
  for (const activity of groupActivities) {
   expect(activity.minParticipants).toBeGreaterThanOrEqual(2);
   expect(activity.maxParticipants).toBeGreaterThanOrEqual(activity.minParticipants);
   expect(activity.maxParticipants).toBeLessThanOrEqual(8);
   expect(activity.steps.length).toBeGreaterThanOrEqual(2);
   expect(activity.steps[0]).toContain('「');
   expect(activity.endCondition).toMatch(/終了/);
   expect(activity.materials).toMatch(/^(なし|紙とペン（任意）)$/);
  }
 });

 it('人数・時間・人目・室内のすべての条件を同時に守る', () => {
  const pool = groupCandidates({participants: 4, minutes: 3, discreet: true, indoorOnly: true});
  expect(pool.length).toBeGreaterThan(0);
  for (const activity of pool) {
   expect(activity.minParticipants).toBeLessThanOrEqual(4);
   expect(activity.maxParticipants).toBeGreaterThanOrEqual(4);
   expect(activity.minutes).toBeLessThanOrEqual(3);
   expect(activity.discreet).toBe(true);
   expect(activity.place).not.toBe('outdoor');
  }
  expect(pool.some(activity => activity.id === 'group:movement:hand-mirror')).toBe(false);
  expect(groupCandidates({participants: 2, minutes: 3, discreet: true, indoorOnly: true}).some(activity => activity.id === 'group:movement:hand-mirror')).toBe(true);
  expect(groupCandidates({participants: 8, minutes: null, discreet: false, indoorOnly: false}).some(activity => activity.place === 'outdoor')).toBe(true);
 });

 it('条件が不正なら候補を補充しない', () => {
  const options = {participants: 2, minutes: 3, discreet: false, indoorOnly: false};
  for (const participants of [0, 1, 9, 2.5, NaN, Infinity]) expect(groupCandidates({...options, participants})).toEqual([]);
  for (const minutes of [0, -1, 1.5, 1441, NaN, Infinity]) expect(groupCandidates({...options, minutes})).toEqual([]);
 });

 it('0件・1件でも扱え、直前候補を避けて乱数の端や不正値でも1件だけ返す', () => {
  const first = groupActivities[0];
  expect(pickGroupActivity([], first.id)).toBeNull();
  expect(pickGroupActivity([first], first.id, () => 1)).toBe(first);
  for (const random of [0, 0.5, 1, -1, Infinity, NaN]) {
   const selected = pickGroupActivity(groupActivities, first.id, () => random);
   expect(selected).not.toBe(first);
   expect(groupActivities).toContain(selected);
  }
 });
});
