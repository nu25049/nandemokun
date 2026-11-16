import type {TriviaFact} from './trivia-facts';

export const extraTriviaFacts: readonly TriviaFact[] = [
 // 食べ物の名前と形
 {
  id: 'calpis-milky-way',
  title: 'カルピスの水玉は天の川がモチーフ',
  detail: 'カルピスが初めて発売された日は7月7日。七夕にちなみ、包装の水玉は夜空の天の川をイメージして作られました。'
 }, // https://www.asahiinryo.co.jp/rd/note/calpis100th.html
 {
  id: 'kewpie-big-yu',
  title: 'キユーピーは「ユ」が大きく、読むときはキューピー',
  detail: '社名も商品名も、小さな「ュ」にせず「キユーピー」と書きます。声に出すときは「きゅーぴー」です。'
 }, // https://lp.kewpie.co.jp/customer/faq/other/
 {
  id: 'chicken-ramen-tempura',
  title: 'チキンラーメンの発明のヒントは天ぷら',
  detail: '開発中だった安藤百福は、天ぷらを揚げる様子を見てひらめきました。麺を乾燥させる方法に、揚げると水分が抜けるしくみを応用しました。'
 }, // https://www.nissin.com/jp/company/chronicle/
 {
  id: 'cup-middle',
  title: 'カップヌードルの麺は、底まで落ちないようにしてある',
  detail: '麺のかたまりをカップの底より大きく作り、途中で固定しています。運んでいる間に麺が動きにくく、すき間を通ってお湯が麺の下にも回ります。'
 }, // https://www.nissin.com/jp/about/history/topics/524
 {
  id: 'glico-finish',
  title: 'グリコのゴールの絵は、小学生の人気投票で決まった',
  detail: '両手を上げてゴールするマークは、近隣の小学校で何度も人気投票をして選ばれました。'
 }, // https://www.glico.com/jp/100th_history_contents/highlight/product/001.html
 {
  id: 'takoyaki-radio',
  title: 'たこ焼きには「ラヂオ焼き」という前身がある',
  detail: '大阪の会津屋では、肉やこんにゃくを入れた丸いラヂオ焼きを販売していました。タコを入れたものが、たこ焼きの始まりだと伝えています。'
 }, // https://www.aiduya.com/original/
 {
  id: 'kinpira-story',
  title: 'きんぴらの名前は、物語の力持ちに由来するとされる',
  detail: '江戸時代の物語に登場する坂田金平が由来の一説です。金平は、金太郎で知られる坂田金時の息子という設定でした。'
 }, // https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/34_27_tokyo.html
 {
  id: 'kikkoman-turtle',
  title: 'キッコーマンの六角形はカメの甲羅をかたどっている',
  detail: '「キッコー」は甲羅の模様を表す「亀甲」。マークの中の「萬」は、カメは万年という言い伝えにちなみます。'
 }, // https://www.kikkoman.co.jp/homecook/kids/hatena.html
 {
  id: 'coke-cacao-bottle',
  title: 'コカ・コーラの瓶の形にはカカオの実がヒントになった',
  detail: 'デザインを担当したガラス会社のチームが、図書館で見つけた細長く筋のあるカカオのイラストを手がかりにしました。'
 }, // https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle
 {
  id: 'pocky-handle',
  title: 'ポッキーは端にチョコをかけないようにして生まれた',
  detail: '最初は全体をチョコで包む案もありました。片側にチョコをかけないことで、手を汚さず持てる部分ができました。'
 }, // https://www.glico.com/jp/100th_history_contents/highlight/product/006.html
 // 音とアート
 {
  id: 'violin-horsehair',
  title: 'バイオリンの弓には馬のしっぽの毛が使われる',
  detail: '一般的な弓では、馬の尾の毛を束ねて張ります。ヤマハの解説では、バイオリンの弓1本につき160〜180本ほどです。'
 }, // https://www.yamaha.com/en/musical_instrument_guide/violin/mechanism/mechanism003.html
 {
  id: 'sax-parts',
  title: 'サックスには約600個の部品が使われる',
  detail: '管とキーのほかに、キーを戻すばねや、穴をふさぐパッドもあります。ヤマハは、これらを合わせて約600個と紹介しています。'
 }, // https://www.yamaha.com/en/musical_instrument_guide/saxophone/mechanism/
 {
  id: 'oboe-double-reed',
  title: 'オーボエの吹き口では薄い板が2枚震える',
  detail: '息を吹き込むと、向かい合った2枚の薄い板が振動します。2枚の板を使う吹き口を「ダブルリード」と呼びます。'
 }, // https://www.yamaha.com/en/musical_instrument_guide/oboe/mechanism/mechanism002.html
 {
  id: 'trombone-positions',
  title: 'トロンボーンはスライドを止めたまま、いくつもの音を出せる',
  detail: '基本のスライド位置は7つ。位置を一つに決めても、唇の振動のしかたを変えて、いくつかの高さの音を出せます。'
 }, // https://www.yamaha.com/ja/musical_instrument_guide/trombone/mechanism/mechanism004.html
 {
  id: 'timpani-pedal-pitch',
  title: '足で音の高さを変えられる太鼓がある',
  detail: 'ペダル式のティンパニでは、足元のペダルで膜を張る強さが変わります。膜を強く張ると、同じ太鼓から高い音が出ます。'
 }, // https://www.yamaha.com/ja/musical_instrument_guide/timpani/mechanism/mechanism002.html
 {
  id: 'hokusai-fuji',
  title: '北斎の大波の版画には小さな富士山がある',
  detail: '『神奈川沖浪裏』は海の波が目立ちますが、波の奥には小さな三角の富士山が描かれています。『富嶽三十六景』の一枚です。'
 }, // https://www.metmuseum.org/art/collection/search/45434
 {
  id: 'mona-lisa-wood',
  title: '『モナ・リザ』はポプラの板に描かれた',
  detail: 'ルーヴル美術館の作品記録では、レオナルド・ダ・ヴィンチが油絵を描いた土台はポプラの木の板です。'
 }, // https://collections.louvre.fr/en/ark:/53355/cl010062370
 {
  id: 'dali-small-canvas',
  title: '溶けた時計で有名なダリの絵は、横幅が33cmほど',
  detail: '『記憶の固執』のキャンバスは縦24.1cm、横33cm。大きな画集で見慣れた絵も、原画は机に置けそうな大きさです。'
 }, // https://www.moma.org/collection/works/79018
 {
  id: 'starry-night-day',
  title: 'ゴッホは夜空を描いた『星月夜』を昼間に制作した',
  detail: '窓から見た夜明け前の景色が着想になりました。ニューヨーク近代美術館によると、絵を描いたのは昼間の何回かにわたる作業でした。'
 }, // https://www.moma.org/collection/works/79802
 {
  id: 'rosetta-three-scripts',
  title: 'ロゼッタ石では、同じ布告が3種類の文字で読める',
  detail: '上から古代エジプトの象形文字、別のエジプト文字であるデモティック、ギリシャ文字が並びます。この比較が文字の解読を助けました。'
 }, // https://www.britishmuseum.org/sites/default/files/2023-11/Room-4-Touch-Tour-Guide.pdf
 // 身近なものの意外な設計
 {
  id: 'bubble-wrap-wallpaper',
  title: 'プチプチでおなじみの緩衝材は、壁紙を作る試みから生まれた',
  detail: '空気の粒が並ぶ素材を、凹凸のある壁紙に使う案がありました。のちに荷物を衝撃から守る梱包材として広まりました。'
 }, // https://www.sealedair.com/products/brand/bubble-wrap
 {
  id: 'velcro-burrs',
  title: '面ファスナーのヒントは、服にくっつく植物の実',
  detail: '発明者は、服や犬の毛に付いた実を見て、小さなかぎが繊維に引っかかる仕組みに注目しました。'
 }, // https://www.velcro.com/original-thinking/our-story/
 {
  id: 'frixion-cold',
  title: '消したフリクションの文字は、強く冷やすと色が戻ることがある',
  detail: 'こすると摩擦熱でインクが透明になります。メーカーによると、マイナス20℃ほどでは透明になった色が戻ります。'
 }, // https://www.pilot.co.jp/library/006/
 {
  id: 'tetra-pak-shape',
  title: 'テトラパックの「テトラ」は最初の容器の形にちなむ',
  detail: '最初の紙容器は、三角形4枚で囲まれた四面体でした。四面体の英語名 tetrahedron が名前の元です。'
 }, // https://www.tetrapak.com/en-eg/about-tetra-pak/news-and-events/logotypes
 {
  id: 'suica-suisui',
  title: 'Suicaの名前には「スイスイ通れる」という意味がある',
  detail: 'JR東日本は名前を「スイスイ行けるICカード」の意味と紹介しています。改札機を通るときの動きを思わせる名前です。'
 }, // https://www.jreast.co.jp/youran/pdf/jre_youran_all.pdf
 {
  id: 'five-yen-no-hole',
  title: '穴がない5円硬貨も作られていた',
  detail: '戦後の最初の5円黄銅貨には穴がなく、国会議事堂が描かれていました。1949年に穴のある型に変わり、稲穂が表に入りました。'
 }, // https://www.boj.or.jp/note_tfjgs/note/valid/past_issue/pcoin_5.htm
 {
  id: 'gshock-ten',
  title: 'G-SHOCKの開発目標には10が3つあった',
  detail: '開発で掲げたのは、10mからの落下に耐えること、10気圧防水、電池寿命10年。これを「トリプル10」と呼んでいました。'
 }, // https://gshock.casio.com/intl/cp/bc-one-japan-2025/triple10/
 {
  id: 'eraser-sleeve-corners',
  title: '消しゴムの紙ケースには、角を切ったものがある',
  detail: '消すときに強く押しても、消しゴムの角がケースの角に食い込みにくくする工夫です。'
 }, // https://www.tombow.com/mamechishiki/e85/
 // 地図と自然
 {
  id: 'tea-map-dots',
  title: '地図の茶畑は、3つの点を一組で表す',
  detail: '国土地理院によると、小さな3点の形は、茶の実を半分に切ったときに見える断面がもとになっています。'
 }, // https://www.gsi.go.jp/KIDS/map-sign-tizukigou-2022-tyabatake.htm
 {
  id: 'onsen-map-steam',
  title: '地図の温泉マークは湯気を描いたもの',
  detail: '三つの曲がった線は、温泉から立つ湯気を表します。国土地理院の地図で、主な温泉などを示す記号です。'
 }, // https://www.gsi.go.jp/KIDS/map-sign-tizukigou-2022-onsen.htm
 {
  id: 'greenwich-102',
  title: 'グリニッジの歴史的な経度0度の線と、現在の基準は少しずれている',
  detail: '昔の基準線はグリニッジ天文台の観測装置を通ります。現在の国際的な基準線は、そこから約102.5m東を通ります。'
 }, // https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich
 {
  id: 'tokyo-origin',
  title: '日本経緯度原点は、東京の天文台跡にある',
  detail: '1892年、当時の東京天文台の観測機器の中心が、日本の緯度・経度を測る基準に定められました。現在は東京・麻布台の天文台跡に金属標があります。'
 }, // https://www.gsi.go.jp/sokuchikijun/sankaku-genten.html
 {
  id: 'mercator-course',
  title: '海図の直線には、同じ方位で進めるものがある',
  detail: 'メルカトル図法の海図で直線を引くと、地球の上では、北に対して同じ角度を保つ進路になります。このため海の航行に使われます。'
 }, // https://nauticalcharts.noaa.gov/learn/nautical-cartography.html
 {
  id: 'route-174',
  title: '日本で一番短い国道は約187m',
  detail: '兵庫県神戸市の国道174号は、神戸港から国道2号までを結びます。歩いても数分の距離です。'
 }, // https://www.kkr.mlit.go.jp/osaka/works/infobox/road_dat/his_kokudo/
 {
  id: 'minamitorishima-tokyo',
  title: '日本で一番東の島は東京都にある',
  detail: '日本の最東端にある南鳥島は、東京の中心部から離れた太平洋の島です。行政上は東京都小笠原村に属します。'
 }, // https://www.t-borderislands.metro.tokyo.lg.jp/minamitorishima/
 {
  id: 'japan-height-sea',
  title: '日本の標高を測る基準には東京湾の平均海面を使う',
  detail: '本州などで標高の基準とされるのは、東京湾の海面の平均です。高さを各地で比べられるように、共通の基準から測ります。'
 }, // https://www.gsi.go.jp/LAW/G2000-g2000faq-1.htm
 {
  id: 'ocean-blue-red',
  title: '海が青く見える理由の一つは、水が赤い光を吸収すること',
  detail: '水の中を光が進むと、赤に近い色は吸収されやすくなります。たくさんの水を遠くから見ると、青い光が目に届きやすくなります。'
 }, // https://oceanservice.noaa.gov/facts/oceanblue.html
 {
  id: 'olympus-largest',
  title: '太陽系で最大の火山は火星にある',
  detail: '火星のオリンポス山は、太陽系最大の火山として知られています。探査機の写真では、広いすそと頂上の大きなくぼみが見えます。'
 }, // https://science.nasa.gov/mars/facts/
 {
  id: 'chimborazo-center',
  title: '地球の中心から最も遠い山頂はエベレストではない',
  detail: '地球は赤道に近いほどふくらんでいます。エクアドルのチンボラソ山は赤道に近く、山頂は地球の中心からエベレストより遠くにあります。'
 }, // https://oceanservice.noaa.gov/facts/highestpoint.html
 {
  id: 'challenger-everest',
  title: '海の最深部は、エベレストの高さより深い',
  detail: 'マリアナ海溝のチャレンジャー海淵は海面下およそ11km。エベレストの山頂は海面から約8.8kmの高さです。'
 }, // https://oceanexplorer.noaa.gov/explainers/mapping/
 // 道具の来歴、地理、天体、計算で確認できる雑学
 {
  id: 'flight-recorder-color',
  title: '飛行機の「ブラックボックス」には、目立つ色が使われる',
  detail: '米国の基準では、対象となる飛行データ記録装置の容器を鮮やかなオレンジ色か黄色にします。探すときに見つけやすいよう、反射材も付けます。'
 }, // https://www.law.cornell.edu/cfr/text/14/25.1459
 {
  id: 'first-retail-barcode-gum',
  title: 'スーパーで最初にバーコードを読まれた商品はガム',
  detail: '1974年6月26日、米オハイオ州のスーパーで、リグレーのガムのパックがレジで読み取られました。'
 }, // https://support.gs1.org/support/solutions/articles/43000734073-gs1-historical-timeline
 {
  id: 'lego-danish-name',
  title: 'レゴの名前はデンマーク語の「よく遊べ」から来た',
  detail: 'デンマーク語で「よく遊ぶ」を意味する leg godt の2語を組み合わせて、LEGOという名前になりました。'
 }, // https://www.lego.com/en-sg/aboutus/news/2026/february/90-year-history-of-the-lego-name
 {
  id: 'yakult-esperanto',
  title: 'ヤクルトの名前はエスペラント語にちなむ',
  detail: 'ヤクルト本社によると、ヨーグルトを意味するエスペラント語の「ヤフルト」を、言いやすい形に変えた名前です。'
 }, // https://www.yakult.co.jp/yakultman/index.html
 {
  id: 'pez-peppermint',
  title: 'PEZの3文字はドイツ語のペパーミントから取った',
  detail: 'ドイツ語の Pfefferminz から、最初の P、中央付近の E、最後の Z を選んだとメーカーは説明しています。'
 }, // https://us.pez.com/pages/history
 {
  id: 'big-ben-bell',
  title: 'ビッグ・ベンはもともと鐘のあだ名だった',
  detail: 'ロンドンの塔はエリザベス・タワーといいます。塔全体もビッグ・ベンと呼ばれますが、もともとは中にある時刻を知らせる大きな鐘の愛称です。'
 }, // https://www.parliament.uk/about/living-heritage/building/palace/architecture/palacestructure/towers-of-parliament/
 {
  id: 'guinness-bird-debate',
  title: 'ギネス世界記録の本は、鳥の速さをめぐる議論がきっかけ',
  detail: 'ギネス社のヒュー・ビーバーは、仲間とヨーロッパで最も速く飛ぶ狩猟鳥について議論しました。その出来事が、記録を調べられる本を作るきっかけになりました。'
 }, // https://www.guinnessworldrecords.com/news/2022/9/why-was-the-guinness-world-records-book-first-published-714607
 {
  id: 'date-line-zigzag',
  title: '日付変更線は地図の上で折れ曲がっている',
  detail: '日付変更線は、おおむね太平洋を南北に走ります。ロシア東部やアリューシャン列島の周りでは、国や地域の境界に合わせて曲がっています。'
 }, // https://oceanservice.noaa.gov/facts/international-date-line.html
 {
  id: 'voyager-record-photos',
  title: '宇宙に出たボイジャーのレコードには画像も入っている',
  detail: 'ボイジャー1号と2号のゴールデンレコードには、音や音楽に加えて115枚の画像が電子的に記録されています。'
 }, // https://science.nasa.gov/mission/voyager/golden-record-contents/images/
 {
  id: 'webb-hexagon-mirrors',
  title: 'ウェッブ宇宙望遠鏡の鏡は六角形18枚でできている',
  detail: '18枚を組み合わせて大きな主鏡にしています。各鏡の表面には金を薄くコーティングしてあります。'
 }, // https://science.nasa.gov/mission/webb/webbs-mirrors/
 {
  id: 'liberty-tablet-date',
  title: '自由の女神像の左手には独立宣言の日付がある',
  detail: '左手で支える板に「JULY IV MDCCLXXVI」とあります。ローマ数字の IV は4、MDCCLXXVI は1776を表し、1776年7月4日と読めます。'
 }, // https://www.nps.gov/stli/faqs.htm
 {
  id: 'biwa-prefecture-fraction',
  title: '琵琶湖は滋賀県の面積の約6分の1を占める',
  detail: '滋賀県の統計では、琵琶湖の面積は約669平方キロメートル。県全体の約4017平方キロメートルと比べると、およそ6分の1です。'
 }, // https://www.pref.shiga.lg.jp/file/attachment/5588044.pdf
 {
  id: 'lighthouse-map-rays',
  title: '灯台の地図記号は、真上から見た灯台を表している',
  detail: '国土地理院によると、上から見た灯台の光源と、周りへ光が広がる様子を組み合わせた記号です。'
 }, // https://www.gsi.go.jp/KIDS/map-sign-tizukigou-2022-toudai.htm
 {
  id: 'shogi-board-piece-count',
  title: '将棋の最初の盤面には駒が40枚ある',
  detail: '対局の開始時には、自分の駒が20枚、相手の駒も20枚。9×9の81マスのうち、40マスに駒が置かれます。'
 }, // https://www.shogi.or.jp/knowledge/about/
 {
  id: 'penny-black-postage',
  title: '1840年のペニー・ブラックは切手の始まりとして知られる',
  detail: '英国で発行された黒い1ペニー切手です。スミソニアンの郵便博物館は、先に発売されたことから世界初の郵便切手として広く認められていると紹介しています。'
 }, // https://postalmuseum.si.edu/us-postal-stamps
 {
  id: 'fullwidth-zero-codepoint',
  title: '全角の「０」と半角の「0」は、文字番号も違う',
  detail: 'Unicodeでは「０」はU+FF10、「0」はU+0030です。見た目の幅だけ変えているのではなく、別々の文字として符号化されています。'
 }, // https://www.unicode.org/Public/UCD/latest/charts/nameslist/ff00/
 {
  id: 'sun-mass-share',
  title: '太陽系の質量の約99.8％が太陽に集まっている',
  detail: 'NASAの解説によれば、惑星や小天体を含む太陽系全体の質量のうち、約99.8％を太陽が占めています。'
 }, // https://science.nasa.gov/sun/facts/
 {
  id: 'mono-eraser-pencil-bonus',
  title: 'MONO消しゴムは鉛筆のおまけから始まった',
  detail: '1967年、トンボ鉛筆が高級鉛筆「MONO100」のサービス品として付けたのが始まりで、その後は消しゴム単体でも売られるようになりました。'
 }, // https://www.tombow.com/sp/kids/eraser/history_tombow.html
 {
  id: 'apollo11-messages-disk',
  title: 'アポロ11号は月にメッセージ入りの小さな円盤を運んだ',
  detail: 'シリコン製の円盤には、世界の指導者73人からのメッセージが刻まれました。円盤の直径は約3.8cmです。'
 }, // https://www.nasa.gov/history/55-years-ago-one-month-until-the-moon-landing/
 {
  id: 'jst-longitude-135',
  title: '東経135度は、地球を一周24時間とすると9時間分にあたる',
  detail: '経度15度が1時間分なので、東経135度は基準から9時間分東にあります。日本標準時が協定世界時より9時間進むことと対応します。'
 }, // https://www.nict.go.jp/sts/jst.html
 {
  id: 'american-steel-cent',
  title: '1943年の米国では、亜鉛で覆った鋼の1セント硬貨が作られた',
  detail: '戦時中に銅をほかの用途に回す必要があったため、一般向けの1セント硬貨の素材に鋼を使い、表面を亜鉛で覆いました。'
 }, // https://www.usmint.gov/content/usmint/us/en/learn/history/historic-coin-production.html
 {
  id: 'clock-hands-meet-22',
  title: '長針と短針が重なるのは、ふつうの時計で1日に22回',
  detail: '12時間で長針は12周、短針は1周。長針が短針を11周分追い抜くので、午前0時を含む1日では22回重なります。翌日の午前0時は数えません。'
 },
 {
  id: 'calendar-three-vertical',
  title: 'カレンダーで縦に並ぶ3日の合計は、真ん中の日の3倍',
  detail: '同じ月の連続する週で、縦に「3、10、17」と並んだら合計は30。上下は中央から7ずつ引いた数と足した数なので、差が打ち消し合います。'
 },
 {
  id: 'magic-square-fifteen',
  title: '1から9を使う3×3の魔方陣は、1列の合計が15',
  detail: '1から9を足すと45。横3列で同じ合計にするなら各列は15です。上から「8・1・6」「3・5・7」「4・9・2」と並べると、縦も斜めも15になります。'
 },
];
