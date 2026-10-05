# 暇な君へ

何をするか迷ったとき、本人が登録した行動候補から1件を提案するWebアプリ。

## 開発
`npm install` → `npm run dev` → http://localhost:3000

検証：`npm test`、`npm run typecheck`、`npm run build`。

候補はlocalStorageに保存されます。Supabase・天気・施設検索は未接続です。
制作計画は `制作内容/制作計画レポート.txt`、GeminiとCodexの相互共有場所は `制作内容/共有メモ.md`。

## Vercel
Framework PresetをNext.jsにし、既存の静的サイト用Build CommandとOutput Directoryの上書きを解除します。mainへのpushで再デプロイします。GitHubへの反映と本番URLでの稼働確認は別に記録します。

## 第3回までの再確認（2026-10-05）
端末内保存版の候補追加・編集・削除、1件のランダム提案、再読み込みによる復元、スマートフォン幅の表示を再検証しました。単体テスト5件、型検査、本番ビルド、ヘッドレスEdgeでの主要操作とエラー処理が成功しています。
詳細と未完了事項は `制作内容/第3回までの再確認結果.md` を参照してください。Supabaseと端末間同期、本番配備の確認、本人による実用性評価は残っています。

2026-10-05：実装・制作記録をコミット `be8081e` としてGitHubのmainへpushし、リモート反映を確認しました。その後のVercel公開URLはHTTP 200ですが、旧「テストページ」を表示しています。Next.js版の本番稼働は未確認です。
