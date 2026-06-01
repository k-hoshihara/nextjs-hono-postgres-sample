# Yomilog

ブクログ風の読書記録アプリケーション。読んだ本を記録・管理し、感想やレビューを残せます。

## 機能（MVP）

- 本棚ステータス管理（読みたい / 読書中 / 読了 / 中断）
- 5段階評価とレビュー
- タグによる分類
- 本・著者・出版社の管理

## 技術スタック

- **Frontend**: Next.js（未着手）
- **Backend**: Hono + @hono/zod-openapi（I/F定義のみ実装済み、ハンドラ未実装）
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL（Docker コンテナで運用予定）

## ディレクトリ構成

```
.
├── frontend/   # Next.js アプリケーション（未着手）
└── backend/    # Hono API サーバー
```

## セットアップ

### Backend

```bash
cd backend
npm install
npm run dev
```

起動後、`http://localhost:8080/ui` で Swagger UI が確認できます。
詳細は [`backend/README.md`](./backend/README.md) を参照。

### Frontend

未着手。

### Database

未着手（PostgreSQL の `docker-compose.yml` は今後追加予定）。

## 進捗

- [x] DB スキーマ設計（第3正規化）
- [x] Drizzle ORM スキーマ定義
- [x] OpenAPI による API I/F 定義
- [ ] API ハンドラの実装
- [ ] PostgreSQL コンテナ + マイグレーション
- [ ] Frontend (Next.js) のセットアップ
