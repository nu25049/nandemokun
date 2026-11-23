export type GroupActivity = {
 id: string;
 title: string;
 minutes: number;
 minParticipants: number;
 maxParticipants: number;
 category: 'conversation' | 'word' | 'observation' | 'creative' | 'movement';
 discreet: boolean;
 place: 'indoor' | 'outdoor' | 'either';
 materials: string;
 steps: readonly string[];
 endCondition: string;
};

type ActivityDraft = Omit<GroupActivity, 'minParticipants' | 'maxParticipants' | 'materials'> &
 Partial<Pick<GroupActivity, 'minParticipants' | 'maxParticipants' | 'materials'>>;

const drafts: readonly ActivityDraft[] = [
 {
  id: 'group:conversation:one-common',
  title: '全員の好きなものを1つそろえる', minutes: 1, category: 'conversation', discreet: true, place: 'either',
  steps: ['小声で「全員が好きな食べ物を一つ探そう」と声をかける。', '一人ずつ「カレーは？」のように候補を出し、全員が好きなら採用する。'],
  endCondition: '一つ決まるか、1分たったら終了。',
 },
 {
  id: 'group:conversation:two-choices',
  title: '二択の理由を一言ずつ聞く', minutes: 3, category: 'conversation', discreet: true, place: 'either',
  steps: ['小声で「一日だけ、空を飛ぶ力と透明になる力ならどっち？」と聞く。', '一人ずつ選んだほうと理由を一言で話す。', '全員話せたら「山と海なら？」など、誰かが次の二択を出す。'],
  endCondition: '3分以内で、最後の質問を全員が答えたら終了。',
 },
 {
  id: 'group:conversation:tiny-good',
  title: '今日よかったことを20秒ずつ話す', minutes: 3, category: 'conversation', discreet: true, place: 'either',
  steps: ['「今日は信号に引っかからなかった、みたいな小さいことでいいよ」と始める。', '一人20秒以内で、今日よかったことを小声で一つ話す。', '聞いている人は最後に一言だけ反応する。'],
  endCondition: '全員が一つ話すか、3分たったら終了。',
 },
 {
  id: 'group:conversation:imaginary-shop',
  title: 'みんなで架空のお店を開く', minutes: 5, category: 'conversation', discreet: true, place: 'indoor',
  steps: ['小声で「雨の日だけ開くお店を作るなら、何を売る？」と聞く。', '一人ずつ商品を一つ出し、全員で店名と看板商品を決める。', '最後に誰かがお客さん役で「おすすめは？」と聞き、別の人が答える。'],
  endCondition: '店名と看板商品が決まり、店員の返事が一つできたら終了。5分以内。',
 },
 {
  id: 'group:conversation:recommended-routine',
  title: '自分の小さな楽しみを紹介し合う', minutes: 10, category: 'conversation', discreet: true, place: 'either',
  steps: ['「お金を使わずにできる、小さな楽しみを一つ教えて」と小声で聞く。', '一人ずつ「帰り道で夕焼けを見る」など具体的に話す。', '各人の話へ一つだけ質問し、最後に試したい案を一つ選ぶ。'],
  endCondition: '全員が紹介し終わり、試したい案を一つずつ言ったら終了。10分以内。',
 },
 {
  id: 'group:conversation:three-tools',
  title: '空想の島へ持っていく道具を3つ選ぶ', minutes: 15, category: 'conversation', discreet: true, place: 'indoor',
  steps: ['「食事と寝る場所がある島で、一日遊ぶ道具を三つだけ選ぼう」と小声で始める。', '各人が道具を二つ提案し、どんな遊びができるか説明する。', '全員で三つに絞り、朝・昼・夕方の遊びを決める。'],
  endCondition: '道具三つと一日の過ごし方が決まるか、15分たったら終了。',
 },
 {
  id: 'group:conversation:rainy-day-ranking',
  title: '雨の日の過ごし方ベスト3を作る', minutes: 15, category: 'conversation', discreet: true, place: 'indoor',
  steps: ['「雨で一日家にいるなら何をする？」と小声で聞く。', '各人が二案出し、似た案をまとめる。メモするなら紙を使う。', '一人二票ずつ入れ、上位三つについて好きな点を話す。同票なら両方を同じ順位にする。'],
  endCondition: 'ベスト3とそれぞれの理由がまとまるか、15分たったら終了。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:conversation:imaginary-day-trip',
  title: '架空の日帰り旅行を一緒に組み立てる', minutes: 30, category: 'conversation', discreet: true, place: 'indoor',
  steps: ['「朝9時に出発して夕方6時に戻るなら、どんな一日にしたい？」と小声で始める。', '一人ずつ、行きたい場所とそこでやることを出す。実在の場所を調べる必要はない。', '全員の案を少なくとも一つずつ入れ、午前・昼・午後の順番に並べる。', '残り5分で、一番楽しみな場面を一人ずつ話す。'],
  endCondition: '全員の案が入った一日の予定ができ、楽しみな場面を話したら終了。30分以内。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:word:food-chain',
  title: '食べ物だけでしりとりを一周する', minutes: 1, category: 'word', discreet: true, place: 'either',
  steps: ['小声で「食べ物しりとり、りんごから」と始める。', '順番に食べ物を一つずつ言う。詰まったらパスして、直前の言葉から次の人が続ける。'],
  endCondition: '全員が一度答えるか、1分たったら終了。',
 },
 {
  id: 'group:word:three-syllables',
  title: '3文字の言葉を順番に増やす', minutes: 3, category: 'word', discreet: true, place: 'either',
  steps: ['小声で「ひらがな三文字だけ。たまご、から」と始める。', '「さくら」「くるま」のように、書くとひらがな三文字の言葉を順番に言う。', '出た言葉は使わず、詰まったら次の人へパスする。'],
  endCondition: '3分たつか、新しい言葉が全員一周出なくなったら終了。',
 },
 {
  id: 'group:word:association-chain',
  title: '連想をつないで最初の言葉へ戻る', minutes: 3, category: 'word', discreet: true, place: 'either',
  steps: ['小声で「海といえば夏」のように二つの言葉をつなぐ。', '次の人は「夏といえば花火」と、最後の言葉から続ける。', '全員一周したら、連想をつないで最初の「海」へ戻れるか試す。'],
  endCondition: '最初の言葉へ戻るか、3分たったら終了。',
 },
 {
  id: 'group:word:no-saying-name',
  title: '名前を言わずに身近なものを説明する', minutes: 5, category: 'word', discreet: true, place: 'either',
  steps: ['小声で「名前を言わずに説明するから当てて。丸くて、持ち手があって、お茶を入れる」と始める。', '一人がコップなど身近なものを思い浮かべ、名前を使わず三つの特徴を話す。', 'ほかの人が当てたら、次の人が説明役になる。'],
  endCondition: '全員が一度説明するか、5分たったら終了。',
 },
 {
  id: 'group:word:five-word-story',
  title: '一人一言でへんてこな文を作る', minutes: 5, category: 'word', discreet: true, place: 'either',
  steps: ['小声で最初の人が「昨日、」と言い、次の人が「冷蔵庫が」と続ける。', '一人ずつ短い一節を足し、全員二周するまで文を続ける。', '最後の人が「おしまい」で終え、最初からつなげて読み直す。'],
  endCondition: '一つの話を読み直すか、5分たったら終了。',
 },
 {
  id: 'group:word:forbidden-adjective',
  title: '「すごい」を使わずに架空の商品をほめる', minutes: 10, category: 'word', discreet: true, place: 'indoor',
  steps: ['小声で「空を飛べる消しゴムを、すごいと言わずに紹介して」と始める。', '一人30秒ずつ、便利さや面白さを具体的に説明する。', '全員の説明から気に入った一言を選び、次は「絶対寝坊しない枕」で一周する。'],
  endCondition: '二つの商品を全員が紹介するか、10分たったら終了。',
 },
 {
  id: 'group:word:alternate-debate',
  title: '架空の遊園地に名前と宣伝文を付ける', minutes: 15, category: 'word', discreet: true, place: 'indoor',
  steps: ['小声で「全部お菓子の形をした遊園地の名前を考えよう」と始める。', '一人二案ずつ名前を出し、全員で一つ選ぶ。', '一人ずつ15文字以内の宣伝文を作り、最後に一番行きたくなる一文を選ぶ。'],
  endCondition: '名前と宣伝文が一つずつ決まるか、15分たったら終了。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:word:story-three-endings',
  title: '同じ始まりから違う結末を作る', minutes: 30, category: 'word', discreet: true, place: 'indoor',
  steps: ['小声で「ある朝、玄関に小さな宇宙船が落ちていた」という始まりを共有する。', '一人3分ほど考え、続きを1分以内で話す。紙に書いてもよい。', '全員が話したら、ほかの人の登場人物を一人借りて短い後日談を作る。'],
  endCondition: '全員の続きと後日談を聞くか、30分たったら終了。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:observation:three-colors',
  title: 'その場の同じ色を3つ探す', minutes: 1, category: 'observation', discreet: true, place: 'either',
  steps: ['小声で「今見える青いものを三つずつ探そう」と声をかける。', 'その場から物を動かさずに探し、一人ずつ名前を言う。前の人と同じ物でもよい。'],
  endCondition: '全員が三つ言うか、1分たったら終了。',
 },
 {
  id: 'group:observation:small-difference',
  title: '同じ景色で気づいた点を比べる', minutes: 3, category: 'observation', discreet: true, place: 'either',
  steps: ['「同じ方向を20秒見て、一つだけ面白いものを覚えよう」と小声で始める。', '一人ずつ、見つけた物と気になった点を一つ話す。', 'もう一度景色を見て、ほかの人の発見を探す。'],
  endCondition: '全員の発見を確かめるか、3分たったら終了。',
 },
 {
  id: 'group:observation:shape-count',
  title: '丸い形と四角い形を数え比べる', minutes: 3, category: 'observation', discreet: true, place: 'either',
  steps: ['小声で「この方向に、丸と四角はどっちが多いと思う？」と聞く。', '一人ずつ予想を言い、同じ範囲を30秒見て数える。', '数えた物の名前を出し合い、重なった物を一つにまとめる。'],
  endCondition: '丸と四角の数が決まるか、3分たったら終了。',
 },
 {
  id: 'group:observation:memory-scene',
  title: '30秒見た景色を質問し合う', minutes: 5, category: 'observation', discreet: true, place: 'indoor',
  steps: ['小声で「机の上を30秒覚えて、見ないで答えてみよう」と始める。', '物を動かさずに見た後、全員が目線を別の方向へ向ける。', '順番に「一番左にあった物は？」など一問ずつ出し、最後に一緒に見直す。'],
  endCondition: '全員が一問出して答え合わせをするか、5分たったら終了。',
 },
 {
  id: 'group:observation:quiet-sound-map',
  title: '聞こえる音の方向を比べる', minutes: 10, category: 'observation', discreet: true, place: 'either',
  steps: ['小声で「1分だけ、近い音と遠い音を探そう」と始める。', '聞こえた音を一人ずつ挙げ、どの方向から聞こえたか話す。', '二回目は、ほかの人が挙げた音を探しながら聞く。'],
  endCondition: '二回聞き比べて、全員が一つ発見を話すか、10分たったら終了。',
 },
 {
  id: 'group:observation:sign-letter',
  title: '見える文字をひらがな順に集める', minutes: 10, category: 'observation', discreet: true, place: 'either',
  steps: ['小声で「見える文字で、あ・い・う・え・おをそろえよう」と始める。', '看板や手元の印刷物をその場から見て、文字を見つけたら場所を言う。', 'ひらがながなければカタカナでもよい。五つそろったら「か行」を探す。'],
  endCondition: '二行分そろうか、10分たったら終了。',
 },
 {
  id: 'group:observation:outdoor-bingo',
  title: '歩きながら3種類の形を探す', minutes: 15, category: 'observation', discreet: false, place: 'outdoor',
  steps: ['「丸・三角・四角を一つずつ見つけよう」と決めて、同じ歩道を一緒に進む。', '見つけた物は立ち止まって名前を共有する。', '出発から5分たったら同じ道を戻り、帰り道では一番小さな形を探す。'],
  endCondition: '出発地点へ戻り、一番面白かった形を一つずつ話して終了。15分以内。',
 },
 {
  id: 'group:observation:tiny-exhibition',
  title: '近所の景色で空想の写真展を開く', minutes: 30, category: 'observation', discreet: false, place: 'outdoor',
  steps: ['「今日は丸いもの展。写真は撮らず、景色に題名を付けよう」と始める。', '10分以内で戻れる歩道を一緒に歩き、一人一つ景色を選ぶ。', '10分で引き返し、選んだ場所で立ち止まって作品名と見どころを紹介する。'],
  endCondition: '全員の紹介を終え、出発地点へ戻って終了。30分以内。',
 },
 {
  id: 'group:creative:three-words',
  title: '三つの言葉で架空のキャラクターを作る', minutes: 1, category: 'creative', discreet: true, place: 'either',
  steps: ['小声で「ネコ・傘・宇宙から、キャラクターを一人作ろう」と始める。', '順番に名前、見た目、得意技を一つずつ足す。人数が多ければ好きな食べ物なども足す。'],
  endCondition: '全員が一つ設定を足すか、1分たったら終了。',
 },
 {
  id: 'group:creative:imaginary-animal',
  title: '架空の動物に変な特徴を足す', minutes: 3, category: 'creative', discreet: true, place: 'either',
  steps: ['小声で「手のひらサイズのドラゴンに、一人一つ特徴を付けよう」と始める。', '「ため息でシャボン玉が出る」など、前の設定を残したまま足していく。', '最後の人が動物の名前を付け、特徴をまとめる。'],
  endCondition: '名前と全員分の特徴がまとまるか、3分たったら終了。',
 },
 {
  id: 'group:creative:silent-commercial',
  title: '架空の道具を手の形だけで紹介する', minutes: 3, category: 'creative', discreet: false, place: 'indoor',
  steps: ['「見えない道具を使うふりで、何の道具か当てよう」と始める。', '一人が「巨大な歯ブラシ」などを決め、座ったまま小さな動きで使うふりをする。', '当たったら次の人が別の道具を演じる。'],
  endCondition: '全員が一度演じるか、3分たったら終了。',
 },
 {
  id: 'group:creative:six-word-poem',
  title: '目の前の景色に短い題名を付ける', minutes: 5, category: 'creative', discreet: true, place: 'either',
  steps: ['小声で「今の景色を映画の一場面だと思って、題名を付けよう」と始める。', '一人30秒考え、題名とその理由を順番に話す。', '最後に全員の題名から一つ選び、その映画の次の場面を一言ずつ足す。'],
  endCondition: '全員が次の場面を一言話すか、5分たったら終了。',
 },
 {
  id: 'group:creative:new-school-subject',
  title: 'あったら面白い授業を作る', minutes: 10, category: 'creative', discreet: true, place: 'indoor',
  steps: ['小声で「週一回、空想の授業を増やせるなら何にする？」と聞く。', '一人ずつ授業名を出し、一つを全員で選ぶ。', '最初の授業で何をするか、宿題は何か、先生はどんな人かを順番に決める。'],
  endCondition: '授業名と最初の授業・宿題・先生が決まるか、10分たったら終了。',
 },
 {
  id: 'group:creative:cooperative-monster',
  title: '一つのモンスターの図鑑を作る', minutes: 15, category: 'creative', discreet: true, place: 'indoor',
  steps: ['小声で「図書館に住んでいるモンスターの図鑑を作ろう」と始める。', '見た目、鳴き声、食べ物、習性の担当を決める。人が多ければ同じ項目を二人で考える。', '各担当が案を説明し、矛盾しそうな特徴を全員でつなげる。紙があれば絵と説明を書く。'],
  endCondition: '名前と四つの項目が埋まるか、15分たったら終了。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:creative:station-jingle',
  title: '架空の駅と町の紹介を作る', minutes: 15, category: 'creative', discreet: true, place: 'indoor',
  steps: ['小声で「雲の上に駅が一つあるとしたら、何駅？」と聞く。', '駅名、駅前の店、名物、観光地を一人一つずつ足す。', '全員の案を使って、30秒で町を紹介する文章を作り、小声で読んでみる。'],
  endCondition: '30秒の町紹介を一度読めたら終了。15分以内。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:creative:mini-board-game',
  title: '道具なしで遊べるゲームを発明する', minutes: 30, category: 'creative', discreet: false, place: 'indoor',
  steps: ['「手の指と声だけで遊べる、新しいゲームを作ろう」と始める。', '10分で勝ち方、順番、一回にできることを全員で決める。', '10分試し、分かりにくかったルールを一つだけ変える。', '最後の10分で改良したルールを試す。'],
  endCondition: '改良前と改良後を一回ずつ遊ぶか、30分たったら終了。',
  materials: '紙とペン（任意）',
 },
 {
  id: 'group:movement:finger-match',
  title: '指の数をそろえてみる', minutes: 1, category: 'movement', discreet: true, place: 'indoor',
  steps: ['座ったまま小声で「せーので、片手の指を一本から五本出そう」と始める。', '机の近くで小さく手を出し、全員の数が同じになるか試す。', '出した数は相談せず、三回だけ繰り返す。'],
  endCondition: '三回試すか、1分たったら終了。',
 },
 {
  id: 'group:movement:hand-mirror',
  title: '手だけの鏡ごっこをする', minutes: 3, category: 'movement', discreet: true, place: 'indoor', maxParticipants: 2,
  steps: ['二人で向かい、座ったまま「手だけ、ゆっくり鏡みたいにまねして」と始める。', '片方が机の上の小さな範囲で手の向きと指の形を変え、もう片方が同じ形にする。', '1分で役を交代する。'],
  endCondition: '二人とも動かす役を一度ずつ終えるか、3分たったら終了。',
 },
 {
  id: 'group:movement:gesture-passing',
  title: '小さな動きを一つずつ増やす', minutes: 3, category: 'movement', discreet: false, place: 'indoor',
  steps: ['座って「手を開く、から動きを足そう」と始める。', '次の人は前の動きをまねてから、「指を一本立てる」など小さな動きを足す。', '忘れたら全員で最初から確認し、脱落せず続ける。'],
  endCondition: '全員が一つずつ足して一周するか、3分たったら終了。',
 },
 {
  id: 'group:movement:pose-theme',
  title: 'お題に合うポーズを一斉に作る', minutes: 5, category: 'movement', discreet: false, place: 'either',
  steps: ['その場で「ロボット、のポーズをせーので」と始める。', '一斉に小さなポーズを作り、似ていたところを一つ話す。', '順番に「眠いネコ」「勇者」など次のお題を出す。'],
  endCondition: '全員がお題を一つ出すか、5分たったら終了。',
 },
 {
  id: 'group:movement:slow-gesture',
  title: 'スローモーションで日常動作を当てる', minutes: 5, category: 'movement', discreet: false, place: 'indoor',
  steps: ['「歯を磨く、みたいな動作をゆっくり演じるね」と始める。', '一人がその場で日常動作をスローモーションで演じ、ほかの人が当てる。', '当たったら次の人が演じる。道具は使わず、動きだけで表す。'],
  endCondition: '全員が一度演じるか、5分たったら終了。',
 },
 {
  id: 'group:movement:walk-same-path',
  title: '5分歩いて同じ道を戻る', minutes: 10, category: 'movement', discreet: false, place: 'outdoor',
  steps: ['「5分だけ歩いて戻ろう。途中で黄色いものを一つ見つけて」と始める。', '歩道を一緒に進み、5分で同じ道を引き返す。', '帰り道で見つけた黄色いものを一人ずつ話す。'],
  endCondition: '出発地点へ戻ったら終了。歩く時間は往復10分。',
 },
 {
  id: 'group:movement:outside-statues',
  title: '合図で変わる像を作る', minutes: 15, category: 'movement', discreet: false, place: 'outdoor',
  steps: ['広く空いた場所で「次の合図で、木になろう」と始める。', '一人がお題を出し、ほかの人がその場でポーズを作って5秒止まる。', 'お題役を交代し、全員がお題役を二回ずつ担当する。'],
  endCondition: '全員がお題役を二回終えるか、15分たったら終了。',
 },
 {
  id: 'group:movement:walk-three-stops',
  title: '三つの発見を持ち帰る散歩をする', minutes: 30, category: 'movement', discreet: false, place: 'outdoor',
  steps: ['「変わった色、形、音を一つずつ見つけて帰ろう」と始める。', '歩道を一緒に10分進み、途中で見つけたものを共有する。', '10分たったら同じ道を戻る。戻ったら全員で三つの発見を選び、今日の散歩に題名を付ける。'],
  endCondition: '出発地点へ戻り、発見三つと題名が決まったら終了。30分以内。',
 },
];

