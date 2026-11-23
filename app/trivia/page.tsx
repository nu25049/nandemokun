import TriviaPanel from './trivia-panel';
import TriviaNavigation from './trivia-navigation';

export const metadata = {title: 'ためにならない雑学 | 暇な君へ'};

export default function TriviaPage() {
 return <>
  <h1 id="trivia-title">ためにならない雑学</h1>
  <TriviaNavigation active="facts" />
  <TriviaPanel />
 </>;
}
