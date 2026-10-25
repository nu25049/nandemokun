import type {Question} from './play';
import {extraRiddles,extraSequences,makeWordOperations} from './question-extra';

export const riddleQuestions: Question[] = [
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

const additional:Question[]=[
 {id:'fence',prompt:'一直線に並ぶ9本の柱の間隔がすべて2mです。最初から最後の柱までは何m？',choices:['16m','18m','20m'],answer:'16m',explanation:'柱9本の間は8区間。2×8＝16mです。'},
 {id:'stairs',prompt:'1段を1歩として12段の階段を上ります。最初は地面です。6歩進んだあと、残りは何段？',choices:['5段','6段','7段'],answer:'6段',explanation:'12段のうち6段進んだので、12−6＝6段です。'},
 {id:'ages',prompt:'兄は弟より3歳年上です。5年後の年齢差は何歳？',choices:['3歳','5歳','8歳'],answer:'3歳',explanation:'二人とも同じ5年だけ年を取るため、年齢差は3歳のままです。'},
 {id:'clock-angle',prompt:'時計がちょうど3時を指しています。短針と長針の小さい方の角度は？',choices:['60度','90度','120度'],answer:'90度',explanation:'長針は12、短針は3。円の4分の1なので90度です。'},
 {id:'ten-hands',prompt:'1人につき手が2本あるとします。5人には合わせて何本の手がありますか？',choices:['5本','10本','12本'],answer:'10本',explanation:'1人2本が5人分なので2×5＝10本です。'},
 {id:'train-seat',prompt:'車内に8人います。3人が降り、5人が乗りました。今は何人？',choices:['10人','13人','16人'],answer:'10人',explanation:'8−3＋5＝10人です。'},
 {id:'bag-balls',prompt:'袋に白玉4個、黒玉6個があります。必ず白玉を1個取り出すには、見ずに最低何個取る？',choices:['5個','6個','7個'],answer:'7個',explanation:'最初の6個がすべて黒でも、7個目は必ず白になります。'},
 {id:'same-pencils',prompt:'赤・青・黄のペンが各5本あります。同じ色の2本を必ずそろえるには、見ずに最低何本取る？',choices:['3本','4本','6本'],answer:'4本',explanation:'最初の3本がすべて違う色でも、4本目はそのどれかと同じ色です。'},
 {id:'water-glasses',prompt:'コップに水が半分入っています。もう半分の量と同じ水を足すと、満杯の何割になる？',choices:['5割','8割','10割'],answer:'10割',explanation:'半分と半分で満杯になるので10割です。'},
 {id:'halve-paper',prompt:'紙1枚を重ねず、毎回どれか1片を2つに切ります。3回切ると何片になる？',choices:['4片','6片','8片'],answer:'4片',explanation:'切るたびに1片増えるので、1＋3＝4片です。'},
 {id:'two-rectangles',prompt:'同じ長方形2枚を、重ならず辺でつないで1つの長方形にしました。外周の角はいくつ？',choices:['4つ','6つ','8つ'],answer:'4つ',explanation:'完成した形は長方形なので、外周の角は4つです。'},
 {id:'triangle-stick',prompt:'三角形を棒3本で作りました。棒を1本追加し、辺を共有する三角形をもう1つ作れますか？棒は曲げません。',choices:['1本でできる','2本必要','3本必要'],answer:'2本必要',explanation:'1辺を共有する新しい三角形には、残り2辺の棒が必要です。'},
 {id:'sock-pairs',prompt:'靴下が全部で14枚あります。1足を2枚とすると何足分？',choices:['6足','7足','14足'],answer:'7足',explanation:'14枚を2枚ずつ組にするので14÷2＝7足分です。'},
 {id:'weeks',prompt:'今日は月曜日です。10日後は何曜日？',choices:['水曜日','木曜日','金曜日'],answer:'木曜日',explanation:'7日後も月曜、さらに3日後なので木曜です。'},
 {id:'yesterday',prompt:'昨日が日曜日なら、明後日は何曜日？',choices:['火曜日','水曜日','木曜日'],answer:'水曜日',explanation:'今日は月曜、明日は火曜、明後日は水曜です。'},
 {id:'candies',prompt:'あめ12個を3人に同じ数ずつ配り、余りはありません。1人何個？',choices:['3個','4個','6個'],answer:'4個',explanation:'12÷3＝4個です。'},
 {id:'twelve-eggs',prompt:'卵が12個あります。2個割ってその2個を焼いて食べました。手を付けていない卵は何個？',choices:['6個','8個','10個'],answer:'10個',explanation:'割った・焼いた・食べたのは同じ2個なので、残りは12−2＝10個です。'},
 {id:'coin-sums',prompt:'10円玉3枚と50円玉1枚があります。合計はいくら？',choices:['60円','80円','100円'],answer:'80円',explanation:'10×3＋50＝80円です。'},
 {id:'one-third',prompt:'ケーキを同じ大きさで6つに切り、2切れ食べました。食べたのは全体の何分の1？',choices:['2分の1','3分の1','6分の1'],answer:'3分の1',explanation:'6切れ中2切れなので2/6＝1/3です。'},
 {id:'double-money',prompt:'100円の商品が2割引です。1個買うといくら？',choices:['20円','80円','120円'],answer:'80円',explanation:'2割は20円。100−20＝80円です。'},
 {id:'opposite',prompt:'北を向いて右に90度、さらに右に90度回りました。今はどちら向き？',choices:['東','南','西'],answer:'南',explanation:'北→東→南と向きが変わります。'},
 {id:'left-turn',prompt:'東を向いて左に90度回り、後ろを向きました。今はどちら向き？',choices:['北','南','西'],answer:'南',explanation:'東から左へ回ると北。北の後ろは南です。'},
 {id:'walking-back',prompt:'一直線の道を東へ8m、西へ3m進みました。出発点からどこにいる？',choices:['東へ5m','西へ5m','東へ11m'],answer:'東へ5m',explanation:'反対方向の3mを引いて、東へ8−3＝5mです。'},
 {id:'equal-boxes',prompt:'箱Aに玉5個、箱Bに玉1個あります。AからBへ何個移すと同じ数？',choices:['1個','2個','3個'],answer:'2個',explanation:'2個移すとAは3個、Bも3個になります。'},
 {id:'heavy-order',prompt:'AはBより重く、BはCより重いと分かっています。一番軽いのは？',choices:['A','B','C'],answer:'C',explanation:'重さはA＞B＞CなのでCが最も軽いです。'},
 {id:'height-order',prompt:'AはBより背が低く、CはAより背が低いとします。一番背が高いのは？',choices:['A','B','C'],answer:'B',explanation:'背の高さはB＞A＞CなのでBです。'},
 {id:'true-box',prompt:'赤い箱か青い箱のどちらかにコインがあります。「赤にはない」が正しいならどちらにある？',choices:['赤い箱','青い箱','どちらにもない'],answer:'青い箱',explanation:'どちらかに必ずあり、赤ではないので青です。'},
 {id:'all-cats',prompt:'「全てのネコは動物」「ミケはネコ」が正しいとします。必ず正しいのは？',choices:['ミケは動物','全ての動物はネコ','ミケはイヌ'],answer:'ミケは動物',explanation:'ネコであるミケは、全てのネコに当てはまる動物でもあります。'},
 {id:'not-all',prompt:'赤い玉3個と青い玉1個があります。この4個について必ず正しいのは？',choices:['全て赤い','少なくとも1個青い','青い方が多い'],answer:'少なくとも1個青い',explanation:'青い玉が1個あるため、この表現だけが正しいです。'},
 {id:'race-last',prompt:'3人で走っています。あなたは最後尾です。前の人を1人だけ追い抜くと何位？',choices:['1位','2位','3位'],answer:'2位',explanation:'3位から2位の人を抜くので2位です。'},
 {id:'tree-intervals',prompt:'木を一直線に4m間隔で6本植えました。最初と最後の間は何m？',choices:['20m','24m','28m'],answer:'20m',explanation:'6本の間は5区間なので、4×5＝20mです。'},
 {id:'alarm',prompt:'0分、5分、10分、15分にアラームが1回ずつ鳴ります。最初から最後までに何回鳴る？',choices:['3回','4回','5回'],answer:'4回',explanation:'0分の最初の音も数えるので4回です。'},
 {id:'book-pages',prompt:'1ページから10ページまで、各ページにそのページ番号を1回書きます。数字は全部で何文字？',choices:['10文字','11文字','12文字'],answer:'11文字',explanation:'1〜9は各1文字で9文字、10は2文字なので11文字です。'},
 {id:'sum-end',prompt:'1から10までの整数を全て足すといくつ？',choices:['45','50','55'],answer:'55',explanation:'両端を組にすると1＋10＝11の組が5組あり、11×5＝55です。'},
 {id:'four-people',prompt:'4人が互いに1回ずつ握手します。全部で何回の握手になる？',choices:['4回','6回','12回'],answer:'6回',explanation:'4×3だと二重に数えるので、4×3÷2＝6回です。'},
 {id:'pair-sum',prompt:'同じ数を2回足すと18です。その数に3を足すと？',choices:['9','12','21'],answer:'12',explanation:'元の数は18÷2＝9。9＋3＝12です。'},
];
riddleQuestions.push(...additional);
riddleQuestions.push(...extraRiddles);

function numeric(id:string,prompt:string,answer:number,explanation:string):Question {
 const gap=answer%7+1;
 return {id,prompt,answer:String(answer),explanation,choices:[String(answer-gap),String(answer),String(answer+gap)]};
}
export const sequenceQuestions:Question[]=[];
for(let start=1;start<=20;start++){
 for(let step=2;step<=9;step++)sequenceQuestions.push(numeric(`seq:add:${start}:${step}`,`${[0,1,2,3].map(n=>start+n*step).join('、')}、？ 同じ数ずつ増えます。次の数は？`,start+4*step,`${step}ずつ増えているので、${start+3*step}＋${step}＝${start+4*step}です。`));
 for(let step=2;step<=5;step++){
  const first=start+49;sequenceQuestions.push(numeric(`seq:sub:${start}:${step}`,`${[0,1,2,3].map(n=>first-n*step).join('、')}、？ 同じ数ずつ減ります。次の数は？`,first-4*step,`${step}ずつ減るので、${first-3*step}−${step}＝${first-4*step}です。`));
 }
 sequenceQuestions.push(numeric(`seq:double:${start}`,`${[1,2,4,8].map(n=>n*start).join('、')}、？ 毎回2倍になります。次の数は？`,start*16,`${start*8}を2倍にして${start*16}です。`));
 sequenceQuestions.push(numeric(`seq:square:${start}`,`${[1,4,9,16].map(n=>n+start-1).join('、')}、？ 増える数は3、5、7と、2ずつ大きくなります。次の数は？`,start+24,`次は9増えるので${start+15}＋9＝${start+24}です。`));
 for(let step=1;step<=6;step++){
  const values=[start];for(let i=0;i<4;i++)values.push(values[values.length-1]+step+i);
  sequenceQuestions.push(numeric(`seq:grow:${start}:${step}`,`${values.slice(0,4).join('、')}、？ 増える数が1ずつ大きくなります。次の数は？`,values[4],`増える数は${step}、${step+1}、${step+2}、次が${step+3}なので${values[4]}です。`));
 }
 for(let step=1;step<=5;step++)for(const gap of [2,3]){
  const values=[start,start+step,start+step*2+gap,start+step*3+gap];
  sequenceQuestions.push(numeric(`seq:alternate:${start}:${step}:${gap}`,`${values.join('、')}、？ 足す数は${step}と${step+gap}の交互です。次の数は？`,start+step*4+gap*2,`次は${step+gap}を足す番なので${values[3]}＋${step+gap}＝${start+step*4+gap*2}です。`));
 }
}

const words=['りんご','ごりら','らっぱ','ぱせり','りす','すいか','からす','すずめ','めだか','かめ','めがね','ねこ','こま','まくら','らくだ','だるま','まめ','めじろ','ろば','ばら','らっこ','こあら','らむね','ねぎ','ぎんが','がくふ','ふね','ねずみ','みかづき','きつね','ねんど','どらむ','むぎ','ぎんいろ','ろうそく','くるま','まど','どんぐり','りか','かに','にわとり','りょうり','りゅう','うさぎ','ぎょうざ','ざる','るり','りぼん','すし','しか','かさ','さかな','なす','すな','なべ','べる','るす','すもう','うま','まつり','りれー','こい','いす','すみれ','れもん','いちご','ごま','まち','ちず','ずこう','うちわ','わに','にく','くり','りゆう','うで','でぐち','ちから','らくご','ごご','ごはん','さくら','らせん','みみ','もも','こころ','ことば','はな','たまご','とけい','ひこうき','ほし','まほう','ゆき','よぞら','わたあめ','あさがお','おかし','しろくま','まぐろ','ろじ','じしょ','しお','おに','にじ','じゃがいも','もり','ふくろ','ろくろ','くつ','つき','きのこ'];
sequenceQuestions.push(...extraSequences);
const playable=words.filter(word=>!/[んーょゅゃ]$/.test(word));
export const wordQuestions:Question[]=[];
for(const word of playable){
 const last=word.slice(-1);
 const next=playable.find(candidate=>candidate[0]===last&&candidate!==word);
 if(next){
  const other=playable.filter(candidate=>candidate[0]!==last),position=(next.length*7+word.charCodeAt(0))%other.length;
  const wrong=[other[position],other[(position+Math.ceil(other.length/2))%other.length]];
  wordQuestions.push({id:`word:chain:${word}:${next}`,prompt:`「${word}」にしりとりで続く言葉は？ 最後と最初の文字を合わせます。`,answer:next,choices:[next,...wrong],explanation:`「${word}」の最後は「${last}」なので、「${last}」で始まる「${next}」です。`});
 }
 for(const letter of [...new Set(word)])for(const repeat of [1,2,3]){
  const phrase=Array(repeat).fill(word).join('・');const count=[...word].filter(char=>char===letter).length*repeat;
  wordQuestions.push({id:`word:count:${word}:${letter}:${repeat}`,prompt:`「${phrase}」の中に「${letter}」は何個ある？ 区切りの「・」は数えません。`,answer:`${count}個`,choices:[`${count-1}個`,`${count}個`,`${count+1}個`],explanation:`「${word}」に「${letter}」は${count/repeat}個。それが${repeat}回なので${count}個です。`});
 }
}
wordQuestions.push(...makeWordOperations(playable));
