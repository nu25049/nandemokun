import {NextResponse, type NextRequest} from 'next/server';
import {accountContext, sameOrigin} from '../../../../lib/account-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
 const context = accountContext(request);
 if (!sameOrigin(request)) return context.json({error: 'このページから操作してください。'}, 403);

 function back(status: 'google-unavailable' | 'google-failed') {
  return context.finish(NextResponse.redirect(new URL('/?login=' + status + '#preferences', request.url), 303));
 }

 if (!context.client || !context.config?.googleEnabled) return back('google-unavailable');

 try {
  const callback = new URL('/auth/confirm', request.url).href;
  const {data, error} = await context.client.auth.signInWithOAuth({
   provider: 'google',
   options: {redirectTo: callback, skipBrowserRedirect: true},
  });
  if (error || !data.url) return back('google-failed');

  const target = new URL(data.url);
  const providers = target.searchParams.getAll('provider');
  if (target.origin !== context.config.url || target.username || target.password || target.hash ||
      target.pathname !== '/auth/v1/authorize' || providers.length !== 1 || providers[0] !== 'google') {
   return back('google-failed');
  }

  return context.finish(NextResponse.redirect(target, 303));
 } catch {
  return back('google-failed');
 }
}
