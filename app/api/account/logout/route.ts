import type {NextRequest} from 'next/server';
import {accountContext,sameOrigin} from '../../../../lib/account-server';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 const context=accountContext(request);
 if(!sameOrigin(request))return context.json({error:'このページから操作してください。'},403);
 try{if(context.client){const {error}=await context.client.auth.signOut({scope:'local'});if(error)return context.json({error:'ログアウトできませんでした。もう一度お試しください。'},502);}return context.json({signedOut:true});}catch{return context.json({error:'ログアウトできませんでした。'},502);}
}
