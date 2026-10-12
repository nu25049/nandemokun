import {afterEach,describe,expect,it,vi} from 'vitest';
import {coordinates,distanceMeters,fetchPlaces,parsePlaces} from './nearby';
import {CANVAS_ORIGIN,fetchCanvasTasks,nextCanvasPage,parseCanvasTasks} from './canvas';
import {POST as nearbyPost} from '../app/api/nearby/route';
import {POST as canvasPost} from '../app/api/canvas/route';
afterEach(()=>vi.unstubAllGlobals());
const todo=(id=1,due:string|null='2026-10-13T12:00:00Z')=>({type:'submitting',assignment:{id,name:`課題${id}`,due_at:due,html_url:`${CANVAS_ORIGIN}/courses/1/assignments/${id}`}});
describe('周辺のお店',()=>{
 it('緯度経度を検証し、検索用に4桁へ丸める',()=>{
  expect(coordinates(35.681236,139.767125)).toEqual({latitude:35.6812,longitude:139.7671});
  for(const [lat,lon] of [[91,0],[0,181],[NaN,0],['1',2],[null,2]])expect(()=>coordinates(lat,lon)).toThrow();
 });
 it('不正・遠方・名無しを除き、近い順と往復＋滞在時間を返す',()=>{
  const node={id:1,type:'node',lat:35,lon:139,tags:{name:'近所のカフェ',amenity:'cafe'}};
  const result=parsePlaces({elements:[{...node,id:2,lat:35.002},node,{...node,id:3,lat:36},{...node,id:4,tags:{}},{...node,id:5,tags:{name:4}}]},35,139);
  expect(result.map(p=>p.id)).toEqual(['node-1','node-2']);expect(result[0].minutes).toBe(17);
  expect(result[1].minutes).toBe(result[1].walkMinutes*2+15);
  expect(result[0].url).toBe('https://www.openstreetmap.org/node/1');
  expect(()=>parsePlaces({},35,139)).toThrow();expect(parsePlaces({elements:[]},35,139)).toEqual([]);
  expect(distanceMeters(35,139,35,139)).toBe(0);
 });
 it('固定サービスだけに固定範囲の検索を送り、通信失敗を伝える',async()=>{
  const mock=vi.fn().mockResolvedValue(new Response(JSON.stringify({elements:[]})));
  vi.stubGlobal('fetch',mock);expect(await fetchPlaces(35,139)).toEqual([]);
  expect(mock.mock.calls[0][0]).toBe('https://overpass-api.de/api/interpreter');
  expect(mock.mock.calls[0][1].body.get('data')).toContain('around:800,35,139');
  mock.mockResolvedValue(new Response('',{status:429}));await expect(fetchPlaces(35,139)).rejects.toThrow();
 });
 it('APIは不正座標と別サイトからの要求を外部送信前に拒否する',async()=>{
  const mock=vi.fn();vi.stubGlobal('fetch',mock);
  expect((await nearbyPost(new Request('https://app.example/api/nearby',{method:'POST',body:'{"latitude":91,"longitude":0}'}))).status).toBe(400);
  expect((await nearbyPost(new Request('https://app.example/api/nearby',{method:'POST',headers:{Origin:'https://evil.example'},body:'{}'}))).status).toBe(403);
  expect(mock).not.toHaveBeenCalled();
 });
});
describe('Canvasの読み取り',()=>{
 it('未提出だけを期限順に並べ、期限なし・重複・不正リンクを扱う',()=>{
  const result=parseCanvasTasks([todo(2,null),todo(1),todo(1),{...todo(3),type:'grading'},{...todo(4),assignment:{...todo(4).assignment,submission:{workflow_state:'submitted'}}},{...todo(5),assignment:{...todo(5).assignment,html_url:'https://evil.example/courses/1/assignments/5'}}]);
  expect(result.map(t=>t.name)).toEqual(['課題1','課題2']);expect(result[1].dueAt).toBeNull();
  expect(parseCanvasTasks([])).toEqual([]);expect(()=>parseCanvasTasks({})).toThrow();
 });
 it('ページ送りは学校のToDo APIだけを許し、トークン流出先へ進まない',()=>{
  expect(nextCanvasPage(`<${CANVAS_ORIGIN}/api/v1/users/self/todo?page=2>; rel="next"`)).toContain('page=2');
  for(const url of ['https://evil.example/api/v1/users/self/todo',`${CANVAS_ORIGIN}/other`,'http://127.0.0.1/api/v1/users/self/todo'])expect(()=>nextCanvasPage(`<${url}>; rel="next"`)).toThrow();
  expect(nextCanvasPage(null)).toBeNull();
 });
 it('小テスト形式のToDoも課題として扱う',()=>{
  const tasks=parseCanvasTasks([{type:'submitting',quiz:{id:1,title:'確認クイズ',html_url:`${CANVAS_ORIGIN}/courses/1/quizzes/1`,due_at:null}}]);
  expect(tasks).toHaveLength(1);expect(tasks[0].name).toBe('確認クイズ');
 });
 it('大量のページが続いても3回で止めて一部取得であることを伝える',async()=>{
  const mock=vi.fn().mockResolvedValue(new Response(JSON.stringify([todo(1)]),{headers:{link:`<${CANVAS_ORIGIN}/api/v1/users/self/todo?page=2>; rel="next"`}}));
  // 各fetchは独立したResponseを返す。
  mock.mockImplementation(async()=>new Response(JSON.stringify([todo(1)]),{headers:{link:`<${CANVAS_ORIGIN}/api/v1/users/self/todo?page=2>; rel="next"`}}));
  vi.stubGlobal('fetch',mock);const result=await fetchCanvasTasks('Bearer test-only-fixture');
  expect(mock).toHaveBeenCalledTimes(3);expect(result.partial).toBe(true);expect(result.tasks).toHaveLength(1);
 });
 it('本人のトークンを固定接続先にだけ送り、ページを結合する',async()=>{
  const mock=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify([todo(1)]),{headers:{link:`<${CANVAS_ORIGIN}/api/v1/users/self/todo?page=2>; rel="next"`}})).mockResolvedValueOnce(new Response(JSON.stringify([todo(2)])));
  vi.stubGlobal('fetch',mock);const result=await fetchCanvasTasks('Bearer test-only-fixture');
  expect(result.tasks).toHaveLength(2);expect(result.partial).toBe(false);
  expect(mock.mock.calls[0][1]).toMatchObject({cache:'no-store',redirect:'error',headers:{Authorization:'Bearer test-only-fixture'}});
 });
 it('認証切れ・不正データ・外部へのページ送りを安全なエラーにする',async()=>{
  const mock=vi.fn().mockResolvedValue(new Response('',{status:401}));vi.stubGlobal('fetch',mock);
  await expect(fetchCanvasTasks('Bearer test-only-fixture')).rejects.toMatchObject({status:401});
  mock.mockResolvedValue(new Response('{}'));await expect(fetchCanvasTasks('Bearer test-only-fixture')).rejects.toThrow();
  mock.mockResolvedValue(new Response('[]',{headers:{link:'<https://evil.example>; rel="next"'}}));await expect(fetchCanvasTasks('Bearer test-only-fixture')).rejects.toThrow();
  expect(mock).toHaveBeenCalledTimes(3);
 });
 it('課題APIは認証なしを拒否し、私的な結果をキャッシュしない',async()=>{
  const mock=vi.fn().mockResolvedValue(new Response(JSON.stringify([todo(1)])));vi.stubGlobal('fetch',mock);
  const denied=await canvasPost(new Request('https://app.example/api/canvas',{method:'POST'}));expect(denied.status).toBe(401);expect(mock).not.toHaveBeenCalled();
  const result=await canvasPost(new Request('https://app.example/api/canvas',{method:'POST',headers:{Authorization:'Bearer test-only-fixture'}}));
  expect(result.status).toBe(200);expect(result.headers.get('cache-control')).toContain('no-store');expect(JSON.stringify(await result.json())).not.toContain('test-only-fixture');
 });
});