export const groupActivities: readonly GroupActivity[] = drafts.map(activity => ({
 minParticipants: 2,
 maxParticipants: 8,
 materials: 'なし',
 ...activity,
}));

export function groupCandidates({
 participants, minutes, discreet, indoorOnly,
}: {
 participants: number;
 minutes: number | null;
 discreet: boolean;
 indoorOnly: boolean;
}): GroupActivity[] {
 if (!Number.isInteger(participants) || participants < 2 || participants > 8) return [];
 if (minutes !== null && (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440)) return [];
 return groupActivities.filter(activity =>
  participants >= activity.minParticipants && participants <= activity.maxParticipants &&
  (minutes === null || activity.minutes <= minutes) &&
  (!discreet || activity.discreet) &&
  (!indoorOnly || activity.place !== 'outdoor'),
 );
}

export function pickGroupActivity(
 pool: readonly GroupActivity[], previousId?: string | null, random = Math.random,
): GroupActivity | null {
 if (!pool.length) return null;
 const alternatives = pool.filter(activity => activity.id !== previousId);
 const candidates = alternatives.length ? alternatives : pool;
 const value = random();
 const fraction = Number.isFinite(value) ? Math.max(0, Math.min(0.999999999, value)) : 0;
 return candidates[Math.floor(fraction * candidates.length)];
}
