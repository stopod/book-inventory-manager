FROM node:20-slim

# Debianベースのイメージを使用してOpenSSLの問題を回避
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# 起動時にマイグレーションを実行してからサーバーを起動
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
