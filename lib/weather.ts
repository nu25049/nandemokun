import type { Action } from './actions';

export type Weather = { code: number; temperature: number; time: number };
// Open-MeteoのWMOコード：https://open-meteo.com/en/docs
const rainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
const snowy = [71, 73, 75, 77, 85, 86];
const stormy = [95, 96, 97, 99];
const supported = [0, 1, 2, 3, 45, 48, ...rainy, ...snowy, ...stormy];

export function weatherLabel(code: number): string {
 if (rainy.includes(code)) return '雨';
 if (snowy.includes(code)) return '雪';
 if (stormy.includes(code)) return '雷雨';
 if ([45, 48].includes(code)) return '霧';
 return code === 0 || code === 1 ? '晴れ' : 'くもり';
}
export function preferIndoors(code: number): boolean {
 return [...rainy, ...snowy, ...stormy, 45, 48].includes(code);
}
export function filterIndoors(actions: Action[], indoorOnly: boolean): Action[] {
 return indoorOnly ? actions.filter(action => action.place === 'indoor') : actions;
}
export function parseWeather(data: unknown, now = Date.now()): Weather {
 const current = (data as { current?: Partial<Weather> & { weather_code?: unknown; temperature_2m?: unknown } } | null)?.current;
 if (!current || typeof current.weather_code !== 'number' || !supported.includes(current.weather_code)
  || typeof current.temperature_2m !== 'number' || !Number.isFinite(current.temperature_2m)
  || current.temperature_2m < -100 || current.temperature_2m > 70
  || typeof current.time !== 'number' || !Number.isFinite(current.time)
  || now - current.time * 1000 > 90 * 60 * 1000 || current.time * 1000 - now > 30 * 60 * 1000) {
  throw new Error('天気データを確認できませんでした');
 }
 return { code: current.weather_code, temperature: current.temperature_2m, time: current.time };
}
export async function fetchWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<Weather> {
 if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw new Error('位置情報が不正です');
 const url = new URL('https://api.open-meteo.com/v1/forecast');
 // 天気には概略位置で十分なため、小数点以下2桁に丸めて送る。
 url.search = new URLSearchParams({ latitude: latitude.toFixed(2), longitude: longitude.toFixed(2), current: 'temperature_2m,weather_code', timeformat: 'unixtime', forecast_days: '1' }).toString();
 const response = await fetch(url, { signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
 if (!response.ok) throw new Error('天気サービスに接続できませんでした');
 return parseWeather(await response.json());
}
