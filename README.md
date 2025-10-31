# クイズアプリ（Next.js版）

Webブラウザ上で動作するシンプルなクイズ学習アプリです。Next.js 15のApp Router構成、API Routes、状態管理、データフェッチの基礎を学習するために作成されました。

## 技術スタック

- **Next.js 15** - App Router構成
- **TypeScript** - 型安全な開発
- **React 19** - 最新のReact機能
- **Tailwind CSS** - モダンなスタイリング
- **SQLite** - 軽量データベース
- **Clerk** - ユーザー認証
- **Node.js 20+** - 実行環境

## 機能

- ✅ クイズの出題～回答～結果表示
- ✅ カテゴリー別フィルタリング
- ✅ 難易度別フィルタリング
- ✅ 問題数選択（5, 10, 15, 20問）
- ✅ リアルタイムスコア表示
- ✅ 正答率計算
- ✅ 結果の保存と表示
- ✅ レスポンシブデザイン
- ✅ **ユーザー登録／ログイン機能（Clerk）**
- ✅ **ユーザーごとの成績履歴表示**
- ✅ **ログアウト機能**

## プロジェクト構成

```
quiz-app/
├── app/
│   ├── api/
│   │   ├── questions/     # 問題取得API
│   │   ├── categories/    # カテゴリー取得API
│   │   └── results/       # 結果保存・取得API
│   ├── history/           # 成績履歴ページ
│   │   └── page.tsx
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト（ClerkProvider対応）
│   ├── middleware.ts      # Clerk認証ミドルウェア
│   └── page.tsx           # メインページ（認証対応）
├── components/
│   ├── QuizSetup.tsx      # クイズ設定画面（認証対応）
│   ├── QuizQuestion.tsx   # 問題表示コンポーネント
│   └── QuizResult.tsx     # 結果表示コンポーネント
├── lib/
│   └── database.ts        # SQLiteデータベース操作（userId対応）
├── .env.local             # 環境変数（Clerk設定）
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## インストールと実行

### 1. 依存関係をインストール：
```bash
npm install
```

### 2. Clerkの設定：

1. [Clerk Dashboard](https://dashboard.clerk.com/) で新しいアプリケーションを作成
2. API Keysから以下の値を取得：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. `.env.local` ファイルに設定：
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
```

### 3. 開発サーバーを起動：
```bash
npm run dev
```

### 4. ブラウザで `http://localhost:3000` を開く

## ビルドとデプロイ

本番環境向けビルド：
```bash
npm run build
```

本番サーバーで実行：
```bash
npm start
```

## APIエンドポイント

### GET /api/questions
クイズ問題を取得します。

クエリパラメータ：
- `category` (オプション): カテゴリーでフィルタリング
- `difficulty` (オプション): 難易度でフィルタリング（easy, medium, hard）
- `limit` (オプション): 取得する問題数（デフォルト: 10）

### GET /api/categories
利用可能なカテゴリー一覧を取得します。

### GET /api/results
クイズ結果履歴を取得します。

クエリパラメータ：
- `userId` (オプション): 特定ユーザーの結果のみ取得

### POST /api/results
クイズ結果を保存します。

リクエストボディ：
```json
{
  "userId": "user_id_from_clerk",
  "score": 8,
  "totalQuestions": 10
}
```

## データベース

SQLiteを使用してクイズデータと結果を保存します。

### questionsテーブル
- `id`: 問題ID
- `question`: 問題文
- `options`: 選択肢（JSON形式）
- `correct_answer`: 正解のインデックス
- `category`: カテゴリー
- `difficulty`: 難易度

### quiz_resultsテーブル
- `id`: 結果ID
- `user_id`: ユーザーID（Clerkから取得）
- `score`: スコア
- `total_questions`: 総問題数
- `completed_at`: 完了日時

## 認証機能

### Clerkによるユーザー認証
- Email/Googleでのログイン対応
- ユーザーごとの成績履歴管理
- ログアウト機能
- 未ログイン時はログイン画面へリダイレクト

### 認証状態の保護
- クイズプレイはログインユーザーのみ
- 成績履歴はログインユーザーのデータのみ表示
- APIはuserIdベースでデータを管理

## カスタマイズ

### 新しい問題を追加する
`lib/database.ts`の`insertSampleQuestions()`メソッドを編集して、サンプル問題を追加できます。

### スタイルを変更する
`tailwind.config.js`と各コンポーネントのTailwindクラスを編集して、デザインをカスタマイズできます。

### 新しい機能を追加する
- API Routesを`app/api/`ディレクトリに追加
- 新しいコンポーネントを`components/`ディレクトリに作成
- ユーティリティ関数を`lib/`ディレクトリに追加

## Vercelデプロイ

このアプリはVercelへのデプロイが想定されています：

1. GitHubリポジトリにコードをプッシュ
2. Vercelでインポート
3. 環境変数にClerkのAPIキーを設定
4. 自動ビルド・デプロイ完了

## ライセンス

MIT License
