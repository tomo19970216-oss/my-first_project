# 経験車図鑑 MoC (Minimum Operational Content)

## プロジェクト概要

「経験車図鑑 MoC」は、車の経験（見た、乗った、運転した、所持した）を記録し、スコアを獲得するWebアプリケーションのプロトタイプです。

車種ごとにレアリティ（1〜10）が設定されており、経験の種類とレアリティを掛け合わせたポイントが獲得できます。Toyota 100車種のデータを初期搭載し、ユーザーは簡単な操作で自分の車経験を記録・可視化できます。

### 主な特徴

- **シンプルなUI**: 5画面構成で直感的に操作可能
- **スコアリングシステム**: 経験種別 × レアリティでポイント計算
- **リアルタイム統計**: 経験車数、各種別の台数を即座に表示
- **軽量設計**: SQLiteを使用し、ローカル環境で完結

## 実装済み機能（MoC）

1. **起動画面** - ロゴと「はじめる」ボタン
2. **経験スコア表示画面** - 総合ポイントと統計情報（経験車数、見た台数、乗った台数、運転した台数、所持した台数）
3. **経験登録フロー**
   - メーカー選択（7メーカー）
   - 車種選択（Toyota 100車種 + 他メーカー各1車種）
   - 経験入力（見た、乗った、運転した、所持した）
   - メモ入力（任意）
   - 登録完了
4. **経験車図鑑（一覧・詳細・編集・削除）**
   - 経験履歴一覧表示（`/experiences` ページ）
   - 経験詳細表示（車種情報、経験種別、ポイント、メモ、登録日時）
   - 経験の編集機能（経験種別、メモの変更）
   - 経験の削除機能

## 使用技術一覧

### フロントエンド
- **React** 19.2.0 - UIライブラリ
- **Vite** 7.2.4 - ビルドツール・開発サーバー
- **React Router DOM** 7.9.6 - ルーティング

### バックエンド
- **Node.js** v22.12.0 - JavaScriptランタイム
- **Express** 5.1.0 - Webアプリケーションフレームワーク
- **better-sqlite3** 12.4.5 - SQLiteデータベースドライバ
- **CORS** 2.8.5 - Cross-Origin Resource Sharing対応

### データベース
- **SQLite** - 軽量リレーショナルデータベース

## プロジェクト構成

```
経験車図鑑-moc/
├── backend/              # バックエンドAPI
│   ├── src/
│   │   ├── server.js    # Expressサーバー
│   │   ├── routes/      # APIルート
│   │   └── db/          # データベース関連
│   │       ├── index.js # DB初期化
│   │       ├── schema.sql # DBスキーマ
│   │       └── seeds.sql  # シードデータ（Toyota 100車種）
│   └── data/            # SQLiteデータベースファイル（gitignore）
├── frontend/            # フロントエンドアプリ
│   ├── src/
│   │   ├── App.jsx     # メインアプリ
│   │   ├── pages/      # 各画面コンポーネント
│   │   └── index.css   # スタイル
│   └── vite.config.js  # Vite設定（プロキシ含む）
└── README.md           # このファイル
```

## ローカル環境でのセットアップ手順

### 前提条件

- **Node.js**: v22.12.0 以上（推奨: v22.x）
- **npm**: Node.jsに同梱されているパッケージマネージャー
- **Git**: バージョン管理システム

Node.jsのバージョン確認:
```bash
node --version  # v22.12.0 以上であることを確認
npm --version   # 確認
```

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd 経験車図鑑-moc
```

### 2. バックエンドのセットアップ

#### 2.1 依存関係のインストール

```bash
cd backend
npm install
```

インストールされる主な依存関係:
- `express` - Webアプリケーションフレームワーク
- `better-sqlite3` - SQLiteデータベースドライバ
- `cors` - Cross-Origin Resource Sharing対応
- `nodemon` - 開発時の自動再起動ツール

#### 2.2 SQLite データベースの作成

データベースは初回起動時に**自動的に作成**されます。手動での作成は不要です。

初回起動時に以下が自動実行されます:
1. `backend/data/dev.db` ファイルの作成
2. `backend/src/db/schema.sql` のスキーマ適用
3. `backend/src/db/seeds.sql` のシードデータ投入

#### 2.3 シードデータの投入

シードデータも初回起動時に**自動的に投入**されます。

投入されるデータ:
- **Toyota**: 100車種（Corolla, 2000GT, Supra, Land Cruiser, Alphard など）
- **その他メーカー**: Lexus, Honda, Mazda, SUBARU, Suzuki, Daihatsu（各1車種）

#### 2.4 バックエンドの起動

```bash
npm run dev
```

起動確認:
- サーバーが http://localhost:4000 で起動します
- コンソールに「Server is running on http://localhost:4000」と表示されます
- コンソールに「Database initialization complete」と表示されます（初回のみ）

動作確認:
```bash
# ヘルスチェック
curl http://localhost:4000/api/health

