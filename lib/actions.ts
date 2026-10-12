export type Action = { id: string; title: string; minutes: number; place: 'indoor' | 'outdoor'; note: string };
export const STORAGE_KEY = 'himanakimihe.actions.v1';
export const initialActions: Action[] = [
 {id:'walk', title:'10分歩いて、同じ道で戻ってくる', minutes:20, place:'outdoor', note:'外に出て10分のタイマーを開始する。歩道を歩き、鳴ったら同じ道を戻る。行き先を決める必要はありません。'},
 {id:'read', title:'青空文庫で「走れメロス」を10分読む', minutes:15, place:'indoor', note:'ブラウザーで「青空文庫 走れメロス 太宰治」と検索し、青空文庫の本文を開く。10分のタイマーをかけて冒頭から読む。本を持っていなくてもできます。'},
 {id:'desk', title:'手の届く範囲の物を3つ、元の場所に戻す', minutes:5, place:'indoor', note:'目の前の机や床から、出したままの物を3つ選んで戻す。3つ戻したら終わり。片づける物がなければ別の候補を選ぶ。'},
 {id:'music', title:'パッヘルベルの「カノン」を5分聴く', minutes:5, place:'indoor', note:'YouTubeで「パッヘルベル カノン」と検索して演奏を1つ再生する。ほかの画面を閉じ、5分間は音楽だけを聴く。'},
 {id:'learn', title:'虹ができる仕組みを調べて3行で説明する', minutes:30, place:'indoor', note:'「虹 仕組み 光 屈折」で検索する。雨粒が何をするか、色が分かれる理由、見える位置の3点を調べ、各1行でメモする。調べる時間は20分まで、残り10分でまとめる。'},
 {id:'cafe', title:'外を歩いて、赤いものを5個見つける', minutes:45, place:'outdoor', note:'外に出て、看板・花・車など赤いものを探す。見つけたものを5個、言葉で覚えるかメモする。20分たったら5個に届かなくても同じ道で戻る。'}
];

// 旧版の初期候補と完全一致するものだけを更新する。利用者の編集・削除は維持する。
const previousInitialActions: Action[] = [
 {id:'walk', title:'近所をゆっくり散歩する', minutes:20, place:'outdoor', note:'いつもと違う道を一本だけ。気になる景色を探してみよう。'},
 {id:'read', title:'読みかけの本をひらく', minutes:15, place:'indoor', note:'一章読まなくても大丈夫。まずは数ページから。'},
 {id:'desk', title:'机の上をひと区画だけ片づける', minutes:5, place:'indoor', note:'小さく始めて、気持ちにも余白をつくろう。'},
 {id:'music', title:'好きな音楽を一曲聴く', minutes:5, place:'indoor', note:'ほかの画面を閉じて、一曲だけじっくり。'},
 {id:'learn', title:'気になっていたことをひとつ学ぶ', minutes:30, place:'indoor', note:'小さな疑問をひとつ選んで調べてみよう。'},
 {id:'cafe', title:'外へ出てひと休みする', minutes:45, place:'outdoor', note:'行き先は自分の知っている場所から。無理なく気分転換。'}
];
export function refreshInitialActions(actions: Action[]): Action[] {
 return actions.map(action => {
  const previous = previousInitialActions.find(item => item.id === action.id);
  if (!previous || action.title !== previous.title || action.minutes !== previous.minutes || action.place !== previous.place || action.note !== previous.note) return action;
  return initialActions.find(item => item.id === action.id) ?? action;
 });
}
export function pickAction(actions: Action[], random = Math.random): Action | null {
 if (!actions.length) return null;
 return actions[Math.min(actions.length - 1, Math.max(0, Math.floor(random() * actions.length)))];
}
export function filterByTime(actions: Action[], maxMinutes: number | null): Action[] {
 return maxMinutes === null ? actions : actions.filter(action => action.minutes <= maxMinutes);
}
export function pickNextAction(actions: Action[], previousId: string | null, avoidRepeat: boolean, random = Math.random): Action | null {
 const alternatives = avoidRepeat ? actions.filter(action => action.id !== previousId) : actions;
 // 候補が1件だけでも提案は続けられる。時間条件を広げて補充はしない。
 return pickAction(alternatives.length ? alternatives : actions, random);
}
export function parseActions(raw: string): Action[] {
 const data: unknown = JSON.parse(raw);
 if (!Array.isArray(data) || !data.every(a => a && typeof a.id === 'string' && typeof a.title === 'string' && a.title.trim().length > 0 && a.title.length <= 80 && Number.isInteger(a.minutes) && a.minutes >= 1 && a.minutes <= 1440 && ['indoor','outdoor'].includes(a.place) && typeof a.note === 'string' && a.note.length <= 200)) throw new Error('保存データの形式が不正です');
 if (new Set(data.map(a => a.id)).size !== data.length) throw new Error('IDが重複しています');
 return data;
}
