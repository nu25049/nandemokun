import TriviaPanel from './trivia-panel';

export const metadata = {title: 'ためにならない雑学 | 暇な君へ'};

export default function TriviaPage() {
 return <main className="focus-game trivia-reader">
  <a className="game-back" href="/">← 戻る</a>
  <section className="trivia-reader-content" aria-labelledby="trivia-title">
   <h1 id="trivia-title">ためにならない雑学</h1>
   <TriviaPanel />
  </section>
 </main>;
}
