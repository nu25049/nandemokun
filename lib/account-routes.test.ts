import {beforeEach,describe,expect,it,vi} from 'vitest';
import {NextRequest,NextResponse} from 'next/server';
import {defaultPreferences} from './preferences';
const stub=vi.hoisted(()=>({client:null as unknown}));
vi.mock('./account-server',()=>({
 accountContext:()=>({client:stub.client,json:(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}}),finish:(response:NextResponse)=>response}),
 sameOrigin:(request:Request)=>request.headers.get('origin')===new URL(request.url).origin,
 accountBody:(request:Request)=>request.json(),
}));
import {GET} from '../app/api/account/route';
import {POST as save} from '../app/api/account/preferences/route';
import {POST as login} from '../app/api/account/login/route';
import {GET as confirm} from '../app/auth/confirm/route';
function request(path:string,body:unknown,origin='http://localhost:3000'){return new NextRequest(`http://localhost:3000${path}`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});}
describe('本人だけの設定API',()=>{
 beforeEach(()=>{stub.client=null;});
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
