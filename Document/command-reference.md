# Book Inventory Manager - コマンドリファレンス

## Dockerコマンド

### 基本的なDockerコマンド

```bash
# Dockerイメージのビルド
docker build -t book-inventory-manager .

# コンテナの起動 (デタッチモード)
docker run -d -p 3000:3000 --name book-inventory-app book-inventory-manager

# コンテナの起動 (インタラクティブモード)
docker run -it -p 3000:3000 --name book-inventory-app book-inventory-manager

# 起動中のコンテナの確認
docker ps

# すべてのコンテナの確認 (停止中も含む)
docker ps -a

# コンテナの停止
docker stop book-inventory-app

# コンテナの再起動
docker restart book-inventory-app

# コンテナの削除
docker rm book-inventory-app

# イメージの削除
docker rmi book-inventory-manager

# コンテナのログ表示
docker logs book-inventory-app

# コンテナのログを継続的に表示
docker logs -f book-inventory-app

# コンテナ内でコマンド実行
docker exec -it book-inventory-app /bin/bash
```

### Docker Composeコマンド

```bash
# サービスの起動
docker-compose up

# サービスのバックグラウンド起動
docker-compose up -d

# サービスの停止
docker-compose down

# サービスのリビルドと起動
docker-compose up --build

# サービスの状態確認
docker-compose ps

# 特定のサービスだけ起動
docker-compose up -d db

# サービスのログ表示
docker-compose logs

# 特定のサービスのログ表示
docker-compose logs app

# 継続的なログ表示
docker-compose logs -f
```

### データベース関連のDockerコマンド

```bash
# PostgreSQLコンテナの起動
docker run -d --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=bookdb -p 5432:5432 postgres:14

# MySQLコンテナの起動
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=bookdb -p 3306:3306 mysql:8

# PostgreSQLのコマンドラインに接続
docker exec -it postgres psql -U user -d bookdb

# MySQLのコマンドラインに接続
docker exec -it mysql mysql -u root -p bookdb
```

### Dockerボリューム操作

```bash
# ボリュームの作成
docker volume create book-inventory-data

# ボリュームの一覧表示
docker volume ls

# ボリュームの詳細情報表示
docker volume inspect book-inventory-data

# ボリュームの削除
docker volume rm book-inventory-data

# 未使用ボリュームの一括削除
docker volume prune
```

### Dockerネットワーク操作

```bash
# ネットワークの作成
docker network create book-inventory-network

# ネットワークの一覧表示
docker network ls

# ネットワークの詳細情報表示
docker network inspect book-inventory-network

# コンテナをネットワークに接続
docker network connect book-inventory-network book-inventory-app

# コンテナをネットワークから切断
docker network disconnect book-inventory-network book-inventory-app

# ネットワークの削除
docker network rm book-inventory-network

# 未使用ネットワークの一括削除
docker network prune
```

### Dockerシステムメンテナンス

```bash
# 未使用イメージ、コンテナ、ネットワークの一括削除
docker system prune

# ボリュームも含めた一括削除
docker system prune -a --volumes

# Dockerシステム情報の表示
docker system info

# Dockerディスク使用量の表示
docker system df
```

## DockerとPrisma Studio

このセクションでは、Dockerコンテナ内でPrisma Studioを起動してデータベースを管理する方法を説明します。

### Dockerコンテナ内でPrisma Studioを起動する

```bash
# コンテナに入ってPrisma Studioを起動する基本コマンド
docker exec -it コンテナ名 bash -c "cd /app && npx prisma studio"

# 具体例: book-inventory-appコンテナで起動
docker exec -it book-inventory-app bash -c "cd /app && npx prisma studio"

# ポートを指定して起動 (デフォルトは5555)
docker exec -it book-inventory-app bash -c "cd /app && npx prisma studio --port 5555"
```

### Docker Composeで起動したコンテナでPrisma Studioを起動

```bash
# Docker Composeで起動したサービスでPrisma Studioを起動
docker-compose exec サービス名 bash -c "cd /app && npx prisma studio"

# 具体例: backendサービスで起動
docker-compose exec backend bash -c "cd /app && npx prisma studio"

# ホストからアクセスできるようにポートバインディングを指定
docker-compose exec backend bash -c "cd /app && npx prisma studio --host 0.0.0.0"
```

### 開発環境用のdocker-compose.ymlの例

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"  # APIサーバー用ポート
      - "5555:5555"  # Prisma Studio用ポート
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/bookdb
    depends_on:
      - db

  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: bookdb
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

### 一時的なPrisma Studioコンテナを起動

プロジェクトのルートディレクトリに.envファイルがある場合：

```bash
# 一時的なPrisma Studioコンテナを起動
docker run --rm -it -p 5555:5555 \
  -v "$(pwd)/backend/prisma:/app/prisma" \
  -v "$(pwd)/.env:/app/.env" \
  --network=host \
  node:16 \
  bash -c "cd /app && npm install -g prisma && prisma studio --host 0.0.0.0"
```

