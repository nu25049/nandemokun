import type {Question} from './play';
type Row=[id:string,prompt:string,answer:string,wrong1:string,wrong2:string,explanation:string];
const rows:Row[]=[
 ['drinks','A・B・Cが水・茶・ジュースを1人1種類ずつ飲みます。Aは茶、Bは水です。Cは？','ジュース','水','茶','茶と水は他の2人が選んでいるので、残るジュースです。'],
 ['middle','3人が横一列に並びます。AはBより左、BはCより左です。真ん中は？','B','A','C','左からA・B・Cの順になるので、真ん中はBです。'],
 ['oldest','AはBより年上で、CはAより年上です。最も年上なのは？','C','A','B','年齢はC＞A＞Bの順です。'],
 ['boxes','鍵は赤・青・黄の箱のどれか1つにあります。赤と青の箱は空です。鍵の場所は？','黄の箱','赤の箱','青の箱','鍵は必ずどれかにあり、赤でも青でもないので黄です。'],
 ['statements','Aは「箱は空」、Bは「Aの発言は正しい」と言います。1人だけが正しい、という条件は成り立つ？','成り立たない','空なら成り立つ','空でなければ成り立つ','2人の発言は同じ意味なので、両方正しいか両方誤りです。'],
 ['rain','「雨が降れば傘をさす」人が傘をさしています。これだけで雨だと決められる？','決められない','必ず雨','必ず晴れ','雨以外の理由で傘をさす可能性は、この条件では否定されていません。'],
 ['even','「偶数なら青い札を配る」という規則です。4番の人に配る札は？','青い札','赤い札','分からない','4は偶数なので、規則から青い札だと分かります。'],
 ['books','本A・B・C・Dを1列に置きます。Aは左端、Dは右端、BはCより左です。左から2冊目は？','B','C','D','両端以外はBとCで、BがCより左なのでA・B・C・Dです。'],
 ['cups','3個のコップのうち、1個だけが赤です。Aは青、Bは赤でした。Cは赤？','赤ではない','必ず赤','条件が矛盾している','赤は1個だけでBが赤なので、Cは赤ではありません。'],
 ['hobbies','AとBは、読書と散歩を別々に1つずつ選びます。Aが散歩を選ばなかったならBは？','散歩','読書','両方','Aは読書になるため、別の活動を選ぶBは散歩です。'],
 ['toggle','ランプは最初に青です。ボタンを押すたび青と赤が入れ替わります。3回押した後は？','赤','青','消灯','青→赤→青→赤と変わります。'],
 ['circles','「丸いカードは全て白い」「このカードは丸い」が正しいとします。必ず言えるのは？','このカードは白い','白いカードは全て丸い','このカードは四角い','丸いカードの条件から、このカードは白いと分かります。'],
 ['bells','0分から6分ごとにベルが鳴ります。0分と24分の音を含め、24分までに何回鳴る？','5回','4回','6回','0・6・12・18・24分の5回です。'],
 ['events','受付で0分、2分、4分に1人ずつ呼ばれます。最初から3人目が呼ばれるまで何分？','4分','2分','6分','最初の人が0分なので、3人目の4分までの経過は4分です。'],
 ['parallel','Aの作業に8分、Bに12分かかります。別の人が同時に始めると、両方終わるのは何分後？','12分','8分','20分','並行して行うので、長い方の12分で両方終わります。'],
 ['trip','毎分60mで180m先まで歩き、同じ速さで戻ります。休憩なしなら往復何分？','6分','3分','9分','片道は180÷60＝3分。往復で6分です。'],
 ['midnight','23時30分から45分たつと何時何分？','0時15分','0時30分','23時45分','30分で0時になり、残り15分で0時15分です。'],
 ['dice','向かい合う面の数字の和が必ず7のサイコロです。2の向かい側は？','5','4','6','2と足して7になる数は5です。'],
 ['pages','本の12ページから36ページまで、両端を含めて読むと何ページ分？','25ページ','24ページ','26ページ','36−12に最初の1ページ分を足して25ページです。'],
 ['coins','10円玉・50円玉・100円玉が1枚ずつあります。全部合わせると？','160円','150円','170円','10＋50＋100＝160円です。'],
 ['discount','1個100円のお菓子を、3個買うと合計200円です。この買い方で6個買うと？','400円','500円','600円','3個の組が2組なので200×2＝400円です。'],
 ['seats','6人が円形に座っています。自分と両隣の2人を除くと、残りは何人？','3人','2人','4人','6人から自分1人と両隣2人を引き、3人です。'],
 ['reverse','2桁の数「24」の十の位と一の位を入れ替えると？','42','24','204','十の位が4、一の位が2になるので42です。'],
 ['notebooks','ノート2冊と100円のペン1本で500円です。ノート1冊の値段は？','200円','150円','250円','ノート2冊分は500−100＝400円なので、1冊200円です。'],
 ['squares','2×2の方眼に、線に沿った正方形はいくつある？ 小さいものも大きいものも数えます。','5個','4個','6個','小さい正方形4個と、全体の正方形1個で5個です。'],
 ['perimeter','縦1cm・横2cmの長方形の周りの長さは？','6cm','3cm','4cm','縦と横が2本ずつあるので、1＋2＋1＋2＝6cmです。'],
 ['edges','ある立体は6つの面があり、各面に辺が4本あります。各辺を2面が共有するとき、辺は全部で何本？','12本','24本','8本','6×4では各辺を2回数えるので、24÷2＝12本です。'],
 ['corner','六角形の角を1つ、隣の2辺を結ぶ直線で切り落としました。残る大きな紙の角は？','7つ','5つ','6つ','角が1つ減り、切り口の両端に2つ増えるので6−1＋2＝7つです。'],
 ['fence','一周21mの輪に3m間隔で柱を立てます。柱は全部で何本？','7本','8本','6本','輪では区間の数と柱の数が同じです。21÷3＝7本です。'],
 ['points','5つの点を、全ての2点の組で1本ずつ線で結びます。同じ線を二重に数えず、線は何本？','10本','5本','20本','各点から4本ですが2回ずつ数えるので、5×4÷2＝10本です。'],
 ['clothes','シャツ3種類とズボン2種類から、1つずつ選ぶ組合せは何通り？','6通り','5通り','9通り','シャツそれぞれにズボン2種類があるので3×2＝6通りです。'],
 ['cards','A・B・Cの3枚を1列に並べます。全ての並べ方は何通り？','6通り','3通り','9通り','最初に3通り、次に2通り、最後に1通りで3×2×1＝6通りです。'],
 ['cuts','棒1本を重ねず、1回に1か所ずつ2回切りました。全部で何本になる？','3本','2本','4本','1回切るごとに本数が1つ増えるので、1＋2＝3本です。'],
 ['tiles','縦3枚・横4枚に正方形のタイルを隙間なく並べます。必要なタイルは何枚？','12枚','7枚','14枚','1列4枚が3列あるので4×3＝12枚です。'],
 ['odd-card','1〜9の数字カードが1枚ずつあります。必ず偶数を1枚含むには、見ずに最低何枚取る？','6枚','5枚','4枚','奇数が5枚あるので、それを全て取っても6枚目は偶数です。'],
 ['three-balls','赤玉4個と青玉4個があります。同じ色3個を必ずそろえるには、見ずに最低何個取る？','5個','4個','6個','4個までなら赤2・青2があります。5個ならどちらかが3個以上です。'],
 ['largest','1・2・3を1回ずつ使って作れる、最も大きい3桁の整数は？','321','312','231','大きい数字から百の位、十の位へ置くので321です。'],
 ['smallest','0・1・2を1回ずつ使って作れる、最も小さい3桁の整数は？ 先頭は0にしません。','102','120','201','百の位は最小の0以外の数1、その後を0・2と並べます。'],
 ['difference','2つの数の和は14、差は4です。大きい方の数は？','9','7','10','大きい方は（14＋4）÷2＝9。小さい方は5です。'],
 ['missing','3つの数の合計は24です。そのうち2つは7と9です。残りの数は？','8','9','10','24−7−9＝8です。'],
 ['negative','気温の値が−2、−5、0の3つあります。最も大きい数は？','0','−2','−5','0は負の数より大きいので、0が最も大きい数です。'],
 ['change','500円を出して、120円の物を2個買いました。お釣りは？','260円','240円','380円','代金は120×2＝240円。500−240＝260円です。'],
 ['average','3回の得点の平均は10点です。最初の2回が8点と12点なら、3回目は？','10点','8点','12点','合計は10×3＝30点。30−8−12＝10点です。'],
 ['overlap','10人のうち、読書が好きな人は6人、散歩が好きな人は5人です。全員が少なくとも片方を好きなら、両方好きな人は？','1人','2人','3人','6＋5＝11では両方好きな人を二重に数えるので、11−10＝1人です。'],
 ['hats','12人が赤か青の帽子を1つずつかぶっています。赤が5人なら青は？','7人','5人','12人','1人につき1つなので、12−5＝7人です。'],
 ['clock','1時間後が15時20分なら、今は何時何分？','14時20分','14時40分','16時20分','15時20分から1時間を引くので14時20分です。'],
 ['half','箱の玉を半分取り出すと6個残りました。元の玉は何個？','12個','6個','18個','残った半分が6個なので、全体は6×2＝12個です。'],
 ['chance','袋に同じ大きさの赤玉2個と青玉2個があります。各玉を同じ確率で1個取ると、赤の確率は？','2分の1','4分の1','3分の1','全4個中、赤は2個なので2/4＝1/2です。'],
];
export const extraRiddles:Question[]=rows.map(([id,prompt,answer,wrong1,wrong2,explanation])=>({id:`riddle:extra:${id}`,prompt,answer,choices:[answer,wrong1,wrong2],explanation}));

