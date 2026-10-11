import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialActions, filterByTime, pickNextAction } from './actions';
import { fetchWeather, filterIndoors, parseWeather, preferIndoors, weatherLabel } from './weather';
afterEach(() => vi.unstubAllGlobals());
const now = Date.UTC(2026, 9, 9, 3);
const data = (code = 61, time = now / 1000) => ({ current: { weather_code: code, temperature_2m: 22.5, time } });
describe('天気と候補の絞り込み', () => {
 it('雨・雪・雷雨・霧は室内、晴れ・くもりは制限しない', () => {
  for (const code of [51, 57, 61, 67, 82, 71, 86, 95, 97, 99, 45, 48]) expect(preferIndoors(code)).toBe(true);
  for (const code of [0, 1, 2, 3]) expect(preferIndoors(code)).toBe(false);
  expect(weatherLabel(61)).toBe('雨'); expect(weatherLabel(97)).toBe('雷雨'); expect(weatherLabel(71)).toBe('雪');
 });
 it('時間と室内条件の両方を満たす候補を対象にし、元の候補は残す', () => {
  expect(filterIndoors(filterByTime(initialActions, 15), true).map(a => a.id)).toEqual(['read', 'desk', 'music']);
  expect(filterIndoors(initialActions, false)).toEqual(initialActions);
  expect(initialActions).toHaveLength(6);
 });
 it('室内候補が0件でも屋外を返さず、1件なら連続回避でも返す', () => {
  expect(pickNextAction(filterIndoors([initialActions[0]], true), null, true)).toBeNull();
  expect(pickNextAction(filterIndoors(initialActions.slice(0, 2), true), 'read', true)?.id).toBe('read');
 });
 it('正常な現在データを復元する', () => expect(parseWeather(data(), now)).toEqual({ code: 61, temperature: 22.5, time: now / 1000 }));
 it('欠落、不正コード、不正温度、古いデータ・未来の時刻は拒否する', () => {
  for (const bad of [null, {}, data(500), data(61, now / 1000 - 7200), data(61, now / 1000 + 3600), { current: { ...data().current, temperature_2m: null } }]) expect(() => parseWeather(bad, now)).toThrow();
 });
 it('APIのHTTPエラーは呼び出し側へ伝える', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  await expect(fetchWeather(35.68, 139.76)).rejects.toThrow();
 });
 it('概略位置だけ送信し、認証情報を送らない', async () => {
  const mock = vi.fn().mockResolvedValue({ ok: true, json: async () => data(0, Date.now() / 1000) });
  vi.stubGlobal('fetch', mock); await fetchWeather(35.681236, 139.767125);
  const [url, options] = mock.mock.calls[0];
  expect(url.searchParams.get('latitude')).toBe('35.68'); expect(url.searchParams.get('longitude')).toBe('139.77');
  expect(options.credentials).toBe('omit'); expect(options.referrerPolicy).toBe('no-referrer');
 });
 it('不正座標では通信しない', async () => {
  const mock = vi.fn(); vi.stubGlobal('fetch', mock);
  await expect(fetchWeather(91, 139)).rejects.toThrow(); expect(mock).not.toHaveBeenCalled();
 });
});
