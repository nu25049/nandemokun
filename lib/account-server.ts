import {createServerClient,type CookieOptions} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {accountConfig} from './account-config';
export const PRIVATE_HEADERS={'Cache-Control':'private, no-store, max-age=0','Vary':'Cookie','Pragma':'no-cache'};
export function accountContext(request:NextRequest){
 const config=accountConfig();
 const changes:{name:string;value:string;options:CookieOptions}[]=[];
 const client=config?createServerClient(config.url,config.key,{
  cookieOptions:{httpOnly:true,sameSite:'lax',secure:new URL(request.url).protocol==='https:'},
  cookies:{getAll:()=>request.cookies.getAll(),setAll:cookies=>{for(const cookie of cookies){request.cookies.set(cookie.name,cookie.value);changes.push(cookie);}}},
  global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',redirect:'error',signal:init?.signal?AbortSignal.any([init.signal,AbortSignal.timeout(10000)]):AbortSignal.timeout(10000)})},
 }):null;
 function finish(response:NextResponse){for(const [key,value] of Object.entries(PRIVATE_HEADERS))response.headers.set(key,value);for(const cookie of changes)response.cookies.set(cookie.name,cookie.value,cookie.options);return response;}
 return {client,finish,json:(body:unknown,status=200)=>finish(NextResponse.json(body,{status}))};
}
export function sameOrigin(request:Request):boolean{return request.headers.get('origin')===new URL(request.url).origin;}
export async function accountBody(request:Request):Promise<unknown>{const text=await request.text();if(text.length>6000)throw new Error('入力が長すぎます');return JSON.parse(text);}
