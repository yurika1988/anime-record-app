# Anime Record App

個人用のアニメ記録アプリです。Next.js（frontend）と NestJS（backend）、MySQL を Docker Compose で起動します。

## 構成

```
.
├── frontend/          # Next.js
├── backend/           # NestJS + Prisma
├── docker/
│   ├── frontend/
│   └── backend/
└── docker-compose.yml
```

## 前提条件

- Docker
- Docker Compose

## 起動方法

```bash
docker compose up --build
```

バックグラウンドで起動する場合:

```bash
docker compose up --build -d
```

### clone 後のマイグレーション

初回、または新しい Prisma マイグレーションを取り込んだあとは、backend コンテナで適用します。

```bash
docker compose exec backend npx prisma migrate deploy
```

`start:dev` は `prisma generate` を実行しますが、マイグレーションの適用は自動では行いません。

## アクセス

| サービス     | URL                              |
|--------------|----------------------------------|
| Frontend     | http://localhost:3000            |
| ログイン     | http://localhost:3000/login      |
| ユーザー登録 | http://localhost:3000/register   |
| アニメ一覧   | http://localhost:3000/anime      |
| Backend      | http://localhost:3001            |
| Health       | http://localhost:3001/health     |

- 登録成功後は `/login` へ遷移します（自動ログインしません）
- ログイン成功後は `/anime` へ遷移します
- アニメ一覧・CRUD はログイン必須です

## 認証

- ユーザー登録: `POST /auth/register`（email / password、パスワードは bcrypt でハッシュ保存）
- ログイン: `POST /auth/login`（`accessToken` として JWT を返却）
- パスワードは 8 文字以上
- Anime API は `Authorization: Bearer <JWT>` が必須です
- 各ユーザーは自分の Anime だけ取得・追加・編集・削除できます

### JWT_SECRET

`docker-compose.yml` の `JWT_SECRET`（`dev_jwt_secret_change_me`）は **開発用プレースホルダー** です。本番環境では必ず推測されにくい安全なランダム値へ変更してください。

## CRUD API

Anime API はすべて JWT 認証と所有者チェック付きです。JSON、または画像付きの `multipart/form-data` を受け付けます。

| メソッド | パス | 説明 |
|----------|------|------|
| `POST` | `/auth/register` | ユーザー登録 |
| `POST` | `/auth/login` | ログイン（JWT 発行） |
| `GET` | `/anime` | 自分のアニメ一覧 |
| `POST` | `/anime` | アニメ登録（任意で画像アップロード） |
| `GET` | `/anime/:id` | 自分のアニメ 1 件 |
| `PATCH` | `/anime/:id` | アニメ更新・画像差し替え・画像削除 |
| `DELETE` | `/anime/:id` | アニメ削除（紐付くアップロード画像も削除） |
| `GET` | `/uploads/...` | アップロード画像の配信（ログイン不要） |
| `GET` | `/health` | ヘルスチェック（認証不要） |

## 画像

カバー画像の保存先は `Anime.imageUrl` です（別テーブルはありません）。次のいずれかを使えます。

1. **ファイルアップロード**（JPEG / PNG / WebP、最大 5MB）
   - 保存パス: `/uploads/{userId}/{uuid}.ext`
   - ディスク: コンテナ内 `/app/uploads/{userId}/...`
2. **外部 URL**（`https://...`）
3. **アプリ内の静的パス**（例: `/images/tensura.jpeg`）
   ファイルは `frontend/public/images/` に各自で配置します。このディレクトリの画像ファイルは Git 管理対象外です。

優先順位: **新しいファイル > `removeImage` > `imageUrl` 文字列**

### 差し替え・削除

- 編集時に新しいファイルを送ると、以前の **アップロード画像ファイル** を削除して差し替えます
- `removeImage=true`（または画面の「画像を削除」）で `imageUrl` を空にし、アップロード済みファイルがあれば削除します。一覧は「画像なし」になります
- Anime 自体を削除すると、紐付いていたアップロード画像ファイルも削除します
- 外部 URL や `/images/...` の静的ファイルは、アプリ側では削除しません

### Docker volume `anime_uploads`

アップロード実体は named volume `anime_uploads` に載せ、backend の `/app/uploads` にマウントしています。コンテナの再作成では消えません。

```bash
docker compose down
```

上記はコンテナを止めますが、volume（DB とアップロード画像）は残ります。

```bash
docker compose down -v
```

`-v` を付けると `anime_uploads` と MySQL のデータ volume も削除されます。**アップロード画像と DB の中身が消えます。**

## 停止方法

```bash
docker compose down
```

## ホットリロード

ソースコードはボリュームマウントされているため、以下のファイルを編集すると自動的に反映されます。

- `frontend/` 配下 → Next.js 開発サーバーが再読み込み
- `backend/` 配下 → NestJS が `--watch` モードで再コンパイル

Docker 上でのファイル監視のため、ポーリングを有効にしています。

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: NestJS 11, Prisma 7, TypeScript
- **Database**: MySQL 8.0
- **Runtime**: Node.js LTS (Alpine)
