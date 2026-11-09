import {activitySteps, type ActivityTimer} from './activity';
import type {Recommendation} from './recommendations';

export const ACTIVITY_PROGRESS_KEY = 'himanakimihe.activity-progress.v1';
const MAX_ITEMS = 20;
const MAX_DURATION = 1440 * 60_000;

export type ActivityProgress = {
 recommendationId: string;
 occurrenceId: string;
 timer: ActivityTimer;
 steps: string[];
 checked: number[];
 updatedAt: number;
};

type ProgressStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isTimestamp(value: unknown): value is number {
 return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;
}

function parseTimer(value: unknown): ActivityTimer | null {
 if (!value || typeof value !== 'object') return null;
 const {duration, startedAt, elapsed, paused} = value as Record<string, unknown>;
 if (typeof duration !== 'number' || duration < 60_000 || duration > MAX_DURATION || duration % 60_000 !== 0) return null;
 if (!isTimestamp(startedAt) || !isTimestamp(elapsed) || typeof paused !== 'boolean') return null;
 return {duration, startedAt, elapsed: Math.min(elapsed, duration), paused};
}

function parseEntry(value: unknown): ActivityProgress | null {
 if (!value || typeof value !== 'object') return null;
 const {recommendationId, occurrenceId, timer, steps, checked, updatedAt} = value as Record<string, unknown>;
 if (typeof recommendationId !== 'string' || !/^(catalog|saved):.+$/u.test(recommendationId) || recommendationId.length > 166) return null;
 if (typeof occurrenceId !== 'string' || !/^[\w-]{1,80}$/.test(occurrenceId) || !isTimestamp(updatedAt)) return null;
 const clock = parseTimer(timer);
 if (!clock || !Array.isArray(steps) || steps.length > 200 || !steps.every(step => typeof step === 'string' && step.length <= 2000) || steps.join('').length > 2000 || !Array.isArray(checked)) return null;
 const indices = checked.filter((index): index is number => Number.isInteger(index) && index >= 0 && index < steps.length);
 return {recommendationId, occurrenceId, timer: clock, steps, checked: [...new Set(indices)], updatedAt};
}

export function readActivityProgress(storage: Pick<Storage, 'getItem'>): ActivityProgress[] {
 const raw = storage.getItem(ACTIVITY_PROGRESS_KEY);
 if (!raw || raw.length > 100_000) return [];
 try {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object') return [];
  const {version, items} = data as Record<string, unknown>;
  if (version !== 1 || !Array.isArray(items)) return [];
  const latest = new Map<string, ActivityProgress>();
  for (const rawEntry of items) {
   const entry = parseEntry(rawEntry);
   if (!entry) continue;
   const previous = latest.get(entry.recommendationId);
   if (!previous || previous.updatedAt < entry.updatedAt) latest.set(entry.recommendationId, entry);
  }
  return [...latest.values()].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_ITEMS);
 } catch {
  return [];
 }
}

export function matchesActivityProgress(progress: ActivityProgress, item: Recommendation): boolean {
 const steps = activitySteps(item.note || item.title);
 return progress.recommendationId === item.id && progress.timer.duration === item.minutes * 60_000 &&
  steps.length === progress.steps.length && steps.every((step, index) => step === progress.steps[index]);
}

export function writeActivityProgress(storage: ProgressStorage, progress: ActivityProgress, expectedOccurrenceId?: string): boolean {
 const items = readActivityProgress(storage);
 const previous = items.find(entry => entry.recommendationId === progress.recommendationId);
 if (expectedOccurrenceId && previous?.occurrenceId !== expectedOccurrenceId) return false;
 const next = [progress, ...items.filter(entry => entry.recommendationId !== progress.recommendationId)].slice(0, MAX_ITEMS);
 storage.setItem(ACTIVITY_PROGRESS_KEY, JSON.stringify({version: 1, items: next}));
 return true;
}

export function clearActivityProgress(storage: ProgressStorage, recommendationId: string, occurrenceId?: string): void {
 const items = readActivityProgress(storage);
 const remaining = items.filter(entry => entry.recommendationId !== recommendationId || (occurrenceId && entry.occurrenceId !== occurrenceId));
 if (items.length === remaining.length) return;
 if (remaining.length === 0) storage.removeItem(ACTIVITY_PROGRESS_KEY);
 else storage.setItem(ACTIVITY_PROGRESS_KEY, JSON.stringify({version: 1, items: remaining}));
}
