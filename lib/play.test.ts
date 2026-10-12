import {describe,expect,it} from 'vitest';
import {checkAnswer,nextQuestion,remainingSeconds} from './play';
describe('画面内の頭の体操',()=>{
 it('四則のうち加減乗算の答えが実際の計算と一致する',()=>{
  for(const seed of [0,0.2,0.34,0.5,0.67,0.99]){
   const question=nextQuestion('calculation',undefined,()=>seed);
   const match=question.prompt.match(/(\d+) ([＋−×]) (\d+)/)!;
   const a=Number(match[1]),b=Number(match[3]);
   const answer=match[2]==='＋'?a+b:match[2]==='−'?a-b:a*b;
   expect(question.answer).toBe(String(answer));expect(answer).toBeGreaterThanOrEqual(0);
  }
 });
 it('全角と前後の空白は受け入れ、空白だけや文字・小数は拒否する',()=>{
  const q=nextQuestion('calculation',undefined,()=>0);
  expect(checkAnswer(q,' ２ ')).toBe(true);
  for(const value of ['',' ','2a','2.0','3'])expect(checkAnswer(q,value)).toBe(false);
 });
 it('全なぞなぞの正解が選択肢にあり、同じ問題を連続させない',()=>{
  for(let n=0;n<12;n++){
   const q=nextQuestion('riddle',undefined,()=>n/12);
   expect(q.choices).toHaveLength(3);expect(q.choices).toContain(q.answer);
   expect(new Set(q.choices).size).toBe(3);
   expect(checkAnswer(q,q.answer)).toBe(true);
   expect(nextQuestion('riddle',q.id,()=>n/12).id).not.toBe(q.id);
  }
 });
 it('期限を過ぎたタイマーを負にせず、非表示中の経過も計算する',()=>{
  expect(remainingSeconds(61000,1000)).toBe(60);expect(remainingSeconds(61000,61000)).toBe(0);expect(remainingSeconds(61000,90000)).toBe(0);
 });
});
