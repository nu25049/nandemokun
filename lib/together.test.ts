import {describe, expect, it} from 'vitest';
import {advanceTogether, answerTogether, createTogetherGame, readyTogether, togetherStandings} from './together';

describe('1台で遊ぶ○×対戦', () => {
 it('全員に同じ問題を出し、最後の回答まで正解画面に進まない', () => {
  let game = createTogetherGame(3, 3, () => 0);
  expect(new Set(game.questions.map(question => question.id)).size).toBe(3);
  for (let player = 0; player < 3; player++) {
   expect(game.phase).toBe('handoff');
   expect(game.playerIndex).toBe(player);
   game = readyTogether(game);
   expect(game.questions[game.roundIndex].id).toBe(game.questions[0].id);
   game = answerTogether(game, game.questions[0].answer, 0, player);
   expect(game.phase).toBe(player === 2 ? 'round-result' : 'handoff');
  }
  expect(game.scores).toEqual([10, 10, 10]);
 });

 it('同じ回答の重複や前の手番の操作で得点・進行を変えない', () => {
  const original = readyTogether(createTogetherGame(2, 3, () => 0));
  const answer = original.questions[0].answer;
  const afterAnswer = answerTogether(original, answer, 0, 0);
  expect(answerTogether(afterAnswer, answer, 0, 0)).toBe(afterAnswer);
  const nextPlayer = readyTogether(afterAnswer);
  expect(answerTogether(nextPlayer, answer, 0, 0)).toBe(nextPlayer);
  expect(answerTogether(nextPlayer, 'invalid', 0, 1)).toBe(nextPlayer);
  expect(advanceTogether(nextPlayer)).toBe(nextPlayer);
  expect(original.answers).toEqual([null, null]);
  expect(original.scores).toEqual([0, 0]);
 });

 it('2〜4人に3問または5問ずつ出し、正誤に合わせて順位と同順位を計算する', () => {
  for (const players of [2, 3, 4]) {
   for (const rounds of [3, 5]) {
    let game = createTogetherGame(players, rounds, () => 0);
    for (let round = 0; round < rounds; round++) {
     for (let player = 0; player < players; player++) {
      game = readyTogether(game);
      const question = game.questions[round];
      const choice = player < 2 ? question.answer : question.choices!.find(option => option !== question.answer)!;
      game = answerTogether(game, choice, round, player);
     }
     game = advanceTogether(game);
    }
    expect(game.phase).toBe('finished');
    expect(game.scores).toEqual(Array.from({length: players}, (_, player) => player < 2 ? rounds * 10 : 0));
    expect(togetherStandings(game).slice(0, 2).map(player => player.rank)).toEqual([1, 1]);
    if (players > 2) expect(togetherStandings(game)[2].rank).toBe(3);
    expect(answerTogether(game, game.questions[0].answer, 0, 0)).toBe(game);
   }
  }
 });

 it('対応外の人数や問題数を受け付けない', () => {
  for (const players of [0, 1, 5, 2.5]) expect(() => createTogetherGame(players, 3)).toThrow();
  for (const rounds of [0, 2, 4, 6]) expect(() => createTogetherGame(2, rounds)).toThrow();
 });
});
