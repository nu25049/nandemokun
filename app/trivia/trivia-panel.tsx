'use client';

import {useState} from 'react';
import {TRIVIA_FACTS} from '../../lib/trivia-facts';

export default function TriviaPanel() {
 const [seen, setSeen] = useState([TRIVIA_FACTS[0].id]);
 const current = TRIVIA_FACTS.find(fact => fact.id === seen[seen.length - 1]) ?? TRIVIA_FACTS[0];

 function showAnotherFact() {
  const recent = seen.length === TRIVIA_FACTS.length ? [] : seen;
  const remaining = TRIVIA_FACTS.filter(fact => fact.id !== current.id && !recent.includes(fact.id));
  const next = remaining[Math.floor(Math.random() * remaining.length)];
  if(next)setSeen([...recent, next.id]);
 }

 return <>
  <p className="content-count">本当の雑学 {TRIVIA_FACTS.length}件</p>
  <article className="trivia-fact" aria-live="polite" aria-atomic="true">
   <h2>{current.title}</h2>
   <p>{current.detail}</p>
  </article>
  <button className="secondary" type="button" onClick={showAnotherFact}>次の雑学 <span aria-hidden="true">→</span></button>
 </>;
}
