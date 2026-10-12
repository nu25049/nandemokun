export type GameKind = 'calculation' | 'riddle';
export type TimerMode = 'down' | 'up';
export const DEFAULT_PLAY_MINUTES=30;
export function playSettings(query:Record<string,string|string[]|undefined>):{kind:GameKind;minutes:number;mode:TimerMode} {
 const minutes=typeof query.minutes==='string'?Number(query.minutes):DEFAULT_PLAY_MINUTES;
 return {kind:query.kind==='riddle'?'riddle':'calculation',minutes:[1,2,3,5,10,15,30,60].includes(minutes)?minutes:DEFAULT_PLAY_MINUTES,mode:query.mode==='up'?'up':'down'};
}
export function playHref(kind:GameKind,minutes:number,mode:TimerMode):string {
 return `/play?${new URLSearchParams({kind,minutes:String(minutes),mode})}`;
}
export type Question = { id: string; prompt: string; answer: string; explanation: string; choices?: string[] };

// 画面内で完結する、自作の算数・論理問題。答えと理由を一緒に用意する。
const riddles: Question[] = [
 {id:'family', prompt:'3人の兄弟には、それぞれ同じ姉が1人います。きょうだいは全部で何人？', choices:['4人','6人','7人'],answer:'4人',explanation:'兄弟3人と、3人に共通する姉1人で4人です。'},
 {id:'race',prompt:'かけっこで2位の人を追い抜きました。今、あなたは何位？',choices:['1位','2位','3位'],answer:'2位',explanation:'2位の人がいた位置に入るので2位。1位の人はまだ前にいます。'},
 {id:'interval',prompt:'時計が3回鳴るのに、最初の音から最後の音まで4秒かかります。同じ間隔で6回鳴ると何秒？',choices:['8秒','10秒','12秒'],answer:'10秒',explanation:'3回の音の間は2区間なので、1区間2秒。6回なら5区間で10秒です。'},
 {id:'socks',prompt:'箱に赤い靴下と青い靴下が各10枚あります。見ずに取り出し、同じ色2枚を必ずそろえるには最低何枚？',choices:['2枚','3枚','11枚'],answer:'3枚',explanation:'最初の2枚が別の色でも、3枚目はどちらかと同じ色になります。'},
 {id:'apples',prompt:'3個のりんごから2個を取りました。あなたが持っているりんごは何個？',choices:['1個','2個','3個'],answer:'2個',explanation:'聞いているのは残りではなく、あなたが取って持っている2個です。'},
 {id:'line',prompt:'1列に並ぶ人の中で、前から4番目、後ろから3番目の人が同じ人でした。全部で何人？',choices:['6人','7人','8人'],answer:'6人',explanation:'4＋3だとその人を2回数えるので、1を引いて6人です。'},
 {id:'cut',prompt:'まっすぐな棒を、1回につき1か所ずつ切ります。5本に分けるには何回切る？',choices:['3回','4回','5回'],answer:'4回',explanation:'切るたびに本数が1本増えます。1本から5本にするので4回です。'},
 {id:'day',prompt:'明日の次の日が金曜日です。今日は何曜日？',choices:['火曜日','水曜日','木曜日'],answer:'水曜日',explanation:'金曜日の2日前は水曜日です。'},
 {id:'square',prompt:'正方形の紙の角を1つ、角の隣にある2辺を結ぶ直線で切り落としました。残る大きな紙の角はいくつ？',choices:['3つ','4つ','5つ'],answer:'5つ',explanation:'元の角が1つ減り、切り口の両端に2つ増えるので、4−1＋2＝5です。'},
 {id:'sequence',prompt:'2、6、12、20、30。増える数が4、6、8、10と続いています。次の数は？',choices:['40','42','44'],answer:'42',explanation:'次は12増えるので、30＋12＝42です。'},
 {id:'balance',prompt:'同じ大きさの玉が3個あり、1個だけ重いと分かっています。天びんで重い玉を特定するには最低何回？',choices:['1回','2回','3回'],answer:'1回',explanation:'2個を左右に載せます。傾けば重い側、つり合えば載せなかった玉です。'},
 {id:'hour',prompt:'1時間半の半分は何分？',choices:['30分','45分','60分'],answer:'45分',explanation:'1時間半は90分。90÷2＝45分です。'},
];
const index = (length: number, random: () => number) => Math.min(length - 1, Math.max(0, Math.floor(random() * length)));
export function nextQuestion(kind: GameKind, previousId?: string, random = Math.random): Question {
 if (kind === 'riddle') {
  const choices = riddles.filter(item => item.id !== previousId);
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
 if (`${a}${symbol}${b}`===previousId) {
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
