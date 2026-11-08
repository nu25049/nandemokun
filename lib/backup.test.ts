import {describe,expect,it} from 'vitest';
import {createBackup,parseBackup,writeBackup} from './backup';
import {STORAGE_KEY,type Action} from './actions';
import {defaultPreferences,HISTORY_KEY,PREFERENCES_KEY} from './preferences';
import {ENGAGEMENT_KEY,emptyEngagement} from './engagement';
import {recommendations} from './recommendations';

const action:Action={id:'backup-one',title:'1分で机の物を戻す',minutes:1,place:'indoor',note:'3つ戻したら終了'};
const now=new Date('2026-11-09T00:00:00.000Z');
function fixture(actions:Action[]=[action]){
 const saved=actions.length?'saved:'+actions[0].id:'play:calculation';
 const category=actions.length?'saved' as const:'calculation' as const;
 return createBackup(actions,defaultPreferences(),{...emptyEngagement(),learn:true,favorites:[saved],feedback:[{id:'result-1',recommendationId:saved,category,outcome:'done',at:now.getTime()}]},[saved],now);
}
function memory(initial:Record<string,string>={}){
 const data=new Map(Object.entries(initial));
 return {data,getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value)},removeItem:(key:string)=>{data.delete(key)}};
}

describe('端末内データの持ち運び',()=>{
 it('候補0件・1件のバックアップを復元し、削除済み初期候補を補充しない',()=>{
  for(const actions of [[],[action]]){
   const backup=fixture(actions);
   expect(backup.format).toBe('himanakimihe-backup');expect(backup.version).toBe(1);expect(backup.createdAt).toBe(now.toISOString());
   expect(parseBackup(JSON.stringify(backup))).toEqual(backup);expect(backup.actions).toEqual(actions);
  }
 });
 it('壊れたファイル・別形式・別バージョン・不正な必須情報を拒否する',()=>{
  const backup=fixture();
  for(const raw of ['{broken','null','[]','{}',JSON.stringify({...backup,format:'other-app'}),JSON.stringify({...backup,version:2}),JSON.stringify({...backup,createdAt:'invalid-date'}),JSON.stringify({...backup,actions:'invalid'}),JSON.stringify({...backup,preferences:{}}),JSON.stringify({...backup,engagement:null}),JSON.stringify({...backup,recent:null})])expect(()=>parseBackup(raw)).toThrow();
 });
 it('候補IDの重複と時間や候補名の不正値を拒否する',()=>{
  const backup=fixture();
  for(const actions of [[action,action],[{...action,id:''}],[{...action,id:'x'.repeat(161)}],[{...action,minutes:0}],[{...action,minutes:1.5}],[{...action,title:''}],[{...action,place:'unknown'}],Array.from({length:1001},(_,i)=>({...action,id:'action-'+i}))])expect(()=>parseBackup(JSON.stringify({...backup,actions}))).toThrow();
 });
 it('余分なアカウント・認証・外部データを除去し、既知の候補だけを持ち運ぶ',()=>{
  const backup=fixture(),game=recommendations([],[],[],null,false,'play')[0];
  const hostile={...backup,account:{token:'private-account-secret'},token:'private-top-secret',actions:[{...action,token:'private-action-secret',url:'https://private.example'}],preferences:{...backup.preferences,token:'private-preference-secret'},recent:['saved:backup-one',game.id,'canvas:private-course','nearby:private-place','saved:deleted'],engagement:{...backup.engagement,token:'private-engagement-secret',favorites:['saved:backup-one',game.id,'canvas:private-course','nearby:private-place','saved:deleted'],feedback:[{...backup.engagement.feedback[0],note:'private-feedback-secret'},{id:'external',recommendationId:'canvas:private-course',category:'canvas',outcome:'done',at:now.getTime()}]}};
  const parsed=parseBackup(JSON.stringify(hostile));
  expect(parsed.actions).toEqual([action]);expect(parsed.recent).toEqual(['saved:backup-one',game.id]);expect(parsed.engagement.favorites).toEqual(['saved:backup-one',game.id]);expect(parsed.engagement.feedback).toHaveLength(1);
  expect(JSON.stringify(parsed)).not.toMatch(/private|token|account|canvas:|nearby:|deleted/);
 });
 it('ファイル容量を文字数ではなくUTF-8のバイト数で制限する',()=>{
  const raw=JSON.stringify({...fixture(),padding:'あ'.repeat(750000)});
  expect(raw.length).toBeLessThan(2*1024*1024);expect(new TextEncoder().encode(raw).byteLength).toBeGreaterThan(2*1024*1024);
  expect(()=>parseBackup(raw)).toThrow();
 });
 it('4種類の端末内データを保存し、アカウント固有の設定を変更しない',()=>{
  const accountKey=PREFERENCES_KEY+':account-1',storage=memory({[accountKey]:'account-settings'}),backup=fixture();
  writeBackup(storage,backup);
  expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toEqual(backup.actions);expect(JSON.parse(storage.getItem(PREFERENCES_KEY)!)).toEqual(backup.preferences);expect(JSON.parse(storage.getItem(ENGAGEMENT_KEY)!)).toEqual(backup.engagement);expect(JSON.parse(storage.getItem(HISTORY_KEY)!)).toEqual(backup.recent);
  expect(storage.getItem(accountKey)).toBe('account-settings');
 });
 it('途中で保存に失敗したら、値がなかった項目も含めて元に戻す',()=>{
  const storage=memory({[STORAGE_KEY]:'previous-actions',[ENGAGEMENT_KEY]:'previous-engagement','unrelated':'keep'}),previous=new Map(storage.data);
  let failed=false;const set=storage.setItem;
  storage.setItem=(key,value)=>{if(key===ENGAGEMENT_KEY&&!failed){failed=true;throw new Error('quota exceeded')}set(key,value)};
  expect(()=>writeBackup(storage,fixture())).toThrow();expect(storage.data).toEqual(previous);
 });
 it('保存前の読み取りに失敗した場合は既存データを変更しない',()=>{
  const storage=memory({[STORAGE_KEY]:'existing'}),previous=new Map(storage.data);
  storage.getItem=()=>{throw new Error('storage blocked')};
  expect(()=>writeBackup(storage,fixture())).toThrow();expect(storage.data).toEqual(previous);
 });
});
