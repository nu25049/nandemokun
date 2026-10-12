import {coordinates,fetchPlaces} from '../../../lib/nearby';
export const runtime='nodejs';
export async function POST(request:Request) {
 const headers={'Cache-Control':'no-store'};
 const origin=request.headers.get('origin');
 if (origin && origin!==new URL(request.url).origin) return Response.json({error:'このページから検索してください。'},{status:403,headers});
 let point:{latitude:number;longitude:number};
 try {const text=await request.text();if(text.length>500)throw new Error();const body=JSON.parse(text);point=coordinates(body.latitude,body.longitude);} catch {return Response.json({error:'位置情報を取得し直してください。'},{status:400,headers});}
 try {const places=await fetchPlaces(point.latitude,point.longitude,AbortSignal.timeout(15000));return Response.json({places},{headers});}
 catch {return Response.json({error:'周辺のお店を取得できませんでした。画面内の遊びは引き続き利用できます。'},{status:502,headers});}
}
