'use client';

import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {
 advanceTogether, answerTogether, createTogetherGame, readyTogether,
 togetherStandings, type TogetherGame,
} from '../../lib/together';
import styles from './together.module.css';

function preventHeldAnswer(event: KeyboardEvent<HTMLButtonElement>) {
 if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
}

export default function TogetherPanel() {
 const [playerCount, setPlayerCount] = useState(2);
 const [rounds, setRounds] = useState(3);
 const [game, setGame] = useState<TogetherGame | null>(null);
 const [selected, setSelected] = useState<string | null>(null);
 const [announcement, setAnnouncement] = useState('');
 const activeGame = useRef<TogetherGame | null>(null);
 const activeSelection = useRef<string | null>(null);
 const mainHeading = useRef<HTMLHeadingElement>(null);
 const setupHeading = useRef<HTMLHeadingElement>(null);

 function showGame(next: TogetherGame | null) {
  activeGame.current = next;
  activeSelection.current = null;
  setGame(next);
  setSelected(null);
  setAnnouncement('');
 }

 function startGame() {
  showGame(createTogetherGame(playerCount, rounds));
 }

 function revealQuestion() {
  if (activeGame.current) showGame(readyTogether(activeGame.current));
 }

 function choose(choice: string, roundIndex: number, playerIndex: number) {
  const current = activeGame.current;
  if (!current || current.phase !== 'answer' || current.roundIndex !== roundIndex || current.playerIndex !== playerIndex) return;
  if (activeSelection.current !== choice) {
   activeSelection.current = choice;
   setSelected(choice);
   setAnnouncement(choice + 'を選択しました。同じ答えをもう一度押すと確定します。');
   return;
  }
  showGame(answerTogether(current, choice, roundIndex, playerIndex));
 }

 function nextRound() {
  if (activeGame.current) showGame(advanceTogether(activeGame.current));
 }

 useEffect(() => {
  if (game) mainHeading.current?.focus({preventScroll: true});
  else setupHeading.current?.focus({preventScroll: true});
 }, [game?.phase, game?.roundIndex, game?.playerIndex]);

 const question = game?.questions[game.roundIndex];
 const standings = game ? togetherStandings(game) : [];
 const winners = standings.filter(player => player.rank === 1);

 return <main className={styles.page}>
  <div className={styles.top}><a href="/">← ホームへ</a><span>1台のスマホで対戦</span></div>
  {!game ? <section className={styles.card}>
   <h1 ref={setupHeading} tabIndex={-1}>みんなで○×</h1>
   <p className={styles.lead}>スマホを順番に渡して、同じ問題に挑戦。</p>
   <fieldset className={styles.settings}><legend>人数</legend><div>{[2, 3, 4].map(count => <button key={count} type="button" aria-pressed={playerCount === count} onClick={() => setPlayerCount(count)}>{count}人</button>)}</div></fieldset>
   <fieldset className={styles.settings}><legend>問題数</legend><div>{[3, 5].map(count => <button key={count} type="button" aria-pressed={rounds === count} onClick={() => setRounds(count)}>{count}問ずつ</button>)}</div></fieldset>
   <p className={styles.note}>正解で10点。全員が答えてから、正解と解説を見せます。</p>
   <button className={styles.primary} type="button" onClick={startGame}>対戦を始める</button>
  </section> : game.phase === 'handoff' ? <section className={styles.handoff}>
   <p className={styles.progress}>第{game.roundIndex + 1}問 / {game.questions.length}問</p>
   <div className={styles.playerIcon} aria-hidden="true">{game.playerIndex + 1}</div>
   <h1 ref={mainHeading} tabIndex={-1}>次はプレイヤー{game.playerIndex + 1}</h1>
   <p>プレイヤー{game.playerIndex + 1}にスマホを渡してください。</p>
   <button className={styles.primary} type="button" onClick={revealQuestion} onKeyDown={preventHeldAnswer}>準備できた</button>
  </section> : game.phase === 'answer' && question ? <section className={styles.card}>
   <p className={styles.progress}>第{game.roundIndex + 1}問 / {game.questions.length}問 · プレイヤー{game.playerIndex + 1}</p>
   <h1 className={styles.question} ref={mainHeading} tabIndex={-1}>{question.prompt}</h1>
   <p className={styles.note}>同じ答えを2回押して確定</p>
   <div className={styles.choices}>{question.choices!.map(choice => <button key={choice} type="button" aria-pressed={selected === choice} onKeyDown={preventHeldAnswer} onClick={() => choose(choice, game.roundIndex, game.playerIndex)}>
    <span aria-hidden="true">{choice === '本当' ? '○' : '×'}</span>{choice}
   </button>)}</div>
   <p className={styles.announcement} role="status">{announcement}</p>
  </section> : game.phase === 'round-result' && question ? <section className={styles.card}>
   <p className={styles.progress}>全員の回答がそろいました</p>
   <h1 ref={mainHeading} tabIndex={-1}>第{game.roundIndex + 1}問の答え</h1>
   <p className={styles.resultPrompt}>{question.prompt}</p>
   <p className={styles.answer}><span aria-hidden="true">{question.answer === '本当' ? '○' : '×'}</span> {question.answer}</p>
   <p className={styles.explanation}>{question.explanation}</p>
   <h2>みんなの回答</h2>
   <ul className={styles.answers}>{game.answers.map((choice, index) => <li key={index}><span>プレイヤー{index + 1}</span><span>{choice} · {choice === question.answer ? '正解 +10点' : '不正解 0点'}</span></li>)}</ul>
   <h2>ここまでの得点</h2>
   <ol className={styles.standings}>{standings.map(player => <li key={player.player}><span>{player.rank}位　プレイヤー{player.player}</span><strong>{player.score}点</strong></li>)}</ol>
   <button className={styles.primary} type="button" onClick={nextRound} onKeyDown={preventHeldAnswer}>{game.roundIndex === game.questions.length - 1 ? '最終結果を見る' : '次の問題へ'}</button>
  </section> : <section className={styles.card}>
   <p className={styles.progress}>{game.questions.length}問ずつの対戦終了</p>
   <h1 ref={mainHeading} tabIndex={-1}>{winners.length === game.playerCount ? 'みんな同点！' : winners.length > 1 ? '同点で優勝！' : 'プレイヤー' + winners[0].player + 'の勝ち！'}</h1>
   {winners.length > 1 && <p className={styles.lead}>{winners.map(player => 'プレイヤー' + player.player).join('・')}</p>}
   <ol className={styles.standings}>{standings.map(player => <li key={player.player}><span>{player.rank}位　プレイヤー{player.player}</span><strong>{player.score}点</strong></li>)}</ol>
   <div className={styles.finalActions}><button className={styles.primary} type="button" onClick={startGame}>同じ設定でもう一度</button><button className={styles.secondary} type="button" onClick={() => showGame(null)}>人数・問題数を変える</button></div>
  </section>}
  <p className={styles.footer}>回答と得点は、この画面を開いている間だけ残ります。</p>
 </main>;
}
