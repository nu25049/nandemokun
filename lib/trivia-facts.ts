import {extraTriviaFacts} from './trivia-facts-extra';

export type TriviaFact = {id:string;title:string;detail:string};

export const TRIVIA_FACTS:readonly TriviaFact[] = [
 {"id":"emoji-black-cat","title":"黒猫の絵文字には黒い四角が入っている","detail":"黒猫の「🐈‍⬛」は、「ネコ」と「黒い大きな四角」の間に、両者をつなぐ見えない記号を置いた組み合わせです。"}, // https://www.unicode.org/emoji/charts/full-emoji-list.html
 {"id":"moon-golf","title":"月面でゴルフのボールを打った人がいる","detail":"アポロ14号のアラン・シェパードは、月面で採取道具の柄にゴルフクラブの先端を付け、ボールを2個打ちました。"}, // https://www.nasa.gov/history/50-years-ago-apollo-14-lands-at-fra-mauro/
 {"id":"piano-colors","title":"昔のピアノには白鍵と黒鍵の色が逆のものがあった","detail":"モーツァルトの時代のピアノには、現代の白鍵に当たる部分が黒く、黒鍵に当たる部分が白いものがありました。"}, // https://www.yamaha.com/ja/musical_instrument_guide/piano/trivia/
 {"id":"mercury-solar-day","title":"水星の太陽日は、水星の約2年分","detail":"水星では太陽が空を一周して同じ向きに戻る周期が約176地球日。水星が太陽を一周するのは約88地球日なので、水星の約2年に当たります。"}, // https://science.nasa.gov/mercury/facts/
 {"id":"number-cycle","title":"142857に2から6を掛けると数字が巡る","detail":"2倍で285714、3倍で428571、4倍で571428、5倍で714285、6倍で857142。同じ6つの数字の先頭が変わるだけです。"},
 {"id":"qr-corners","title":"QRコードの大きな四角は3つ","detail":"標準的なQRコードでは、左上・右上・左下の大きな四角を読み取りの目印にします。マイクロQRコードは1つです。"}, // https://www.qrcode.com/en/codes/microqr.html
 {"id":"chess-promotion","title":"チェスでは同じ色のクイーンが盤上に2個そろうことがある","detail":"ポーンが一番奥まで進むとクイーンなどに交換できます。最初のクイーンが盤上に残っていても選べます。"}, // https://handbook.fide.com/chapter/e012023
 {"id":"dime-edge","title":"アメリカの10セント硬貨のふちにあるギザギザは118個","detail":"米国造幣局のダイムの仕様には、厚さや重さに加えて、ふちに刻まれたギザギザの数も載っています。"}, // https://www.usmint.gov/learn/coins-and-medals/circulating-coins/dime
 {"id":"mars-sunset","title":"火星では夕日の近くが青く見える","detail":"大気中の細かいちりの影響で、日没時に太陽の周りが青く見えることがあります。探査車がその様子を撮影しました。"}, // https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/
 {"id":"emoji-japan","title":"日本の国旗の絵文字は J と P の組み合わせ","detail":"「🇯🇵」は普通のアルファベットではなく、地域を示す専用の記号 J と P を並べて表します。"}, // https://www.unicode.org/emoji/charts/full-emoji-list.html
 {"id":"time-2100","title":"2100年は4で割り切れてもうるう年ではない","detail":"グレゴリオ暦では、100で割り切れる年は平年にします。ただし400でも割り切れる2000年や2400年はうるう年です。"}, // https://www.nao.ac.jp/faq/a0306.html
 {"id":"hanafuda-calendar","title":"花札は1か月につき4枚ある","detail":"1月から12月まで、季節の絵柄が4枚ずつ。1年分を合わせると48枚です。"}, // https://museum.nintendo.com/guide/hanafuda/index.html
 {"id":"silent-string","title":"英語の queue は5文字でも Q と同じ音","detail":"英語の queue は「列」などの意味で、発音はアルファベットの Q と同じです。"}, // https://dictionary.cambridge.org/us/pronunciation/english/queue
 {"id":"calculator-1089","title":"1089を9倍すると順番が逆になる","detail":"1089×9＝9801。左から読む数字の列と、右から読む数字の列が入れ替わります。"},
 {"id":"go-intersections","title":"囲碁の19路盤に石を置ける交点は361個","detail":"縦19本と横19本の線がつくる交点を使います。石を置くのは、四角のマスの中ではなく、線と線が交わるところです。"}, // https://www.nihonkiin.or.jp/teach/lesson/school/kigu.html
 {"id":"strip-ring","title":"紙を半回転ひねって輪にすると表と裏がつながる","detail":"細長い紙を半回転ひねって両端をつなぐと、メビウスの帯になります。ペンで幅の真ん中をたどると、もとの紙の表と裏の両方を通って出発点に戻ります。"}, // https://www.itbm.nagoya-u.ac.jp/ja/research/2022/05/post-43.php
 {"id":"paper-a4","title":"A4を半分にするとA5に近い","detail":"A4は210×297mm。長い辺を半分にして向きを変えると148.5×210mmになり、148×210mmのA5にほぼ重なります。"}, // https://kb.gsd.ricoh.com/app/answers/detail/a_id/262587
 {"id":"postal-digits","title":"郵便番号のハイフンを消すと7桁","detail":"日本の郵便番号は数字7桁です。「123-4567」のように書くときは、前の3桁と後ろの4桁の間にハイフンを入れます。"}, // https://www.post.japanpost.jp/service/search/zipcode/zipmanual/p04.html
 {"id":"postcard-fold","title":"往復はがきは、2枚分をつないだまま送る","detail":"往信はがきと返信はがきがつながっています。送るときは真ん中で折り、受け取った人は返信する分を切り離します。"}, // https://www.post.japanpost.jp/service/send/domestic/mail/postcard/
 {"id":"isbn-prefix","title":"13桁のISBNは978か979で始まる","detail":"本につく国際標準図書番号の先頭3桁は、現在の13桁方式では978か979です。"}, // https://www.isbn-international.org/content/what-isbn/10
 {"id":"palindrome-take","title":"「たけやぶやけた」は両方向から読める","detail":"ひらがなで「た・け・や・ぶ・や・け・た」と並べると、後ろから逆に読んでも同じです。"},
 {"id":"palindrome-tomato","title":"日本語のトマトは回文、英語の tomato は回文ではない","detail":"「ト・マ・ト」は後ろから読んでも同じ。英語の tomato を逆にすると otamot になります。"},
 {"id":"bookkeeper","title":"bookkeeperには同じ文字が2つずつ3組続く","detail":"「簿記の係」を意味する英単語です。b・oo・kk・ee・per と分けると、o・k・eが2つずつ並びます。"}, // https://dictionary.cambridge.org/dictionary/english/bookkeeper
 {"id":"hako-bako","title":"「はこ」は「おもちゃ箱」の中で「ばこ」になる","detail":"「はこ」に濁点がついて「ばこ」になるように、語をつなぐと後ろの語の頭が濁ることがあります。連濁と呼ばれます。"}, // https://kotoba.ninjal.ac.jp/qa/yokuaru/qa-213/
 {"id":"ten-ten","title":"「う」に濁点をつけると「ゔ」と書ける","detail":"カタカナでは「ウ」に濁点をつけた「ヴ」。「ヴァイオリン」のように使われます。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/3040/
 {"id":"listen-silent","title":"listen と silent は同じ6文字を使う","detail":"「聞く」と「静かな」という別の英単語ですが、文字の順番を並べ替えると片方からもう片方になります。"},
 {"id":"morse-short","title":"モールス信号の E は短い音ひとつ","detail":"国際モールス符号では、Eは短点1つ、Tは長点1つ。どちらも信号を一度鳴らすだけで表せます。"}, // https://www.itu.int/rec/R-REC-M.1677/e
 {"id":"emoji-keycap","title":"「7️⃣」は見た目ひとつ、中身は3つ","detail":"よく使われるこの表記は、数字の7、絵文字表示を指定する記号、四角で囲む記号を順に並べて作ります。"}, // https://www.unicode.org/reports/tr51/
 {"id":"one-ichi","title":"横線の「一」と、伸ばす「ー」は別の文字","detail":"「一」は漢字で、「ー」は「コーヒー」のように音を伸ばす印です。形が似ていても役割が違います。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/30a0/
 {"id":"kanji-mori","title":"「木」が3つで「森」になる","detail":"「森」は上に「木」が1つ、下に「木」が2つ。下の2つだけを並べると「林」です。"},
 {"id":"kanji-syou","title":"「品」には口が3つある","detail":"「口」が上に1つ、下に2つ。似た並び方で「日」を3つ組み合わせた漢字には「晶」があります。"},
 {"id":"hiragana-he","title":"ひらがなの「へ」とカタカナの「ヘ」はよく似ている","detail":"どちらも山形ですが、「への字」の「へ」はひらがな。「ヘルメット」の「ヘ」はカタカナです。"}, // https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/
 {"id":"emoji-melting","title":"溶けながら笑う絵文字の名前は MELTING FACE","detail":"「🫠」は、文字や絵文字の規格であるUnicodeの一覧に、U+1FAE0の番号で載っています。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/1fa70/
 {"id":"cards-suits","title":"標準的なトランプは四つのマークが各13枚","detail":"エースからキングまで同じ構成が4組あり、ジョーカーを数えなければ52枚です。"}, // https://www.nintendo.com/jp/others/playing_cards/howtoplay/seven_bridge/index.html
 {"id":"chess-corners","title":"チェス盤は手前右のすみが白","detail":"8×8のチェス盤を置くときは、どちらのプレイヤーから見ても手前の右端が白いマスになります。"}, // https://handbook.fide.com/chapter/e012023
 {"id":"cube-color-faces","title":"3×3のキューブの表面は54マス","detail":"各面に9マスあり、面が6つ。外側の小さな色のマスを全部数えると54です。"},
 {"id":"janken-cases","title":"2人じゃんけんの出し方は9通り","detail":"2人がそれぞれグー・チョキ・パーを選べるので、3×3で9通り。同じ手を出すあいこは3通りです。"},
 {"id":"calculator-nines","title":"12345679に9を掛けると1が9つ並ぶ","detail":"8だけ抜けた数字の列を9倍すると111111111。掛ける前より1桁長くなります。"},
 {"id":"number-square","title":"111×111は12321","detail":"位ごとの計算を並べると、数字が「1、2、3、2、1」と増えてから減ります。"},
 {"id":"number-five","title":"5で終わる整数を2乗すると最後は25","detail":"15×15＝225、35×35＝1225。10の倍数に5を足した数の2乗では、25以外の部分が100の倍数になります。"},
 {"id":"number-thirty-seven","title":"37を3、6、9…27倍すると、同じ数字が3つ並ぶ","detail":"37×3は111、37×6は222、37×9は333。掛ける数を3ずつ増やすと、37×27の999まで同じ数字が3つずつ並びます。"},
 {"id":"number-power","title":"最初の5つの奇数を足すと25","detail":"1＋3＋5＋7＋9＝25。1×1のマスから始め、正方形の辺を1マスずつ長くすると、3、5、7、9の順にマスが増えて5×5になります。"},
 {"id":"number-digits","title":"24時間表示の12:34は、区切りを抜くと1234","detail":"12時34分を「12:34」と表示すると、時と分を区切る記号の両側に1・2と3・4が順に並びます。"},
 {"id":"venus-rotation","title":"金星が自転を一回終えるまでに、金星の1年が過ぎる","detail":"金星の自転は地球の約243日、太陽を一周するのは約225日。自転よりも先に公転が一周します。"}, // https://science.nasa.gov/venus/venus-facts/
 {"id":"time-365","title":"平年は52週間と1日","detail":"365日を7日ずつ分けると、364日で52週間。最後に1日だけ余ります。"},
 {"id":"sunlight-delay","title":"日なたを照らす光は約8分前に太陽を出た","detail":"太陽から地球までは約1億5000万km。光の速さでも数分かかり、平均で約8分20秒かけて届きます。"}, // https://astrobiology.nasa.gov/quick-facts/more-quick-facts/
 {"id":"time-thirty","title":"31日ある月は1年に7つ","detail":"1・3・5・7・8・10・12月です。7月と8月は31日が続きます。"},
 {"id":"time-watch-angle","title":"3時の時計の針は直角を作る","detail":"3時ちょうどは、短針が3、長針が12を指します。小さい方の角度は円を4分の1にした90度です。"},
 {"id":"shape-triangle","title":"正三角形の角は全部60度","detail":"三角形の内角の合計は180度。正三角形ではその角が3つとも等しいので、1つ60度です。"},
 {"id":"shape-coin","title":"丸いコインを半回転しても輪郭は同じ","detail":"絵や数字の向きは変わりますが、円の形そのものは回転しても重なります。"},
 {"id":"shape-diagonal","title":"正方形は対角線1本で同じ三角形2枚になる","detail":"向かい合う角をまっすぐ結ぶと、45度・45度・90度の三角形に分かれます。"},
 {"id":"shape-rectangle","title":"長方形は半分に折る向きで細長さが変わる","detail":"縦横が異なる長方形は、長い辺を半分に折るか、短い辺を半分に折るかで、折ったあとの縦横比が変わります。"},
 {"id":"shape-hexagon","title":"正六角形は正三角形6つで作れる","detail":"中心から六つの頂点へ線を引くと、60度ずつに分かれます。各区画が同じ大きさの正三角形です。"},
 {"id":"shape-star","title":"正五角形から描く星は、先端5つを足すと180度","detail":"正五角形の頂点を一つ飛ばしで結ぶと五つのとがった先端ができます。各先端は36度で、合計180度です。"},
 {"id":"shape-tile","title":"長方形のタイル4枚で同じ形を大きくできる","detail":"同じ長方形を2列2段に並べると、縦も横も2倍。元のタイルと同じ縦横比になります。"},
 {"id":"shape-nine","title":"3×3の格子にも正方形は9つより多い","detail":"横や縦の線に沿うものだけを数えても、1マスの9つ、2×2の4つ、全体の1つで14個あります。"},
 {"id":"dice-opposites","title":"一般的な6面サイコロは、向かい合う目を足すと7","detail":"向かい合う面は1と6、2と5、3と4。どの組も点を足すと7になります。"}, // https://files.eric.ed.gov/fulltext/ED523099.pdf
 {"id":"socks-three","title":"2色しかなければ靴下3枚で必ず同じ色がそろう","detail":"最初の2枚が別々の色でも、3枚目はどちらかの色と同じです。暗い引き出しから選んでもこの数え方は変わりません。"},
 {"id":"combo-pair","title":"4人全員が互いに1回ずつ握手すると6回","detail":"1人は残り3人と、次の人はまだ握手していない2人と、残る2人は1回。3＋2＋1です。"},
 {"id":"combo-coin","title":"コインを2回投げると表と裏の並びは4通り","detail":"表表・表裏・裏表・裏裏です。表が1回になる並びだけを数えると、そのうち2通りです。"},
 {"id":"combo-traffic","title":"右折を4回繰り返すと元と同じ向き","detail":"毎回直角に右を向くなら、90度が4回で360度。進んだ距離にかかわらず向きだけ元に戻ります。"},
 {"id":"seven-segment","title":"デジタル時計の「8」はすべての棒を使う","detail":"7本の棒で数字を作る表示器では、「8」は7本すべて、「1」は右側の2本だけを点灯させます。"}, // https://www.ti.com/lit/ds/symlink/sn74ls47.pdf
 {"id":"combo-pages","title":"1から20までのページ番号には「1」が12回出る","detail":"1に一度、10から19の十の位に十度、11の一の位にもう一度出てきます。"},
 {"id":"combo-edges","title":"5人を丸いテーブルに座らせると隣り合う席の組は5組","detail":"隣の組を時計回りに数えると、最後の席と最初の席の組もあります。列に並べたときより1組増えます。"},
 // 宇宙。NASA Science の天体解説とアポロ15号の記録。
 {"id":"uranus-on-side","title":"天王星は横倒しで回っている","detail":"天王星の自転軸は、公転面に対する垂直方向から約98度傾いています。こまを横に倒したような向きです。"}, // https://science.nasa.gov/uranus/facts/
 {"id":"saturn-density","title":"土星は平均すると水より軽い","detail":"同じ体積で比べると、土星全体の平均密度は水より小さくなります。NASAは、入るほど大きなお風呂があれば浮くとたとえています。"}, // https://science.nasa.gov/mission/cassini/faq/
 {"id":"pluto-heart","title":"冥王星には白いハートがある","detail":"探査機の写真に、ハート形の明るい地域が写っています。西側には、窒素などの氷で覆われた広い盆地があります。"}, // https://science.nasa.gov/earth/frozen-ice-on-earth-and-well-beyond/
 {"id":"neptune-predicted","title":"海王星は、惑星として見つかる前に位置を計算された","detail":"天王星の軌道のずれを手がかりに、未知の惑星の位置を計算しました。その予想をもとに1846年に海王星を発見。ガリレオもそれ以前に観測していましたが、恒星として記録していました。"}, // https://science.nasa.gov/neptune/neptune-facts/
 {"id":"ganymede-mercury","title":"木星の衛星ガニメデは、水星より直径が大きい","detail":"ガニメデは木星を回る衛星ですが、直径では惑星の水星を上回ります。太陽系でいちばん大きな衛星です。"}, // https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/
 {"id":"moon-same-side","title":"月は自転しているから、地球にほぼ同じ面を向ける","detail":"月は地球を一周する間に、自分も一回転します。回転がそろっているため、地球からはいつもほぼ同じ側が見えます。"}, // https://science.nasa.gov/skywatching/faq/
 {"id":"moon-hammer-feather","title":"月でハンマーと羽を落としたら同時に着いた","detail":"アポロ15号のデイヴィッド・スコットは、月面でハンマーと羽を同時に落としました。空気抵抗がほぼないため、映像では同時に地面へ着きました。"}, // https://science.nasa.gov/image-article/apod-2011-november-1-hammer-versus-feather-on-the-moon/
 {"id":"titan-rain","title":"土星の衛星タイタンではメタンの雨が降る","detail":"探査機カッシーニは液体のメタンなどを含む湖を観測しました。タイタンでは水の代わりにメタンが蒸発し、雲や雨になります。"}, // https://science.nasa.gov/mission/cassini/science/titan/
 // 生き物。博物館・水族館の解説とウォンバットの研究。
 {"id":"wombat-cubes","title":"ウォンバットの仲間には、角ばったふんをするものがいる","detail":"サイコロに似たふんを作るウォンバットを調べた研究では、腸の壁の硬さが場所によって異なることが角のでき方に関わると考えられています。"}, // https://hu.gatech.edu/wp-content/uploads/2021/01/Hu21-wombat.pdf
 {"id":"shark-cartilage","title":"サメの骨格の主な材料は軟骨","detail":"サメは軟骨魚類の仲間です。骨格は主に、人間の耳に含まれるものと同じ種類の組織である軟骨でできています。"}, // https://www.nhm.ac.uk/discover/quick-questions/do-sharks-have-bones.html
 {"id":"butterfly-feet","title":"チョウは足で味を感じる","detail":"足や、蜜を吸う口の器官に、味を感じる細胞があります。口を伸ばす前にも、止まった先の物質を足で感じられます。"}, // https://www.amnh.org/exhibitions/butterflies/anatomy
 {"id":"flamingo-pink","title":"フラミンゴのピンクは食べ物から来る","detail":"食べたものに含まれる赤やオレンジ系の色素が、羽の色に関わります。ひなの羽は、一般に灰色や白っぽい色です。"}, // https://nationalzoo.si.edu/animals/news/why-are-flamingos-pink-and-other-flamingo-facts
 {"id":"octopus-hearts","title":"タコには心臓が3つある","detail":"2つはそれぞれえらへ血液を送り、残り1つは酸素を取り込んだ血液を全身へ送ります。"}, // https://ocean.si.edu/ocean-life/invertebrates/octopuses-squids-and-relatives
 {"id":"platypus-eggs","title":"カモノハシは卵を産んで、子に乳を与える","detail":"鳥のようなくちばしがあり、卵も産みます。子に乳を与える哺乳類で、単孔類に分類されます。"}, // https://www.nhm.ac.uk/discover/the-platypus-puzzle.html
 {"id":"otter-rock","title":"ラッコは石を使って貝を開ける","detail":"水面にあおむけになり、胸を台にして食事します。アサリなど殻の硬いものを食べるときには、石を使って殻を割ることがあります。"}, // https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/sea-otter
 {"id":"seahorse-pouch","title":"タツノオトシゴはオスがおなかの袋で卵を育てる","detail":"メスがオスの袋へ卵を入れます。卵は袋の中で育ち、オスが小さな子どもを外へ送り出します。"}, // https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/big-belly-seahorse
 // 遊びと音楽。各メーカー・団体の公式資料。
 {"id":"lego-six","title":"同じレゴブロック6個で9億通り以上の組み立て","detail":"公式の数え方では、同じ色の2×4ブロックを6個つないだ形は915,103,765通りあります。"}, // https://www.lego.com/en-us/history/articles/d-the-stud-and-tube-principle
 {"id":"tetris-tennis","title":"テトリスの名前にはテニスが入っている","detail":"作者は「4」を意味する tetra と、好きなスポーツの tennis を組み合わせて Tetris と名付けました。"}, // https://www.tetris.com/about
 {"id":"pacman-pizza","title":"パックマンの形の発想の一つはピザ","detail":"制作者の岩谷徹さんが着想を得たものの一つは、1切れ取った丸いピザ。その隙間が、口を開けた横顔に見えます。"}, // https://pacman.com/en/news/?p=1627%2F1000
 {"id":"mario-jumpman","title":"マリオは一時期「ジャンプマン」と呼ばれた","detail":"1981年のアーケード版『ドンキーコング』に登場した主人公です。任天堂は、そのころ使っていた呼び名として Jumpman を紹介しています。"}, // https://www.nintendo.com/en-gb/News/2016/November/Nintendo-Classic-Mini-NES-special-interview-Volume-1-Donkey-Kong-1152552.html
 {"id":"game-boy-printer","title":"ゲームボーイには写真を印刷する周辺機器があった","detail":"ゲームボーイカメラで撮った写真は、別売りのゲームボーイプリンタを使ってシールにできました。"}, // https://www.nintendo.com/en-za/Hardware/Nintendo-History/Game-Boy-Color/Game-Boy-Color-Accessories/Game-Boy-Color-Accessories-915840.html
 {"id":"nintendo-playing-cards","title":"任天堂の最初の商品はゲーム機よりずっと前の花札","detail":"任天堂は1889年に花札の製造から始まりました。テレビの画面を使う遊びを作るより、ずっと前の話です。"}, // https://www.nintendo.com/en-gb/News/2021/August/Revisit-Nintendo-s-roots-with-Hanafuda-2019412.html
 {"id":"chess-castling","title":"チェスには1手で駒を2個動かせる手がある","detail":"キャスリングでは、条件を満たしたときにキングを2マス動かし、ルークをキングが通ったマスに置きます。合わせて1手です。"}, // https://handbook.fide.com/chapter/E012023
 {"id":"harpsichord-plucks","title":"チェンバロの中では弦をはじいている","detail":"鍵盤を押すと、小さな爪で弦をはじきます。ピアノのハンマーが弦をたたく仕組みとは、音を出す動きが違います。"}, // https://hub.yamaha.com/pianos/p-history/evolution-of-the-modern-piano-from-dulcimer-to-disklavier/
 // 建物と道具。運営機関・メーカー・規格の資料。
 {"id":"eiffel-heat","title":"エッフェル塔の先端は晴れた日に少し移動する","detail":"日が当たる側の鉄が温まって伸び、塔がわずかに傾きます。運営元によると、先端が一日に描く軌跡は、直径約15cmの円に近い形です。"}, // https://www.toureiffel.paris/en/news/history-and-culture/why-does-eiffel-tower-change-size
 {"id":"liberty-green","title":"自由の女神像の緑色は銅の表面で自然にできた","detail":"像の表面には銅が使われています。長く空気や雨に触れてできた緑色の層が、今の色を作りました。"}, // https://www.nps.gov/stli/planyourvisit/frequently-asked-questions-statue-of-liberty.htm
 {"id":"braille-dots","title":"6点式点字のマスには64通りの形がある","detail":"6か所それぞれについて、点を出すか出さないかを選びます。点が1つもないマスまで含めれば、2を6回掛けて64通りです。"}, // https://loc.gov/exhibits/louis-braille/exhibition-items.html
 {"id":"usb-c-twist","title":"USB Type-Cの差し込み口は表裏を選ばない","detail":"USB Type-Cのコネクターは上下対称なので、プラグの表裏をひっくり返しても差し込めます。"}, // https://www.usb.org/usb-type-cr-cable-and-connector-specification
 {"id":"post-it-adhesive","title":"貼ってはがせる付箋の糊が先にできた","detail":"3Mの研究者が作った新しい接着剤を、別の研究者が紙に塗る用途に結びつけました。そこからポスト・イットが生まれました。"}, // https://www.3m.com/3M/en_US/consumer-us/stories/full-story/?storyid=e9f444d3-a5c5-46f1-a34b-082ff275aa7d
 {"id":"ykk-letters","title":"ファスナーにある YKK は昔の社名の頭文字","detail":"YKKは Yoshida Kogyo Kabushikikaisha の頭文字です。旧社名の英語表記から取り、ファスナーの商標になりました。"}, // https://www.ykk.com/ykk/mame/ykk_01.html
 {"id":"keypad-rows","title":"電話と電卓では「1・2・3」と「7・8・9」の上下が逆","detail":"一般的な電話の数字キーでは、1・2・3の段が7・8・9より上です。電卓では7・8・9の段が上に来ます。"}, // https://www.itu.int/rec/T-REC-E.161
 {"id":"record-spiral","title":"レコードの溝は輪の集まりに見えて、らせん","detail":"一般的なレコードでは、針が外側から内側に向かうらせんの溝をたどります。遠目には、丸い線が何重にも重なって見えます。"}, // https://content-files.shure.com/KnowledgeBaseFiles/high-fidelity-phonograph-cartridge-technical-seminar-faq.pdf
 // 数のからくり。計算例で確かめられるもの。
 {"id":"kaprekar-6174","title":"6174の数字を並べ替えて引くと、また6174","detail":"大きい順に並べると7641、小さい順は1467。7641−1467を計算すると、もとの6174に戻ります。"},
 {"id":"birthday-23","title":"23人いれば同じ誕生日の2人がいる確率は半分を超える","detail":"各人の誕生日が365日に同じ確率で独立に分布するモデルでは、23人に同じ誕生日の組が少なくとも一ついる確率は約50.7％です。"},
 {"id":"repeating-one","title":"9がずっと続く0.999…は、ちょうど1","detail":"0.999…をxとすると、10xは9.999…。10xからxを引くと小数部分が消えて9となり、xは1になります。"},
 {"id":"repeat-three-digits","title":"3桁を2回並べると7・11・13すべてで割れる","detail":"123を2回並べた123123は123×1001。1001は7×11×13なので、どんな3桁を選んでも同じ性質があります。"},
 {"id":"number-153","title":"153は、1・5・3をそれぞれ3乗して足しても153","detail":"1×1×1は1、5×5×5は125、3×3×3は27。足すと153になります。"},
 {"id":"folding-ten","title":"紙を半分に10回折れたら重なりは1024枚分","detail":"折るたびに層が2倍になると考えると、10回で2を10回掛けた1024になります。実際に折れる回数は紙の大きさや厚みによります。"},
 {"id":"dice-sums-seven","title":"サイコロ2個の合計でいちばん出やすいのは7","detail":"公平な6面サイコロを2個、独立に振ったとき、合計7には1＋6から6＋1まで6通りあります。合計2の1＋1や、合計12の6＋6は1通りです。"},
 {"id":"chocolate-breaks","title":"20かけの板チョコを1かけずつにするには19回","detail":"重ねずに1回で1つのかたまりを二つに割るなら、割るたびに数が1つ増えます。最初の1個が20個になるまで、19回です。"},
 // 言葉と形。文字遊びと身近な形の話。
 {"id":"desserts-stressed","title":"desserts を後ろから読むと stressed","detail":"desserts は甘いデザートの複数形。文字をひっくり返した stressed は「ストレスを感じた」という意味です。"},
 {"id":"typewriter-row","title":"TYPEWRITER はキーボードの1段だけで打てる","detail":"一般的なQWERTY配列では、TYPEWRITER に入る文字は全部、英字の最上段 QWERTYUIOP にあります。"},
 {"id":"swims-rotation","title":"SWIMS は書体によって上下逆さでも SWIMS","detail":"大文字のSとIが半回転しても同じ形で、WとMが互いに入れ替わる書体で書くと、単語全体を180度回しても読めます。"},
 {"id":"number-anagram","title":"英語の「12＋1」と「11＋2」は、答えも使う文字も同じ","detail":"TWELVE PLUS ONE と ELEVEN PLUS TWO は、空白を抜いて並べ替えると同じ文字になります。どちらを足しても13です。"},
 {"id":"facetious-vowels","title":"facetious に出る母音字は a・e・i・o・u の順","detail":"「冗談めかした」を表す英単語 facetious は、子音字を抜くと aeiou。英語の母音字5種類が、アルファベット順に一度ずつ出てきます。"},
 {"id":"rainbow-circle","title":"虹は空の上からだと輪に見えることがある","detail":"虹は見る人の影の方向を中心にした円です。地上からは地平線に遮られやすい部分も、飛行機からなら、水滴の位置などの条件がそろうと見えます。"}, // https://www.nesdis.noaa.gov/about/k-12-education/optical-phenomena/what-causes-rainbow
 {"id":"lighthouse-rings","title":"昔の灯台にはガラスの輪を重ねたレンズがある","detail":"フレネルレンズは中心の周りに輪状のガラスを並べたものです。厚いガラスのかたまりを使わず、灯火を遠くへ向けられます。"}, // https://www.nps.gov/articles/fresnellens.htm
 {"id":"chessboard-domino","title":"チェス盤の対角のすみを2マス抜くと、ドミノで埋められない","detail":"隣り合う2マスを覆うドミノは、黒と白を1マスずつ覆います。対角のすみ同士は同じ色なので、両方を抜くと黒と白の数が合いません。"},
 // 文字と記号
 {"id":"iteration-voicing","title":"「々」は同じ字を表しても、同じ音とは限らない","detail":"「人々」の「々」は直前の「人」を繰り返す印です。読むときは「ひとひと」ではなく「ひとびと」になり、後ろの音が濁ります。"}, // https://unicode.org/versions/Unicode18.0.0/core-spec/chapter-6/
 {"id":"kana-ligatures","title":"「より」と「コト」を1字にまとめたかながある","detail":"「ゟ」は「より」、「ヿ」は「コト」を一つにまとめた文字です。昔の縦書きでも使われ、今のUnicodeにもそれぞれ一文字として収録されています。"}, // https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/
 {"id":"reiwa-single-character","title":"「令和」を1マスに収めた「㋿」という文字がある","detail":"「令」と「和」を1マスに収めた文字です。Unicodeには「㍻（平成）」や「㍼（昭和）」なども一文字ずつ載っています。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/3200/
 {"id":"missing-type-geta","title":"印刷できない漢字の代わりに「げた」が出ることがある","detail":"「〓」はげた記号と呼ばれ、書体にない漢字などの代わりに置かれてきました。数字や数式で使う「＝」とは別の記号です。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/3000/
 {"id":"half-fraction-slash","title":"「½」に隠れている斜線は、普通の「/」と別の文字","detail":"Unicodeの互換分解で「½」を3文字に分けると「1⁄2」です。中央の「⁄」には、分数に使う斜線として専用の番号が付いています。"}, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/0080/
 // 暦
 {"id":"calendar-week-400","title":"カレンダーの曜日は400年後にぴったり戻る","detail":"グレゴリオ暦では400年にうるう年が97回。合計146097日は7で割り切れるので、400年後の同じ月日が同じ曜日になります。"}, // https://eco.mtk.nao.ac.jp/koyomi/wiki/A5B0A5ECA5B4A5EAA5AACEF1.html
 {"id":"calendar-february-march","title":"平年の2月と3月は、28日まで曜日がそろう","detail":"平年の2月はちょうど4週間です。3月1日は2月1日と同じ曜日になるので、たとえば2月14日が月曜なら3月14日も月曜です。"},
 {"id":"calendar-friday-thirteen","title":"13日の金曜日を一度も迎えない年はない","detail":"グレゴリオ暦では、平年でもうるう年でも各月の1日を集めると7種類の曜日が全部出ます。日曜始まりの月では、12日後の13日は金曜です。"},
 {"id":"calendar-iso-week","title":"1月1日が前年の最終週に入ることがある","detail":"国際規格の週番号では、1月4日を含む月曜始まりの週を第1週とします。2005年1月1日は土曜日なので、週で表すと2004年の第53週です。"}, // https://learn.microsoft.com/en-us/dotnet/api/system.globalization.isoweek.getweekofyear
 // 数のしくみ
 {"id":"number-2520","title":"2520は1から10のどの整数で割っても余らない","detail":"しかも、その条件を満たす最小の正の整数です。8と9と5と7の積で、この4つがあれば2・3・4・6・10に必要な因数もそろいます。"},
 {"id":"number-divisibility-nine","title":"大きな数が9の倍数かは、数字を足すだけで分かる","detail":"たとえば2385は2＋3＋8＋5＝18なので、9の倍数です。10も100も1000も、9で割った余りが1なので、各桁を足しても余りは同じです。"},
 {"id":"number-zero-factorial","title":"0個のものを並べる方法は0通りではなく1通り","detail":"何も置いていない並びが1通りあります。n個の異なるものの並べ方を表す階乗は、この「空の並び」も数えるので0!＝1です。"},
 {"id":"number-999-complement","title":"999×47は、46と953を並べるだけで作れる","detail":"999×47＝1000×47−47。千の位を一つ借りると、前は47−1＝46、後ろは1000−47＝953。これで46953になります。"},
 {"id":"number-2025-split","title":"2025を前後に分けて足すと、2025の平方根になる","detail":"20＋25＝45。45×45を計算すると2025です。似た例に3025があり、30＋25＝55と55×55＝3025が成り立ちます。"},
 // 紙と図形
 {"id":"geometry-cardboard-balance","title":"三角形の厚紙で釣り合う点は、3本の線で見つかる","detail":"厚さと密度が一様なら、各頂点から向かいの辺の中点に引いた3本の線の交点が重心です。厚紙を水平にして、その交点の真下を支えると釣り合います。"},
 {"id":"geometry-grid-diagonal","title":"4×6の方眼の対角線は、8マスの内側を通る","detail":"角から反対の角へ線を引くと、内側の縦線3本と横線5本を横切ります。中央では縦横2本を同時に越えるので、対角線は8区間に分かれます。角だけに触れるマスを除けば、1区間につき1マスです。"},
 {"id":"geometry-cube-tetrahedron","title":"立方体の角を4つ選ぶと正四面体が隠れている","detail":"市松模様のように辺で隣り合う角を別の色で塗り、片方の色の4つだけを結びます。6本とも立方体の面の対角線なので、同じ長さになります。"},
 {"id":"geometry-triangle-incircle","title":"どんな三角形にも、3辺にぴったり触れる円を描ける","detail":"三つの角を半分に分ける線は一点で交わります。各線の上の点は角の両側の辺から等距離なので、交点は三辺すべてから同じ距離です。その距離を半径にすると円が収まります。"},
 {"id":"geometry-semicircle-sum","title":"大きな半円の弧は、直径を分けた小さな半円の弧の合計と同じ","detail":"直径10cmの半円の弧は5πcm。直径4cmと6cmの半円に分けても、弧は2πcm＋3πcmです。分ける位置を変えても合計の長さは変わりません。"},
 // 楽譜
 {"id":"music-clef-lines","title":"ト音記号の渦はソの線を囲んでいる","detail":"一般的なト音記号では下から2本目がソです。一方、ヘ音記号で点が二つ挟む線はファ。記号が変わると、同じ場所に書いた音符の読み方も変わります。"}, // https://www.w3.org/2021/06/musicxml40/tutorial/notation-basics/#clef
 {"id":"music-whole-measure-rest","title":"4分の3拍子の1小節を全部休むときにも全休符を使える","detail":"4分の3拍子の小節の中央に全休符が一つだけあると、その小節全部を休む印です。休む時間は、拍子に従って4分音符3つ分になります。"}, // https://lilypond.org/doc/v2.27/Documentation/notation/writing-rests
 {"id":"music-ds-jump","title":"楽譜の「D.S.」は、セーニョのある場所へ戻る指示","detail":"「D.S.」はダル・セーニョの略で、セーニョと呼ばれる記号の地点へ戻ります。曲の最初に戻るときの指示は「D.C.」です。"}, // https://handbook.musescore.org/notation/repeats/jumps-and-markers
 {"id":"music-octave-eight","title":"楽譜で音符の上にある「8va」は、半音12個分上","detail":"音符の上に「8va」の線がある区間は1オクターブ上で演奏します。ド・レ・ミ・ファ・ソ・ラ・シ・ドと数えると8音、鍵盤で小さな半音の間隔を数えると12個分です。"}, // https://handbook.musescore.org/notation/pitch/octave-lines
 {"id":"music-double-sharp","title":"ピアノでは「ファのダブルシャープ」と「ソ」が同じ鍵盤","detail":"ダブルシャープは半音二つ分上げる記号です。ファから隣の黒鍵へ半音、そこからソへもう半音。表記の名前は違っても押す鍵盤は一つです。"}, // https://www.w3.org/2021/06/musicxml40/tutorial/midi-compatible-part/
 ...extraTriviaFacts,
];
