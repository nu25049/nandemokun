import ActivityPanel from './activity-panel';
export const metadata={title:'手順とタイマー | 暇な君へ'};
export default async function ActivityPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const params=await searchParams;const id=typeof params.id==='string'?params.id:'';
 return <ActivityPanel key={id} id={id}/>;
}