function numberQuestion(id:string,prompt:string,answer:number,explanation:string):Question {
 const gap=Math.min(answer-1,answer%5+1);
 return {id,prompt,answer:String(answer),choices:[String(answer-gap),String(answer),String(answer+gap)],explanation};
}
export const extraSequences:Question[]=[];
for(let start=1;start<=10;start++)for(let step=1;step<=5;step++){
 for(const factor of [2,3,4]){
  const values=[start];for(let i=0;i<5;i++)values.push(i%2===0?values[i]*factor:values[i]+step);
  extraSequences.push(numberQuestion(`seq2:mix:${start}:${step}:${factor}`,`${values.slice(0,5).join('、')}、？ 「×${factor}、＋${step}」を順に繰り返します。次の数は？`,values[5],`次は${factor}倍の番なので、${values[4]}×${factor}＝${values[5]}です。`));
 }
 for(const gap of [10,20,30]){
  const values=[start,start+gap,start+step,start+gap+step,start+2*step,start+gap+2*step];
  extraSequences.push(numberQuestion(`seq2:interleave:${start}:${step}:${gap}`,`${values.join('、')}、？ 奇数番目と偶数番目は、それぞれ${step}ずつ増えます。次の数は？`,start+3*step,`次は奇数番目の列。${start}、${start+step}、${start+2*step}の次なので${start+3*step}です。`));
 }
 for(const gap of [3,4,5]){
  const increments=[step,step+1,step+gap],values=[start];for(let i=0;i<5;i++)values.push(values[i]+increments[i%3]);
  extraSequences.push(numberQuestion(`seq2:cycle:${start}:${step}:${gap}`,`${values.slice(0,5).join('、')}、？ 足す数は${increments.join('、')}の順で繰り返します。次の数は？`,values[5],`次は${increments[1]}を足す番なので、${values[4]}＋${increments[1]}＝${values[5]}です。`));
 }
}
for(let first=1;first<=10;first++)for(let second=1;second<=15;second++){
 const values=[first,second];for(let i=2;i<6;i++)values.push(values[i-1]+values[i-2]);
 extraSequences.push(numberQuestion(`seq2:sum:${first}:${second}`,`${values.slice(0,5).join('、')}、？ 3番目以降は直前の2つの和です。次の数は？`,values[5],`直前の${values[3]}と${values[4]}を足して${values[5]}です。`));
}

