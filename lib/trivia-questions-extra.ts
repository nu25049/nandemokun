export const extraTriviaQuestions: ReadonlyArray<{
  id: string;
  statement: string;
  answer: boolean;
  explanation: string;
}> = [
  // NOAA https://oceanservice.noaa.gov/facts/highestpoint.html
  {
    id: "trivia:mauna-kea-base",
    statement: "海底のふもとから測ると、マウナ・ケアはエベレストより高い。",
    answer: true,
    explanation: "ハワイのマウナ・ケアは海底のふもとから山頂まで約1万m。海面を基準にした標高ではエベレストが上です。",
  },
  // UNESCO https://whc.unesco.org/en/list/754/
  {
    id: "trivia:baikal-depth",
    statement: "世界で最も深い湖は、ロシアにあるバイカル湖だ。",
    answer: true,
    explanation: "バイカル湖は、水面から湖底までの深さが最深部で1,600mを超えます。",
  },
  // 札幌市 https://www4.city.sapporo.jp/global/english/outline/
  // Météo-France https://donneespubliques.meteofrance.fr/metadonnees_publiques/fiches/fiche_75114001.pdf
  {
    id: "trivia:paris-north-of-sapporo",
    statement: "パリは札幌よりも北にある。",
    answer: true,
    explanation: "パリは北緯約49度、札幌は約43度です。緯度の数字が大きいパリのほうが北にあります。",
  },
  // マカパ市 https://macapa.ap.gov.br/tradicao-na-amazonia-conheca-a-historia-da-cidade-do-meio-mundo/
  {
    id: "trivia:brazil-equator",
    statement: "赤道はブラジルの国土を通っている。",
    answer: true,
    explanation: "赤道はブラジル北部を横切ります。赤道付近の都市マカパには、それを示す記念碑もあります。",
  },
  // NASA https://www.nasa.gov/frequently-asked-questions-about-antarctica/
  // Woods Hole Oceanographic Institution https://divediscover.whoi.edu/polar-regions/antarctica-the-frozen-continent-2/
  // University of Maryland https://aosc.umd.edu/news/sahara-desert-expanding
  {
    id: "trivia:sahara-largest-all-deserts",
    statement: "寒い地域も含めると、地球で最も大きい砂漠はサハラ砂漠だ。",
    answer: false,
    explanation: "最大なのは降水量が少ない南極の砂漠です。サハラ砂漠は暑い砂漠の中で最大です。",
  },
  // Government of Canada https://www.canada.ca/en/services/environment/our-environment/nature-based-climate-solutions/coastlines.html
  {
    id: "trivia:canada-arctic-coast",
    statement: "カナダが面している大洋は、大西洋と太平洋の2つだけだ。",
    answer: false,
    explanation: "カナダは北極海にも面しています。北部には北極海に浮かぶ島々もあります。",
  },
  // Australian Government https://www.dfat.gov.au/about-australia
  // NSW Government https://www.nsw.gov.au/about-nsw/key-facts-about-nsw
  {
    id: "trivia:sydney-capital",
    statement: "オーストラリアの首都はシドニーだ。",
    answer: false,
    explanation: "首都はキャンベラです。シドニーはニューサウスウェールズ州の州都です。",
  },
  // NASA Earth Observatory https://science.nasa.gov/earth/earth-observatory/dead-sea-6136/
  {
    id: "trivia:dead-sea-open-ocean",
    statement: "死海に塩分が多いのは、外洋から海水が流れ込むからだ。",
    answer: false,
    explanation: "死海は外洋につながっていない塩湖です。川などから入った水が蒸発し、塩分が残ります。",
  },
  // San Diego Zoo https://animals.sandiegozoo.org/animals/giraffe
  // OpenStax https://openstax.org/books/anatomy-and-physiology-2e/pages/7-3-the-vertebral-column
  {
    id: "trivia:giraffe-neck-bones",
    statement: "キリンの首の骨の数は、人間と同じだ。",
    answer: true,
    explanation: "キリンも人間も、通常は首の骨である頸椎が7個です。キリンは一つひとつの頸椎が縦に長いのです。",
  },
  // University of Adelaide https://digital.library.adelaide.edu.au/items/ad4f9181-6877-4d5b-bcf9-55a0446bd65b/full
  // San Diego Zoo Wildlife Alliance https://ielc.libguides.com/sdzg/factsheets/koala/characteristics
  {
    id: "trivia:koala-fingerprints",
    statement: "コアラの指には、人間のような指紋がある。",
    answer: true,
    explanation: "コアラの指先にも細かな隆起があり、渦や弧を描く模様が人間の指紋とよく似ています。",
  },
  // NOAA https://oceanservice.noaa.gov/facts/coral_bleach.html
  {
    id: "trivia:coral-bleaching",
    statement: "海水温が高くなりすぎると、サンゴは共生する藻を失って白くなることがある。",
    answer: true,
    explanation: "水温などのストレスで藻がいなくなり、白い骨格が透けて見えます。サンゴの白化と呼ばれます。",
  },
  // Smith et al., PNAS https://pmc.ncbi.nlm.nih.gov/articles/PMC8346884/
  {
    id: "trivia:honeycomb-hexagon",
    statement: "ミツバチの巣に並ぶ小部屋の多くは、正面から見ると六角形だ。",
    answer: true,
    explanation: "六角形の部屋をすき間なく並べます。巣の端やつなぎ目には、五角形や七角形の部屋が混じることもあります。",
  },
  // San Diego Zoo https://animals.sandiegozoo.org/animals/camel
  {
    id: "trivia:camel-hump-water",
    statement: "ラクダのこぶには、飲み水がたまっている。",
    answer: false,
    explanation: "こぶに蓄えているのは脂肪です。食べ物が少ないときのエネルギー源になります。",
  },
  // San Diego Zoo https://animals.sandiegozoo.org/animals/owl
  {
    id: "trivia:owl-full-turn",
    statement: "フクロウは体を動かさずに、頭だけを一周させられる。",
    answer: false,
    explanation: "多くのフクロウは、頭を左右それぞれに最大約270度まで回せます。一方向に360度回して一周することはできません。",
  },
  // Smithsonian's National Zoo https://nationalzoo.si.edu/animals/ostrich
  {
    id: "trivia:ostrich-head-in-sand",
    statement: "ダチョウは危険を感じると、頭を砂に埋めて隠れる。",
    answer: false,
    explanation: "ダチョウが頭を砂に埋めて隠れる習性はありません。巣で卵を転がすとき、頭を地面近くに下げることが、この言い伝えの由来の一つと考えられています。",
  },
  // Animal Diversity Web https://animaldiversity.org/accounts/Lagomorpha/
  {
    id: "trivia:rabbit-rodent",
    statement: "前歯が伸び続けるウサギは、ネズミと同じげっ歯類だ。",
    answer: false,
    explanation: "ウサギはウサギ目、ネズミはげっ歯目に属します。ウサギには上の大きな前歯の後ろに、小さな前歯がもう1組あります。",
  },
  // Royal Botanic Gardens, Kew https://www.kew.org/read-and-watch/vanilla-digitisation
  {
    id: "trivia:vanilla-orchid",
    statement: "天然のバニラエキスは、ランの仲間の実から作られる。",
    answer: true,
    explanation: "バニラはラン科の植物です。エキスは、収穫後に香りを引き出す加工を施した細長い実から作ります。",
  },
  // University of Florida IFAS https://ask.ifas.ufl.edu/publication/HS377.pdf
  {
    id: "trivia:cashew-apple-seed",
    statement: "カシューナッツは、リンゴのような見た目の部分の外側に付いてできる。",
    answer: true,
    explanation: "「カシューアップル」と呼ばれるふくらみの先に、硬い殻を持つ実が付きます。食べるナッツはその殻の中の種です。",
  },
  // University of Missouri Extension https://ipm.missouri.edu/meg/2019/11/popcorn/
  {
    id: "trivia:popcorn-steam",
    statement: "ポップコーンの粒をはじけさせるのは、粒の中で生まれる水蒸気だ。",
    answer: true,
    explanation: "粒の中の水分が加熱で水蒸気になり、圧力が高まって皮が破れます。そのとき中のでんぷんが一気に膨らみます。",
  },
  // 農林水産省 https://www.maff.go.jp/j/pr/aff/2406/spe1_04.html
  {
    id: "trivia:yogurt-lactic-acid",
    statement: "ヨーグルトを作るとき、乳酸菌は牛乳に含まれる乳糖を利用する。",
    answer: true,
    explanation: "乳酸菌は乳糖を利用して乳酸を作ります。乳酸が増えると酸味が出て、牛乳のたんぱく質が固まります。",
  },
  // NC State Extension https://plants.ces.ncsu.edu/plants/eutrema-japonicum/
  // University of Wisconsin Extension https://hort.extension.wisc.edu/articles/horseradish-armoracia-rusticana/
  {
    id: "trivia:wasabi-horseradish-species",
    statement: "本わさびと西洋わさびは、名前が違うだけで同じ植物だ。",
    answer: false,
    explanation: "どちらもアブラナ科ですが、別の植物です。西洋わさびはホースラディッシュとも呼ばれます。",
  },
  // USDA https://www.ams.usda.gov/grades-standards/dried-prunes-grades-standards
  // USDA https://www.ams.usda.gov/sites/default/files/media/Raisin_Standard.pdf
  {
    id: "trivia:prune-grape",
    statement: "ドライプルーンは、ブドウの一種を乾燥させたものだ。",
    answer: false,
    explanation: "ドライプルーンは、乾燥に適したスモモで作ります。乾燥させたブドウはレーズンと呼ばれます。",
  },
  // New Zealand Ministry for Culture and Heritage https://nzhistory.govt.nz/chinese-gooseberry-becomes-kiwifruit
  {
    id: "trivia:kiwi-fruit-origin",
    statement: "キウイフルーツは、もともとニュージーランドに自生していた果物だ。",
    answer: false,
    explanation: "原産地は中国です。ニュージーランドで栽培・輸出が広がり、キウイフルーツという名前が定着しました。",
  },
  // USDA https://www.ams.usda.gov/sites/default/files/media/AA20380_Honey.pdf
  {
    id: "trivia:honey-crystals-added-sugar",
    statement: "はちみつが白くザラザラに固まるのは、砂糖が足されたときだけだ。",
    answer: false,
    explanation: "はちみつにもともと含まれるブドウ糖が結晶になることがあります。砂糖を加えなくても起こる変化です。",
  },
  // USGS https://www.usgs.gov/water-science-school/science/water-density
  {
    id: "trivia:water-density-four-degrees",
    statement: "純粋な水は、凍る寸前よりも約4℃のときのほうが密度が高い。",
    answer: true,
    explanation: "通常の気圧では、約4℃の水が最も密です。これより冷えると、水は凍る前から少しずつ膨張します。",
  },
  // Smithsonian National Air and Space Museum https://howthingsfly.si.edu/gravity-air/buoyancy
  {
    id: "trivia:balloon-warm-air-density",
    statement: "熱気球が浮くのは、中の空気を温めると外の空気より密度が低くなるからだ。",
    answer: true,
    explanation: "気圧が同じなら、温かい空気は同じ体積の冷たい空気より軽くなります。外の空気を押しのけて生じる浮力が、気球全体の重さを上回ると浮き上がります。",
  },
  // Philips https://www.philips.com/c-dam/corporate/research/technologies/cd/The-Emergence-of-the-Compact-Disc_v2.pdf
  {
    id: "trivia:cd-laser",
    statement: "音楽CDのデータを読み取るときは、盤面にレーザーを当てる。",
    answer: true,
    explanation: "CDプレーヤーはレーザーの反射の変化を読み取ります。針を溝に当てるレコードとは、読み取り方が違います。",
  },
  // Georgia State University https://hyperphysics.gsu.edu/hbase/Sound/dopp.html
  {
    id: "trivia:siren-moving-away",
    statement: "一定の高さで鳴るサイレンが通り過ぎると、近づくときより音が低く聞こえる。",
    answer: true,
    explanation: "離れていくと音の波が間隔を空けて届き、音が低く聞こえます。これをドップラー効果といいます。",
  },
  // University of Illinois Physics Van https://van.physics.illinois.edu/ask/listing/440
  {
    id: "trivia:aluminum-fridge-magnet",
    statement: "冷蔵庫に貼る磁石は、鋼板と同じようにアルミ板にもくっつく。",
    answer: false,
    explanation: "アルミは普通の磁石に強く引かれません。鋼板には付く磁石も、アルミ板を近づけるだけでは付きません。",
  },
  // Nobel Prize Outreach https://www.nobelprize.org/alfred-nobel/
  // International Mathematical Union https://www.mathunion.org/imu-awards/fields-medal
  {
    id: "trivia:nobel-math-category",
    statement: "ノーベル賞には、数学の部門がある。",
    answer: false,
    explanation: "ノーベル賞に数学部門はありません。数学の業績をたたえるフィールズ賞は、国際数学連合が授与する別の賞です。",
  },
  // U.S. National Weather Service https://www.weather.gov/safety/lightning-myths
  {
    id: "trivia:lightning-same-spot",
    statement: "同じ場所に雷が二度落ちることはない。",
    answer: false,
    explanation: "雷は同じ場所にも繰り返し落ちます。高い建造物が何度も雷を受けるのはその一例です。",
  },
  // U.S. Department of Energy https://www.energy.gov/documents/energysavingslightemittingdiodesnichelightingappspdf
  {
    id: "trivia:led-filament",
    statement: "LED電球は、白熱電球と同じように細い金属線を熱して光る。",
    answer: false,
    explanation: "LEDは半導体に電流を流すと光を出します。金属線を熱して光らせるのは白熱電球の仕組みです。",
  },
  // 小学館『精選版 日本国語大辞典』 https://kotobank.jp/word/%E7%A9%BA%E3%81%8A%E3%81%91-3209432
  // 全国カラオケ事業者協会 https://www.karaoke.or.jp/03nenpyo/shogen2.php
  {
    id: "trivia:karaoke-etymology",
    statement: "「カラオケ」の「オケ」は「オーケストラ」を縮めたものだ。",
    answer: true,
    explanation: "「空」の「カラ」と「オーケストラ」の「オケ」を合わせた言葉です。「オケ」だけでオーケストラを指すこともあります。",
  },
  // MIT Press https://thereader.mitpress.mit.edu/origin-word-robot-rur/
  // Karel Čapek Memorial https://karelcapek.cz/en/film-adaptation-karel-capek
  {
    id: "trivia:robot-czech-play",
    statement: "「ロボット」という言葉が世界に広まるきっかけは、チェコの戯曲だった。",
    answer: true,
    explanation: "カレル・チャペックの戯曲『R.U.R.』に登場した言葉です。この作品が各国で上演され、広く知られるようになりました。",
  },
  // Badminton World Federation https://system.bwfbadminton.com/documents/folder_1_81/Statutes/CHAPTER-4---RULES-OF-THE-GAME/SECTION%204.1-%20Laws%20of%20Badminton.pdf (Law 13.3.1)
  {
    id: "trivia:badminton-boundary-in",
    statement: "バドミントンでは、シャトルが有効範囲を示すライン上に落ちるとインになる。",
    answer: true,
    explanation: "ライン自体もコートの有効範囲に含まれます。ラインの外側に落ちるとアウトです。",
  },
  // International Table Tennis Federation https://db.ittf.com/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_clean.pdf (Law 2.9.1.1)
  {
    id: "trivia:table-tennis-serve-net",
    statement: "卓球で、ほかの条件を満たしたサーブがネットに触れて相手側に入ったら、サーブをやり直す。",
    answer: true,
    explanation: "この場合は「レット」となり、点数を変えずにサーブをやり直します。",
  },
  // Cambridge Dictionary https://dictionary.cambridge.org/us/dictionary/english/mansion
  {
    id: "trivia:english-mansion",
    statement: "英語で mansion は、日本語の「マンション」と同じく一般的な集合住宅を指す。",
    answer: false,
    explanation: "英語の mansion は、豪華で大きな邸宅を表します。日本語でいう一般的なマンションとは指すものが異なります。",
  },
  // Cambridge Dictionary https://dictionary.cambridge.org/dictionary/english/consent
  // Cambridge Dictionary https://dictionary.cambridge.org/dictionary/english/electrical-outlet
  {
    id: "trivia:english-consent-outlet",
    statement: "電源の「コンセント」は、英語でも consent と呼ぶ。",
    answer: false,
    explanation: "英語の consent は「同意」や「許可」です。電源の差し込み口は米国では electrical outlet、英国では power point などと呼びます。",
  },
  // U.S. National Institute on Deafness and Other Communication Disorders https://www.nidcd.nih.gov/sites/default/files/Documents/health/hearing/american-sign-language-2020.pdf
  {
    id: "trivia:sign-language-universal",
    statement: "アメリカ手話とイギリス手話は、どちらも英語圏なので同じ言語だ。",
    answer: false,
    explanation: "同じ英語圏でも、アメリカ手話とイギリス手話は別の言語です。手話は、話し言葉の違いと同じ分かれ方をするとは限りません。",
  },
  // FIVB https://www.fivb.com/volleyball/the-game/basic-rules/
  {
    id: "trivia:volleyball-block-touch",
    statement: "室内の6人制バレーボールでは、ブロックに触れた後、そのチームはあと2回までしかボールに触れられない。",
    answer: false,
    explanation: "ブロックの接触はチームの3回に数えません。ブロックに触れた後でも、チームは最大3回で返せます。",
  },
  // ITTF https://db.ittf.com/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_clean.pdf (Laws 2.11.1 and 2.13.3)
  {
    id: "trivia:table-tennis-deuce-service",
    statement: "卓球で10対10になった後は、サーブを1点ごとに交代する。",
    answer: true,
    explanation: "通常の交代は2点ごとです。10対10以降は1点ごとに交代し、2点差がつくまで続けます。",
  },
  {
    id: "trivia:binary-one-tenth",
    statement: "10進法の0.1は、2進法でも有限小数で表せる。",
    answer: false,
    explanation: "2進法の有限小数は、分数にすると分母を2の累乗にできます。0.1は10分の1で、分母の5を消せないため、2進法では数字が繰り返します。",
  },
  // FIDE https://handbook.fide.com/chapter/E012023 (Laws 3.7.3.1–3.7.3.2)
  {
    id: "trivia:chess-en-passant-turn",
    statement: "チェスの「アンパッサン」で相手のポーンを取れるのは、相手がそのポーンを2マス進めた直後の1手だけだ。",
    answer: true,
    explanation: "自分のポーンの横に相手のポーンが2マス進んできた場合、条件を満たせば1マス進んだかのように取れます。別の手を指すとその機会はなくなります。",
  },
  {
    id: "trivia:digit-nine-tens-ones",
    statement: "1から100までの整数では、十の位が9の数のほうが、一の位が9の数より多い。",
    answer: false,
    explanation: "十の位が9なのは90〜99で10個。一の位が9なのは9、19、…、99でこちらも10個です。",
  },
  {
    id: "trivia:right-triangle-diameter",
    statement: "直角三角形の一番長い辺を直径にした円は、直角の頂点も通る。",
    answer: true,
    explanation: "長い辺の中点を中心に、三角形を半回転した形を重ねずに合わせると長方形になります。長方形の4つの角は中心から等距離なので、同じ円の上にあります。",
  },
  {
    id: "trivia:polyhedra-six-vertices",
    statement: "頂点が6つの立体なら、どんな形でも面の数は同じだ。",
    answer: false,
    explanation: "三角柱は頂点が6つで面が5つです。正八面体も頂点は6つですが、面は8つあります。",
  },
  {
    id: "trivia:odd-prime-sum",
    statement: "2より大きい素数を二つ選んで足すと、答えは素数にならない。",
    answer: true,
    explanation: "2より大きい素数はどれも奇数です。奇数を二つ足すと2より大きい偶数になり、2で割り切れます。",
  },
  {
    id: "trivia:cube-eight-hidden",
    statement: "同じ大きさの立方体8個を2×2×2に積むと、表面に出ない立方体が1個ある。",
    answer: false,
    explanation: "2×2×2では8個とも大きな立方体の角にあり、表に3面ずつ出ます。3×3×3なら中央の1個が表に出ません。",
  },
  {
    id: "trivia:paper-corner-cut",
    statement: "正方形の紙の角を一つ、まっすぐな切り口で小さく切り落とすと、残りの紙の角は5つになる。",
    answer: true,
    explanation: "もとの角が一つなくなり、切り口の両端に新しい角が一つずつできます。4−1＋2で5つです。",
  },
  {
    id: "trivia:rectangle-perimeter-area",
    statement: "同じ長さのひもで作った長方形なら、縦横の比を変えても囲む面積は同じだ。",
    answer: false,
    explanation: "16cmのひもなら、縦3cm・横5cmでも、縦2cm・横6cmでも囲めます。面積はそれぞれ15平方cmと12平方cmです。",
  },
  {
    id: "trivia:english-cat-palindrome",
    statement: "「Was it a cat I saw?」は、空白と記号を除いて小文字にすると逆からも同じに読める。",
    answer: true,
    explanation: "続けて書くと「wasitacatisaw」です。最初と最後から一文字ずつ比べると、中心のcまで文字が対になっています。",
  },
  {
    id: "trivia:average-round-trip-speed",
    statement: "同じ道を行きは時速2km、帰りは時速6kmで進むと、往復の平均は時速4kmになる。",
    answer: false,
    explanation: "片道6kmなら行きは3時間、帰りは1時間。往復12kmを4時間で進むので平均は時速3kmです。",
  },
  {
    id: "trivia:permuted-three-digit-sum",
    statement: "異なる三つの1〜9の数字から作れる6通りの3桁の数を足すと、必ず222の倍数になる。",
    answer: true,
    explanation: "各数字が百・十・一の位に2回ずつ現れます。各数字には合計で200＋20＋2が掛かるので、答えは三つの数字の合計を222倍した値です。",
  },
  {
    id: "trivia:circle-three-cuts",
    statement: "円い紙に直線を3本引き、その線に沿って切ると、最大8片に分けられる。",
    answer: false,
    explanation: "1本目で2片になります。2本目は先の線と交わって最大2片、3本目は先の2本と交わって最大3片を新たに増やします。最大で2＋2＋3＝7片です。",
  },
  {
    id: "trivia:dice-not-doubles",
    statement: "公平な6面サイコロを2個振ると、違う数字が出る確率は同じ数字が出る確率の5倍だ。",
    answer: true,
    explanation: "1個目の数字が何でも、2個目には同じ数字が1面、違う数字が5面あります。だから確率は1対5です。",
  },
  // FIDE https://handbook.fide.com/chapter/E012023 (Law 1.4.1)
  {
    id: "trivia:chess-king-capture",
    statement: "チェスのチェックメイトでは、相手のキングを盤から取り除いて勝つ。",
    answer: false,
    explanation: "攻撃されているキングを合法手で救えない状態になった時点で勝敗が決まります。相手のキングを取る手はありません。",
  },
];
