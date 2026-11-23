import {foodConversationTopics} from './conversation-topics-food';
import {dailyConversationTopics} from './conversation-topics-daily';
import {scienceConversationTopics} from './conversation-topics-science';

export type ConversationTopic = {
 id: string;
 category: 'food' | 'daily' | 'science' | 'culture';
 title: string;
 detail: string;
 prompt: string;
 source: string;
 sourceName: string;
};

export const CONVERSATION_TOPICS: readonly ConversationTopic[] = [
 ...foodConversationTopics,
 ...dailyConversationTopics,
 ...scienceConversationTopics,
 {
  id: "hokusai-forty-six",
  category: 'culture',
  title: "『富嶽三十六景』は全部で46枚",
  detail: "北斎の富士山シリーズは、人気を受けて版元が10枚増やしました。題名には最初の「三十六」が残っています。",
  prompt: "富士山を一枚だけ描くなら、どこから見た景色にする？",
  source: "https://www.metmuseum.org/art/collection/search/36490",
  sourceName: "メトロポリタン美術館",
 },
 {
  id: "cage-listening",
  category: 'culture',
  title: "演奏者が音を鳴らさない曲がある",
  detail: "ジョン・ケージの『4分33秒』は3楽章あり、演奏者は楽器で音を鳴らしません。会場に自然に響く音に耳を向けられる作品です。",
  prompt: "教室や部屋で30秒だけ黙ったら、最初に何の音が聞こえそう？",
  source: "https://johncage.org/kuhns/john-cage-and-the-new-world-symphony",
  sourceName: "ジョン・ケージ財団",
 },
 {
  id: "tezuka-beetle-name",
  category: 'culture',
  title: "手塚治虫の「虫」はオサムシが由来",
  detail: "手塚は少年の頃、昆虫図鑑でオサムシを知り、本名の「治」に「虫」を足してペンネームにしました。",
  prompt: "好きな生き物からペンネームを作るなら、何にする？",
  source: "https://tezukaosamu.net/jp/about/1930.html",
  sourceName: "手塚治虫公式サイト",
 },
 {
  id: "doraemon-birthday",
  category: 'culture',
  title: "ドラえもんの誕生日は2112年9月3日",
  detail: "作品の公式サイトに掲載されている誕生日です。読者から見て未来の年まで決まっています。",
  prompt: "未来からひみつ道具が一つ届くなら、どれが欲しい？",
  source: "https://dora-world.com/sp/tencomi_detective/dora001/dora001_vol001.html",
  sourceName: "ドラえもんチャンネル",
 },
 {
  id: "landlords-game",
  category: 'culture',
  title: "モノポリーの前身には、土地の独占を考えるゲームがあった",
  detail: "エリザベス・マギーが考案し、1904年に特許が出た『The Landlord’s Game』は、モノポリーの前身の一つです。遊びながら土地を持つ側の有利さが分かる仕組みでした。",
  prompt: "自分の街でボードゲームを作るなら、どの場所をマスに入れたい？",
  source: "https://invention.si.edu/invention-stories/woman-inventor-behind-monopoly",
  sourceName: "スミソニアン協会",
 },
 {
  id: "rubiks-early-name",
  category: 'culture',
  title: "ルービックキューブには「マジック・キューブ」という初期の名前があった",
  detail: "ハンガリーで売られた頃は「マジック・キューブ」。世界へ発売する際、考案者のルービックの名前を使った呼び名に変わりました。",
  prompt: "あのキューブ、何面までそろえられる？",
  source: "https://rubiks.com/history",
  sourceName: "ルービックキューブ公式",
 },
 {
  id: "crossword-word-cross",
  category: 'culture',
  title: "初期の新聞クロスワードは「ワード・クロス」という名前だった",
  detail: "アーサー・ウィンが作った「Word-Cross Puzzle」が、1913年にニューヨークの新聞『ワールド』の日曜版に載りました。",
  prompt: "クロスワードって、解けそうなところから埋める？ 左上から順に考える？",
  source: "https://blogs.loc.gov/headlinesandheroes/2021/11/free-puzzles-word-cross-crosswords-and-acrostics/",
  sourceName: "米国議会図書館",
 },
 {
  id: "uranus-moons-literature",
  category: 'culture',
  title: "天王星にはシェイクスピアの登場人物と同じ名前の月がある",
  detail: "天王星の衛星には、戯曲のオフィーリアやパックにちなんだ名前があります。アレクサンダー・ポープの詩に登場する人物の名前も使われています。",
  prompt: "新しい月に名前を付けるなら、どの作品の登場人物にしたい？",
  source: "https://science.nasa.gov/uranus/moons/",
  sourceName: "NASA",
 },
 {
  id: "beethoven-moonlight",
  category: 'culture',
  title: "ベートーヴェンの「月光」は後から付いた呼び名",
  detail: "詩人で音楽評論家のルートヴィヒ・レルシュタープが、第1楽章を月明かりが照らす湖の情景にたとえたことが、呼び名の由来です。",
  prompt: "曲に景色の名前を付けるなら、どの曲にどんな名前を付ける？",
  source: "https://internet.beethoven.de/en/exhibition/beethoven-on-postage-stamps/",
  sourceName: "ベートーヴェン・ハウス",
 },
 {
  id: "edison-nursery-rhyme",
  category: 'culture',
  title: "エジソンは蓄音機の試し録りで「メリーさんのひつじ」を使ったと伝わる",
  detail: "米国議会図書館によると、エジソンは童謡の一節を機械に吹き込み、同じ言葉が再生されるのを確かめたと伝えられています。",
  prompt: "声を録れる機械を初めて作ったら、何を最初に録音する？",
  source: "https://www.loc.gov/programs/national-recording-preservation-plan/tools-and-resources/historical-background/timeline/",
  sourceName: "米国議会図書館",
 },
 {
  id: "american-gothic-models",
  category: 'culture',
  title: "名画『アメリカン・ゴシック』のモデルは画家の妹と歯医者",
  detail: "農家らしい二人を描いたグラント・ウッドは、妹のナンと、かかりつけの歯科医をモデルに選びました。",
  prompt: "知り合いをモデルに肖像画を描くなら、どんな背景にする？",
  source: "https://www.artic.edu/pdf/static/download-my-museum-tour.pdf-layout-5823.pdf",
  sourceName: "シカゴ美術館",
 },
 {
  id: "monet-impression-name",
  category: 'culture',
  title: "「印象派」の名前のきっかけはモネの朝日の絵",
  detail: "モネの『印象、日の出』が展覧会に出たとき、批評家が絵の題名にちなむ見出しで評を書きました。その呼び方が、のちに画家たちの流派の名として定着しました。",
  prompt: "朝日と夕日、絵にするならどっちを選ぶ？",
  source: "https://www.marmottan.fr/notice/4014/",
  sourceName: "マルモッタン・モネ美術館",
 },
];
