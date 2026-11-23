import type {ReactNode} from 'react';

export default function TriviaLayout({children}: {children: ReactNode}) {
 return <main className="focus-game trivia-reader">
  <a className="game-back" href="/">← 戻る</a>
  <section className="trivia-reader-content" aria-labelledby="trivia-title">
   {children}
  </section>
 </main>;
}
