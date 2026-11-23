import {nextQuestion, type Question} from './play';

export type TogetherPhase = 'handoff' | 'answer' | 'round-result' | 'finished';
export type TogetherGame = {
 playerCount: number;
 questions: readonly Question[];
 roundIndex: number;
 playerIndex: number;
 phase: TogetherPhase;
 answers: (string | null)[];
 scores: number[];
};

export function createTogetherGame(playerCount: number, rounds: number, random = Math.random): TogetherGame {
 if (![2, 3, 4].includes(playerCount) || ![3, 5].includes(rounds)) {
  throw new Error('人数は2〜4人、問題数は3問か5問で選んでください。');
 }
 const questions: Question[] = [];
 for (let round = 0; round < rounds; round++) {
  questions.push(nextQuestion('trivia', questions.map(question => question.id), random));
 }
 return {
  playerCount,
  questions,
  roundIndex: 0,
  playerIndex: 0,
  phase: 'handoff',
  answers: Array(playerCount).fill(null),
  scores: Array(playerCount).fill(0),
 };
}

export function readyTogether(game: TogetherGame): TogetherGame {
 return game.phase === 'handoff' ? {...game, phase: 'answer'} : game;
}

export function answerTogether(
 game: TogetherGame,
 choice: string,
 roundIndex: number,
 playerIndex: number,
): TogetherGame {
 const question = game.questions[game.roundIndex];
 if (game.phase !== 'answer' || roundIndex !== game.roundIndex || playerIndex !== game.playerIndex ||
     game.answers[playerIndex] !== null || !question.choices?.includes(choice)) return game;
 const answers = [...game.answers];
 const scores = [...game.scores];
 answers[playerIndex] = choice;
 if (choice === question.answer) scores[playerIndex] += 10;
 const lastPlayer = playerIndex === game.playerCount - 1;
 return {
  ...game,
  answers,
  scores,
  playerIndex: lastPlayer ? playerIndex : playerIndex + 1,
  phase: lastPlayer ? 'round-result' : 'handoff',
 };
}

export function advanceTogether(game: TogetherGame): TogetherGame {
 if (game.phase !== 'round-result') return game;
 if (game.roundIndex === game.questions.length - 1) return {...game, phase: 'finished'};
 return {
  ...game,
  roundIndex: game.roundIndex + 1,
  playerIndex: 0,
  phase: 'handoff',
  answers: Array(game.playerCount).fill(null),
 };
}

export function togetherStandings(game: TogetherGame): {player: number; score: number; rank: number}[] {
 return game.scores
  .map((score, index) => ({player: index + 1, score, rank: 1 + game.scores.filter(other => other > score).length}))
  .sort((first, second) => first.rank - second.rank || first.player - second.player);
}
