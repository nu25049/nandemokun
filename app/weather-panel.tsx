'use client';
import { useEffect, useRef, useState } from 'react';
import { fetchWeather, preferIndoors, weatherLabel, type Weather } from '../lib/weather';

export default function WeatherPanel({ indoorOnly, onChange, disabled }: { indoorOnly: boolean; onChange: (value: boolean) => void; disabled: boolean }) {
 const [weather, setWeather] = useState<Weather | null>(null);
 const [busy, setBusy] = useState(false);
 const [notice, setNotice] = useState('');
 const request = useRef(0);
 const controller = useRef<AbortController | null>(null);
 useEffect(() => () => { request.current++; controller.current?.abort(); }, []);
 // 長く開いた画面では古い天気に基づいた条件を維持しない。
 useEffect(() => {
  if (!weather) return;
  const timer = setTimeout(() => { setWeather(null); onChange(false); setNotice('天気情報の有効時間を過ぎました。場所の条件を解除しました。必要なら再確認してください。'); }, Math.max(0, weather.time * 1000 + 90 * 60 * 1000 - Date.now()));
  return () => clearTimeout(timer);
 }, [weather, onChange]);

 function manual(value: boolean) {
  request.current++; controller.current?.abort(); setBusy(false); setWeather(null); onChange(value);
  setNotice(value ? '天気や位置情報を使わず、室内候補だけを提案します。' : '場所の条件を解除しました。');
 }
 async function checkWeather() {
  const id = ++request.current;
  controller.current?.abort(); setBusy(true); setWeather(null); setNotice('現在地と天気を確認しています。');
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
   if (!navigator.geolocation) throw new Error('位置情報に対応していません');
   const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }));
   if (request.current !== id) return;
   const abort = new AbortController(); controller.current = abort;
   timeout = setTimeout(() => abort.abort(), 8000);
   const data = await fetchWeather(position.coords.latitude, position.coords.longitude, abort.signal);
   if (request.current !== id) return;
   setWeather(data); onChange(preferIndoors(data.code));
   setNotice(preferIndoors(data.code) ? '天気に合わせ、室内の候補に絞りました。' : '天気による場所の絞り込みは行いません。');
  } catch {
   if (request.current !== id) return;
   onChange(false); setNotice('天気を取得できませんでした。場所の条件を解除し、通常の提案を続けます。室内のみへの手動切り替えもできます。');
  } finally { if (timeout) clearTimeout(timeout); if (request.current === id) setBusy(false); }
 }
 return <div className="weather-panel">
  <label htmlFor="indoor-only">場所の条件</label>
  <select id="indoor-only" value={indoorOnly ? 'indoor' : 'all'} disabled={disabled} onChange={e => manual(e.target.value === 'indoor')}>
   <option value="all">室内・屋外どちらでも</option><option value="indoor">室内だけにする</option>
  </select>
  <button className="weather-button" type="button" onClick={checkWeather} disabled={disabled || busy}>{busy ? '天気を確認中…' : '現在地の天気に合わせる'}</button>
  {busy && <button className="reset-time" type="button" onClick={() => manual(false)}>天気の確認をやめる</button>}
  <div className="weather-status" role="status">
   {weather && <p><strong>{weatherLabel(weather.code)} · {Math.round(weather.temperature)}℃</strong><br/>{new Date(weather.time * 1000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}時点の推定（天気モデル）</p>}
   {notice && <p>{notice}</p>}
  </div>
  <p className="weather-note">ボタンを押した場合のみ位置情報を利用し、概略位置を天気サービスへ送信します。位置は保存しません。</p>
  <a className="weather-source" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather data by Open-Meteo ↗</a>
 </div>;
}
