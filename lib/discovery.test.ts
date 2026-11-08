import {it,expect} from 'vitest';
import {catalog} from './catalog';
import {discover,defaultDiscoveryFilters} from './discovery';
it('カタログ検索で時間・場所・分類・お気に入りと複数キーワードを組み合わせる',()=>{
 const one=catalog[0],filters={...defaultDiscoveryFilters(),minutes:one.minutes,category:one.category,place:one.place,favoritesOnly:true,query:'丸 ネコ'};
 expect(discover(catalog,filters,[one.id])).toEqual([one]);
 expect(discover(catalog,filters,[])).toEqual([]);
 expect(discover(catalog,{...filters,minutes:0},[one.id])).toEqual([]);
});
it('全角英数字と大文字・小文字をそろえ、元の順番と候補を変更しない',()=>{
 const pool=[{...catalog[0],id:'a',title:'ＡＢＣを作る',minutes:3},{...catalog[0],id:'b',title:'別の物',note:'abcを書く',minutes:1}];
 const before=JSON.stringify(pool),filters={...defaultDiscoveryFilters(),query:'AbC',sort:'short' as const};
 expect(discover(pool,filters).map(x=>x.id)).toEqual(['b','a']);expect(JSON.stringify(pool)).toBe(before);
 expect(discover([],filters)).toEqual([]);expect(discover(pool.slice(0,1),filters)).toHaveLength(1);
});
