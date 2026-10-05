# 「暇な君へ」開発規範

GeminiとCodexが、利用者の指示のもとで共同制作するプロジェクトです。
双方の共有場所は `制作内容/共有メモ.md` です。作業前に読み、作業後に実装・検証・未完了事項を更新してください。元計画は `制作内容/制作計画レポート.txt` です。

- 変更前に git status を確認し、他方や利用者の未コミット変更を上書きしない。
- 同じファイルを同時編集しない。共有メモの担当と作業状態を確認する。
- 候補から1件提案する中核機能を守る。外部APIへの接続を必須にしない。
- 秘密鍵をソース、メモ、Git履歴に書かない。
- 型検査、候補0件・1件・保存不正データのテスト、主要画面操作を確認する。
- 公開済み・検証済み・予定を区別して記録する。検証していない成果を完了としない。
- 利用者が許可していない公開、push、他のチャットへの送信はしない。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
