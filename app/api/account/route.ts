import type {NextRequest} from 'next/server';
import {accountContext} from '../../../lib/account-server';
import {parsePreferences} from '../../../lib/preferences';
export const runtime='nodejs';
export async function GET(request:NextRequest){
 const context=accountContext(request);
 if(!context.client)return context.json({configured:false,user:null,preferences:null});
 try{
  const {data,error}=await context.client.auth.getUser();
  if(!data.user){if(error&&error.name!=='AuthSessionMissingError'&&error.status!==401&&error.status!==403)return context.json({configured:true,error:'ログイン状態を確認できません。端末内の調整は利用できます。'},503);return context.json({configured:true,user:null,preferences:null});}
  const user={id:data.user.id,email:data.user.email??''};
  const result=await context.client.from('recommendation_preferences').select('settings').eq('user_id',user.id).maybeSingle();
  if(result.error)return context.json({configured:true,user,preferences:null,warning:'アカウントの設定を読み込めませんでした。端末内の調整を使えます。'});
  let preferences=null;
  if(result.data){try{preferences=parsePreferences(result.data.settings);}catch{return context.json({configured:true,user,preferences:null,warning:'保存された設定を読み込めません。設定を選び直して保存してください。'});}}
  return context.json({configured:true,user,preferences});
 }catch{return context.json({configured:true,error:'ログイン状態を確認できません。端末内の調整は利用できます。'},503);}
}
