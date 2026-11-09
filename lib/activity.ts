import {refreshInitialActions,type Action} from './actions';
import {recommendations,type Recommendation} from './recommendations';
export function resolveActivity(id:string,actions:Action[]):Recommendation|null {
 return recommendations(refreshInitialActions(actions),[],[],null,false,'all').find(item=>item.id===id&&(item.source==='library'||item.source==='saved'))??null;
}
export function activitySteps(note:string):string[]{return note.split(/[。\n]+/).map(step=>step.trim()).filter(Boolean);}
export type ActivityTimer={duration:number;startedAt:number;elapsed:number;paused:boolean};
export function createActivityTimer(minutes:number,now=Date.now()):ActivityTimer{return {duration:(Number.isInteger(minutes)&&minutes>=1&&minutes<=1440?minutes:1)*60000,startedAt:now,elapsed:0,paused:false};}
export function remainingActivitySeconds(timer:ActivityTimer,now=Date.now()):number{return Math.max(0,Math.ceil((timer.duration-timer.elapsed-(timer.paused?0:Math.max(0,now-timer.startedAt)))/1000));}
export function pauseActivityTimer(timer:ActivityTimer,now=Date.now()):ActivityTimer{return timer.paused?timer:{...timer,elapsed:timer.elapsed+Math.max(0,now-timer.startedAt),startedAt:now,paused:true};}
export function resumeActivityTimer(timer:ActivityTimer,now=Date.now()):ActivityTimer{return timer.paused?{...timer,startedAt:now,paused:false}:timer;}
