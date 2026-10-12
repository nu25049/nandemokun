import PlayPanel from '../play-panel';
import {playSettings} from '../../lib/play';

export const metadata={title:'頭の体操 | 暇な君へ'};

export default async function PlayPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 const settings=playSettings(await searchParams);
 return <PlayPanel key={`${settings.kind}:${settings.mode}:${settings.minutes}`} {...settings}/>;
}
