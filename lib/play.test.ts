import {describe,expect,it} from 'vitest';
import {checkAnswer,elapsedSeconds,nextQuestion,playHref,playSettings,remainingSeconds} from './play';
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
 it('計算も同じ問題を連続させず、加減乗算の答えを維持する',()=>{
  for(const seed of [0,0.34,0.5,0.67,0.99]){
   const first=nextQuestion('calculation',undefined,()=>seed);
   const second=nextQuestion('calculation',first.id,()=>seed);
   expect(second.id).not.toBe(first.id);
   const match=second.prompt.match(/(\d+) ([＋−×]) (\d+)/)!;
   const a=Number(match[1]),b=Number(match[3]);
   expect(second.answer).toBe(String(match[2]==='＋'?a+b:match[2]==='−'?a-b:a*b));
  }
 });
 it('カウントアップは非表示中も実時間で進み、開始前を0にする',()=>{
  expect(elapsedSeconds(1000,1000)).toBe(0);
  expect(elapsedSeconds(1000,2500)).toBe(1);
  expect(elapsedSeconds(1000,121000)).toBe(120);
  expect(elapsedSeconds(1000,0)).toBe(0);
 });
 it('遊ぶ画面のURLと種類・時間・方式を安全な既定値に整える',()=>{
  const href=playHref('riddle',3,'up');
  expect(playSettings(Object.fromEntries(new URL(href,'https://example.com').searchParams))).toEqual({kind:'riddle',minutes:3,mode:'up'});
  for(const minutes of ['-1','0','1.5','NaN','10000',['3']])expect(playSettings({kind:'invalid',mode:'invalid',minutes})).toEqual({kind:'calculation',minutes:1,mode:'down'});
  expect(playSettings({})).toEqual({kind:'calculation',minutes:1,mode:'down'});
 });
});
