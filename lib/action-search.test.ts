import {describe,expect,it} from 'vitest';
import type {Action} from './actions';
import {searchActions} from './action-search';

const items:Action[]=[
 {id:'a',title:'ＡＢＣをメモする',note:'紙に気になる言葉を3つ書く',minutes:5,place:'indoor'},
 {id:'b',title:'外を歩く',note:'花の名前をメモする',minutes:10,place:'outdoor'},
 {id:'c',title:'カフェの絵を描く',note:'紙とペンを使う',minutes:5,place:'indoor'},
 {id:'d',title:'ABCをメモする',note:'別の紙を使う',minutes:1,place:'indoor'}
];
const ids=(actions:Action[])=>actions.map(action=>action.id);

describe('自分の候補の検索・並べ替え',()=>{
 it('候補0件・1件と空白だけの検索を扱う',()=>{
  expect(searchActions([],'')).toEqual([]);expect(searchActions([items[0]],'　 \t')).toEqual([items[0]]);expect(searchActions([items[0]],'見つからない')).toEqual([]);
 });
 it('全角英数・大小文字・半角カナをそろえて検索する',()=>{
  expect(ids(searchActions(items,'abc'))).toEqual(['a','d']);expect(ids(searchActions(items,'ＡｂＣ'))).toEqual(['a','d']);expect(ids(searchActions(items,'ｶﾌｪ'))).toEqual(['c']);
 });
 it('候補名とメモの両方を検索し、複数の言葉をすべて含む候補だけを返す',()=>{
  expect(ids(searchActions(items,'紙　abc'))).toEqual(['a','d']);expect(ids(searchActions(items,'花 メモ'))).toEqual(['b']);expect(searchActions(items,'花 紙')).toEqual([]);
 });
 it('場所と検索語を同時に適用し、候補を条件外から補充しない',()=>{
  expect(ids(searchActions(items,'メモ','added','outdoor'))).toEqual(['b']);expect(ids(searchActions(items,'','added','indoor'))).toEqual(['a','c','d']);expect(searchActions([items[1]],'','added','indoor')).toEqual([]);
 });
 it('時間順を安定させ、元の配列や候補を変更しない',()=>{
  const before=structuredClone(items),references=[...items];
  expect(ids(searchActions(items,'','short'))).toEqual(['d','a','c','b']);expect(ids(searchActions(items,'','long'))).toEqual(['b','a','c','d']);expect(items).toEqual(before);expect(items.every((action,index)=>action===references[index])).toBe(true);
 });
 it('名前順の同名候補は登録順を保ち、登録順への変更も元の順序を使う',()=>{
  const named=searchActions(items,'','name');expect(ids(named).filter(id=>id==='a'||id==='d')).toEqual(['a','d']);expect(ids(searchActions(items,''))).toEqual(['a','b','c','d']);expect(named).not.toBe(items);
 });
});
