# リポジトリ運用ガイドライン

## プロジェクト構成とモジュール設計

* `app/` は Next.js App Router のルートを保持。`app/page.tsx` はクイズの進行を管理し、`app/history/page.tsx` は過去の結果を表示、`app/sign-in` および `app/sign-up` は Clerk 認証を提供。
  API ハンドラは `app/api/{categories,questions,results}/route.ts` にあり、共通ヘルパーを介して SQLite とやり取りする。
* `components/Quiz*.tsx` は再利用可能なクライアントコンポーネント。新しい UI を作る際はこのフォルダに `PascalCase` のファイル名で作成し、`default export` する。
* `lib/database.ts` は SQLite 接続とクエリを一元管理。ルートから直接 `sqlite3` を触らず、ここを拡張する。
* グローバルスタイルは `app/globals.css` に定義され、Tailwind は `tailwind.config.js` で設定。ページ固有のアセットは、そのページの隣に配置する。

## ビルド・テスト・開発コマンド

* `npm run dev` — 開発サーバをホットリロード付きで起動。
* `npm run build` — 本番用にビルド（リリース前に実行）。
* `npm run start` — ビルド済み出力をローカルで動作確認。
* `npm run lint` — ESLint / Next のルールを実行（プッシュ前必須）。

## コーディングスタイルと命名規則

* TypeScript は strict モード。エクスポート関数には明示的な戻り値型を記述。
* インデントは 2 スペース、引用符はシングル。`components/QuizQuestion.tsx` に合わせる。
* コンポーネントやモジュールは `PascalCase.tsx`、フックやユーティリティは `camelCase.ts`。サーバロジックは該当ルート配下に配置。
* スタイル指定は Tailwind ユーティリティを優先。共通コードのインポートには相対パスではなく `@/*` エイリアスを使う。

## テストガイドライン

* 自動テストは未導入。追加する際はコンポーネントまたはルートの隣に `*.test.tsx` を置き、`package.json` に実行方法を記載。
* 当面は `npm run lint` と手動 QA をゲートとして扱う。Clerk で認証し、クイズを一通りプレイし、`/history` で履歴保存を確認。
* PR には再現手順を記録し、レビュアーが簡単に再現できるようにする。

## コミット・PR ガイドライン

* コミットメッセージは短く現在形で（日本語も可）。1行50文字以内を目安に、スコープ（例：`quiz:`）や課題番号（例：`quiz: improve pacing (#123)`）を含めてもよい。
* 関連変更は1コミットにまとめ、WIP的なノイズを避ける。
* PR には要約、テスト方法（実行コマンドまたは手順）、UI 変更がある場合はスクリーンショットまたは GIF を添付。Clerk のキーは `.env.local` に保持されていることを確認。

## 設定とセキュリティ

* Clerk の公開鍵／秘密鍵、DB パスの上書き設定などは `.env.local` に保存し、リポジトリにはコミットしない。
* `quiz.db` は開発者ローカルの SQLite ファイル。スキーマ変更前にバックアップし、マイグレーション手順を PR に記載する。
# その他
日本語で説明してね