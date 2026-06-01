# DBマイグレーション

Drizzle Kit による PostgreSQL マイグレーション運用のガイド。

## 全体像

```
src/db/schema.ts  ─(db:generate)→  drizzle/*.sql  ─(db:migrate)→  PostgreSQL
   Drizzleスキーマ                  マイグレーションファイル          実DB
```

- スキーマの定義は `src/db/schema.ts` に集約する
- `drizzle/` は自動生成だが **Gitで管理する**（履歴・レビュー対象）
- 実DBへの反映は `db:migrate` のみ

## スキーマを変更するときの手順

1. `src/db/schema.ts` を編集
2. `npm run db:generate` を実行
   - `drizzle/NNNN_*.sql` と `drizzle/meta/` が生成・更新される
3. 生成された SQL を目視確認
   - 破壊的変更（DROP / 型変更 / NOT NULL 化）が意図通りか
   - データを失う変更が含まれていないか
4. `drizzle/` の変更をコミット
5. `npm run db:migrate` でローカルDBに適用
6. アプリを動かして動作確認

## 各コマンドの役割

| コマンド | 用途 | 想定シーン |
|---|---|---|
| `npm run db:generate` | schema.ts から SQL を生成 | スキーマ変更後 |
| `npm run db:migrate` | 生成済み SQL を順次適用 | ローカル / 本番への反映 |
| `npm run db:push` | schema.ts を直接DBへ反映（履歴なし） | 実験 / 使い捨てDB |
| `npm run db:studio` | DB GUI を起動 | データ確認 / 手動編集 |

### `db:push` と `db:migrate` の使い分け

- **`db:push`**
  - マイグレーションファイルを生成せず、現在の schema.ts を DB に直接反映
  - 試行錯誤フェーズでは便利
  - 履歴が残らないため、本番運用や複数人での開発には向かない

- **`db:migrate`**
  - `drizzle/` 配下の SQL を順番に適用
  - 履歴が残り、再現可能
  - こちらが基本のフロー

## やってはいけないこと

- **`drizzle/` 配下を手動編集する**
  - `drizzle/*.sql` も `drizzle/meta/*.json` も drizzle-kit が管理する生成物
  - 手で書き換えても、次の `db:generate` で整合性が崩れる
- **既に適用済みのマイグレーションを編集する**
  - 既にDBに当てたSQLを変更しても、再適用されない
  - 修正したいときは新しいマイグレーションを作る
- **`drizzle/` を `.gitignore` する**
  - これはコード履歴の一部。コミットして共有する

## トラブルシューティング

### マイグレーションの結果がおかしい

ローカル開発DBなら、コンテナごと作り直すのが最速:

```bash
docker compose down -v   # ボリュームごと削除
docker compose up -d
npm run db:migrate
```

### 生成済みファイルをやり直したい（開発初期のみ）

開発初期で履歴を清算してよい場合に限り:

```bash
rm -rf drizzle/
npm run db:generate
docker compose down -v && docker compose up -d
npm run db:migrate
```

本番運用が始まった後は **絶対にやらない**。

## 参考

- Drizzle Kit ドキュメント: <https://orm.drizzle.team/kit-docs/overview>