export function makeWordOperations(words:readonly string[]):Question[]{
 const bank:Question[]=[];
 for(const word of words){
  const chars=[...word],letters=[...new Set(chars)];
  const add=(id:string,prompt:string,answer:string,wrong1:string,wrong2:string,explanation:string)=>bank.push({id:`word2:${id}`,prompt,answer,choices:[answer,wrong1,wrong2],explanation});
  chars.forEach((answer,index)=>{
   const wrong=['あ','い','う','え','お','か','き','く'].filter(letter=>letter!==answer);
   add(`position:${word}:${index}`,`「${word}」の左から${index+1}番目の文字は？`,answer,wrong[(index+word.length)%wrong.length],wrong[(index+word.length+1)%wrong.length],`左から順に${chars.map((letter,i)=>`${i+1}番目が「${letter}」`).join('、')}なので「${answer}」です。`);
  });
  add(`types:${word}`,`「${word}・${word}」に含まれる文字は何種類？ 同じ文字は1種類とし、「・」は数えません。`,`${letters.length}種類`,`${letters.length-1}種類`,`${letters.length+1}種類`,`異なる文字は${letters.map(letter=>`「${letter}」`).join('、')}の${letters.length}種類。繰り返しても種類は増えません。`);
  for(const letter of letters){
   const replacements=['あ','い','う','え','お','か','き','く'].filter(value=>!chars.includes(value));
   const answer=word.split(letter).join(replacements[0]),wrong=word.split(letter).join(replacements[1]);
   add(`replace:${word}:${letter}`,`「${word}」の「${letter}」を全て「${replacements[0]}」に置き換えると？`,answer,word,wrong,`「${letter}」の位置だけを全て「${replacements[0]}」に替え、他はそのままなので「${answer}」です。`);
  }
  const reverse=[...chars].reverse().join('');
  const rotations=[...new Set(chars.map((_,i)=>[...chars.slice(i),...chars.slice(0,i)].join('')))].filter(value=>value!==reverse);
  if(rotations.length>=2)add(`reverse:${word}`,`「${word}」を右から左へ、1文字ずつ逆順に読むと？`,reverse,rotations[0],rotations[1],`右端から順に${[...reverse].map(letter=>`「${letter}」`).join('、')}なので「${reverse}」です。`);
 }
 return bank;
}
