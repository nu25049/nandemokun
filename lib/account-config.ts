export function accountConfig(env:Record<string,string|undefined>=process.env):{url:string;key:string}|null {
 const url=env.SUPABASE_URL,key=env.SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key||key.startsWith('sb_secret_'))return null;
 try{
  const parsed=new URL(url);
  if(parsed.username||parsed.password||parsed.search||parsed.hash||!['','/'].includes(parsed.pathname))return null;
  if(parsed.protocol!=='https:'&&!(parsed.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsed.hostname)))return null;
  if(!key.startsWith('sb_publishable_')){
   const payload=JSON.parse(Buffer.from(key.split('.')[1]??'','base64url').toString('utf8'));
   if(payload.role!=='anon')return null;
  }
  return {url:parsed.origin,key};
 }catch{return null;}
}
