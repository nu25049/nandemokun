import {describe,expect,it} from 'vitest';
import {accountConfig} from './account-config';
describe('任意の認証設定',()=>{
 it('未設定や管理者キーを受け入れず、公開用キーだけを利用する',()=>{
  expect(accountConfig({})).toBeNull();
  const base={SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'};
  expect(accountConfig(base)?.url).toBe(base.SUPABASE_URL);
  expect(accountConfig({...base,SUPABASE_PUBLISHABLE_KEY:'sb_secret_test'})).toBeNull();
  const token='header.'+Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url')+'.signature';expect(accountConfig({...base,SUPABASE_PUBLISHABLE_KEY:token})).toBeNull();
 });
 it('任意のURLへの誤送信を防ぎ、ローカル開発だけHTTPを許す',()=>{
  for(const url of ['http://external.example','https://user:pass@example.com','https://example.com/path','https://example.com?query=1'])expect(accountConfig({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'})).toBeNull();
  expect(accountConfig({SUPABASE_URL:'http://127.0.0.1:54321',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'})).not.toBeNull();
 });
});
