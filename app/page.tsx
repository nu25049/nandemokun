'use client';
import {useCallback,useEffect,useState} from 'react';
import {type Action,initialActions,parseActions,pickNextAction,refreshInitialActions,STORAGE_KEY} from '../lib/actions';
import {recommendations,type Recommendation,type Source} from '../lib/recommendations';
import type {NearbyPlace} from '../lib/nearby';
import type {CanvasTask} from '../lib/canvas';
import WeatherPanel from './weather-panel';
import {playHref,type GameKind,type TimerMode} from '../lib/play';
import NearbyPanel from './nearby-panel';
import CanvasPanel from './canvas-panel';

export default function Home() {
 const [actions,setActions]=useState<Action[]>([]);
 const [places,setPlaces]=useState<NearbyPlace[]>([]);
 const [tasks,setTasks]=useState<CanvasTask[]>([]);
 const [ready,setReady]=useState(false);
 const [result,setResult]=useState<Recommendation|null>(null);
 const [gameKind,setGameKind]=useState<GameKind>('calculation');
 const [gameMinutes,setGameMinutes]=useState(1);
 const [timerMode,setTimerMode]=useState<TimerMode>('down');
 const [message,setMessage]=useState('');
 const [editing,setEditing]=useState<string|null>(null);
 const [title,setTitle]=useState('');
 const [minutes,setMinutes]=useState('15');
 const [place,setPlace]=useState<'indoor'|'outdoor'>('indoor');
 const [note,setNote]=useState('');
 const [maxMinutes,setMaxMinutes]=useState<number|null>(1);
 const [source,setSource]=useState<Source>('all');
 const [avoidRepeat,setAvoidRepeat]=useState(false);
 const [indoorOnly,setIndoorOnly]=useState(false);
 const changePlace=useCallback((value:boolean)=>{setIndoorOnly(value);setResult(current=>value&&current?.place==='outdoor'?null:current);},[]);
 const changePlaces=useCallback((next:NearbyPlace[])=>{setPlaces(next);setResult(current=>current?.source==='nearby'?null:current);},[]);
 const changeTasks=useCallback((next:CanvasTask[])=>{setTasks(next);setResult(current=>current?.source==='canvas'?null:current);},[]);
 const eligible=recommendations(actions,places,tasks,maxMinutes,indoorOnly,source);
 useEffect(()=>{
  try {const raw=localStorage.getItem(STORAGE_KEY);setActions(raw===null?initialActions:refreshInitialActions(parseActions(raw)));}
  catch {setMessage('保存データを読み込めませんでした。自分の候補を追加して再保存できます。画面内の遊びは利用できます。');}
  setReady(true);
 },[]);
 function persist(next:Action[]){setActions(next);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setMessage('自分の候補をこの端末に保存しました。');}catch{setMessage('端末への保存に失敗しました。再読み込みすると変更が失われる可能性があります。');}}
 function resetForm(){setEditing(null);setTitle('');setMinutes('15');setPlace('indoor');setNote('');}
 function submit(e:React.FormEvent){
  e.preventDefault();const n=Number(minutes);
  if(!title.trim()||title.trim().length>80||!Number.isInteger(n)||n<1||n>1440){setMessage('候補名と1〜1440分の整数を入力してください。');return;}
  const item:Action={id:editing??crypto.randomUUID(),title:title.trim(),minutes:n,place,note:note.trim()};
  const next=editing?actions.map(a=>a.id===editing?item:a):[...actions,item];persist(next);
  if(result?.source==='saved'&&result.actionId===editing)setResult(recommendations(next,[],[],maxMinutes,indoorOnly,'saved').find(a=>a.actionId===editing)??null);
  resetForm();
 }
 function edit(a:Action){setEditing(a.id);setTitle(a.title);setMinutes(String(a.minutes));setPlace(a.place);setNote(a.note);document.getElementById('action-title')?.focus();}
 function remove(a:Action){if(!window.confirm(`「${a.title}」を削除しますか？`))return;persist(actions.filter(x=>x.id!==a.id));if(result?.source==='saved'&&result.actionId===a.id)setResult(null);if(editing===a.id)resetForm();}
 function changeTime(value:string){setMaxMinutes(value===''?null:Number(value));setResult(null);}
 function changeSource(value:Source){setSource(value);setResult(null);}
 function suggest(){setResult(pickNextAction(eligible,result?.id??null,avoidRepeat));setMessage(eligible.length?'空き時間に合う候補を選びました。':'条件を変えるか、連携先を確認してください。');}
 const emptyMessage=source==='nearby'?(places.length?'この時間に収まるお店がありません':'先に近くのお店を調べよう'):source==='canvas'?'Canvasの課題を取得してみよう':source==='saved'&&!actions.length?'自分の候補を追加しよう':'この条件に合う候補がありません';
 return <main>
  <header><a className="brand" href="/">暇な君へ<span className="brand-dot">●</span></a><nav className="header-links"><a className="nav" href="#connections">お店・課題</a><a className="nav" href="#my-actions">自分の候補 ↗</a></nav></header>
  <section className="home-dashboard" aria-label="次の行動を提案">
   <div className="suggestion proposal-card">
    <div className="card-top"><span>YOUR NEXT MOVE</span><span className="pill">{ready?`${eligible.length}件から提案`:'読み込み中'}</span></div>
    <h1>空いた時間、<em>何しよう？</em></h1>
    <button className="primary propose-button" disabled={!ready||!eligible.length} onClick={suggest}>{result?'もうひとつ提案して':'いま、何しよう？'} <span>↗</span></button>
    <div className="result" aria-live="polite">
     {result?<><div className="result-meta">{result.place==='indoor'?'室内で':'外に出て'} · 約{result.minutes}分</div><h2>{result.title}</h2>{result.note&&<p>{result.game?'下のボタンで専用画面へ。問題に集中して遊べます。':result.note}</p>}
      {result.dueAt&&<p className="task-due">期限：{new Date(result.dueAt).toLocaleString('ja-JP')}</p>}
      {result.url&&<a className="result-link" href={result.url} target="_blank" rel="noreferrer">{result.source==='canvas'?'Canvasで課題を開く':'地図でお店を見る'} ↗</a>}
      {result.game&&<a className="result-link" href={playHref(result.game,result.minutes,timerMode)}>この遊びを大画面で始める ↗</a>}
     </>:ready&&!eligible.length?<><h2>{emptyMessage}</h2><p>{source==='nearby'?'検索結果の移動時間と滞在時間を見込んで選びます。':source==='canvas'?'下の接続欄から、未提出のToDoを確認できます。':'時間や種類を変えるか、自分の候補を追加できます。'}</p><button className="reset-time" onClick={()=>{setSource('play');setResult(null);}}>画面内の遊びにする</button></>:
      <p className="proposal-hint">ボタンを押せば、次にすることをひとつ提案。<br/>条件を変えるなら左下、すぐ遊ぶなら右下へ。</p>}
    </div>
   </div>
   <div className="dashboard-bottom">
    <section className="dashboard-options" aria-labelledby="options-title"><span className="eyebrow">YOUR OPTIONS</span><h2 id="options-title">提案のオプション</h2>
    <div className="suggestion-options">
     <label htmlFor="available-time">使える時間</label><select id="available-time" value={maxMinutes??''} onChange={e=>changeTime(e.target.value)} disabled={!ready}><option value="1">1分</option><option value="3">3分</option><option value="5">5分</option><option value="10">10分</option><option value="15">15分</option><option value="30">30分</option><option value="60">60分</option><option value="">時間を指定しない</option></select>
     <label htmlFor="suggestion-source">何系にする？</label><select id="suggestion-source" value={source} onChange={e=>changeSource(e.target.value as Source)} disabled={!ready}><option value="all">おまかせ</option><option value="play">計算・なぞなぞで遊ぶ</option><option value="saved">自分の候補</option><option value="nearby">近くのお店</option><option value="canvas">Canvasの課題</option></select>
     <label className="repeat-option"><input type="checkbox" checked={avoidRepeat} onChange={e=>setAvoidRepeat(e.target.checked)} disabled={!ready}/>同じ候補の連続を避ける</label>
     <p className="eligible-count" aria-live="polite">{ready?`提案できる候補：${eligible.length}件`:'候補を読み込み中'}{avoidRepeat&&eligible.length===1?'（1件のため同じ候補を提案します）':''}</p>
     <details className="weather-details"><summary>天気・場所の条件</summary><WeatherPanel indoorOnly={indoorOnly} onChange={changePlace} disabled={!ready}/></details>
    </div>
    <p className="dashboard-note">お店や課題の接続は、この下から。</p></section>
    <section className="play-launcher" aria-labelledby="play-title"><span className="eyebrow">JUST PLAY</span><h2 id="play-title">数分だけ、頭を動かそう。</h2><p>問題を大きく、操作は少なく。<br/>計算は正解したら、すぐ次へ。</p>
     <label htmlFor="game-kind">遊びの種類</label><select id="game-kind" value={gameKind} onChange={e=>setGameKind(e.target.value as GameKind)} disabled={!ready}><option value="calculation">計算チャレンジ</option><option value="riddle">なぞなぞ・ひらめき問題</option></select>
     <label htmlFor="timer-mode">タイマーの方式</label><select id="timer-mode" value={timerMode} onChange={e=>setTimerMode(e.target.value as TimerMode)} disabled={!ready}><option value="down">カウントダウン</option><option value="up">カウントアップ</option></select>
     {timerMode==='down'?<><label htmlFor="game-minutes">遊ぶ時間</label><select id="game-minutes" value={gameMinutes} onChange={e=>setGameMinutes(Number(e.target.value))} disabled={!ready}>{[1,3,5,10,15,30,60].map(n=><option key={n} value={n}>{n}分</option>)}</select></>:<p className="timer-explanation">0:00から計測。戻るまで好きなだけ遊べます。</p>}
     <a className="secondary play-start" href={playHref(gameKind,gameMinutes,timerMode)}>暇つぶしページで遊ぶ <span>↗</span></a>
     <p className="dashboard-note">遊ぶ画面では、戻る操作と回答だけ。</p>
    </section>
   </div>
  </section>
  <section id="connections" className="connections"><div className="section-heading"><div><span className="eyebrow">A LITTLE FURTHER</span><h2>外に出る？ 課題を進める？</h2></div><p>つないだ情報も、おまかせ提案に加わります。</p></div><div className="connection-columns"><NearbyPanel onChange={changePlaces}/><CanvasPanel onChange={changeTasks}/></div></section>
  <section className="workspace" id="my-actions"><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>自分の「やってみたい」も追加。</h2></div><p>普段やりたいことは、ここに保存。</p></div><div className="columns">
   <form onSubmit={submit} className="form-card"><h3>{editing?'候補を編集する':'候補をひとつ追加'}</h3><label htmlFor="action-title">何をする？</label><input id="action-title" value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} required placeholder="例：机の上の物を3つ元の場所に戻す"/><div className="form-row"><div><label htmlFor="minutes">目安の時間（分）</label><input id="minutes" type="number" min="1" max="1440" step="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></div><div><label htmlFor="place">場所</label><select id="place" value={place} onChange={e=>setPlace(e.target.value as Action['place'])}><option value="indoor">室内</option><option value="outdoor">屋外</option></select></div></div><label htmlFor="note">ひとことメモ（任意）</label><textarea id="note" value={note} onChange={e=>setNote(e.target.value)} maxLength={200} placeholder="例：出したままの文房具を戻す。3つ戻したら終わり。"/><button className="secondary" disabled={!ready}>{editing?'変更を保存':'候補を追加'} <span>＋</span></button>{editing&&<button className="cancel" type="button" onClick={resetForm}>編集をキャンセル</button>}<p className="storage-note">自分の候補はこのブラウザーに保存されます。別端末とは同期しません。</p></form>
   <div className="list-panel"><div className="list-heading"><h3>あなたの行動リスト</h3><span>{actions.length} IDEAS</span></div>{ready&&actions.length===0?<div className="empty">まだ自分の候補がありません。<br/>画面内の遊びはそのまま利用できます。</div>:actions.map((a,i)=><article className="action" key={a.id}><span className="number">{String(i+1).padStart(2,'0')}</span><div className="action-body"><h4>{a.title}</h4><p>{a.place==='indoor'?'室内':'屋外'} <span>·</span> 約{a.minutes}分</p></div><div className="action-buttons"><button onClick={()=>edit(a)} aria-label={`${a.title}を編集`}>編集</button><button onClick={()=>remove(a)} aria-label={`${a.title}を削除`}>削除</button></div></article>)}</div>
  </div></section>
  <p className="status" role="status">{message}</p><footer><span>暇な君へ</span><p>空いた時間を、そのまま楽しく。</p><small>画面内の遊びは外部サービスに接続せず使えます。</small></footer>
 </main>;
}
