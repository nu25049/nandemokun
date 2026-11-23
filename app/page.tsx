'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {type Action,initialActions,parseActions,refreshInitialActions,STORAGE_KEY} from '../lib/actions';
import {recommendations,type Recommendation} from '../lib/recommendations';
import type {NearbyPlace} from '../lib/nearby';
import type {CanvasTask} from '../lib/canvas';
import WeatherPanel from './weather-panel';
import {GAME_LABELS,playHref,QUESTION_COUNTS,type GameKind,type TimerMode} from '../lib/play';
import {AVAILABLE_MINUTES,HOME_SETTINGS_KEY,defaultHomeSettings,parseHomeSettings,type HomeSettings,type HomeSource} from '../lib/home-settings';
import {isDiscreetRecommendation} from '../lib/discreet';
import {groupCandidates,pickGroupActivity,type GroupActivity} from '../lib/group-activities';
import {GAME_PROGRESS_KEY,gameLevel,gameRecordKey,readGameProgress,type GameProgress} from '../lib/game-progress';
import {defaultPreferences,HISTORY_KEY,parseRecent,pickPersonalized,visibleRecommendations,type Preferences} from '../lib/preferences';
import PreferencesPanel from './preferences-panel';
import NearbyPanel from './nearby-panel';
import CanvasPanel from './canvas-panel';
import BackupPanel from './backup-panel';
import ActionList from './action-list';
import ActivityResume from './activity-resume';
import {clearActivityProgress} from '../lib/activity-progress';
import EngagementPanel,{ResultFeedback} from './engagement-panel';
import {ENGAGEMENT_KEY,emptyEngagement,parseEngagement,rate,toggleFavorite,learningFactors,type Engagement,type Outcome} from '../lib/engagement';
const DISCREET_KEY='himanakimihe.discreet.v1';
const HOME_VIEWS=[
 {id:'home',label:'ホーム'},
 {id:'options',label:'提案の条件'},
 {id:'games',label:'ほかのゲーム'},
 {id:'activity',label:'お気に入り・利用記録'},
 {id:'preferences',label:'提案の好み'},
 {id:'connections',label:'近くのお店・Canvas'},
 {id:'my-actions',label:'自分の候補'},
 {id:'backup',label:'データのバックアップ'},
] as const;

