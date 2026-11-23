export default function TriviaNavigation({active}: {active: 'facts' | 'tomorrow'}) {
 return <nav className="trivia-navigation" aria-label="雑学の種類">
  <a href="/trivia" aria-current={active === 'facts' ? 'page' : undefined}>ためにならない雑学</a>
  <a href="/trivia/tomorrow" aria-current={active === 'tomorrow' ? 'page' : undefined}>明日の話のネタ</a>
 </nav>;
}
