import {DEFAULT_PLAY_MINUTES, GAME_LABELS, type GameKind, type TimerMode} from './play';
import type {Source} from './recommendations';

export const HOME_SETTINGS_KEY = 'himanakimihe.home-settings.v1';
export const AVAILABLE_MINUTES = [1, 3, 5, 10, 15, 30, 60] as const;
export type HomeSource = Source | 'favorites';
export type HomeSettings = {
 maxMinutes: number | null;
 source: HomeSource;
 avoidRepeat: boolean;
 gameKind: GameKind;
 gameMinutes: number;
 timerMode: TimerMode;
 participants: number;
};

export function defaultHomeSettings(): HomeSettings {
 return {maxMinutes: 30, source: 'all', avoidRepeat: false, gameKind: 'calculation', gameMinutes: DEFAULT_PLAY_MINUTES, timerMode: 'down', participants: 1};
}

export function parseHomeSettings(raw: string | null): HomeSettings {
 const defaults = defaultHomeSettings();
 if (!raw) return defaults;
 try {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
  const saved = value as Record<string, unknown>;
  const sources: HomeSource[] = ['all', 'play', 'library', 'saved', 'favorites', 'nearby', 'canvas'];
  return {
   maxMinutes: saved.maxMinutes === null || AVAILABLE_MINUTES.some(minutes => minutes === saved.maxMinutes) ? saved.maxMinutes as number | null : defaults.maxMinutes,
   source: sources.includes(saved.source as HomeSource) ? saved.source as HomeSource : defaults.source,
   avoidRepeat: saved.avoidRepeat === true,
   gameKind: typeof saved.gameKind === 'string' && Object.hasOwn(GAME_LABELS, saved.gameKind) ? saved.gameKind as GameKind : defaults.gameKind,
   gameMinutes: [1, 2, 3, 5, 10, 15, 30, 60].includes(saved.gameMinutes as number) ? saved.gameMinutes as number : defaults.gameMinutes,
   timerMode: saved.timerMode === 'up' ? 'up' : 'down',
   participants: typeof saved.participants === 'number' && Number.isInteger(saved.participants) && saved.participants >= 1 && saved.participants <= 8 ? saved.participants : defaults.participants,
  };
 } catch {
  return defaults;
 }
}