# メーカー一覧取得
curl http://localhost:4000/api/makers
```

### 3. フロントエンドのセットアップ

**別のターミナル**を開いて以下を実行してください。

#### 3.1 依存関係のインストール

```bash
cd frontend
npm install
```

インストールされる主な依存関係:
- `react` - UIライブラリ
- `react-dom` - React DOMレンダラー
- `react-router-dom` - ルーティングライブラリ
- `vite` - ビルドツール・開発サーバー
- `@vitejs/plugin-react` - Vite用Reactプラグイン

#### 3.2 フロントエンドの起動

```bash
npm run dev
```

起動確認:
- サーバーが http://localhost:5173 で起動します
- コンソールに「VITE v7.2.4 ready in XXX ms」と表示されます
- コンソールに「Local: http://localhost:5173/」と表示されます

### 4. アプリケーションの起動確認

1. ブラウザで http://localhost:5173 にアクセス
2. 起動画面が表示されることを確認
3. 「はじめる」ボタンをクリック
4. スコア画面が表示されることを確認（初期値: 0 PT）
5. 「経験を登録する」ボタンをクリック
6. メーカー選択画面でメーカーを選択
7. 車種選択画面で車種を選択
8. 経験入力画面で経験種別を選択して登録
9. スコア画面に戻り、ポイントが加算されていることを確認

### トラブルシューティング

#### ポート競合エラー
バックエンドまたはフロントエンドのポートが既に使用されている場合:

**バックエンド (4000番ポート):**
```javascript
// backend/src/server.js
const PORT = process.env.PORT || 4001; // ポート番号を変更
```

**フロントエンド (5173番ポート):**
```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // ポート番号を変更
    proxy: { /* ... */ }
  }
})
```

#### データベースリセット
データベースをリセットしたい場合:
```bash
cd backend
rm -f data/dev.db
npm run dev  # 再起動で自動的に再作成されます
```

#### 依存関係のエラー
依存関係のインストールに失敗した場合:
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## データベーススキーマ

### car_masters テーブル
- `car_id`: 車ID（主キー）
- `maker_id`: メーカーID
- `maker_name`: メーカー名
- `model_name`: 車種名
- `segment`: セグメント（車種カテゴリ）
- `rarity`: レアリティ（1〜10）

### experiences テーブル
- `id`: 経験ID（主キー）
- `user_id`: ユーザーID（MoCでは固定で1）
- `car_id`: 車ID（外部キー）
- `experience_type`: 経験種別（saw, rode, drove, owned）
- `points`: 獲得ポイント
- `note`: メモ（任意）
- `created_at`: 登録日時

## 経験種別とポイント計算

スコアは以下の計算式で算出されます：

**最終ポイント = 基本ポイント × レアリティ**

### 基本ポイント
- **見た (saw)**: 1ポイント
- **乗った (rode)**: 2ポイント
- **運転した (drove)**: 5ポイント
- **所持した (owned)**: 10ポイント

### 例
- レアリティ10の2000GTに「乗った」場合: 2 × 10 = **20ポイント**
- レアリティ1のCorollaに「運転した」場合: 5 × 1 = **5ポイント**

## API エンドポイント一覧

バックエンドは http://localhost:4000 で起動し、以下の8つのAPIエンドポイントを提供します。

### 1. GET /api/makers

**概要**: メーカー一覧を取得

**リクエスト**: なし

**レスポンス**:
```json
{
  "makers": [
    { "maker_id": 1, "maker_name": "トヨタ" },
    { "maker_id": 2, "maker_name": "レクサス" },
    { "maker_id": 3, "maker_name": "ホンダ" },
    { "maker_id": 4, "maker_name": "マツダ" },
    { "maker_id": 5, "maker_name": "SUBARU" },
    { "maker_id": 6, "maker_name": "スズキ" },
    { "maker_id": 7, "maker_name": "ダイハツ" }
  ]
}
```

**使用例**:
```bash
curl http://localhost:4000/api/makers
```

---

### 2. GET /api/models?maker_id={maker_id}

**概要**: 指定メーカーの車種一覧を取得

**リクエストパラメータ**:
- `maker_id` (必須): メーカーID（1〜7）

**レスポンス**:
```json
{
  "models": [
    {
      "car_id": 1,
      "model_name": "Corolla",
      "segment": "セダン／ハッチバック",
      "rarity": 1
    },
    {
      "car_id": 62,
      "model_name": "2000GT",
      "segment": "クラシックスポーツ",
      "rarity": 10
    }
  ]
}
```

**使用例**:
```bash
# Toyota（maker_id=1）の車種一覧を取得
curl "http://localhost:4000/api/models?maker_id=1"
```

---

### 3. POST /api/experience

**概要**: 車の経験を登録し、ポイントを獲得

**リクエストボディ**:
```json
{
  "car_id": 62,
  "experience_type": "rode",
  "note": "素晴らしい車でした"
}
```

**パラメータ**:
- `car_id` (必須): 車ID
- `experience_type` (必須): 経験種別
  - `"saw"` - 見た（1pt × レアリティ）
  - `"rode"` - 乗った（2pt × レアリティ）
  - `"drove"` - 運転した（5pt × レアリティ）
  - `"owned"` - 所持した（10pt × レアリティ）
- `note` (任意): メモ（文字列）

**レスポンス**:
```json
{
  "experience": {
    "id": 1,
    "user_id": 1,
    "car_id": 62,
    "experience_type": "rode",
    "points": 20,
    "note": "素晴らしい車でした",
    "created_at": "2025-11-21 09:34:36"
  }
}
```

**使用例**:
```bash
curl -X POST http://localhost:4000/api/experience \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 62,
    "experience_type": "rode",
    "note": "素晴らしい車でした"
  }'
