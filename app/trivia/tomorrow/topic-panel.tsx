'use client';

import {useState} from 'react';
import type {ConversationTopic} from '../../../lib/conversation-topics';
import {nextTriviaHistory} from '../../../lib/trivia-reader';

const labels = {
 all: 'すべて',
 food: '食べ物',
 daily: '身近なもの',
 science: '科学・自然',
 culture: '文化・作品',
} as const;
type Filter = keyof typeof labels;

function TopicDeck({topics}: {topics: readonly ConversationTopic[]}) {
 const [seen, setSeen] = useState(() => topics.length ? [topics[0].id] : []);
 const current = topics.find(topic => topic.id === seen[seen.length - 1]);

 if (!current) return <p>この分野の話のネタはまだありません。</p>;

 return <>
  <div className="conversation-toolbar">
   <p className="content-count">話のネタ {topics.length}件</p>
   <button className="secondary conversation-next" type="button" disabled={topics.length < 2} onClick={() => setSeen(nextTriviaHistory(topics, seen))}>
    次の話のネタ <span aria-hidden="true">→</span>
   </button>
  </div>
  <article className="trivia-fact conversation-card" aria-live="polite" aria-atomic="true">
   <p className="conversation-category">{labels[current.category]}</p>
   <h2>{current.title}</h2>
   <p>{current.detail}</p>
   <div className="conversation-prompt">
    <p className="conversation-prompt-label">会話のきっかけ</p>
    <p>{current.prompt}</p>
   </div>
   <a className="conversation-source" href={current.source} target="_blank" rel="noopener noreferrer">出典を見る（{current.sourceName}）</a>
  </article>
 </>;
}

export default function TopicPanel({topics}: {topics: readonly ConversationTopic[]}) {
 const [filter, setFilter] = useState<Filter>('all');
 const available = filter === 'all' ? topics : topics.filter(topic => topic.category === filter);

 return <>
  <fieldset className="conversation-filters">
   <legend>話題を選ぶ</legend>
   {(Object.keys(labels) as Filter[]).map(key => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{labels[key]}</button>)}
  </fieldset>
  <TopicDeck key={filter} topics={available} />
 </>;
}
