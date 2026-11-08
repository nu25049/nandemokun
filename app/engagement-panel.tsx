'use client';
import {CATEGORY_LABELS,CATEGORIES} from '../lib/categories';
import {canRemember,learningFactors,type Engagement,type Outcome} from '../lib/engagement';
import type {Recommendation} from '../lib/recommendations';

export function ResultFeedback({item,state,outcome,onRate,onFavorite}:{item:Recommendation;state:Engagement;outcome?:Outcome;onRate:(outcome:Outcome)=>void;onFavorite:()=>void}){
 if(!canRemember(item))return <p className="feedback-note">お店と課題の内容は履歴に保存しません。</p>;
 const favorite=state.favorites.includes(item.id);
 return <div className="result-feedback" aria-label="この提案への反応">
  <button aria-pressed={favorite} onClick={onFavorite}>{favorite?'★ お気に入り済み':'☆ お気に入りに追加'}</button>
  <button aria-pressed={outcome==='done'} onClick={()=>onRate('done')}>やってみた</button>
  <button aria-pressed={outcome==='skip'} onClick={()=>onRate('skip')}>今回は見送る</button>
 </div>;
}
export default function EngagementPanel({state,pool,eligibleIds,notice,onChange,onFavorites,onClear}:{state:Engagement;pool:Recommendation[];eligibleIds:Set<string>;notice:string;onChange:(next:Engagement)=>void;onFavorites:()=>void;onClear:()=>void}){
 const known=new Map(pool.filter(canRemember).map(item=>[item.id,item]));
 const favorites=state.favorites.flatMap(id=>known.has(id)?[known.get(id)!]:[]);
 const feedback=state.feedback.filter(row=>known.has(row.recommendationId));
 const done=feedback.filter(row=>row.outcome==='done').length,skipped=feedback.filter(row=>row.outcome==='skip').length;
 const factors=learningFactors(state);
 return <section id="activity" className="activity-section">
  <div className="section-heading"><div><span className="eyebrow">YOUR NEXT FAVORITE</span><h2>やってみた、を次につなげる。</h2></div><p>記録はこのブラウザーだけ。ログイン不要。</p></div>
  <div className="activity-columns">
   <div className="preference-card"><h3>自分に合う提案へ</h3><p>提案{feedback.length}件 · やってみた{done}件 · 見送り{skipped}件 · 未評価{feedback.length-done-skipped}件</p>
    <label className="repeat-option"><input type="checkbox" checked={state.learn} onChange={e=>onChange({...state,learn:e.target.checked})}/>利用結果を次の提案に反映する</label>
    <p>「やってみた」種類を少し増やし、見送った種類を少し減らします。時間・場所と手動の「出さない」を優先します。提案を引き直すだけでは評価しません。</p>
    {state.learn&&<ul className="learning-summary">{CATEGORIES.filter(key=>(factors[key]??1)!==1).map(key=><li key={key}>{CATEGORY_LABELS[key]}：{(factors[key]??1)>1?'少し出やすく':'少し控えめに'}</li>)}</ul>}
    <button className="weather-button" onClick={onClear}>利用記録と自動調整をリセット</button><p>お気に入りと手動の好みは残ります。</p>
    <p className="connection-notice" role="status">{notice}</p>
   </div>
   <div className="preference-card"><h3>お気に入り {favorites.length}件</h3><p>今の時間・場所・好みの条件内で選びます。</p>
    <button className="weather-button" disabled={!favorites.length} onClick={onFavorites}>お気に入りから提案する</button>
    {!favorites.length?<p>提案にある☆ボタンで、またやりたい候補を残せます。</p>:<ul className="activity-list">{favorites.slice().reverse().map(item=><li key={item.id}><div><strong>{item.title}</strong><small>{item.game?'空き時間に合わせる':'約'+item.minutes+'分'} · {eligibleIds.has(item.id)?'今の条件で選べます':'今の条件では対象外'}</small></div><button aria-label={item.title+'のお気に入りを解除'} onClick={()=>onChange({...state,favorites:state.favorites.filter(id=>id!==item.id)})}>解除</button></li>)}</ul>}
   </div>
  </div>
  <details className="activity-history"><summary>最近の利用記録（最新100件）</summary>
   {!feedback.length?<p>次の提案から記録します。戻ってからでも、ここで評価できます。</p>:<ol className="activity-list">{feedback.slice().reverse().map(row=><li key={row.id}><div><strong>{known.get(row.recommendationId)!.title}</strong><small>{new Date(row.at).toLocaleString('ja-JP')} · {row.outcome==='done'?'やってみた':row.outcome==='skip'?'今回は見送る':'未評価'}</small></div><div className="history-actions"><button aria-pressed={row.outcome==='done'} aria-label={known.get(row.recommendationId)!.title+'をやってみたとして記録'} onClick={()=>onChange({...state,feedback:state.feedback.map(entry=>entry.id===row.id?{...entry,outcome:'done'}:entry)})}>やってみた</button><button aria-pressed={row.outcome==='skip'} aria-label={known.get(row.recommendationId)!.title+'を見送りとして記録'} onClick={()=>onChange({...state,feedback:state.feedback.map(entry=>entry.id===row.id?{...entry,outcome:'skip'}:entry)})}>見送り</button><button aria-label={known.get(row.recommendationId)!.title+'の利用記録を削除'} onClick={()=>onChange({...state,feedback:state.feedback.filter(entry=>entry.id!==row.id)})}>削除</button></div></li>)}</ol>}
   <p>候補の内容は現在の登録から表示します。削除した候補は表示せず、お店・課題・位置情報は記録しません。お気に入りと利用記録はアカウント保存の対象外です。</p>
  </details>
 </section>;
}
