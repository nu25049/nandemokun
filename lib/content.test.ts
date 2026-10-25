import {describe,expect,it} from 'vitest';
import {catalog} from './catalog';
import {parseActions} from './actions';
import {checkAnswer,nextQuestion,QUESTION_COUNTS,questionBank,type GameKind} from './play';

describe('拡充した候補と問題',()=>{
 it('72件の具体的な候補に重複IDがなく、保存候補と同じ制約を守る',()=>{
  expect(catalog).toHaveLength(72);expect(parseActions(JSON.stringify(catalog))).toHaveLength(72);
  expect(new Set(catalog.map(a=>a.id)).size).toBe(72);
  for(const category of ['create','relax','observe','organize','learn','move'])expect(catalog.filter(a=>a.category===category)).toHaveLength(12);
  expect(catalog.some(a=>a.minutes===1)).toBe(true);expect(catalog.every(a=>a.note.length>=30)).toBe(true);
 });
 it('固定48問・数列600問・ことば問題に、正解の重複選択肢や空欄を含めない',()=>{
  expect(QUESTION_COUNTS.riddle).toBe(48);expect(QUESTION_COUNTS.sequence).toBe(600);expect(QUESTION_COUNTS.word).toBeGreaterThan(500);
  for(const kind of ['riddle','sequence','word'] as GameKind[]){
   const bank=questionBank(kind);expect(new Set(bank.map(q=>q.id)).size).toBe(bank.length);expect(new Set(bank.map(q=>q.prompt)).size).toBe(bank.length);
   for(const q of bank){expect(q.prompt.length).toBeGreaterThan(5);expect(q.explanation.length).toBeGreaterThan(5);expect(q.choices).toHaveLength(3);expect(new Set(q.choices).size).toBe(3);expect(q.choices).toContain(q.answer);expect(checkAnswer(q,q.answer)).toBe(true);}
  }
  console.log('content inventory',QUESTION_COUNTS,'catalog',catalog.length);
 });
 it('数列の正解は表示された式の規則と一致する',()=>{
  for(const q of questionBank('sequence')){
   const [_,type,base,parameter,gap]=q.id.split(':');const start=Number(base),step=Number(parameter);
   const expected=type==='add'?start+step*4:type==='sub'?start+49-step*4:type==='double'?start*16:type==='square'?start+24:type==='grow'?start+step*4+6:start+step*4+Number(gap)*2;
   expect(Number(q.answer),q.id).toBe(expected);
  }
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
