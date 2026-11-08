'use client';
import {useRef,useState} from 'react';
import {createBackup,parseBackup,writeBackup,MAX_BACKUP_BYTES,type Backup} from '../lib/backup';
import type {Action} from '../lib/actions';
import type {Preferences} from '../lib/preferences';
import type {Engagement} from '../lib/engagement';

export default function BackupPanel({actions,preferences,engagement,recent,ready}:{actions:Action[];preferences:Preferences;engagement:Engagement;recent:()=>string[];ready:boolean}){
 const [pending,setPending]=useState<Backup|null>(null),[notice,setNotice]=useState(''),[reading,setReading]=useState(false);
 const request=useRef(0);
 function download(){
  try{
   const backup=createBackup(actions,preferences,engagement,recent());
   const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json;charset=utf-8'}));
   const link=document.createElement('a'),now=new Date();
   link.href=url;link.download='himanakimihe-'+now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+'.json';
   document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setNotice('バックアップを保存しました。別のブラウザーでも、このファイルから復元できます。');
  }catch{setNotice('バックアップを作成できませんでした。現在のデータは変更していません。');}
 }
 async function read(file:File|undefined){
  const id=++request.current;setPending(null);setNotice('');if(!file){setReading(false);return;}
  setReading(true);
  try{if(file.size>MAX_BACKUP_BYTES)throw new Error('ファイルは2MB以内にしてください。');const backup=parseBackup(await file.text());if(id!==request.current)return;setPending(backup);setNotice('内容を読み込みました。まだ現在のデータは変更していません。');}
  catch{if(id===request.current)setNotice('このファイルは読み込めません。暇な君へで保存した2MB以内のJSONファイルを選んでください。現在のデータは変更していません。');}
  finally{if(id===request.current)setReading(false);}
 }
 function restore(){
  if(!pending||reading)return;
  try{writeBackup(localStorage,pending);window.location.reload();}
  catch(error){setNotice(error instanceof Error?error.message:'復元できませんでした。');}
 }
 return <section className="backup-section" id="backup" aria-labelledby="backup-title">
  <div className="section-heading"><div><span className="eyebrow">TAKE IT WITH YOU</span><h2 id="backup-title">データを保存・引き継ぎ</h2></div><p>ログインなしで、ファイルから引き継げます。</p></div>
  <div className="activity-columns">
   <div className="preference-card"><h3>今のデータを保存</h3><p>自分の候補・提案の好み・お気に入り・利用履歴を、ひとつのファイルに保存します。</p><button className="weather-button" disabled={!ready} onClick={download}>バックアップをダウンロード</button><p>Canvasやお店の情報、現在地、ログイン情報は含めません。ファイルはこのブラウザーで作成し、サーバーには送信しません。</p></div>
   <div className="preference-card"><h3>保存したファイルから復元</h3><label htmlFor="backup-file">バックアップファイル（JSON・2MB以内）</label><input id="backup-file" type="file" accept=".json,application/json" disabled={!ready} onChange={e=>void read(e.target.files?.[0])}/><p>復元すると、このブラウザーの候補・ゲスト用の好み・お気に入り・履歴を置き換えます。アカウントの設定は変更しません。</p>
    {reading&&<p>ファイルを読み込み中…</p>}
    {pending&&<div className="backup-preview"><h4>復元する内容</h4><p>保存日時：{new Date(pending.createdAt).toLocaleString('ja-JP')}</p><ul><li>自分の候補：{pending.actions.length}件</li><li>お気に入り：{pending.engagement.favorites.length}件</li><li>利用履歴：{pending.engagement.feedback.length}件</li></ul><p>現在のデータを残す場合は、先にバックアップをダウンロードしてください。復元後は画面を再読み込みします。</p><button className="secondary" onClick={restore} disabled={reading}>この内容で復元する</button><button className="cancel" onClick={()=>{request.current++;setPending(null);setNotice('復元をキャンセルしました。現在のデータは変更していません。');}}>復元をキャンセル</button></div>}
   </div>
  </div><p className="connection-notice" role="status">{notice}</p>
 </section>;
}
