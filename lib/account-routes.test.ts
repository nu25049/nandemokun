import {beforeEach,describe,expect,it,vi} from 'vitest';
import {NextRequest,NextResponse} from 'next/server';
import {defaultPreferences} from './preferences';
const stub=vi.hoisted(()=>({
 client:null as unknown,
 config:null as {url:string;key:string;googleEnabled:boolean}|null,
 finish:vi.fn<(response:NextResponse)=>NextResponse>(),
}));
vi.mock('./account-server',()=>({
 accountContext:()=>({client:stub.client,config:stub.config,json:(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}}),finish:stub.finish}),
 sameOrigin:(request:Request)=>request.headers.get('origin')===new URL(request.url).origin,
 accountBody:(request:Request)=>request.json(),
}));
import {GET} from '../app/api/account/route';
import {POST as save} from '../app/api/account/preferences/route';
import {POST as login} from '../app/api/account/login/route';
import {POST as google} from '../app/api/account/google/route';
import {GET as confirm} from '../app/auth/confirm/route';
function request(path:string,body:unknown,origin='http://localhost:3000'){return new NextRequest(`http://localhost:3000${path}`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});}
beforeEach(()=>{
 stub.client=null;
 stub.config=null;
 stub.finish.mockReset().mockImplementation(response=>{
  response.headers.set('Cache-Control','private, no-store');
  return response;
 });
});
describe('本人だけの設定API',()=>{
 it('未設定でもゲストが利用でき、送信を完了したように見せない',async()=>{
  const response=await GET(new NextRequest('http://localhost:3000/api/account'));expect(await response.json()).toEqual({configured:false,user:null,preferences:null});expect(response.headers.get('cache-control')).toContain('no-store');
  expect((await login(request('/api/account/login',{email:'test@example.com'}))).status).toBe(503);
 });
 it('他のサイトからの設定変更を認証より前に拒否する',async()=>{expect((await save(request('/api/account/preferences',defaultPreferences(),'https://outside.example'))).status).toBe(403);});
 it('無効な設定と、未ログインからの書き込みを拒否する',async()=>{
  const from=vi.fn();stub.client={auth:{getUser:vi.fn().mockResolvedValue({data:{user:null},error:null})},from};
  expect((await save(request('/api/account/preferences',{}))).status).toBe(400);
  expect((await save(request('/api/account/preferences',defaultPreferences()))).status).toBe(401);expect(from).not.toHaveBeenCalled();
 });
 it('保存する所有者をリクエストではなく検証済みのユーザーから決める',async()=>{
  const upsert=vi.fn().mockResolvedValue({error:null});stub.client={auth:{getUser:vi.fn().mockResolvedValue({data:{user:{id:'verified-user'}},error:null})},from:()=>({upsert})};
  const response=await save(request('/api/account/preferences',{...defaultPreferences(),user_id:'another-user'}));
  expect(response.status).toBe(200);expect(upsert).toHaveBeenCalledWith(expect.objectContaining({user_id:'verified-user',settings:defaultPreferences()}),{onConflict:'user_id'});
 });
 it('保存先エラー時に成功扱いにしない',async()=>{
  stub.client={auth:{getUser:vi.fn().mockResolvedValue({data:{user:{id:'verified-user'}},error:null})},from:()=>({upsert:vi.fn().mockResolvedValue({error:{message:'database error'}})})};
  expect((await save(request('/api/account/preferences',defaultPreferences()))).status).toBe(502);
 });
 it('コールバックの外部への転送指定や生のエラーを返さない',async()=>{
  const response=await confirm(new NextRequest('http://localhost:3000/auth/confirm?next=https://outside.example&code=secret-code'));
  const location=response.headers.get('location')!;expect(location).toBe('http://localhost:3000/?login=unconfigured#preferences');expect(location).not.toContain('secret-code');
 });
 it('送信先メールを検証し、確認リンクはこのサイトに固定する',async()=>{
  const send=vi.fn().mockResolvedValue({error:null});stub.client={auth:{signInWithOtp:send}};
  expect((await login(request('/api/account/login',{email:'invalid'}))).status).toBe(400);expect(send).not.toHaveBeenCalled();
  expect((await login(request('/api/account/login',{email:'fixture@example.com',next:'https://outside.example'}))).status).toBe(200);
  expect(send).toHaveBeenCalledWith({email:'fixture@example.com',options:{emailRedirectTo:'http://localhost:3000/auth/confirm',shouldCreateUser:true}});
 });
 it('検証が成功しても任意の転送先に移動しない',async()=>{
  const exchange=vi.fn().mockResolvedValue({error:null});stub.client={auth:{exchangeCodeForSession:exchange}};
  const response=await confirm(new NextRequest('http://localhost:3000/auth/confirm?next=https://outside.example&code=fixture-code'));
  expect(exchange).toHaveBeenCalledWith('fixture-code');expect(response.headers.get('location')).toBe('http://localhost:3000/?login=success#preferences');
 });
});

