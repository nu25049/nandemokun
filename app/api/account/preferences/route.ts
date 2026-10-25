import type {NextRequest} from 'next/server';
import {accountBody,accountContext,sameOrigin} from '../../../../lib/account-server';
import {parsePreferences} from '../../../../lib/preferences';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const context=accountContext(request);
 if(!sameOrigin(request))return context.json({error:'このページから操作してください。'},403);
 if(!context.client)return context.json({error:'ログインは準備中です。設定はこの端末に保存できます。'},503);
 let preferences;
 try{preferences=parsePreferences(await accountBody(request));}catch{return context.json({error:'設定の値を確認してください。'},400);}
 try{
  const {data,error}=await context.client.auth.getUser();
  if(error||!data.user)return context.json({error:'設定をアカウントに保存するにはログインしてください。'},401);
  const result=await context.client.from('recommendation_preferences').upsert({user_id:data.user.id,settings:preferences,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  if(result.error)return context.json({error:'アカウントに保存できませんでした。この端末の設定は残っています。'},502);
  return context.json({saved:true});
 }catch{return context.json({error:'設定を保存できませんでした。この端末の設定は残っています。'},502);}
}