export default function Home() {
 const [actions,setActions]=useState<Action[]>([]);
 const [places,setPlaces]=useState<NearbyPlace[]>([]);
 const [tasks,setTasks]=useState<CanvasTask[]>([]);
 const [ready,setReady]=useState(false);
 const [result,setResult]=useState<Recommendation|null>(null);
 const [groupResult,setGroupResult]=useState<GroupActivity|null>(null);
 const [settings,setSettings]=useState(defaultHomeSettings);
 const {maxMinutes,source,avoidRepeat,gameKind,gameMinutes,timerMode,participants}=settings;
 const isGroup=participants>1;
 const [settingsNotice,setSettingsNotice]=useState('');
 const [message,setMessage]=useState('');
 const [editing,setEditing]=useState<string|null>(null);
 const [title,setTitle]=useState('');
 const [minutes,setMinutes]=useState('15');
 const [place,setPlace]=useState<'indoor'|'outdoor'>('indoor');
 const [note,setNote]=useState('');
 const [indoorOnly,setIndoorOnly]=useState(false);
 const [preferences,setPreferences]=useState(defaultPreferences);
 const [hash,setHash]=useState('');
 const [discreet,setDiscreet]=useState(false);
 const [gameProgress,setGameProgress]=useState<GameProgress>({totalScore:0,bestTap:0});
 const menu=useRef<HTMLDetailsElement>(null);
 const activeView=hash==='#nearby'?'connections':HOME_VIEWS.find(entry=>`#${entry.id}`===hash)?.id??'home';
 const level=gameLevel(gameProgress.totalScore);
 const selectedBest=gameProgress.bestScores?.[gameRecordKey(gameKind,gameMinutes,timerMode)]??0;
 const nextBestGoal=Math.min(Number.MAX_SAFE_INTEGER,selectedBest+10);
 const recent=useRef<string[]>([]);
 const [engagement,setEngagement]=useState(emptyEngagement);
 const engagementRef=useRef(engagement);
 const resultToken=useRef('');
 const [engagementNotice,setEngagementNotice]=useState('');
 const changePreferences=useCallback((next:Preferences)=>{setPreferences(next);setResult(current=>current&&next.weights[current.category]===0?null:current);},[]);
 const changePlace=useCallback((value:boolean)=>{setIndoorOnly(value);setResult(current=>value&&current?.place==='outdoor'?null:current);setGroupResult(null);},[]);
 const changePlaces=useCallback((next:NearbyPlace[])=>{setPlaces(next);setResult(current=>current?.source==='nearby'?null:current);},[]);
 const changeTasks=useCallback((next:CanvasTask[])=>{setTasks(next);setResult(current=>current?.source==='canvas'?null:current);},[]);
 const localPool=recommendations(actions,[],[],null,false,'all').map(item=>item.game?{...item,title:GAME_LABELS[item.game]+'で遊ぶ'}:item);
 const eligibleAll=visibleRecommendations(recommendations(actions,places,tasks,maxMinutes,indoorOnly,source==='favorites'?'all':source),preferences).filter(item=>!discreet||isDiscreetRecommendation(item));
 const eligible=source==='favorites'?eligibleAll.filter(item=>engagement.favorites.includes(item.id)):eligibleAll;
 const groupPool=isGroup?groupCandidates({participants,minutes:maxMinutes,discreet,indoorOnly}):[];
 const candidateCount=isGroup?groupPool.length:eligible.length;
 const favoriteEligibleIds=new Set(visibleRecommendations(recommendations(actions,[],[],maxMinutes,indoorOnly,'all'),preferences).filter(item=>!discreet||isDiscreetRecommendation(item)).map(item=>item.id));
 useEffect(()=>{
  function syncView(){setHash(window.location.hash);if(menu.current)menu.current.open=false;}
  function syncScore(){setGameProgress(readGameProgress());}
  function storage(event:StorageEvent){if(event.key===GAME_PROGRESS_KEY||event.key===null)syncScore();}
  syncView();syncScore();
  window.addEventListener('hashchange',syncView);
  window.addEventListener('pageshow',syncScore);
  window.addEventListener('storage',storage);
  return()=>{
   window.removeEventListener('hashchange',syncView);
   window.removeEventListener('pageshow',syncScore);
   window.removeEventListener('storage',storage);
  };
 },[]);
 useEffect(()=>{
  if(hash==='#nearby')document.getElementById('nearby')?.scrollIntoView({block:'start'});
  else window.scrollTo({top:0,behavior:'instant'});
 },[hash]);
 useEffect(()=>{
  let loaded:Action[]=[];
  try {const raw=localStorage.getItem(STORAGE_KEY);loaded=raw===null?initialActions:refreshInitialActions(parseActions(raw));setActions(loaded);}
  catch {setMessage('保存データを読み込めませんでした。自分の候補を追加して再保存できます。画面内の遊びは利用できます。');}
  try{const saved=parseEngagement(localStorage.getItem(ENGAGEMENT_KEY),recommendations(loaded,[],[],null,false,'all'));engagementRef.current=saved;setEngagement(saved);}
  catch{setEngagementNotice('利用記録を読み込めませんでした。初期状態で続けられます。新しい操作で再保存できます。');}
  setReady(true);
  try{recent.current=parseRecent(localStorage.getItem(HISTORY_KEY));}catch{recent.current=[];}
  try{
   const quiet=localStorage.getItem(DISCREET_KEY)==='1';
   const saved=parseHomeSettings(localStorage.getItem(HOME_SETTINGS_KEY));
   if(quiet&&['saved','nearby','canvas'].includes(saved.source))saved.source='all';
   setDiscreet(quiet);
   setSettings(saved);
  }catch{setSettingsNotice('条件を読み込めませんでした。30分のおまかせから使えます。');}
 },[]);
 function updateSettings(patch:Partial<HomeSettings>){
  const next={...settings,...patch};
  setSettings(next);
  setResult(null);
  setGroupResult(null);
  try{localStorage.setItem(HOME_SETTINGS_KEY,JSON.stringify(next));setSettingsNotice('');}
  catch{setSettingsNotice('条件を保存できません。この画面では使えますが、再読み込みすると初期値に戻ります。');}
 }
 function saveEngagement(next:Engagement){if(source==='favorites')setResult(current=>current&&!next.favorites.includes(current.id)?null:current);engagementRef.current=next;setEngagement(next);try{localStorage.setItem(ENGAGEMENT_KEY,JSON.stringify(next));setEngagementNotice('お気に入り・利用記録をこのブラウザーに保存しました。');}catch{setEngagementNotice('利用記録を端末に保存できませんでした。この画面では使えますが、再読み込みで失われます。');}}
 function recordOutcome(outcome:Outcome){if(result)saveEngagement(rate(engagementRef.current,result,resultToken.current,outcome));}
 function persist(next:Action[]){setActions(next);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setMessage('自分の候補をこの端末に保存しました。');return true;}catch{setMessage('端末への保存に失敗しました。再読み込みすると変更が失われる可能性があります。');return false;}}
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
 function remove(a:Action){
  if(!window.confirm(`「${a.title}」を削除しますか？`))return;
  const next=actions.filter(x=>x.id!==a.id);
  if(persist(next))try{clearActivityProgress(localStorage,`saved:${a.id}`);}catch{/* 候補がない進行記録は表示されない。 */}
  saveEngagement(parseEngagement(JSON.stringify(engagementRef.current),recommendations(next,[],[],null,false,'all')));
  if(result?.source==='saved'&&result.actionId===a.id)setResult(null);
  if(editing===a.id)resetForm();
 }
 function changeTime(value:string){updateSettings({maxMinutes:value===''?null:Number(value)});}
 function changeSource(value:HomeSource){updateSettings({source:value});}
 function changeDiscreet(value:boolean){
  if(value===discreet)return;
  setDiscreet(value);
  setResult(null);
  setGroupResult(null);
  if(value&&['saved','nearby','canvas'].includes(source))changeSource('all');
  try{localStorage.setItem(DISCREET_KEY,value?'1':'0');}catch{/* 現在の画面には反映する。 */}
 }
 function suggest(){
  if(isGroup){
   const next=pickGroupActivity(groupPool,groupResult?.id);
   setGroupResult(next);
   setMessage(next?`${participants}人でできる暇つぶしを選びました。`:'空き時間や人数、場所の条件を確認してください。');
   return;
  }
  const alternatives=avoidRepeat?eligible.filter(item=>item.id!==result?.id):eligible;
  const next=pickPersonalized(alternatives.length?alternatives:eligible,preferences,recent.current,Math.random,learningFactors(engagementRef.current));
  resultToken.current=crypto.randomUUID();setResult(next);
  if(next){
   const tracked=rate(engagementRef.current,next,resultToken.current,'pending');
   if(tracked!==engagementRef.current)saveEngagement(tracked);
   recent.current=[...recent.current,next.id].slice(-20);
   try{localStorage.setItem(HISTORY_KEY,JSON.stringify(recent.current.filter(id=>!id.startsWith('nearby:')&&!id.startsWith('canvas:'))));}catch{/* 履歴の保存失敗でも提案は続ける。 */}
  }
  setMessage(next?'空き時間と好みに合う候補を選びました。':'条件や提案の傾向を確認してください。');
 }
 const emptyMessage=source==='favorites'?'今の条件に合うお気に入りがありません':discreet?'今の条件で目立ちにくい候補がありません':source==='nearby'?(places.length?'この時間に収まるお店がありません':'先に近くのお店を調べよう'):source==='canvas'?(tasks.length?'今の条件に合う課題がありません':'Canvasの課題を取得してみよう'):source==='saved'&&!actions.length?'自分の候補を追加しよう':'この条件に合う候補がありません';
 const sourceLabel=source==='all'?'おまかせ':source==='play'?'画面内のゲーム':source==='library'?'おすすめの暇つぶし':source==='saved'?'自分の候補':source==='favorites'?'お気に入り':source==='nearby'?'近くのお店':'Canvasの課題';
 return <main className="app-home">
  <header className="home-header">
   <a className="brand" href="#home">暇な君へ<span className="brand-dot">●</span></a>
   <div className="home-header-actions">
    <span className="home-level">Lv. {level.level}</span>
    <details className="home-menu" ref={menu} onKeyDown={event=>{
     if(event.key==='Escape'&&menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}
    }}>
     <summary><span aria-hidden="true">☰</span> メニュー</summary>
     <nav aria-label="メインメニュー">
      {HOME_VIEWS.map(entry=><a key={entry.id} href={`#${entry.id}`} aria-current={activeView===entry.id?'page':undefined} onClick={()=>{if(menu.current)menu.current.open=false;}}>{entry.label}</a>)}
      <a href="/ideas">カタログから探す ↗</a>
     </nav>
    </details>
   </div>
  </header>
  <section id="home" className="home-dashboard" hidden={activeView!=='home'} aria-label="次の行動を提案">
   <div className="suggestion proposal-card">
    <div className="proposal-heading"><h1>いま、何しよう？</h1><span className="pill">{ready?`${candidateCount}件から提案`:'読み込み中'}</span></div>
    <fieldset className="participant-mode" disabled={!ready}>
     <legend>誰と過ごす？</legend>
     <button type="button" aria-pressed={!isGroup} onClick={()=>updateSettings({participants:1})}>ひとり</button>
     <button type="button" aria-pressed={isGroup} onClick={()=>updateSettings({participants:isGroup?participants:2})}>みんな</button>
     {isGroup&&<div className="participant-count"><label htmlFor="participants">人数</label><select id="participants" value={participants} onChange={event=>updateSettings({participants:Number(event.target.value)})}>{[2,3,4,5,6,7,8].map(count=><option key={count} value={count}>{count}人</option>)}</select></div>}
    </fieldset>
    <fieldset className="home-time-options" disabled={!ready}>
     <legend>空き時間</legend>
     {AVAILABLE_MINUTES.map(value=><button key={value} type="button" aria-pressed={maxMinutes===value} onClick={()=>changeTime(String(value))}>{value}分</button>)}
     <button type="button" aria-pressed={maxMinutes===null} onClick={()=>changeTime('')}>指定なし</button>
    </fieldset>
    <fieldset className="discreet-options">
     <legend>人目が気になる？</legend>
     <button type="button" disabled={!ready} aria-pressed={discreet} onClick={()=>changeDiscreet(true)}>気になる</button>
     <button type="button" disabled={!ready} aria-pressed={!discreet} onClick={()=>changeDiscreet(false)}>気にしない</button>
    </fieldset>
    {discreet&&<p className="discreet-hint">{isGroup?'小声や小さな動きで楽しめる候補を提案します。':'座ったまま、音を出さずにできる候補を提案します。'}</p>}
    <p className="home-conditions">{isGroup?`${participants}人でできる会話・遊び`:sourceLabel}{indoorOnly?' · 室内のみ':''}{!isGroup&&avoidRepeat?' · 連続を避ける':''}</p>
    <button className="primary propose-button" disabled={!ready||!candidateCount} onClick={suggest}>{(isGroup?groupResult:result)?'もうひとつ提案して':'ひとつ提案して'} <span aria-hidden="true">↗</span></button>
    <div className="result" aria-live="polite">
     {isGroup?groupResult?<div className="group-result">
      <div className="result-meta">{participants}人 · 約{groupResult.minutes}分{groupResult.place==='outdoor'?' · 屋外':''}</div>
      <h2>{groupResult.title}</h2>
      <p className="group-materials">持ち物　{groupResult.materials}</p>
      <ol className="group-steps">{groupResult.steps.map((step,index)=><li key={index}>{step}</li>)}</ol>
      <p className="group-ending"><strong>終わりの目安</strong>{groupResult.endCondition}</p>
     </div>:ready&&!groupPool.length?<><h2>この条件に合う複数人の暇つぶしがありません</h2><p>人数や空き時間を変更するか、場所の条件を見直してください。</p><a className="home-text-link" href="#options">条件を見直す</a></>:<p className="group-intro">会話やその場の遊びを1件提案します。手順を見て、みんなで始めよう。</p>:result?<><div className="result-meta">{result.place==='indoor'?'室内で':'外に出て'} · 約{result.minutes}分</div><h2>{result.title}</h2>{result.note&&<p>{result.game?'下のボタンで専用画面へ。問題に集中して遊べます。':result.note}</p>}
      {result.dueAt&&<p className="task-due">期限：{new Date(result.dueAt).toLocaleString('ja-JP')}</p>}
      {result.url&&<a className="result-link" href={result.url} target="_blank" rel="noreferrer">{result.source==='canvas'?'Canvasで課題を開く':'地図でお店を見る'} ↗</a>}
      {result.game&&<a className="result-link" href={playHref(result.game,result.minutes,timerMode)}>この遊びを大画面で始める ↗</a>}
      {!result.game&&(result.source==='library'||result.source==='saved')&&<a className="result-link" href={'/activity?id='+encodeURIComponent(result.id)}>手順とタイマーを開いて始める ↗</a>}
      <ResultFeedback item={result} state={engagement} outcome={engagement.feedback.find(row=>row.id===resultToken.current)?.outcome} onRate={recordOutcome} onFavorite={()=>saveEngagement(toggleFavorite(engagementRef.current,result))}/>
     </>:ready&&!eligible.length?<>
      <h2>{emptyMessage}</h2>
      <p>{source==='nearby'?'お店の検索と、往復・滞在に使える時間を確認してください。':source==='canvas'?'接続画面で未提出のToDoを確認できます。':source==='favorites'?'カタログや提案した行動の「お気に入り」を押して追加できます。':'空き時間や種類、好みの設定を確認してください。'}</p>
      {source==='nearby'&&<a className="result-link" href="#nearby">現在地からお店を探す ↗</a>}
      {source==='canvas'&&<a className="result-link" href="#connections">Canvasに接続する ↗</a>}
      {source==='saved'&&!actions.length&&<a className="result-link" href="#my-actions">自分の候補を追加する ↗</a>}
      {source==='favorites'&&<a className="result-link" href="/ideas">カタログでお気に入りを探す ↗</a>}
      <a className="reset-time" href="#preferences">提案の傾向を調整する</a>
      {source!=='all'&&<button className="reset-time" onClick={()=>changeSource('all')}>おまかせに戻す</button>}
     </>:
      null}
    </div>
    <div className="home-proposal-links"><a className="home-text-link" href="#options">提案の条件</a><a className="home-text-link" href="#games">ゲームを選ぶ</a><a className="home-text-link" href="/trivia">雑学を読む</a><a className="home-text-link" href="/trivia/tomorrow">明日の話のネタ</a></div>
    {settingsNotice&&<p className="settings-notice" role="status">{settingsNotice}</p>}
   </div>
   {!isGroup&&<div className="quick-start-card">
    <a className="quick-tap-link" href="/tap">30秒タップで遊ぶ <span aria-hidden="true">↗</span></a>
    <div className="home-shortcuts">
     <a href={playHref('calculation',1,'down')} target="_blank" rel="noopener noreferrer" aria-label="1分の計算を別タブで開く">1分の計算 ↗</a>
     <a href={playHref('riddle',3,'down')} target="_blank" rel="noopener noreferrer" aria-label="3分のなぞなぞを別タブで開く">3分のなぞなぞ ↗</a>
     <a href="/together">みんなで○×（2〜4人） ↗</a>
    </div>
    <div className="home-progress">
     <span>累計 {gameProgress.totalScore.toLocaleString('ja-JP')} 点</span>
     <span>次のLv.まで {level.perLevel-level.intoLevel} 点</span>
     <progress aria-label="次のレベルまでの進み具合" value={level.intoLevel} max={level.perLevel}/>
    </div>
   </div>}
   {!isGroup&&<ActivityResume actions={actions} ready={ready} feedback={engagement.feedback}/>}
  </section>
    <section id="options" className="dashboard-options home-secondary-view" hidden={activeView!=='options'} aria-labelledby="options-title"><h2 id="options-title">提案の条件</h2>
    <div className="suggestion-options">
     <label htmlFor="available-time">使える時間</label><select id="available-time" value={maxMinutes??''} onChange={e=>changeTime(e.target.value)} disabled={!ready}><option value="1">1分</option><option value="3">3分</option><option value="5">5分</option><option value="10">10分</option><option value="15">15分</option><option value="30">30分</option><option value="60">60分</option><option value="">時間を指定しない</option></select>
     {isGroup?<p className="group-options-note">{participants}人で過ごすための提案です。人数はホームで変更できます。</p>:<>
      <label htmlFor="suggestion-source">何系にする？</label><select id="suggestion-source" value={source} onChange={e=>changeSource(e.target.value as HomeSource)} disabled={!ready}><option value="all">おまかせ</option><option value="play">画面内のゲーム</option><option value="library">おすすめの暇つぶし</option><option value="saved" disabled={discreet}>自分の候補</option><option value="favorites">お気に入り</option><option value="nearby" disabled={discreet}>近くのお店</option><option value="canvas" disabled={discreet}>Canvasの課題</option></select>
      <label className="repeat-option"><input type="checkbox" checked={avoidRepeat} onChange={e=>updateSettings({avoidRepeat:e.target.checked})} disabled={!ready}/>同じ候補の連続を避ける</label>
     </>}
     <p className="eligible-count" aria-live="polite">{ready?`提案できる候補：${candidateCount}件`:'候補を読み込み中'}{!isGroup&&avoidRepeat&&eligible.length===1?'（1件のため同じ候補を提案します）':''}</p>
     <details className="weather-details"><summary>天気・場所の条件</summary><WeatherPanel indoorOnly={indoorOnly} onChange={changePlace} disabled={!ready}/></details>
    </div>
    <a className="home-text-link" href="#home">ホームへ戻る</a></section>
    <section id="games" className="play-launcher home-secondary-view" hidden={activeView!=='games'} aria-labelledby="play-title"><h2 id="play-title">ほかのゲーム</h2>
     <a className="together-entry" href="/together"><strong>みんなで○×（2〜4人） ↗</strong><span>スマホ1台を交代して答える、得点対決。</span></a>
     <h3>ひとりで遊ぶ</h3><p>正解で10点。同じ条件の自己ベストに挑戦できます。</p>
     <label htmlFor="game-kind">遊びの種類</label><select id="game-kind" value={gameKind} onChange={e=>updateSettings({gameKind:e.target.value as GameKind})} disabled={!ready}>{Object.entries(GAME_LABELS).map(([kind,label])=><option key={kind} value={kind}>{label}</option>)}</select>
     <p className="content-count">なぞなぞ{QUESTION_COUNTS.riddle}問・数列{QUESTION_COUNTS.sequence}問・ことば{QUESTION_COUNTS.word}問・豆知識○×{QUESTION_COUNTS.trivia}問。1回のプレイでは一巡するまで同じ問題を出しません。</p>
     <label htmlFor="timer-mode">タイマーの方式</label><select id="timer-mode" value={timerMode} onChange={e=>updateSettings({timerMode:e.target.value as TimerMode})} disabled={!ready}><option value="down">カウントダウン</option><option value="up">カウントアップ</option></select>
     {timerMode==='down'?<><label htmlFor="game-minutes">遊ぶ時間</label><select id="game-minutes" value={gameMinutes} onChange={e=>updateSettings({gameMinutes:Number(e.target.value)})} disabled={!ready}>{[1,2,3,5,10,15,30,60].map(n=><option key={n} value={n}>{n}分</option>)}</select></>:<p className="timer-explanation">0:00から計測。戻るまで好きなだけ遊べます。</p>}
     <p className="launcher-best">{timerMode==='down'?`${gameMinutes}分`:'カウントアップ'}の自己ベスト <strong>{selectedBest}点</strong> · 次の目標 {nextBestGoal}点</p>
     <a className="secondary play-start" href={playHref(gameKind,gameMinutes,timerMode)}>暇つぶしページで遊ぶ <span>↗</span></a>
     <p className="launcher-best">30秒タップの自己ベスト <strong>{gameProgress.bestTap}点</strong>　<a href="/tap">挑戦する ↗</a></p>
     <p className="dashboard-note">遊ぶ画面では、戻る操作と回答だけ。</p>
     <div className="quick-play"><h3>1〜3分だけ遊ぶ</h3><p>選んだ種類を、新しいタブで開きます。</p><div className="quick-play-links">{[1,2,3].map(n=><a key={n} href={playHref(gameKind,n,'down')} target="_blank" rel="noopener noreferrer" aria-label={`${n}分の暇つぶしを別タブで開く`}>{n}分 <span aria-hidden="true">↗</span></a>)}</div></div>
    </section>
  <div hidden={activeView!=='activity'}><EngagementPanel state={engagement} pool={localPool} eligibleIds={favoriteEligibleIds} notice={engagementNotice} onChange={saveEngagement} onFavorites={()=>{updateSettings({source:'favorites',participants:1});window.location.hash='home';}} onClear={()=>{if(window.confirm('利用記録と自動調整をリセットしますか？ お気に入りと手動の好みは残ります。'))saveEngagement({...engagementRef.current,learn:false,feedback:[]});}}/></div>
  <div hidden={activeView!=='preferences'}><PreferencesPanel onChange={changePreferences}/></div>
  <div hidden={activeView!=='backup'}><BackupPanel actions={actions} preferences={preferences} engagement={engagement} recent={()=>recent.current} ready={ready}/></div>
  <section id="connections" className="connections" hidden={activeView!=='connections'}><div className="section-heading"><div><span className="eyebrow">A LITTLE FURTHER</span><h2>外に出る？ 課題を進める？</h2></div><p>つないだ情報も、おまかせ提案に加わります。</p></div><div className="connection-columns"><NearbyPanel onChange={changePlaces}/><CanvasPanel onChange={changeTasks}/></div></section>
  <section className="workspace" id="my-actions" hidden={activeView!=='my-actions'}><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>自分の「やってみたい」も追加。</h2></div><p>普段やりたいことは、ここに保存。</p></div><div className="columns">
   <form onSubmit={submit} className="form-card"><h3>{editing?'候補を編集する':'候補をひとつ追加'}</h3><label htmlFor="action-title">何をする？</label><input id="action-title" value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} required placeholder="例：机の上の物を3つ元の場所に戻す"/><div className="form-row"><div><label htmlFor="minutes">目安の時間（分）</label><input id="minutes" type="number" min="1" max="1440" step="1" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></div><div><label htmlFor="place">場所</label><select id="place" value={place} onChange={e=>setPlace(e.target.value as Action['place'])}><option value="indoor">室内</option><option value="outdoor">屋外</option></select></div></div><label htmlFor="note">ひとことメモ（任意）</label><textarea id="note" value={note} onChange={e=>setNote(e.target.value)} maxLength={200} placeholder="例：出したままの文房具を戻す。3つ戻したら終わり。"/><button className="secondary" disabled={!ready}>{editing?'変更を保存':'候補を追加'} <span>＋</span></button>{editing&&<button className="cancel" type="button" onClick={resetForm}>編集をキャンセル</button>}<p className="storage-note">自分の候補はこのブラウザーに保存されます。別端末とは同期しません。</p></form>
   <ActionList actions={actions} ready={ready} onEdit={edit} onRemove={remove}/>
  </div></section>
  {message&&<p className="status" role="status">{message}</p>}
 </main>;
}
