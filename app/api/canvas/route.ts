import {CanvasError,fetchCanvasTasks} from '../../../lib/canvas';
export const runtime='nodejs';
export async function POST(request:Request) {
 const headers={'Cache-Control':'private, no-store','Vary':'Authorization'};
 const origin=request.headers.get('origin');
 if (origin && origin!==new URL(request.url).origin) return Response.json({error:'このページから接続してください。'},{status:403,headers});
 try {
  const result=await fetchCanvasTasks(request.headers.get('authorization')??'',AbortSignal.timeout(12000));
  return Response.json(result,{headers});
 } catch(error) {
  const known=error instanceof CanvasError;
  return Response.json({error:known?error.message:'Canvasとの通信に失敗しました。画面内の遊びは引き続き利用できます。'},{status:known?error.status:502,headers});
 }
}
