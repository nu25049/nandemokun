import {extraTriviaQuestions} from './trivia-questions-extra';

export const TRIVIA_QUESTIONS: ReadonlyArray<{
 id: string;
 statement: string;
 answer: boolean;
 explanation: string;
}> = [
 {id:'trivia:venus-orbit', statement:'金星は地球より太陽の近くを回っている。', answer:true, explanation:'太陽に近い順に、水星、金星、地球と並びます。'}, // https://science.nasa.gov/venus/venus-facts/
 {id:'trivia:dolphin-breathing', statement:'イルカは水の中で、えらを使って呼吸する。', answer:false, explanation:'イルカは哺乳類で、水面に出て肺で空気を吸います。'}, // https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin
 {id:'trivia:shogi-promotion', statement:'将棋で成った歩兵は「と金」と呼ばれる。', answer:true, explanation:'歩兵は成ると「と金」になり、金将と同じ動きができます。'}, // https://www.shogi.or.jp/knowledge/shogi/03.php
 {id:'trivia:woodwind-flute', statement:'フルートは金属製でも木管楽器に分類される。', answer:true, explanation:'分類は材料だけで決まらず、フルートは息を吹き口の縁に当てて音を鳴らす木管楽器です。'}, // https://www.yamaha.com/ja/musical_instrument_guide/flute/mechanism/mechanism002.html
 {id:'trivia:roman-ten', statement:'ローマ数字の「X」は5を表す。', answer:false, explanation:'Xは10、Vは5を表します。'},
 {id:'trivia:pencil-lead', statement:'黒い鉛筆の芯は、主に金属の鉛でできている。', answer:false, explanation:'一般的な黒い鉛筆の芯は、黒鉛と粘土を混ぜて焼き固めたものです。'}, // https://www.mpuni.co.jp/customer/pdf/Pencil.pdf
 {id:'trivia:traffic-order', statement:'日本の一般的な横向きの車両用信号では、正面から見て赤は右端にある。', answer:true, explanation:'横型の3灯式では、左から青、黄、赤の順に並びます。'}, // https://www.npa.go.jp/english/bureau/traffic/traffic-light_english.pdf
 {id:'trivia:hydrogen-helium', statement:'ヘリウムの元素記号は「H」である。', answer:false, explanation:'ヘリウムはHeです。Hは水素の元素記号です。'}, // https://iupac.org/what-we-do/periodic-table-of-elements/
 {id:'trivia:milk-carton-notch', statement:'日本の牛乳パックでは、上端に半円形の切り欠きがあるとき、開け口はその反対側にある。', answer:true, explanation:'くぼみは触って牛乳と見分ける目印です。反対側を探すと開け口も分かります。'}, // https://www.j-milk.jp/knowledge/products/8d863s000007z1wa.html
 {id:'trivia:octopus-arms', statement:'タコには腕が8本ある。', answer:true, explanation:'口の周りから伸びる吸盤付きの8本は、生物学では腕と呼ばれます。'}, // https://ocean.si.edu/ocean-life/invertebrates/octopuses-squids-and-relatives
 {id:'trivia:strawberry-specks', statement:'イチゴの表面にある小さな粒は、一粒ずつがむき出しの種である。', answer:false, explanation:'表面の粒は、種を一つずつ包んだ小さな果実です。赤くて甘い部分は、花の土台がふくらんだものです。'}, // https://extension.umn.edu/agriculture/specialty-crops/commercial-fruit-production/strawberry-farming/small-or-misshapen-strawberries
 {id:'trivia:octave-seven', statement:'ピアノで「ド」から1オクターブ上の「ド」までは、半音7個分である。', answer:false, explanation:'1オクターブは半音12個分です。白鍵と黒鍵のどちらも半音を数えるときに含めます。'},
 {id:'trivia:antipodal-seasons', statement:'日本が冬を迎える12月、南半球のシドニーでは夏になる。', answer:true, explanation:'地球の自転軸が傾いているため、北半球と南半球の季節はおおむね逆になります。'}, // https://www.bom.gov.au/news-and-media/solstices-equinoxes-and-the-seasons
 {id:'trivia:banana-stem', statement:'バナナの幹のように見える部分は、木と同じように年輪ができる。', answer:false, explanation:'バナナは大型の草です。幹のように見える部分は葉の根元が重なってできており、木のような年輪はありません。'}, // https://edis.ifas.ufl.edu/publication/MG040/pdf
 {id:'trivia:chess-knight', statement:'チェスのナイトは、ほかの駒を飛び越えて移動できる。', answer:true, explanation:'ナイトは縦横の一方へ2マス、もう一方へ1マス進んだ位置に着き、途中に駒があっても移動できます。'}, // https://handbook.fide.com/chapter/E012023 (3.6)
 {id:'trivia:tomorrow-two-days', statement:'「明後日」は、今日から数えて3日後のことだ。', answer:false, explanation:'明日が1日後、明後日が2日後です。'},
 {id:'trivia:clap-vacuum', statement:'空気などがまったくない真空では、手をたたく音は伝わらない。', answer:true, explanation:'音が伝わるには、空気や水など、振動を伝える物質が必要です。'},
 {id:'trivia:go-board', statement:'囲碁で一般的に使う19路盤には、升目の中に石を置く。', answer:false, explanation:'囲碁の石は、縦線と横線が交わる点に置きます。'}, // https://www.nihonkiin.or.jp/teach/gakkouigo/aboutigo.html
 {id:'trivia:moonlight', statement:'月が夜に明るく見えるのは、主に太陽の光を反射しているからだ。', answer:true, explanation:'月の表面に当たった太陽の光が反射し、その一部が地球に届きます。'}, // https://science.nasa.gov/moon/moonlight/
 {id:'trivia:rugby-pass', statement:'ラグビーでは、相手のゴールラインに向かって腕を振り、手で前方にパスしてよい。', answer:false, explanation:'ラグビーでは手で前方へ投げるパスは反則です。前方へは走ったりキックしたりして進めます。'}, // https://passport.world.rugby/laws-of-the-game/laws-by-number/11-knock-forward-or-throw-forward
 {id:'trivia:japanese-vowels', statement:'日本語の基本の母音は「あ・い・う・え」の4つである。', answer:false, explanation:'「お」を含めて、「あ・い・う・え・お」の5つです。'},
 {id:'trivia:spider-legs', statement:'成体のクモの脚は、基本的に8本である。', answer:true, explanation:'クモには脚が4対あり、成体の昆虫の脚は通常3対です。'}, // https://www.nhm.ac.uk/take-part/identify-nature/spiders-in-your-home.html
 {id:'trivia:venus-day-year', statement:'金星は、太陽の周りを一周するよりも、自転を一回するほうが長くかかる。', answer:true, explanation:'地球の日数で、金星の公転は約225日、自転は約243日です。'}, // https://science.nasa.gov/venus/venus-facts/
 {id:'trivia:pacific-atlantic', statement:'太平洋は大西洋より面積が小さい。', answer:false, explanation:'太平洋は大西洋より広く、地球で最も広い海洋です。'}, // https://oceanservice.noaa.gov/facts/biggestocean.html
 {id:'trivia:polar-bear', statement:'野生のホッキョクグマは北極圏に生息する。', answer:true, explanation:'ホッキョクグマは北極とその周辺に暮らし、南極には自然分布しません。'}, // https://www.fws.gov/species/polar-bear-ursus-maritimus
 {id:'trivia:gram-kilogram', statement:'0.5キログラムは50グラムである。', answer:false, explanation:'1キログラムは1000グラムなので、半分の0.5キログラムは500グラムです。'},
 {id:'trivia:bluetooth-king', statement:'Bluetoothという名前は、中世の王のあだ名に由来する。', answer:true, explanation:'デンマークのハーラル王のあだ名が由来です。ロゴにも王の名とあだ名の頭文字を表すルーン文字が使われています。'}, // https://www.bluetooth.com/about-us/Bluetooth-origin/
 {id:'trivia:inkjet-toner', statement:'インクジェットプリンターは、紙に粉末のトナーを吹きつけて印刷する。', answer:false, explanation:'インクジェットは液体インクの小さな滴を飛ばします。トナーを使う代表例はレーザープリンターです。'}, // https://canon.jp/biz/solution/smb/tips/device/print/printer-features
 {id:'trivia:flat-musical', statement:'楽譜のフラット記号「♭」は、音を半音下げる。', answer:true, explanation:'♭は半音下げる記号で、シャープ「♯」は半音上げる記号です。'},
 {id:'trivia:airplane-mode-wifi', statement:'iPhoneは機内モードにすると、機内モードを解除するまでWi-Fiをオンにできない。', answer:false, explanation:'機内モードのまま、Wi-Fiだけをオンにできます。機内で使えるかは航空会社の案内に従います。'}, // https://support.apple.com/ja-jp/108785
 {id:'trivia:wombat-cubes', statement:'ウォンバットは、サイコロのような形のふんをする。', answer:true, explanation:'ふんは腸の中で角のある形に整えられます。研究では、腸の部分ごとの伸びやすさの違いが関係すると考えられています。'}, // https://pubmed.ncbi.nlm.nih.gov/33289747/
 {id:'trivia:crane-order', statement:'ツルは鳥の分類では、ハトと同じハト目に属する。', answer:false, explanation:'ツルはツル目に属します。ハトはハト目なので、別のグループです。'}, // https://www.allaboutbirds.org/guide/sandhill_crane and https://www.allaboutbirds.org/guide/Rock_Pigeon/overview
 {id:'trivia:birds-dinosaurs', statement:'生物の分類では、スズメやニワトリも恐竜の仲間である。', answer:true, explanation:'鳥は獣脚類と呼ばれる恐竜の一系統から進化し、現代に生き残った恐竜の仲間です。'}, // https://qrius.si.edu/taxonomy/term/12038
 {id:'trivia:rainbow-circle', statement:'虹は半円の形なので、飛行機から見ても一周つながった円にはならない。', answer:false, explanation:'地上では、下の方向が地面に遮られるため、虹の一部だけが見えることが多いです。上空では、必要な方向に水滴があれば円全体が見えます。'}, // https://science.nasa.gov/image-article/apod-2014-september-30-a-full-circle-rainbow-over-australia/
 {id:'trivia:binary-two', statement:'2進法で書いた「10」は、10進法では2になる。', answer:true, explanation:'2進法では右から1、2、4の位です。「10」は2の位に1、1の位に0があります。'},
 {id:'trivia:white-chocolate-butter', statement:'ホワイトチョコレートは白いので、カカオ由来の原料を使っていない。', answer:false, explanation:'白くても、カカオ豆から取れる油脂のココアバターを使います。茶色いカカオマスを入れないので、色が白っぽくなります。'}, // https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-163/subpart-B/section-163.124
 {id:'trivia:penguin-flight', statement:'ペンギンは翼を使って空を飛ぶ。', answer:false, explanation:'ペンギンの翼は水中を進むのに適していて、空を飛ぶことはできません。'}, // https://ocean.si.edu/ocean-life/seabirds/penguins
 {id:'trivia:northern-star', statement:'日本で夜空に北極星が見えれば、北の方角を知る目印になる。', answer:true, explanation:'北極星は地球の自転軸を北へ延ばした方向の近くに見えます。'}, // https://science.nasa.gov/solar-system/what-is-the-north-star-and-how-do-you-find-it/
 {id:'trivia:one-yen-gram', statement:'現在使われているアルミニウムの1円玉は、1枚で約1グラムである。', answer:true, explanation:'1円玉の規格は重さ1グラム、直径20ミリメートルです。'}, // https://www.mint.go.jp/media/2021/08/mintclub_77.pdf
 {id:'trivia:baseball-four', statement:'野球では、通常4つのストライクで三振になる。', answer:false, explanation:'三振は3ストライクです。4ボールになると四球です。'}, // https://www.mlb.com/glossary/standard-stats/strikeout
 {id:'trivia:shark-cartilage', statement:'サメの骨格は、硬い骨よりも軟骨を中心にできている。', answer:true, explanation:'サメは軟骨魚類です。骨格の軟骨は、カルシウム塩が沈着して硬くなる部分もあります。'}, // https://www.floridamuseum.ufl.edu/discover-fish/sharks/faq/
 {id:'trivia:football-goal', statement:'サッカーでは、ボールの一部がゴールラインに触れた時点でゴールになる。', answer:false, explanation:'得点には、ボール全体がゴールポストの間とクロスバーの下でゴールラインを越える必要があります。'}, // https://www.theifab.com/laws/latest/determining-the-outcome-of-a-match/
 {id:'trivia:ice-floating', statement:'普通の氷を水に入れると浮く。', answer:true, explanation:'同じ体積なら、氷は液体の水より軽いため、水に浮かびます。'}, // https://www.usgs.gov/water-science-school/science/water-density
 {id:'trivia:old-window-flow', statement:'古い窓ガラスの下が厚いのは、常温で長い時間をかけてガラスが流れたからだ。', answer:false, explanation:'常温で目に見えるほど流れることはありません。古いガラスに見られる厚さのばらつきは、主に製造時に生じたものです。'}, // https://web.engr.oregonstate.edu/~rochefow/Polymer%20Course%20Notes%202018/Zanotto%20-%20Do%20Cathedral%20Glasses%20Flow.pdf
 {id:'trivia:planet-saturn', statement:'土星の環には、水の氷でできた粒が多く含まれている。', answer:true, explanation:'遠くからは帯に見えますが、土星の環は主に水の氷の粒や岩のかけらが集まったものです。'}, // https://science.nasa.gov/saturn/facts/
 {id:'trivia:underwater-sound', statement:'同じ音でも、空気中より海水中のほうが速く伝わる。', answer:true, explanation:'条件にもよりますが、空気中では毎秒約340メートル、海水中では毎秒約1500メートルが目安です。'}, // https://oceanservice.noaa.gov/facts/sound.html
 {id:'trivia:bread-pan', statement:'食パンは英語で、ふつう「pan」と呼ぶ。', answer:false, explanation:'食パンなどのパンは英語では「bread」です。「pan」はフライパンなどの調理器具を表します。'},
 {id:'trivia:sleep-kanji', statement:'「目」を2つ横に並べると、そのまま漢字の「眠」になる。', answer:false, explanation:'「眠」は左の「目」と、右の「民」を組み合わせた漢字です。'}, // https://www.kanjipedia.jp/kanji/0006633100/

 // 生き物。Smithsonian、University of Hawaiʻi、Florida Museum、Missouri Department of Conservation。
 {id:'trivia:bat-flight', statement:'自力で羽ばたいて飛べる哺乳類は、コウモリの仲間だけだ。', answer:true, explanation:'ムササビなどは高い所から滑空します。コウモリは翼を羽ばたいて、高さを保ったり上昇したりできます。'}, // https://home.nps.gov/subjects/bats/how-bats-fly.htm
 {id:'trivia:goldfish-memory', statement:'金魚は、覚えたことを3秒ほどですべて忘れてしまう。', answer:false, explanation:'金魚は目印を頼りに場所を見つける課題などを学習できます。記憶は3秒で消えるわけではありません。'}, // https://pubmed.ncbi.nlm.nih.gov/15250808/
 {id:'trivia:butterfly-feet', statement:'チョウは足で味を感じられる。', answer:true, explanation:'足には化学物質を感じる器官があります。ナミアゲハのメスでは、卵を産む植物を見分けるのにも役立ちます。'}, // https://pmc.ncbi.nlm.nih.gov/articles/PMC6704861/
 {id:'trivia:seahorse-male', statement:'タツノオトシゴでは、オスが卵を受け取って子を産む。', answer:true, explanation:'メスがオスのおなかにある袋に卵を入れます。オスはそこで卵を育て、子が育つと袋から出します。'}, // https://ocean.si.edu/ocean-life/invertebrates/pregnant-seahorse
 {id:'trivia:chameleon-signal', statement:'カメレオンが体の色を変えるのは、背景に溶け込むためだけだ。', answer:false, explanation:'相手を威嚇したり、求愛したりするときにも色を変える種類がいます。'}, // https://news.asu.edu/content/asu-researchers-discover-chameleons-use-colorful-language-communicate
 {id:'trivia:electric-eel-family', statement:'デンキウナギは、ニホンウナギと同じウナギ目の魚だ。', answer:false, explanation:'デンキウナギは南米にすむギュムノート目の魚で、細長い姿がウナギに似ています。'}, // https://nationalzoo.si.edu/animals/electric-eel
 {id:'trivia:freshwater-jellyfish', statement:'クラゲは海にすむ生き物で、淡水で暮らす種類はいない。', answer:false, explanation:'湖や池などに出るマミズクラゲがいます。小さな傘を持ち、淡水で暮らします。'}, // https://mdc.mo.gov/discover-nature/field-guide/freshwater-jellyfish

 // 食べ物。University of Florida IFAS、農林水産省、エスビー食品、New Mexico State University。
 {id:'trivia:pineapple-flowers', statement:'パイナップル1個は、たくさんの花からできた実が合わさったものだ。', answer:true, explanation:'別々の花からできた小さな実がくっついて育ちます。表面にはその名残が模様として見えます。'}, // https://ask.ifas.ufl.edu/publication/MG055
 {id:'trivia:tea-plant', statement:'緑茶・ウーロン茶・紅茶は、同じ種類の植物の葉から作れる。', answer:true, explanation:'どれもチャの葉が原料です。葉の成分をどの程度酸化させるかなど、加工の違いで香りや味が変わります。'}, // https://www.maff.go.jp/j/pr/aff/2204/spe1_03.html
 {id:'trivia:pepper-plant', statement:'ブラックペッパーとホワイトペッパーは、どちらも同じ種類の植物の実が原料だ。', answer:true, explanation:'どちらもコショウの実です。黒こしょうは皮ごと乾燥させ、白こしょうは外側の皮を取り除きます。'}, // https://www.sbfoods.co.jp/sbsoken/jiten/search/detail/00017.html
 {id:'trivia:bread-dough-gas', statement:'パンの生地をふくらませる気体の一つは、酵母が出す二酸化炭素だ。', answer:true, explanation:'酵母は糖を分解する過程で二酸化炭素を出します。生地がその気体を閉じ込めると、中に気泡ができます。'}, // https://pubs.nmsu.edu/_e/E206/index.html

 // 物理と天気。USDA、ACS、NOAA、UCAR、University of Illinois Physics Van。
 {id:'trivia:boiling-mountain', statement:'気圧の低い高い山では、真水は海辺より低い温度で沸騰する。', answer:true, explanation:'水の蒸気圧が周囲の気圧と等しくなると沸騰します。気圧が低い場所では、海面近くより低い温度でその条件を満たします。'}, // https://ask.fsis.usda.gov/article/What-is-the-boiling-point-of-water
 {id:'trivia:cloud-vapor', statement:'雲の白く見える部分は、気体の水蒸気そのものだ。', answer:false, explanation:'気体の水蒸気は目に見えません。雲は小さな水滴や氷の粒が集まって見えます。'}, // https://www.weather.gov/source/zhu/ZHU_Training_Page/clouds/cloud_development/clouds.htm
 {id:'trivia:dry-ice-solid', statement:'ドライアイスは、固体の二酸化炭素である。', answer:true, explanation:'通常の気圧では、液体を経ず固体から気体になります。この変化を昇華と呼びます。'}, // https://nvlpubs.nist.gov/nistpubs/Legacy/LC/nbslettercircular286.pdf
 {id:'trivia:seawater-freezing', statement:'一般的な海水は、真水と同じように約0℃で凍り始める。', answer:false, explanation:'海水は塩分を含むため、真水より低い温度で凍ります。平均的な塩分の海水では約マイナス2℃が目安です。'}, // https://oceanservice.noaa.gov/facts/oceanfreeze.html
 {id:'trivia:room-fridge', statement:'部屋の中に放熱する家庭用冷蔵庫の扉を開けたまま運転すれば、閉め切った部屋全体を冷やせる。', answer:false, explanation:'冷蔵庫は中から取った熱を背面などに放出します。閉め切った同じ部屋では、さらに運転に使った電力も熱になります。'}, // https://van.physics.illinois.edu/ask/listing/6604
 {id:'trivia:spoon-temperature', statement:'温度が同じでも、金属のスプーンは木のスプーンより冷たく感じることがある。', answer:true, explanation:'金属は木より熱をよく伝えます。手より冷たい物を持つと、金属のほうが手から熱を速く受け取ります。'}, // https://van.physics.illinois.edu/ask/listing/44029
 {id:'trivia:heat-vacuum', statement:'何もない真空を通って、熱が伝わることはない。', answer:false, explanation:'光や赤外線などによる熱の伝わり方があります。太陽のエネルギーは、このしくみで宇宙空間を通って地球に届きます。'}, // https://openstax.org/books/college-physics-2e/pages/14-7-radiation

 // 宇宙。NASA Science の Moon、Mars、Uranus、Jupiter、Meteors 各解説。
 {id:'trivia:light-year-distance', statement:'光年は、時間ではなく距離を表す単位だ。', answer:true, explanation:'1光年は、光が真空中を1年かけて進む距離です。夜空の星までの距離などに使われます。'}, // https://science.nasa.gov/exoplanets/what-is-a-light-year/
 {id:'trivia:moon-no-spin', statement:'地球から月のほぼ同じ側が見えるのは、月が自転していないからだ。', answer:false, explanation:'月は自転しています。地球の周りを一周する間にほぼ一回転するため、同じ側を地球に向け続けます。'}, // https://science.nasa.gov/moon/facts/
 {id:'trivia:jupiter-red-storm', statement:'木星の大赤斑は、巨大な嵐だ。', answer:true, explanation:'木星の雲に見える赤っぽい楕円は、高速の風が渦を巻く嵐です。'}, // https://science.nasa.gov/jupiter/jupiter-facts/
 {id:'trivia:uranus-sideways', statement:'天王星は、自転の軸が横倒しに近い向きになっている。', answer:true, explanation:'太陽の周りを回る面に垂直な方向と比べて、自転の軸が約98度傾いています。'}, // https://science.nasa.gov/uranus/facts/
 {id:'trivia:martian-atmosphere', statement:'火星の地表を取り囲む大気は存在しない。', answer:false, explanation:'火星には地球よりかなり薄い大気があります。主な成分は二酸化炭素です。'}, // https://science.nasa.gov/mars/facts/
 {id:'trivia:meteor-glow', statement:'流れ星の光は、小さな石などが太陽の光を反射しているだけだ。', answer:false, explanation:'小さなちりや石が地球の大気に高速で突入すると、周りの空気や物質が熱くなって光の筋が見えます。'}, // https://science.nasa.gov/solar-system/meteors-meteorites/
 {id:'trivia:lunar-eclipse-shadow', statement:'皆既月食のとき、月は地球の影にすっぽり入る。', answer:true, explanation:'太陽・地球・月がほぼ一直線に並び、地球が太陽の光を遮ります。皆既月食は、月全体が地球の濃い影に入った状態です。'}, // https://science.nasa.gov/moon/eclipses/

 // 身近な技術。USB-IF の仕様書、MDN の画像形式・TLS の解説。
 {id:'trivia:usb-name', statement:'USBの「B」は、機器同士をつなぐ仕組みを表す「Bus」の頭文字だ。', answer:true, explanation:'USBは Universal Serial Bus の略です。パソコンと周辺機器などの間でデータをやり取りします。'}, // https://www.usb.org/sites/default/files/bwpaper2.pdf
 {id:'trivia:png-alpha', statement:'PNG形式の画像は、背景の一部を半透明にして保存できる。', answer:true, explanation:'PNGは透明度を記録できます。背景を完全に透明にしたり、影のように半透明にしたりできます。'}, // https://www.w3.org/TR/png/
 {id:'trivia:jpeg-resave', statement:'一般的なJPEG画像を低い画質設定で保存し直しても、画質は必ず元のままだ。', answer:false, explanation:'JPEGでは通常、圧縮時に画像の情報の一部を省きます。低い画質で保存し直すと、細かい模様などが失われることがあります。'}, // https://jpeg.org/jpeg/
 {id:'trivia:gif-still', statement:'GIF形式にすると、静止画1枚でも必ず動く画像になる。', answer:false, explanation:'GIFには、静止画1枚だけのものもあります。複数の画像を順に表示する設定でアニメーションになります。'}, // https://giflib.sourceforge.net/gifstandard/GIF89a.html
 {id:'trivia:https-operator', statement:'HTTPSのサイトに送った文章は、そのサイトの運営者にも読めない。', answer:false, explanation:'HTTPSは通信の途中を暗号化します。送信先のサイトは受け取ったデータを読み取れます。'}, // https://www.rfc-editor.org/rfc/rfc9110.html#name-https-uri-scheme

 // 地図・ゲーム。USGS の地図投影法、日本オセロ連盟の競技ルール。
 {id:'trivia:greenland-africa', statement:'メルカトル図法で大きく見えるグリーンランドは、実際の面積もアフリカ大陸より大きい。', answer:false, explanation:'実際にはアフリカのほうがずっと広いです。メルカトル図法では、赤道から離れた土地ほど面積が大きく見えます。'}, // https://www.govinfo.gov/content/pkg/GOVPUB-D-PURL-gpo213506/pdf/GOVPUB-D-PURL-gpo213506.pdf
 {id:'trivia:othello-first', statement:'日本オセロ連盟の競技ルールでは、白が最初の一手を打つ。', answer:false, explanation:'最初に打つのは黒です。そのあと白と黒が交互に打ち、置ける場所がなければ手番を渡します。'}, // https://www.othello.gr.jp/rule
 {id:'trivia:domino-28', statement:'0から6までの目を使う一般的なドミノは、1セット28枚だ。', answer:true, explanation:'0と0のように同じ目も使います。目の組み合わせを小さい方から数えると、7＋6＋5＋4＋3＋2＋1の28枚です。'},
 {id:'trivia:coin-after-streak', statement:'毎回独立に公平なコインを投げるとき、5回続けて表が出ると、次は裏が出る確率のほうが高くなる。', answer:false, explanation:'毎回の結果が独立なら、それまでの結果に関係なく、次の1回は表も裏も2分の1です。'},
 {id:'trivia:three-cubes-faces', statement:'同じ大きさの立方体3個を面でつなげてまっすぐ並べると、表面の小さな正方形は14面になる。', answer:true, explanation:'つなぐ前は6面が3個で18面です。2か所のつなぎ目で2面ずつ隠れるので、18から4を引きます。'},
 {id:'trivia:dice-sum-chances', statement:'公平な6面サイコロを2個、独立に振るとき、目の合計2と合計7は同じ出やすさだ。', answer:false, explanation:'2になるのは1と1だけです。7は1と6、2と5、3と4があり、左右の順を逆にした組も数えると6通りです。'},
 {id:'trivia:clock-speed-ratio', statement:'一般的な12時間表示の時計では、長針は短針の12倍の角度を同じ時間で進む。', answer:true, explanation:'長針が1周するのは1時間で、短針が1周するのは12時間です。'},
 {id:'trivia:discount-reverse', statement:'100円から2割引きした価格を2割上げると、ちょうど100円に戻る。', answer:false, explanation:'2割引きで80円になります。80円の2割は16円なので、2割上げても96円です。'},
 {id:'trivia:factorial-trailing-zeros', statement:'1から10までの整数をすべて掛けると、答えの末尾はちょうど2つの0で終わる。', answer:true, explanation:'末尾の0は因数の2と5の組でできます。5の因数は、5と10に一つずつあります。2の因数は十分あるので、末尾の0は2個です。'},
 {id:'trivia:scale-volume', statement:'直方体の縦・横・高さをすべて2倍にすると、体積は4倍になる。', answer:false, explanation:'体積は縦・横・高さの積です。それぞれが2倍になるので、2×2×2で8倍になります。'},
 // GS1 Japan https://www.gs1jp.org/code/jan/check_digit.html
 {
   id: 'trivia:jan-check-digit',
   statement: '商品のバーコードに添えられる13桁のJANコードでは、末尾の1桁は読み間違いを検出するためにある。',
   answer: true,
   explanation: '末尾は残り12桁から計算した数字です。読み取った数字で計算し直し、末尾と照合すると入力や読み取りの誤りを見つけられます。',
 },
 // USBC https://bowl.com/getmedia/cabf49db-8cc5-4ce4-abc0-dfca1a1d7706/USBC-Playing-Rules.pdf (Rule 2)
 {
   id: 'trivia:bowling-last-strike',
   statement: '一般的な10ピン制のボウリングで、最後のフレームの最初の投球がストライクなら、あと2投できる。',
   answer: true,
   explanation: 'ストライクには後の2投の点を加えます。第10フレームでは、その点を決めるために2投が追加されます。',
 },
 // GPS.gov https://www.gps.gov/gps-and-telling-time
 {
   id: 'trivia:gps-atomic-clocks',
   statement: 'GPSの衛星には、位置を求めるのに役立つ原子時計が載っている。',
   answer: true,
   explanation: '受信機は信号が届くまでの時間をもとに、衛星との距離を推定します。そのため衛星は、正確な時刻を伝えます。',
 },
 // NIDCD https://www.nidcd.nih.gov/health/how-do-we-hear
 {
   id: 'trivia:ear-three-bones',
   statement: '鼓膜の振動を耳の奥へ伝える途中に、小さな骨が3つ並んでいる。',
   answer: true,
   explanation: '中耳にあるツチ骨、キヌタ骨、アブミ骨が、鼓膜の振動を内耳へ伝えます。',
 },
 // PETボトルリサイクル推進協議会 https://www.petbottle-rec.gr.jp/basic/what.html
 {
   id: 'trivia:pet-bottle-material',
   statement: '「ペットボトル」のPETは、ボトルの素材の名前を略したものだ。',
   answer: true,
   explanation: 'PETはポリエチレンテレフタレートの略です。同じ素材は、衣類の繊維などにも使われます。',
 },
 // University of Minnesota https://open.lib.umn.edu/horticulture/chapter/10-2-unique-storage-organs/
 {
   id: 'trivia:potato-stem',
   statement: 'ジャガイモの食べる部分は、植物の分類では根ではなく茎が太ったものだ。',
   answer: true,
   explanation: '地下に伸びた茎の先が膨らみます。表面にある「芽」は、そこから新しい茎や葉が伸びる場所です。',
 },
 // USDA https://www.ars.usda.gov/southeast-area/dawson-ga/national-peanut-research-laboratory/docs/peanuts-101-the-basics/page-5/
 {
   id: 'trivia:peanut-underground-pods',
   statement: '落花生は地上で花を咲かせるが、さやは土の中で育つ。',
   answer: true,
   explanation: '花が受粉すると、付け根から伸びた部分が土にもぐります。その先で、食べる種が入ったさやが育ちます。',
 },
 // National Weather Service https://www.weather.gov/safety/lightning-science-overview
 {
   id: 'trivia:thunder-air-expansion',
   statement: '雷のゴロゴロという音は、雷で熱せられた空気が急に膨張することで生まれる。',
   answer: true,
   explanation: '雷の通り道に沿って空気が急に熱くなり、膨張します。そのときにできる圧力の波が雷鳴として聞こえます。',
 },
 // FIBA https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2024-v10a.pdf (2.4.4)
 {
   id: 'trivia:basketball-three-point-line',
   statement: 'バスケットボールの国際ルールでは、3ポイントラインを踏んで床から放ったシュートが入ると3点になる。',
   answer: false,
   explanation: '3ポイントラインは3点のエリアに含まれません。ラインを踏んで放ったフィールドゴールは2点です。',
 },
 {
   id: 'trivia:coin-around-coin',
   statement: '同じ大きさの硬貨を2枚平らに置き、一方を固定して他方を滑らず外周に沿って一周させると、転がした硬貨は1回転する。',
   answer: false,
   explanation: '転がる硬貨の中心は、硬貨の半径の2倍の円を一周します。その距離は硬貨の円周の2倍なので、硬貨は2回転します。',
 },
 // University of Alaska Fairbanks https://www.gi.alaska.edu/index.php/alaska-science-forum/more-spirals
 {
   id: 'trivia:drain-hemisphere',
   statement: '浴槽の排水の渦は、北半球と南半球で必ず反対向きになる。',
   answer: false,
   explanation: '家庭の浴槽では、流す前の水の動きや容器・排水口の形が大きく影響します。半球だけで渦の向きは決まりません。',
 },
 // ダイキン工業 https://www.ac.daikin.co.jp/info/announce/drain
 {
   id: 'trivia:ac-drain-refrigerant',
   statement: '冷房中、エアコンの排水ホースから普通に出る水は、エアコンの中の冷媒が液体になったものだ。',
   answer: false,
   explanation: '室内の空気が冷やされると、その中の水蒸気が水滴になります。排水ホースはこの結露水を外へ流します。',
 },
 // Gemological Institute of America https://www.gia.edu/gia-news-research/how-protect-diamond-chipping
 {
   id: 'trivia:diamond-never-chips',
   statement: 'ダイヤモンドは傷が付きにくいので、強い衝撃を受けても欠けることはない。',
   answer: false,
   explanation: '引っかき傷への強さと、衝撃に対する強さは別の性質です。ダイヤモンドも当たり方によって欠けることがあります。',
 },
 {
   id: 'trivia:a-paper-ratio-halving',
   statement: 'A判の用紙は、長辺が半分になるように切ると、短辺と長辺の比が大きく変わるように設計されている。',
   answer: false,
   explanation: '設計上の縦横比は1対√2です。長い辺だけを半分にすると元の短辺が新しい長辺になり、縦横比は再び1対√2になります。',
 },
 // NASA https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/
 {
   id: 'trivia:iss-zero-gravity',
   statement: '国際宇宙ステーションで人が浮くのは、地球の重力がほとんど届かない高さにいるからだ。',
   answer: false,
   explanation: '地球の重力はその高さでも強く働きます。宇宙飛行士も宇宙ステーションも一緒に地球の周りを落ち続けるため、浮いて見えます。',
 },
 // Cambridge Dictionary https://dictionary.cambridge.org/dictionary/english/inflammable
 {
   id: 'trivia:english-inflammable',
   statement: '英語の inflammable は、flammable に「否定」を付けた「燃えにくい」という意味だ。',
   answer: false,
   explanation: 'flammable と inflammable はどちらも「燃えやすい」です。燃えないことを示す語は non-flammable です。',
 },
 ...extraTriviaQuestions,
];