```

---

### 4. GET /api/score

**概要**: ユーザーの総合スコアと統計情報を取得

**リクエスト**: なし

**レスポンス**:
```json
{
  "user_id": 1,
  "score": 20,
  "total_cars": 1,
  "saw_count": 0,
  "rode_count": 1,
  "drove_count": 0,
  "owned_count": 0
}
```

**レスポンスフィールド**:
- `user_id`: ユーザーID（MoCでは固定で1）
- `score`: 総合ポイント
- `total_cars`: 経験した車の種類数（重複なし）
- `saw_count`: 「見た」経験の回数
- `rode_count`: 「乗った」経験の回数
- `drove_count`: 「運転した」経験の回数
- `owned_count`: 「所持した」経験の回数

**使用例**:
```bash
curl http://localhost:4000/api/score
```

---

### 5. GET /api/experience

**概要**: ユーザーの全経験履歴を取得（車の詳細情報を含む）

**リクエスト**: なし

**レスポンス**:
```json
{
  "experiences": [
    {
      "id": 1,
      "user_id": 1,
      "car_id": 62,
      "experience_type": "owned",
      "points": 100,
      "note": "素晴らしい車でした",
      "created_at": "2025-11-21 09:34:36",
      "maker_name": "トヨタ",
      "model_name": "2000GT",
      "segment": "クラシックスポーツ",
      "rarity": 10
    }
  ]
}
```

**レスポンスフィールド**:
- `id`: 経験ID
- `user_id`: ユーザーID
- `car_id`: 車ID
- `experience_type`: 経験種別（saw, rode, drove, owned）
- `points`: 獲得ポイント
- `note`: メモ
- `created_at`: 登録日時
- `maker_name`: メーカー名
- `model_name`: 車種名
- `segment`: セグメント
- `rarity`: レアリティ

**使用例**:
```bash
curl http://localhost:4000/api/experience
```

---

### 6. GET /api/experience/:id

**概要**: 特定の経験の詳細情報を取得

**リクエストパラメータ**:
- `id` (必須): 経験ID

**レスポンス**:
```json
{
  "experience": {
    "id": 1,
    "user_id": 1,
    "car_id": 62,
    "experience_type": "owned",
    "points": 100,
    "note": "素晴らしい車でした",
    "created_at": "2025-11-21 09:34:36",
    "maker_name": "トヨタ",
    "model_name": "2000GT",
    "segment": "クラシックスポーツ",
    "rarity": 10
  }
}
```

**使用例**:
```bash
curl http://localhost:4000/api/experience/1
```

---

### 7. PUT /api/experience/:id

**概要**: 既存の経験を更新（経験種別やメモを変更）

**リクエストパラメータ**:
- `id` (必須): 経験ID

**リクエストボディ**:
```json
{
  "experience_type": "owned",
  "note": "更新したメモ"
}
```

**パラメータ**:
- `car_id` (任意): 車ID（変更する場合）
- `experience_type` (任意): 経験種別（saw, rode, drove, owned）
- `note` (任意): メモ

**レスポンス**:
```json
{
  "experience": {
    "id": 1,
    "user_id": 1,
    "car_id": 62,
    "experience_type": "owned",
    "points": 100,
    "note": "更新したメモ",
    "created_at": "2025-11-21 09:34:36"
  }
}
```

**使用例**:
```bash
curl -X PUT http://localhost:4000/api/experience/1 \
  -H "Content-Type: application/json" \
  -d '{
    "experience_type": "owned",
    "note": "更新したメモ"
  }'
