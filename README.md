# Anime Record App

Next.js (frontend) と NestJS (backend) の開発環境です。Docker Compose でホットリロード付きの開発サーバーを起動できます。

## 構成

```
.
├── frontend/          # Next.js
├── backend/           # NestJS
├── docker/
│   ├── frontend/      # Frontend Dockerfile
│   └── backend/       # Backend Dockerfile
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

## アクセス

| サービス  | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:3001        |
| Health    | http://localhost:3001/health |

## 停止方法

```bash
docker compose down
```

## ホットリロード

ソースコードはボリュームマウントされているため、以下のファイルを編集すると自動的に反映されます。

- `frontend/` 配下 → Next.js 開発サーバーが再読み込み
- `backend/` 配下 → NestJS が `--watch` モードで再コンパイル

Docker 上でのファイル監視のため、ポーリングを有効にしています。

## 画像

画像は各自で用意してください。

カバー画像は `frontend/public/images/` に配置し、`imageUrl` には `/images/ファイル名` のようなアプリ内パス（または外部URL）を保存します。画像ファイル自体は Git 管理対象外です。

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: NestJS 11, TypeScript
- **Runtime**: Node.js LTS (Alpine)