describe('Googleで登録・ログイン',()=>{
 const serviceOrigin='https://fixture.supabase.co';
 const enabled={url:serviceOrigin,key:'sb_publishable_fixture',googleEnabled:true};
 const path='/api/account/google';

 it('別サイトの送信を拒否し、未設定と無効化中は認証を開始しない',async()=>{
  const signInWithOAuth=vi.fn();
  stub.client={auth:{signInWithOAuth}};
  stub.config=enabled;

  const forbidden=await google(request(path,{},'https://outside.example'));
  expect(forbidden.status).toBe(403);
  expect(forbidden.headers.get('location')).toBeNull();

  for(const config of [null,{...enabled,googleEnabled:false}]){
   stub.config=config;
   const unavailable=await google(request(path,{}));
   expect(unavailable.status).toBe(303);
   expect(unavailable.headers.get('location')).toBe('http://localhost:3000/?login=google-unavailable#preferences');
   expect(unavailable.headers.get('cache-control')).toContain('no-store');
  }
  expect(signInWithOAuth).not.toHaveBeenCalled();
 });

 it('同一サイトの確認先を使用し、PKCEのCookieを載せた303で認証へ進む',async()=>{
  const callback='http://localhost:3000/auth/confirm';
  const authorize=new URL('/auth/v1/authorize',serviceOrigin);
  authorize.searchParams.set('provider','google');
  authorize.searchParams.set('redirect_to',callback);
  authorize.searchParams.set('code_challenge','fixture-challenge');
  authorize.searchParams.set('code_challenge_method','s256');
  stub.config=enabled;
  const signInWithOAuth=vi.fn().mockResolvedValue({data:{url:authorize.href},error:null});
  stub.client={auth:{signInWithOAuth}};
  stub.finish.mockImplementation(response=>{
   response.cookies.set('pkce-verifier','fixture',{httpOnly:true,sameSite:'lax',path:'/'});
   response.headers.set('Cache-Control','private, no-store');
   return response;
  });

  const response=await google(request(path+'?next=https://outside.example',{redirectTo:'https://outside.example'}));
  expect(signInWithOAuth).toHaveBeenCalledWith({provider:'google',options:{redirectTo:callback,skipBrowserRedirect:true}});
  expect(stub.finish).toHaveBeenCalledOnce();
  expect(response.status).toBe(303);
  expect(response.headers.get('location')).toBe(authorize.href);
  expect(response.headers.get('set-cookie')).toContain('pkce-verifier=fixture');
  expect(response.headers.get('cache-control')).toContain('no-store');
 });

 it('認証サービスの正規のGoogle認証URL以外はこのサイト内の失敗案内に戻す',async()=>{
  stub.config=enabled;
  const signInWithOAuth=vi.fn();
  stub.client={auth:{signInWithOAuth}};
  const authorize=serviceOrigin+'/auth/v1/authorize';
  const invalidUrls=[
   'https://outside.example/auth/v1/authorize?provider=google',
   'https://fixture.supabase.co.outside.example/auth/v1/authorize?provider=google',
   'https://untrusted:password@fixture.supabase.co/auth/v1/authorize?provider=google',
   serviceOrigin+'/other/path?provider=google',
   authorize+'?provider=github',
   authorize+'?provider=google&provider=github',
   authorize+'?provider=google#unexpected',
   'invalid URL',
  ];

  for(const url of invalidUrls){
   signInWithOAuth.mockResolvedValue({data:{url},error:null});
   const response=await google(request(path,{}));
   expect(response.status).toBe(303);
   expect(response.headers.get('location')).toBe('http://localhost:3000/?login=google-failed#preferences');
  }
 });
});
