import {parseActions,STORAGE_KEY,type Action} from './actions';
import {parsePreferences,parseRecent,PREFERENCES_KEY,HISTORY_KEY,type Preferences} from './preferences';
import {parseEngagement,ENGAGEMENT_KEY,canRemember,type Engagement} from './engagement';
import {recommendations} from './recommendations';

export const MAX_BACKUP_BYTES=2*1024*1024;
export type Backup={format:'himanakimihe-backup';version:1;createdAt:string;actions:Action[];preferences:Preferences;engagement:Engagement;recent:string[]};
export function parseBackup(raw:string):Backup {
 if(new TextEncoder().encode(raw).byteLength>MAX_BACKUP_BYTES)throw new Error('ファイルは2MB以内にしてください。');
 const value:unknown=JSON.parse(raw);
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('バックアップの形式が違います。');
 const v=value as Record<string,unknown>;
 if(v.format!=='himanakimihe-backup'||v.version!==1||typeof v.createdAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(v.createdAt)||!Number.isFinite(Date.parse(v.createdAt)))throw new Error('対応するバックアップではありません。');
 const actions=parseActions(JSON.stringify(v.actions)).map(({id,title,minutes,place,note})=>({id,title,minutes,place,note}));
 if(actions.length>1000||actions.some(item=>!item.id.trim()||item.id.length>160))throw new Error('候補数または候補IDが上限を超えています。');
 const preferences=parsePreferences(v.preferences);
 const pool=recommendations(actions,[],[],null,false,'all');
 if(!v.engagement||!Array.isArray(v.recent))throw new Error('利用記録の形式が違います。');
 const engagement=parseEngagement(JSON.stringify(v.engagement),pool);
 const known=new Set(pool.filter(canRemember).map(item=>item.id));
 const recent=parseRecent(JSON.stringify(v.recent)).filter(id=>known.has(id));
 return {format:'himanakimihe-backup',version:1,createdAt:new Date(v.createdAt).toISOString(),actions,preferences,engagement,recent};
}
export function createBackup(actions:Action[],preferences:Preferences,engagement:Engagement,recent:string[],now=new Date()):Backup {
 return parseBackup(JSON.stringify({format:'himanakimihe-backup',version:1,createdAt:now.toISOString(),actions,preferences,engagement,recent}));
}
type StorageAccess=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export function writeBackup(storage:StorageAccess,backup:Backup):void {
 const valid=parseBackup(JSON.stringify(backup));
 const values:[string,string][]=[[STORAGE_KEY,JSON.stringify(valid.actions)],[PREFERENCES_KEY,JSON.stringify(valid.preferences)],[ENGAGEMENT_KEY,JSON.stringify(valid.engagement)],[HISTORY_KEY,JSON.stringify(valid.recent)]];
 const previous=values.map(([key])=>[key,storage.getItem(key)] as const);
 try{for(const [key,value] of values)storage.setItem(key,value);}
 catch{
  let restored=true;
  for(const [key,value] of previous.slice().reverse())try{if(value===null)storage.removeItem(key);else storage.setItem(key,value);}catch{restored=false;}
  throw new Error(restored?'保存できませんでした。元のデータに戻しました。':'保存できませんでした。元のデータの一部を戻せなかったため、再読み込みせず今のデータを保存してください。');
 }
}
