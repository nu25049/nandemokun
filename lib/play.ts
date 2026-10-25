import {riddleQuestions,sequenceQuestions,wordQuestions} from './question-bank';
export const GAME_LABELS={calculation:'計算チャレンジ',riddle:'なぞなぞ・ひらめき問題',sequence:'数列・規則チャレンジ',word:'ことば遊び'} as const;
export type GameKind = keyof typeof GAME_LABELS;
export type TimerMode = 'down' | 'up';
export const DEFAULT_PLAY_MINUTES=30;
export function playSettings(query:Record<string,string|string[]|undefined>):{kind:GameKind;minutes:number;mode:TimerMode} {
 const minutes=typeof query.minutes==='string'?Number(query.minutes):DEFAULT_PLAY_MINUTES;
 return {kind:typeof query.kind==='string'&&Object.hasOwn(GAME_LABELS,query.kind)?query.kind as GameKind:'calculation',minutes:[1,2,3,5,10,15,30,60].includes(minutes)?minutes:DEFAULT_PLAY_MINUTES,mode:query.mode==='up'?'up':'down'};
}
export function playHref(kind:GameKind,minutes:number,mode:TimerMode):string {
 return `/play?${new URLSearchParams({kind,minutes:String(minutes),mode})}`;
}
export type Question = { id: string; prompt: string; answer: string; explanation: string; choices?: string[] };

const index = (length: number, random: () => number) => Math.min(length - 1, Math.max(0, Math.floor(random() * length)));
export function questionBank(kind:GameKind):readonly Question[]{return kind==='riddle'?riddleQuestions:kind==='sequence'?sequenceQuestions:kind==='word'?wordQuestions:[];}
export const QUESTION_COUNTS={riddle:riddleQuestions.length,sequence:sequenceQuestions.length,word:wordQuestions.length};
export function nextQuestion(kind: GameKind, previousId?: string|readonly string[], random = Math.random): Question {
 const previous=typeof previousId==='string'?[previousId]:previousId??[];
 if (kind !== 'calculation') {
  const bank=questionBank(kind);
  let choices = bank.filter(item => !previous.includes(item.id));
  if(!choices.length)choices=bank.filter(item=>item.id!==previous[previous.length-1]);
  const question = choices[index(choices.length, random)];
  // 正解の位置が固定にならないよう選択肢を並べ替える。
  const options = [...question.choices!];
  for (let i = options.length - 1; i > 0; i--) { const j = index(i + 1, random); [options[i], options[j]] = [options[j], options[i]]; }
  return {...question, choices: options};
 }
 const operation = index(3, random);
 const minimum=operation===2?10:1000;
 const range=operation===2?90:9000;
 let a = index(range, random) + minimum;
 let b = index(range, random) + minimum;
 if (operation === 1 && b > a) [a,b] = [b,a];
 const symbol = ['＋','−','×'][operation];
 while (previous.includes(`${a}${symbol}${b}`)) {
  b=minimum+(b-minimum+1)%range;
  if(operation===1&&b>a)[a,b]=[b,a];
 }
 const answer = String(operation === 0 ? a + b : operation === 1 ? a - b : a * b);
 return {id:`${a}${symbol}${b}`,prompt:`${a} ${symbol} ${b} = ?`,answer,explanation:`${a} ${symbol} ${b} = ${answer}`};
}
export function checkAnswer(question: Question, input: string): boolean {
 const normalized = input.normalize('NFKC').trim();
 return question.choices ? normalized === question.answer : /^-?\d+$/.test(normalized) && Number(normalized) === Number(question.answer);
}
export function remainingSeconds(deadline: number, now = Date.now()): number {
 return Math.max(0, Math.ceil((deadline - now) / 1000));
}
export function elapsedSeconds(startedAt:number,now=Date.now()):number {
 return Math.max(0,Math.floor((now-startedAt)/1000));
}