```

**注意事項**:
- 経験種別を変更すると、ポイントが自動的に再計算されます
- 指定しなかったフィールドは既存の値が保持されます

---

### 8. DELETE /api/experience/:id

**概要**: 既存の経験を削除

**リクエストパラメータ**:
- `id` (必須): 経験ID

**リクエスト**: なし

**レスポンス**:
```json
{
  "message": "Experience deleted successfully",
  "id": 1
}
```

**使用例**:
```bash
curl -X DELETE http://localhost:4000/api/experience/1
```

**注意事項**:
- 削除した経験は復元できません
- 削除後、スコアは自動的に再計算されます

## シードデータ

初期データとして以下が登録されています：
- **Toyota**: 100車種（Corolla, 2000GT, Supra, Alphard など）
- **その他メーカー**: Lexus, Honda, Mazda, SUBARU, Suzuki, Daihatsu（各1車種のみ）

## 開発メモ

### MoCの制約
- ユーザーIDは固定（user_id = 1）
- 認証機能なし
- 画像表示なし（将来的に追加予定）
- 「遊び方」画面は未実装（アラート表示のみ）
- 「図鑑管理」機能は未実装

## 今後のTODO

### 機能追加
- [ ] **検索機能**: 車種名やメーカー名での検索
- [ ] **フィルタ機能**: レアリティ、セグメント、経験種別でのフィルタリング
- [ ] **ソート機能**: 車種一覧をレアリティ順、名前順でソート
- [x] **経験履歴表示**: 登録した経験の一覧表示（実装済み - `/experiences` ページ）
- [x] **経験の編集・削除**: 登録済み経験の編集・削除機能（実装済み - 詳細ページから編集・削除可能）
- [ ] **図鑑管理機能**: 経験した車の一覧表示（図鑑ビュー）
- [ ] **遊び方画面**: アプリの使い方を説明する画面の実装
- [ ] **ランキング機能**: ユーザー間のスコアランキング（マルチユーザー対応後）
- [ ] **車の画像表示**: 車種ごとの画像表示機能
- [ ] **データエクスポート**: 経験データのCSV/JSONエクスポート

### UI/UXの改善
- [ ] **デザイン改修**: より洗練されたデザインへの刷新
- [ ] **レスポンシブ対応**: モバイル・タブレット対応の強化
- [ ] **ローディング表示**: データ取得中のローディングアニメーション改善
- [ ] **エラーハンドリング**: エラー発生時のユーザーフレンドリーなメッセージ表示
- [ ] **トースト通知**: 登録成功時などの通知機能
- [ ] **アニメーション**: 画面遷移やボタンクリック時のアニメーション追加
- [ ] **ダークモード**: ダークモード対応

### データ拡充
- [ ] **他メーカーの車種追加**: Honda, Mazda, SUBARU, Suzuki, Daihatsu, Lexusの車種データ拡充
- [ ] **海外メーカー追加**: BMW, Mercedes-Benz, Audi, Volkswagen, Ford, Chevroletなど
- [ ] **車種情報の充実**: 年式、排気量、駆動方式などの詳細情報追加

### バックエンド改善
- [ ] **ユーザー認証**: JWT認証の実装
- [ ] **マルチユーザー対応**: 複数ユーザーのサポート
- [ ] **バリデーション強化**: リクエストパラメータの厳密なバリデーション
- [ ] **エラーハンドリング**: 統一的なエラーレスポンス形式
- [ ] **ログ機能**: アクセスログ、エラーログの記録
- [ ] **テスト**: ユニットテスト、統合テストの追加
- [ ] **API ドキュメント**: Swagger/OpenAPIドキュメントの自動生成

### インフラ・運用
- [ ] **本番環境デプロイ**: Heroku, Vercel, AWS等へのデプロイ
- [ ] **CI/CD**: GitHub Actionsでの自動テスト・デプロイ
- [ ] **データベース移行**: PostgreSQL/MySQLへの移行（本番環境用）
- [ ] **環境変数管理**: .envファイルの適切な管理
- [ ] **セキュリティ対策**: SQLインジェクション、XSS対策の強化
- [ ] **パフォーマンス最適化**: クエリ最適化、キャッシング導入

### ドキュメント
- [ ] **API仕様書**: 詳細なAPI仕様書の作成
- [ ] **開発者ガイド**: 開発環境構築、コーディング規約のドキュメント化
- [ ] **ユーザーマニュアル**: エンドユーザー向けの使い方ガイド

## トラブルシューティング

### ポート競合エラー
バックエンドまたはフロントエンドのポートが既に使用されている場合：
- バックエンド: `backend/src/server.js` の `PORT` を変更
- フロントエンド: `frontend/vite.config.js` の `server.port` を追加

### データベースリセット
データベースをリセットしたい場合：
```bash
cd backend
rm -f data/dev.db
npm run dev  # 再起動で自動的に再作成されます
```

## ライセンス

ISC

## 作成者

経験車図鑑 MoC プロジェクト
