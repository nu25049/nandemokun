export type Action = { id: string; title: string; minutes: number; place: 'indoor' | 'outdoor'; note: string };
export const STORAGE_KEY = 'himanakimihe.actions.v1';
export const initialActions: Action[] = [
 {id:'walk', title:'近所をゆっくり散歩する', minutes:20, place:'outdoor', note:'いつもと違う道を一本だけ。気になる景色を探してみよう。'},
 {id:'read', title:'読みかけの本をひらく', minutes:15, place:'indoor', note:'一章読まなくても大丈夫。まずは数ページから。'},
 {id:'desk', title:'机の上をひと区画だけ片づける', minutes:5, place:'indoor', note:'小さく始めて、気持ちにも余白をつくろう。'},
 {id:'music', title:'好きな音楽を一曲聴く', minutes:5, place:'indoor', note:'ほかの画面を閉じて、一曲だけじっくり。'},
 {id:'learn', title:'気になっていたことをひとつ学ぶ', minutes:30, place:'indoor', note:'小さな疑問をひとつ選んで調べてみよう。'},
 {id:'cafe', title:'外へ出てひと休みする', minutes:45, place:'outdoor', note:'行き先は自分の知っている場所から。無理なく気分転換。'}
];
export function pickAction(actions: Action[], random = Math.random): Action | null {
 if (!actions.length) return null;
 return actions[Math.min(actions.length - 1, Math.max(0, Math.floor(random() * actions.length)))];
}
export function parseActions(raw: string): Action[] {
 const data: unknown = JSON.parse(raw);
 if (!Array.isArray(data) || !data.every(a => a && typeof a.id === 'string' && typeof a.title === 'string' && a.title.trim().length > 0 && a.title.length <= 80 && Number.isInteger(a.minutes) && a.minutes >= 1 && a.minutes <= 1440 && ['indoor','outdoor'].includes(a.place) && typeof a.note === 'string' && a.note.length <= 200)) throw new Error('保存データの形式が不正です');
 if (new Set(data.map(a => a.id)).size !== data.length) throw new Error('IDが重複しています');
 return data;
}
