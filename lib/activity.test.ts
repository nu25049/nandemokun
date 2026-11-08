import {it,expect} from 'vitest';
import {catalog} from './catalog';
import {resolveActivity,activitySteps,createActivityTimer,remainingActivitySeconds,pauseActivityTimer,resumeActivityTimer} from './activity';
it('カタログと現在の自作候補だけを開始でき、削除・外部・ゲームのIDを拒否する',()=>{
 expect(resolveActivity(catalog[0].id,[])?.title).toBe(catalog[0].title);
 const action={id:'one',title:'丸を描く',minutes:1,place:'indoor' as const,note:'紙を用意する。丸を描く。'};
 expect(resolveActivity('saved:one',[action])?.minutes).toBe(1);expect(resolveActivity('saved:one',[])).toBeNull();
 for(const id of ['canvas:private','nearby:1','play:word','missing',''])expect(resolveActivity(id,[action])).toBeNull();
 expect(activitySteps(action.note)).toEqual(['紙を用意する','丸を描く']);expect(activitySteps('。\n')).toEqual([]);
});
it('実時間で残り時間を測り、一時停止時間を除き、0秒から負にならない',()=>{
 let timer=createActivityTimer(1,1000);expect(remainingActivitySeconds(timer,1000)).toBe(60);expect(remainingActivitySeconds(timer,11500)).toBe(50);
 timer=pauseActivityTimer(timer,11000);expect(remainingActivitySeconds(timer,99000)).toBe(50);expect(pauseActivityTimer(timer,99999)).toEqual(timer);
 timer=resumeActivityTimer(timer,101000);expect(remainingActivitySeconds(timer,111000)).toBe(40);expect(resumeActivityTimer(timer,111000)).toEqual(timer);expect(remainingActivitySeconds(timer,200000)).toBe(0);
 expect(remainingActivitySeconds(createActivityTimer(NaN,0),0)).toBe(60);
});
