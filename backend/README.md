# Yomilog Backend

ブクログ風読書記録アプリ Yomilog の API サーバー。

## 技術スタック

- **Hono** — Web フレームワーク
- **@hono/zod-openapi** — OpenAPI 3.0 仕様の自動生成 + バリデーション
- **@hono/swagger-ui** — Swagger UI のホスティング
- **Drizzle ORM** — PostgreSQL 用 ORM
- **TypeScript** / **tsx** — 型と開発時実行

## セットアップ

```bash
npm install
```

## 起動

```bash
npm run dev      # 開発（ファイル変更で自動リロード）
npm run start    # 通常起動
npm run typecheck
```

デフォルトポートは `8080`。変えたい場合は環境変数で:

```bash
PORT=8090 npm run dev
```

起動後にアクセスできるURL:

| URL | 内容 |
|---|---|
| `http://localhost:8080/ui` | Swagger UI |
| `http://localhost:8080/doc` | OpenAPI 3.0 仕様 (JSON) |
| `http://localhost:8080/api/...` | 各エンドポイント |

## ディレクトリ構成

```
backend/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # エントリポイント (OpenAPIHono の組み立て)
    ├── db/
    │   └── schema.ts         # Drizzle スキーマ
    └── openapi/
        ├── common.ts         # 共通スキーマ (IdParam, Error, Timestamps)
        └── routes/           # リソースごとの I/F 定義
            ├── publishers.ts
            ├── authors.ts
            ├── books.ts
            ├── tags.ts
            └── bookshelf.ts
```

## API リソース

| Resource | 用途 |
|---|---|
| `/api/publishers` | 出版社マスター |
| `/api/authors` | 著者マスター |
| `/api/books` | 本の書誌情報 |
| `/api/tags` | タグマスター |
| `/api/bookshelf` | 本棚エントリ（ステータス・評価・感想） |

詳細なリクエスト/レスポンス仕様は Swagger UI (`/ui`) で確認できます。

## 状態

ハンドラはまだ未実装（`throw new Error("Not implemented")`）。I/F 定義のみ。
