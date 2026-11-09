'use client';
import {useEffect, useRef, useState} from 'react';
import {initialActions, parseActions, STORAGE_KEY, type Action} from '../../lib/actions';
import {recommendations, type Recommendation} from '../../lib/recommendations';
import {ENGAGEMENT_KEY, emptyEngagement, parseEngagement, rate, toggleFavorite, type Engagement, type Outcome} from '../../lib/engagement';
import {activitySteps, createActivityTimer, pauseActivityTimer, remainingActivitySeconds, resolveActivity, resumeActivityTimer} from '../../lib/activity';
import {ACTIVITY_PROGRESS_KEY, clearActivityProgress, matchesActivityProgress, readActivityProgress, writeActivityProgress, type ActivityProgress} from '../../lib/activity-progress';

type Run = {
 item: Recommendation;
 progress: ActivityProgress;
 engagement: Engagement;
 outcome: Outcome;
};

export default function ActivityPanel({id}: {id: string}) {
 const [run, setRun] = useState<Run | null>(null);
 const [ready, setReady] = useState(false);
 const [notice, setNotice] = useState('');
 const [now, setNow] = useState(0);
 const current = useRef<Run | null>(null);
 const pool = useRef<Recommendation[]>([]);
 const persisted = useRef(false);
 const initialized = useRef(false);
 const engagementUnsaved = useRef(false);

 function show(next: Run) {
  current.current = next;
  setRun(next);
 }

 function saveEngagement(next: Engagement): boolean {
  try {
   localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(next));
   engagementUnsaved.current = false;
   return true;
  } catch {
   engagementUnsaved.current = true;
   setNotice('端末に記録できませんでした。この画面では続けられます。');
   return false;
  }
 }

 function latestEngagement(fallback: Engagement): Engagement {
  if (engagementUnsaved.current) return fallback;
  try { return parseEngagement(localStorage.getItem(ENGAGEMENT_KEY), pool.current); }
  catch { return fallback; }
 }

 useEffect(() => {
  if (initialized.current) return;
  initialized.current = true;
  let actions: Action[] = initialActions;
  try {
   const raw = localStorage.getItem(STORAGE_KEY);
   if (raw !== null) actions = parseActions(raw);
  } catch {
   actions = [];
   setNotice('自分の候補を読み込めませんでした。カタログは利用できます。');
  }
  const item = resolveActivity(id, actions);
  setReady(true);
  if (!item) return;

  pool.current = recommendations(actions, [], [], null, false, 'all');
  let engagement = emptyEngagement();
  try { engagement = parseEngagement(localStorage.getItem(ENGAGEMENT_KEY), pool.current); }
  catch { setNotice('利用記録を読み込めませんでした。新しく記録できます。'); }

  const at = Date.now();
 const pending = engagement.feedback.filter(row => row.recommendationId === id && row.outcome === 'pending').at(-1);
  let saved: ActivityProgress | undefined;
  try { saved = readActivityProgress(localStorage).find(entry => entry.recommendationId === id); }
  catch { setNotice('途中の行動を読み込めませんでした。この画面では続けられます。'); }
  const savedOutcome = engagement.feedback.find(row => row.id === saved?.occurrenceId)?.outcome;
  if (saved && (!matchesActivityProgress(saved, item) || (savedOutcome && savedOutcome !== 'pending'))) saved = undefined;

  const progress: ActivityProgress = saved ?? {
   recommendationId: id,
   occurrenceId: pending?.id ?? crypto.randomUUID(),
   timer: createActivityTimer(item.minutes, at),
   steps: activitySteps(item.note || item.title),
   checked: [],
   updatedAt: at,
  };

  if (!engagement.feedback.some(row => row.id === progress.occurrenceId)) {
   engagement = rate(engagement, item, progress.occurrenceId, 'pending', at);
   saveEngagement(engagement);
  }
  try { persisted.current = Boolean(saved) || writeActivityProgress(localStorage, progress); }
  catch { setNotice('途中の行動を保存できませんでした。この画面では続けられます。'); }
  show({item, progress, engagement, outcome: 'pending'});
  setNow(at);
 }, [id]);

 useEffect(() => {
  function sync(event: StorageEvent) {
   const active = current.current;
   if (!active || (event.key !== ACTIVITY_PROGRESS_KEY && event.key !== ENGAGEMENT_KEY && event.key !== null)) return;
   try {
    const engagement = latestEngagement(active.engagement);
    const rated = engagement.feedback.find(row => row.id === active.progress.occurrenceId)?.outcome;
    const stored = readActivityProgress(localStorage).find(entry => entry.recommendationId === id);
    const progress = stored?.occurrenceId === active.progress.occurrenceId && stored.updatedAt >= active.progress.updatedAt ? stored : active.progress;
    const outcome = rated ?? active.outcome;
    show({ ...active, progress, engagement, outcome });
    if (persisted.current && stored?.occurrenceId !== active.progress.occurrenceId && outcome === 'pending') {
     setNotice('別のタブで進行状況が更新されました。ホームから開き直せます。');
    }
    setNow(Date.now());
   } catch { /* 保存領域が使えなくても、開いている画面は操作できる。 */ }
  }
  window.addEventListener('storage', sync);
  return () => window.removeEventListener('storage', sync);
 }, [id]);

 const seconds = run ? remainingActivitySeconds(run.progress.timer, now) : 0;
 const ticking = run?.outcome === 'pending' && !run.progress.timer.paused && seconds > 0;
 useEffect(() => {
  if (!ticking) return;
  const handle = setInterval(() => setNow(Date.now()), 250);
  return () => clearInterval(handle);
 }, [ticking]);

 function changeProgress(change: (progress: ActivityProgress, at: number) => ActivityProgress) {
  const active = current.current;
  if (!active || active.outcome !== 'pending') return;
  const at = Date.now();
  let progress = change(active.progress, at);
  try {
   const stored = readActivityProgress(localStorage).find(entry => entry.recommendationId === id);
   if (stored?.occurrenceId === active.progress.occurrenceId && stored.updatedAt > active.progress.updatedAt) progress = change(stored, at);
   const expected = persisted.current ? active.progress.occurrenceId : undefined;
   if (!writeActivityProgress(localStorage, {...progress, updatedAt: at}, expected)) {
    setNotice('別のタブで進行状況が更新されました。ホームから開き直せます。');
    return;
   }
   persisted.current = true;
   setNotice('');
  } catch {
   setNotice('途中の行動を保存できませんでした。この画面では続けられます。');
  }
  show({...active, progress: {...progress, updatedAt: at}});
  setNow(at);
 }

 function finish(outcome: 'done' | 'skip') {
  const active = current.current;
  if (!active) return;
  const at = Date.now();
  const engagement = rate(latestEngagement(active.engagement), active.item, active.progress.occurrenceId, outcome, at);
  const timer = pauseActivityTimer(active.progress.timer, at);
  show({...active, progress: {...active.progress, timer}, engagement, outcome});
  setNow(at);
  if (!saveEngagement(engagement)) return;
  try {
   clearActivityProgress(localStorage, id, active.progress.occurrenceId);
   persisted.current = false;
   setNotice('このブラウザーに記録しました。');
  } catch { setNotice('結果を記録しました。途中の記録は次に開いたときに整理されます。'); }
 }

 function favorite() {
  const active = current.current;
  if (!active) return;
  const engagement = toggleFavorite(latestEngagement(active.engagement), active.item);
  show({...active, engagement});
  if (saveEngagement(engagement)) setNotice('このブラウザーに記録しました。');
 }

 const pending = run?.outcome === 'pending';
 const paused = run?.progress.timer.paused;
 let clockMessage = '手順をひとつずつ進めよう。';
 if (!pending) clockMessage = '結果を選びました。';
 else if (seconds === 0) clockMessage = '目安の時間になりました。下のボタンで結果を記録しよう。';
 else if (paused) clockMessage = '一時停止中';

 return (
  <main className="activity-focus">
   <div className="activity-focus-top"><a href="/">← ホームへ</a><a href="/ideas">ほかの暇つぶしを探す</a></div>
   {!ready && <p>読み込み中…</p>}
   {ready && !run && <section className="activity-focus-card"><h1>この候補は見つかりませんでした</h1><p>ホームから選び直してください。</p></section>}
   {run && (
    <section className="activity-focus-card">
     <span className="eyebrow">ONE THING AT A TIME</span>
     <h1>{run.item.title}</h1>
     <div className="activity-focus-clock">
      <time>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</time>
      <p>{clockMessage}</p>
     </div>
     <div className="activity-focus-controls">
      <button disabled={!seconds || !pending} onClick={() => changeProgress((entry, at) => ({
       ...entry, timer: paused ? resumeActivityTimer(entry.timer, at) : pauseActivityTimer(entry.timer, at),
      }))}>{paused ? '再開' : '一時停止'}</button>
      <button aria-pressed={run.engagement.favorites.includes(run.item.id)} onClick={favorite}>{run.engagement.favorites.includes(run.item.id) ? '★ お気に入り済み' : '☆ お気に入りに追加'}</button>
     </div>
     <h2>やること</h2>
     <p className="activity-focus-progress">{run.progress.checked.length} / {run.progress.steps.length}ステップ</p>
     <ul className="activity-focus-checklist">
      {run.progress.steps.map((step, index) => (
       <li key={index}>
        <label>
         <input type="checkbox" disabled={!pending} checked={run.progress.checked.includes(index)} onChange={event => {
          const checked = event.target.checked;
          changeProgress(entry => ({...entry, checked: checked ? [...new Set([...entry.checked, index])] : entry.checked.filter(value => value !== index)}));
         }}/>
         <span>{step}</span>
        </label>
       </li>
      ))}
     </ul>
     <div className="activity-focus-outcomes">
      <button aria-pressed={run.outcome === 'done'} onClick={() => finish('done')}>やってみた</button>
      <button aria-pressed={run.outcome === 'skip'} onClick={() => finish('skip')}>今回は見送る</button>
     </div>
     <p className="activity-focus-summary">ホームの「途中の行動」から続きを開けます。一時停止しておくと、閉じている間も残り時間を保てます。</p>
     <p className="activity-focus-notice" role="status">{notice}</p>
    </section>
   )}
  </main>
 );
}
