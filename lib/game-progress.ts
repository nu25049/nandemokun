export const GAME_PROGRESS_KEY = 'himanakimihe.game-progress.v1';
export type GameProgress = {totalScore: number; bestTap: number};

const emptyProgress: GameProgress = {totalScore: 0, bestTap: 0};
const pointsPerLevel = 100;
let savedProgress = emptyProgress;
let pendingProgress = emptyProgress;

function validScore(value: unknown): number {
 return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function parseProgress(raw: string | null): GameProgress {
 if (!raw || raw.length > 256) return emptyProgress;
 try {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyProgress;
  const record = value as Partial<GameProgress>;
  return {totalScore: validScore(record.totalScore), bestTap: validScore(record.bestTap)};
 } catch {
  return emptyProgress;
 }
}

function mergeProgress(saved: GameProgress, pending: GameProgress): GameProgress {
 return {
  totalScore: Math.min(Number.MAX_SAFE_INTEGER, saved.totalScore + pending.totalScore),
  bestTap: Math.max(saved.bestTap, pending.bestTap),
 };
}

export function readGameProgress(): GameProgress {
 if (typeof window === 'undefined') return {...emptyProgress};
 try {
  savedProgress = parseProgress(window.localStorage.getItem(GAME_PROGRESS_KEY));
 } catch {
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
 try {
  // 別タブで増えた分を保つため、加算前に最新の値を読む。
  savedProgress = parseProgress(window.localStorage.getItem(GAME_PROGRESS_KEY));
  const updated = mergeProgress(savedProgress, pendingProgress);
  window.localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(updated));
  savedProgress = updated;
  pendingProgress = emptyProgress;
 } catch {
  // 保存できなかった加算分も、このページでのプレイ中は表示する。
 }
 return mergeProgress(savedProgress, pendingProgress);
}

export function gameLevel(totalScore: number): {level: number; intoLevel: number; perLevel: number} {
 const score = validScore(totalScore);
 return {level: 1 + Math.floor(score / pointsPerLevel), intoLevel: score % pointsPerLevel, perLevel: pointsPerLevel};
}
