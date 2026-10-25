export const CATEGORY_LABELS={calculation:'計算',riddle:'なぞなぞ',sequence:'数列・規則',word:'ことば遊び',create:'作って遊ぶ',relax:'ひと休み',observe:'観察',organize:'身の回り',learn:'考えて学ぶ',move:'軽く動く',saved:'自分の候補',nearby:'近くのお店',canvas:'Canvasの課題'} as const;
export type Category=keyof typeof CATEGORY_LABELS;
export const CATEGORIES=Object.keys(CATEGORY_LABELS) as Category[];
