import type {Recommendation} from './recommendations';

// 頭の中、スマホのメモ・描画欄、またはその場での観察だけでできる既存のお題。
const discreetCatalogIds = new Set([
 'catalog:create:1', // 描画欄に丸だけでネコを描く
 'catalog:create:3', // 3行の話を作る
 'catalog:create:8', // 15文字の広告を考える
 'catalog:relax:1', // 周囲にすでにある音を聞く
 'catalog:relax:2', // 今日の楽しみを決める
 'catalog:relax:4', // 景色に題名を付ける
 'catalog:observe:1', // その場から見える形を数える
 'catalog:observe:3', // 物を動かさず白い物を見比べる
 'catalog:organize:5', // ブラウザーのタブを整理する
 'catalog:organize:9', // スマホのホーム画面を整理する
 'catalog:learn:2', // 傘の別の用途を考える
 'catalog:learn:3', // 100を作る式を考える
 'catalog:learn:7', // 物の共通点を頭の中で探す
 'catalog:extra:create:1', // 描画欄に線3本で顔を描く
 'catalog:extra:create:2', // 架空の必殺技をメモする
 'catalog:extra:create:4', // 想像した駅に名前を付ける
 'catalog:extra:relax:1', // 気分を天気の名前で表す
 'catalog:extra:relax:2', // 架空の注文を考える
 'catalog:extra:relax:3', // すでに聞こえている音に注意を向ける
 'catalog:extra:relax:5', // 思い出の風景の色を選ぶ
 'catalog:extra:observe:3', // 景色を頭の中で4区画に分ける
 'catalog:extra:organize:4', // スマホでメモをまとめる
 'catalog:extra:organize:7', // ブックマークを分類する
 'catalog:extra:learn:1', // しりとりを頭の中でつなぐ
 'catalog:extra:learn:2', // 10を作る式を考える
 'catalog:extra:learn:3', // 言葉を逆から書く
]);

export function isDiscreetRecommendation(item: Recommendation): boolean {
 if (item.place !== 'indoor') return false;
 return item.source === 'play' || (item.source === 'library' && discreetCatalogIds.has(item.id));
}
