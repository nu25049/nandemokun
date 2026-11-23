import {describe, expect, it} from 'vitest';
import {defaultHomeSettings, parseHomeSettings} from './home-settings';

describe('ホームの条件保存', () => {
 it('初回と破損データでは30分のおまかせから始める', () => {
  for (const raw of [null, '{broken', 'null', '[]', '42', '{}']) {
   expect(parseHomeSettings(raw)).toEqual(defaultHomeSettings());
  }
 });
 it('時間指定なしと短時間ゲームの設定を保持する', () => {
  const settings = {maxMinutes: null, source: 'favorites', avoidRepeat: true, gameKind: 'riddle', gameMinutes: 2, timerMode: 'up', participants: 4};
  expect(parseHomeSettings(JSON.stringify(settings))).toEqual(settings);
 });
 it('人数のない旧設定をひとり用として読み込み、不正な人数は初期値に戻す', () => {
  expect(parseHomeSettings(JSON.stringify({maxMinutes: 5, source: 'library'}))).toEqual({...defaultHomeSettings(), maxMinutes: 5, source: 'library'});
  for (const participants of [0, 9, 2.5, '3', null, {}, -2]) {
   expect(parseHomeSettings(JSON.stringify({participants})).participants).toBe(1);
  }
  for (const participants of [1, 2, 4, 8]) {
   expect(parseHomeSettings(JSON.stringify({participants})).participants).toBe(participants);
  }
 });
 it('不正な項目だけを初期値に戻し、知らない項目を取り込まない', () => {
  expect(parseHomeSettings(JSON.stringify({maxMinutes: -1, source: 'other', avoidRepeat: 'false', gameKind: '__proto__', gameMinutes: '30', timerMode: 'other', token: 'ignore'}))).toEqual(defaultHomeSettings());
  expect(parseHomeSettings(JSON.stringify({maxMinutes: 3, gameMinutes: 999}))).toEqual({...defaultHomeSettings(), maxMinutes: 3});
 });
});
