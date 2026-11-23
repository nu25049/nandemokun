import type {GameKind,TimerMode} from './play';

export const GAME_PROGRESS_KEY = 'himanakimihe.game-progress.v1';
export type GameProgress = {totalScore: number; bestTap: number; bestScores?: Record<string,number>};

const emptyProgress: GameProgress = {totalScore: 0, bestTap: 0};
const pointsPerLevel = 100;
let savedProgress = emptyProgress;
let pendingProgress = emptyProgress;
let storageAvailable = true;
const maxProgressLength = 8192;
const recordKeyPattern = /^(calculation|riddle|sequence|word|trivia):(up|down:(1|2|3|5|10|15|30|60))$/;

export function gameRecordKey(kind: GameKind, minutes: number, mode: TimerMode): string {
 const key = mode === 'up' ? `${kind}:up` : `${kind}:down:${minutes}`;
 if (!recordKeyPattern.test(key)) throw new Error('対応していないゲームの記録です。');
 return key;
}

export function parseGameBestScores(value: unknown, strict = false): Record<string,number> {
 const result: Record<string,number> = {};
 if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length > 45) {
  if (strict) throw new Error('ゲームの自己ベストの形式が違います。');
  return result;
 }
 for (const [key,score] of Object.entries(value)) {
  if (!recordKeyPattern.test(key) || typeof score !== 'number' || !Number.isSafeInteger(score) || score < 0) {
   if (strict) throw new Error('ゲームの自己ベストが不正です。');
   continue;
  }
  result[key] = score;
 }
 return result;
}

function validScore(value: unknown): number {
 return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function parseProgress(raw: string | null): GameProgress {
 if (!raw || raw.length > maxProgressLength) return emptyProgress;
 try {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyProgress;
  const record = value as Partial<GameProgress>;
  const bestScores = parseGameBestScores(record.bestScores);
  return {totalScore: validScore(record.totalScore), bestTap: validScore(record.bestTap), ...(Object.keys(bestScores).length ? {bestScores} : {})};
 } catch {
  return emptyProgress;
 }
}

function mergeProgress(saved: GameProgress, pending: GameProgress): GameProgress {
 const bestScores = {...saved.bestScores};
 for (const [key,score] of Object.entries(pending.bestScores ?? {})) {
  bestScores[key] = Math.max(bestScores[key] ?? 0, score);
 }
 return {
  totalScore: Math.min(Number.MAX_SAFE_INTEGER, saved.totalScore + pending.totalScore),
  bestTap: Math.max(saved.bestTap, pending.bestTap),
  ...(Object.keys(bestScores).length ? {bestScores} : {}),
 };
}

function readSavedProgress(): void {
 savedProgress = parseProgress(window.localStorage.getItem(GAME_PROGRESS_KEY));
 storageAvailable = true;
}

export function readGameProgress(): GameProgress {
 if (typeof window === 'undefined') return {...emptyProgress};
 try {
  readSavedProgress();
 } catch {
  storageAvailable = false;
  // 保存領域を読めない間は、最後に読み込んだ点数を表示する。
 }
 return mergeProgress(savedProgress, pendingProgress);
}

export function addGameScore(points: number, tapScore = 0): GameProgress {
 if (typeof window === 'undefined') return {...emptyProgress};
 pendingProgress = mergeProgress(pendingProgress, {
  totalScore: validScore(points),
  bestTap: validScore(tapScore),
 });
 return saveProgress();
}

export function recordGameBest(key: string, score: number): GameProgress {
 if (!recordKeyPattern.test(key) || typeof score !== 'number' || !Number.isSafeInteger(score) || score < 0) {
  throw new Error('ゲームの自己ベストが不正です。');
 }
 if (typeof window === 'undefined') return {...emptyProgress};
 pendingProgress = mergeProgress(pendingProgress, {totalScore: 0, bestTap: 0, bestScores: {[key]: score}});
 return saveProgress();
}

function saveProgress(): GameProgress {
 try {
  // 別タブで増えた分を保つため、加算前に最新の値を読む。
  readSavedProgress();
  const updated = mergeProgress(savedProgress, pendingProgress);
  window.localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(updated));
  savedProgress = updated;
  pendingProgress = emptyProgress;
 } catch {
  storageAvailable = false;
  // 保存できなかった加算分も、このページでのプレイ中は表示する。
 }
 return mergeProgress(savedProgress, pendingProgress);
}

export function progressIsSaved(): boolean {
 return typeof window !== 'undefined' && storageAvailable && pendingProgress === emptyProgress;
}

export function gameLevel(totalScore: number): {level: number; intoLevel: number; perLevel: number} {
 const score = validScore(totalScore);
 return {level: 1 + Math.floor(score / pointsPerLevel), intoLevel: score % pointsPerLevel, perLevel: pointsPerLevel};
}
