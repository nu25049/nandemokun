import {describe,expect,it} from 'vitest';
import {catalog} from './catalog';
import {parseActions} from './actions';
import {checkAnswer,nextQuestion,QUESTION_COUNTS,questionBank,type GameKind} from './play';

describe('拡充した候補と問題',()=>{
 it('144件の具体的な候補に重複ID・名称がなく、保存候補と同じ制約を守る',()=>{
  expect(catalog).toHaveLength(144);expect(parseActions(JSON.stringify(catalog))).toHaveLength(144);
  expect(new Set(catalog.map(a=>a.id)).size).toBe(144);expect(new Set(catalog.map(a=>a.title)).size).toBe(144);
  for(const category of ['create','relax','observe','organize','learn','move'])expect(catalog.filter(a=>a.category===category)).toHaveLength(24);
  expect(catalog.some(a=>a.minutes===1)).toBe(true);expect(catalog.every(a=>a.note.length>=30)).toBe(true);
 });
 it('固定96問・数列1200問・ことば問題に、正解の重複選択肢や空欄を含めない',()=>{
  expect(QUESTION_COUNTS.riddle).toBe(96);expect(QUESTION_COUNTS.sequence).toBe(1200);expect(QUESTION_COUNTS.word).toBeGreaterThan(1500);
  for(const kind of ['riddle','sequence','word'] as GameKind[]){
   const bank=questionBank(kind);expect(new Set(bank.map(q=>q.id)).size).toBe(bank.length);expect(new Set(bank.map(q=>q.prompt)).size).toBe(bank.length);
   for(const q of bank){expect(q.prompt.length).toBeGreaterThan(5);expect(q.explanation.length).toBeGreaterThan(5);expect(q.choices).toHaveLength(3);expect(new Set(q.choices).size).toBe(3);expect(q.choices).toContain(q.answer);expect(checkAnswer(q,q.answer)).toBe(true);}
  }
  console.log('content inventory',QUESTION_COUNTS,'catalog',catalog.length);
 });
 it('数列の正解は表示された式の規則と一致する',()=>{
  for(const q of questionBank('sequence')){
   if(q.id.startsWith('seq2:'))continue;
   const [_,type,base,parameter,gap]=q.id.split(':');const start=Number(base),step=Number(parameter);
   const expected=type==='add'?start+step*4:type==='sub'?start+49-step*4:type==='double'?start*16:type==='square'?start+24:type==='grow'?start+step*4+6:start+step*4+Number(gap)*2;
   expect(Number(q.answer),q.id).toBe(expected);
  }
 });
 it('追加した4種類の数列で表示された並びと正解が一致する',()=>{
  const extra=questionBank('sequence').filter(q=>q.id.startsWith('seq2:'));expect(extra).toHaveLength(600);
  for(const q of extra){
   const values=q.prompt.split('、？')[0].split('、').map(Number);expect(values.every(Number.isFinite)).toBe(true);
   const [_,type,first,step,factor]=q.id.split(':');let expected=0;
   if(type==='mix'){expected=values[values.length-1]*Number(factor);for(let i=1;i<values.length;i++)expect(values[i]).toBe(i%2?values[i-1]*Number(factor):values[i-1]+Number(step));}
   else if(type==='interleave'){expected=values[values.length-2]+Number(step);for(let i=2;i<values.length;i++)expect(values[i]-values[i-2]).toBe(Number(step));}
   else if(type==='cycle'){expected=values[values.length-1]+Number(step)+1;const differences=[Number(step),Number(step)+1,Number(step)+Number(factor)];for(let i=1;i<values.length;i++)expect(values[i]-values[i-1]).toBe(differences[(i-1)%3]);}
   else{expected=values[values.length-1]+values[values.length-2];expect(values[0]).toBe(Number(first));for(let i=2;i<values.length;i++)expect(values[i]).toBe(values[i-1]+values[i-2]);}
   expect(Number(q.answer),q.id).toBe(expected);
  }
 });
 it('位置・種類数・文字置換・逆読みの正解を元の文字列から確認する',()=>{
  const extra=questionBank('word').filter(q=>q.id.startsWith('word2:'));expect(extra.length).toBeGreaterThan(500);
  for(const q of extra){
   const [_,type,word,arg]=q.id.split(':');expect(q.prompt).toContain(word);
   const expected=type==='position'?[...word][Number(arg)]:type==='types'?`${new Set(word).size}種類`:type==='reverse'?[...word].reverse().join(''):word.split(arg).join(q.prompt.match(/を全て「([^」]+)」に/)![1]);
   expect(q.answer,q.id).toBe(expected);
  }
 });
 it('以前の72件のカタログIDを保つ',()=>{
  for(const category of ['create','relax','observe','organize','learn','move'])for(let i=1;i<=12;i++)expect(catalog.some(a=>a.id===`catalog:${category}:${i}`)).toBe(true);
 });
 it('しりとりの選択肢は正解だけが条件を満たす',()=>{
  for(const q of questionBank('word').filter(q=>q.id.startsWith('word:chain:'))){
   const [,,word]=q.id.split(':');const matching=q.choices!.filter(choice=>choice[0]===word.slice(-1));expect(matching).toEqual([q.answer]);
  }
 });
 it('一巡するまでは既出問題を避け、全問を見たあとも連続しない',()=>{
  const seen:string[]=[];const total=questionBank('riddle').length;
  for(let i=0;i<total;i++){const q=nextQuestion('riddle',seen,()=>0);expect(seen).not.toContain(q.id);seen.push(q.id);}
  expect(nextQuestion('riddle',seen,()=>0).id).not.toBe(seen[seen.length-1]);
 });
});
