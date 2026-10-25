import type {NextRequest} from 'next/server';
import {accountBody,accountContext,sameOrigin} from '../../../../lib/account-server';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const context=accountContext(request);
 if(!sameOrigin(request))return context.json({error:'このページから操作してください。'},403);
 if(!context.client)return context.json({error:'ログインは準備中です。ログインせずにすべての遊びと端末内の調整を使えます。'},503);
 try{
  const last=Number(request.cookies.get('hh-login-at')?.value??0);
  if(Number.isFinite(last)&&Date.now()-last<60000)return context.json({error:'少し待ってからもう一度お試しください。'},429);
  const body=await accountBody(request) as {email?:unknown};
  if(typeof body?.email!=='string'||body.email.length>254||!/^\S+@\S+\.\S+$/.test(body.email.trim()))return context.json({error:'メールアドレスを確認してください。'},400);
  const {error}=await context.client.auth.signInWithOtp({email:body.email.trim(),options:{emailRedirectTo:new URL('/auth/confirm',request.url).href,shouldCreateUser:true}});
  if(error)return context.json({error:'ログインメールを送信できませんでした。時間をおいて試してください。'},error.status===429?429:502);
  const response=context.json({message:'メールを送信しました。同じブラウザーでリンクを開いてください。'});
  response.cookies.set('hh-login-at',String(Date.now()),{httpOnly:true,sameSite:'lax',secure:new URL(request.url).protocol==='https:',path:'/',maxAge:60});
  return response;
 }catch{return context.json({error:'ログインメールを送信できませんでした。入力内容と接続を確認してください。'},400);}
}
