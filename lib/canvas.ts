export const CANVAS_ORIGIN='https://nu.instructure.com';
export type CanvasTask={id:string;name:string;dueAt:string|null;url:string};
export class CanvasError extends Error {constructor(message:string,public status:number){super(message);}}
export function parseCanvasTasks(raw:unknown):CanvasTask[] {
 if (!Array.isArray(raw)) throw new CanvasError('Canvasから課題を読み込めませんでした。',502);
 const tasks:CanvasTask[]=[];
 for (const value of raw) {
  if (!value || typeof value!=='object' || value.type!=='submitting') continue;
  const assignment=value.assignment??value.quiz;
  const name=assignment?.name??assignment?.title;
  if (!assignment || !Number.isSafeInteger(assignment.id) || assignment.id<=0 || typeof name!=='string' || !name.trim() || assignment.locked_for_user===true) continue;
  const submission=assignment.submission;
  if (submission?.submitted_at || ['submitted','graded'].includes(submission?.workflow_state)) continue;
  let url:URL;
  try {url=new URL(assignment.html_url??value.html_url);} catch {continue;}
  if (url.origin!==CANVAS_ORIGIN || url.username || url.password || !/^\/courses\/\d+\/(assignments|quizzes)\/\d+\/?$/.test(url.pathname)) continue;
  const dueAt=typeof assignment.due_at==='string' && Number.isFinite(Date.parse(assignment.due_at))?new Date(assignment.due_at).toISOString():null;
  tasks.push({id:`${url.pathname}:${assignment.id}`,name:name.trim().slice(0,200),dueAt,url:url.origin+url.pathname});
 }
 return tasks.filter((task,i,all)=>all.findIndex(t=>t.id===task.id)===i).sort((a,b)=>(a.dueAt?Date.parse(a.dueAt):Infinity)-(b.dueAt?Date.parse(b.dueAt):Infinity));
}
export function nextCanvasPage(link:string|null):string|null {
 if (!link) return null;
 const part=link.split(',').find(item=>/rel="next"/.test(item));
 if (!part) return null;
 const match=/<([^>]+)>/.exec(part);
 if (!match) throw new CanvasError('Canvasのページ情報を読み込めませんでした。',502);
 const url=new URL(match[1]);
 if (url.origin!==CANVAS_ORIGIN || url.username || url.password || url.pathname!=='/api/v1/users/self/todo') throw new CanvasError('Canvasのページ情報を読み込めませんでした。',502);
 return url.href;
}
export async function fetchCanvasTasks(authorization:string,signal?:AbortSignal):Promise<{tasks:CanvasTask[];partial:boolean}> {
 if (!/^Bearer [^\s]{8,4096}$/.test(authorization)) throw new CanvasError('CanvasのAPIトークンを入力してください。',401);
 let url:string|null=`${CANVAS_ORIGIN}/api/v1/users/self/todo?per_page=100`;
 const all:unknown[]=[];
 for (let page=0;url && page<3;page++) {
  const response=await fetch(url,{headers:{Authorization:authorization,Accept:'application/json'},cache:'no-store',redirect:'error',signal});
  if (response.status===401 || response.status===403) throw new CanvasError('Canvasに接続できません。トークンの有効期限と利用権限を確認してください。',response.status);
  if (!response.ok) throw new CanvasError('Canvasから課題を取得できませんでした。時間をおいて試してください。',502);
  const data:unknown=await response.json();
  if (!Array.isArray(data)) throw new CanvasError('Canvasから課題を読み込めませんでした。',502);
  all.push(...data);url=nextCanvasPage(response.headers.get('link'));
 }
 return {tasks:parseCanvasTasks(all),partial:url!==null};
}