### 既存のコンテナのデータベースに接続してPrisma Studioを使用

```bash
# 既存のDBコンテナに接続する一時的なPrisma Studioコンテナ
docker run --rm -it -p 5555:5555 \
  -v "$(pwd)/backend/prisma:/app/prisma" \
  --network=book-inventory-manager_default \
  node:16 \
  bash -c "cd /app && npm install -g prisma && DATABASE_URL='postgresql://user:password@db:5432/bookdb' prisma studio --host 0.0.0.0"
```

注意: `book-inventory-manager_default`はネットワーク名で、`docker network ls`コマンドで確認できます。また、DATABASE_URLはあなたの環境に合わせて変更してください。

### トラブルシューティング

```bash
# Prisma Studioを起動する前に、データベース接続をテスト
docker exec -it book-inventory-app bash -c "cd /app && npx prisma migrate status"

# Prismaクライアントを再生成
docker exec -it book-inventory-app bash -c "cd /app && npx prisma generate"

# データベースURLを直接指定してPrisma Studioを起動
docker exec -it book-inventory-app bash -c "cd /app && DATABASE_URL='postgresql://user:password@db:5432/bookdb' npx prisma studio"
```

## Prismaコマンド

### 初期化とスキーマ関連

```bash
# Prismaの初期化
npx prisma init

# データベースマイグレーション作成
npx prisma migrate dev --name init

# マイグレーションの適用
npx prisma migrate deploy

# 開発環境でのマイグレーション作成と適用
npx prisma migrate dev

# 本番環境でのマイグレーション適用
npx prisma migrate deploy

# マイグレーション履歴のリセット (開発環境のみ)
npx prisma migrate reset

# マイグレーション状態の表示
npx prisma migrate status
```

### Prismaクライアント関連

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースシード実行
npx prisma db seed

# 特定のシードファイルのみ実行
npx prisma db seed --file=seed.ts
```

### データベース操作

```bash
# Prisma Studioの起動 (GUIでデータ操作)
npx prisma studio

# データベースのリセット (全テーブルの削除と再作成)
npx prisma db push --force-reset

# スキーマからデータベースへの直接反映 (マイグレーション履歴なし)
npx prisma db push

# データベースからスキーマの生成 (既存DBからの移行時)
npx prisma db pull

# 指定データベースへのマイグレーション
npx prisma migrate deploy --preview-feature --schema=./prisma/schema.prisma

# データのエクスポート
npx prisma db export --data-proxy
```

### 実行環境指定

```bash
# 環境変数ファイルを指定してPrismaコマンド実行
npx prisma migrate dev --env-file .env.development

# 特定のプロファイルを使用してPrismaコマンド実行
npx prisma migrate deploy --preview-feature --schema=./prisma/schema.prisma
```

### トラブルシューティング

```bash
# Prismaのバージョン確認
npx prisma -v

# Prismaクライアントの再生成
npx prisma generate --watch

# データベース接続テスト
npx prisma db execute --stdin < test-connection.sql

# プリズマキャッシュのクリア
npx prisma generate --no-engine
```

## 開発用スクリプト (package.json)

```bash
# バックエンド開発サーバー起動
npm run dev

# フロントエンド開発サーバー起動
cd frontend && npm run dev

# ビルド
npm run build

# テスト実行
npm run test

# リンター実行
npm run lint

# フォーマッター実行
npm run format

# Prismaスキーマ生成
npm run prisma:generate

# Prismaマイグレーション
npm run prisma:migrate

# Prisma Studio起動
npm run prisma:studio
```

## プロジェクト特有のスクリプト

このプロジェクトでは、以下のコマンドがよく使われます：

```bash
# バックエンドサーバーの起動
cd backend
npm run dev

# フロントエンドの開発サーバー起動
cd frontend
npm run dev

# バックエンドビルド
cd backend
npm run build

# フロントエンドビルド
cd frontend
npm run build

# データベースマイグレーション
cd backend
npm run prisma:migrate

# Prisma Studio起動（データベース管理UI）
cd backend
npm run prisma:studio
```

## Docker開発環境

このプロジェクトをDockerで開発する場合の主なコマンド：

```bash
# 開発環境の起動
docker-compose -f docker-compose.dev.yml up -d

# 開発環境の停止
docker-compose -f docker-compose.dev.yml down

# アプリケーションのリビルドと再起動
docker-compose -f docker-compose.dev.yml up -d --build app

# データベースコンテナだけ起動
docker-compose -f docker-compose.dev.yml up -d db

# ログの確認
docker-compose -f docker-compose.dev.yml logs -f app
```

これらのコマンドはプロジェクトの開発、デバッグ、デプロイメントのプロセスを効率化するために重要です。コマンドとその用途を理解することで、開発ワークフローがスムーズになります。