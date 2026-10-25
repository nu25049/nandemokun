import {NextResponse,type NextRequest} from 'next/server';
import {accountContext} from '../../../lib/account-server';
export const runtime='nodejs';
export async function GET(request:NextRequest){
 const context=accountContext(request);
 const target=new URL('/?login=failed#preferences',request.url);
 if(!context.client){target.searchParams.set('login','unconfigured');return context.finish(NextResponse.redirect(target));}
 try{
  const code=request.nextUrl.searchParams.get('code'),token=request.nextUrl.searchParams.get('token_hash');
  const result=code&&code.length<=4096?await context.client.auth.exchangeCodeForSession(code):token&&token.length<=4096&&request.nextUrl.searchParams.get('type')==='email'?await context.client.auth.verifyOtp({token_hash:token,type:'email'}):null;
  if(result&&!result.error)target.searchParams.set('login','success');
 }catch{/* 認証コードやトークンをログ・レスポンスに含めない。 */}
 return context.finish(NextResponse.redirect(target));
}
