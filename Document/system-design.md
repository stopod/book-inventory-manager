# Book Inventory Manager - システム設計ドキュメント

## システム概要

Book Inventory Manager は、書籍の在庫を管理するためのアプリケーションです。ユーザー認証機能を備え、認証されたユーザーのみが書籍データの作成、閲覧、更新、削除を行えます。

## アーキテクチャ

このアプリケーションは以下のコンポーネントで構成されています：

- **フロントエンド**: React + TypeScript (Vite)
- **バックエンド**: Node.js + TypeScript + Hono
- **データベース**: PostgreSQL（Prismaを使用）
- **認証**: JWT (JSON Web Token)

## ユースケース図

### 1. 認証関連のユースケース

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthAPI
    participant JWTService
    participant UserRepository
    participant Database

    %% ユーザー登録プロセス
    User->>Frontend: ユーザー登録情報を入力
    Frontend->>AuthAPI: /api/auth/register (POST)
    AuthAPI->>UserRepository: findByEmail(email)
    UserRepository->>Database: SELECT * FROM users WHERE email = ?
    Database-->>UserRepository: ユーザー存在確認結果
    
    alt ユーザーが既に存在する場合
        UserRepository-->>AuthAPI: ユーザー重複エラー
        AuthAPI-->>Frontend: 409 Conflict
        Frontend-->>User: 「このメールアドレスは既に登録されています」
    else ユーザーが存在しない場合
        AuthAPI->>UserRepository: パスワードをハッシュ化して保存
        UserRepository->>Database: INSERT INTO users
        Database-->>UserRepository: 成功レスポンス
        UserRepository-->>AuthAPI: 新規ユーザー情報
        AuthAPI->>JWTService: generateToken(userId)
        JWTService-->>AuthAPI: accessToken, refreshToken
        AuthAPI-->>Frontend: ユーザー情報 + トークン
        Frontend->>Frontend: トークンをlocalStorageに保存
        Frontend-->>User: 「登録成功」
    end

    %% ログインプロセス
    User->>Frontend: メール・パスワードを入力
    Frontend->>AuthAPI: /api/auth/login (POST)
    AuthAPI->>UserRepository: findByEmail(email)
    UserRepository->>Database: SELECT * FROM users WHERE email = ?
    Database-->>UserRepository: ユーザー情報
    
    alt ユーザーが存在しない場合
        UserRepository-->>AuthAPI: ユーザーなし
        AuthAPI-->>Frontend: 401 Unauthorized
        Frontend-->>User: 「メールアドレスまたはパスワードが間違っています」
    else ユーザーが存在する場合
        AuthAPI->>UserRepository: パスワード照合
        UserRepository-->>AuthAPI: 照合結果
        
        alt パスワードが一致しない場合
            AuthAPI-->>Frontend: 401 Unauthorized
            Frontend-->>User: 「メールアドレスまたはパスワードが間違っています」
        else パスワードが一致する場合
            AuthAPI->>JWTService: generateToken(userId)
            JWTService-->>AuthAPI: accessToken, refreshToken
            AuthAPI-->>Frontend: ユーザー情報 + トークン
            Frontend->>Frontend: トークンをlocalStorageに保存
            Frontend-->>User: ダッシュボードへリダイレクト
        end
    end

    %% トークンリフレッシュプロセス
    Frontend->>AuthAPI: /api/auth/refresh (POST)
    AuthAPI->>JWTService: verifyRefreshToken(token)
    
    alt リフレッシュトークンが有効
        JWTService-->>AuthAPI: 検証済みのペイロード
        AuthAPI->>JWTService: generateToken(userId)
        JWTService-->>AuthAPI: 新しいaccessToken
        AuthAPI-->>Frontend: 新しいaccessToken
        Frontend->>Frontend: accessTokenを更新
    else リフレッシュトークンが無効
        JWTService-->>AuthAPI: 検証エラー
        AuthAPI-->>Frontend: 401 Unauthorized
        Frontend->>Frontend: ログアウト処理
        Frontend-->>User: ログイン画面にリダイレクト
    end

    %% セッション検証プロセス
    Frontend->>AuthAPI: /api/auth/me (GET)
    AuthAPI->>AuthAPI: authMiddleware
    AuthAPI->>JWTService: verifyToken(token)
    
    alt トークンが有効
        JWTService-->>AuthAPI: 検証済みのペイロード
        AuthAPI->>UserRepository: findById(userId)
        UserRepository->>Database: SELECT * FROM users WHERE id = ?
        Database-->>UserRepository: ユーザー情報
        UserRepository-->>AuthAPI: ユーザー情報
        AuthAPI-->>Frontend: ユーザー情報
    else トークンが無効
        JWTService-->>AuthAPI: 検証エラー
        AuthAPI-->>Frontend: 401 Unauthorized
        Frontend->>Frontend: ログアウト処理
        Frontend-->>User: ログイン画面にリダイレクト
    end
```

### 2. 書籍管理のユースケース

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthMiddleware
    participant BookAPI
    participant BookRepository
    participant Database

    %% 書籍一覧取得プロセス
    User->>Frontend: 書籍一覧ページを開く
    Frontend->>BookAPI: /api/books (GET)
    BookAPI->>AuthMiddleware: 認証チェック
    
    alt 認証失敗
        AuthMiddleware-->>Frontend: 401 Unauthorized
        Frontend-->>User: ログイン画面にリダイレクト
    else 認証成功
        AuthMiddleware-->>BookAPI: 次の処理へ
        BookAPI->>BookRepository: getAllBooks()
        BookRepository->>Database: SELECT * FROM books
        Database-->>BookRepository: 書籍一覧データ
        BookRepository-->>BookAPI: 書籍一覧
        BookAPI-->>Frontend: 書籍一覧JSON
        Frontend-->>User: 書籍一覧を表示
    end

    %% 書籍詳細取得プロセス
    User->>Frontend: 書籍詳細を表示
    Frontend->>BookAPI: /api/books/:id (GET)
    BookAPI->>AuthMiddleware: 認証チェック
    
    alt 認証失敗
        AuthMiddleware-->>Frontend: 401 Unauthorized
        Frontend-->>User: ログイン画面にリダイレクト
    else 認証成功
        AuthMiddleware-->>BookAPI: 次の処理へ
        BookAPI->>BookRepository: getBookById(id)
        BookRepository->>Database: SELECT * FROM books WHERE id = ?
        Database-->>BookRepository: 書籍データ
        
        alt 書籍が存在しない
            BookRepository-->>BookAPI: null
            BookAPI-->>Frontend: 404 Not Found
            Frontend-->>User: 「書籍が見つかりません」
        else 書籍が存在する
            BookRepository-->>BookAPI: 書籍データ
            BookAPI-->>Frontend: 書籍データJSON
            Frontend-->>User: 書籍詳細を表示
        end
    end

    %% 書籍追加プロセス
    User->>Frontend: 新規書籍情報を入力
    Frontend->>BookAPI: /api/books (POST)
    BookAPI->>AuthMiddleware: 認証チェック
    
    alt 認証失敗
        AuthMiddleware-->>Frontend: 401 Unauthorized
        Frontend-->>User: ログイン画面にリダイレクト
    else 認証成功
        AuthMiddleware-->>BookAPI: 次の処理へ
        BookAPI->>BookRepository: バリデーション
        
        alt バリデーション失敗
            BookRepository-->>BookAPI: バリデーションエラー
            BookAPI-->>Frontend: 400 Bad Request
            Frontend-->>User: 入力エラーを表示
        else バリデーション成功
            BookAPI->>BookRepository: createBook(bookData)
            BookRepository->>Database: INSERT INTO books
            Database-->>BookRepository: 新規書籍データ
            BookRepository-->>BookAPI: 新規書籍データ
            BookAPI-->>Frontend: 新規書籍データJSON
            Frontend-->>User: 「書籍が追加されました」
        end
    end

    %% 書籍更新プロセス
    User->>Frontend: 書籍情報を編集
    Frontend->>BookAPI: /api/books/:id (PUT)
    BookAPI->>AuthMiddleware: 認証チェック
    
    alt 認証失敗
        AuthMiddleware-->>Frontend: 401 Unauthorized
        Frontend-->>User: ログイン画面にリダイレクト
    else 認証成功
        AuthMiddleware-->>BookAPI: 次の処理へ
        BookAPI->>BookRepository: バリデーション
        
        alt バリデーション失敗
            BookRepository-->>BookAPI: バリデーションエラー
            BookAPI-->>Frontend: 400 Bad Request
            Frontend-->>User: 入力エラーを表示
        else バリデーション成功
            BookAPI->>BookRepository: updateBook(id, bookData)
            BookRepository->>Database: UPDATE books SET ... WHERE id = ?
            Database-->>BookRepository: 更新結果
            
            alt 書籍が存在しない
                BookRepository-->>BookAPI: null
                BookAPI-->>Frontend: 404 Not Found
                Frontend-->>User: 「書籍が見つかりません」
            else 更新成功
                BookRepository-->>BookAPI: 更新された書籍データ
                BookAPI-->>Frontend: 更新された書籍データJSON
                Frontend-->>User: 「書籍が更新されました」
            end
        end
    end

    %% 書籍削除プロセス
    User->>Frontend: 書籍削除ボタンをクリック
    Frontend->>BookAPI: /api/books/:id (DELETE)
    BookAPI->>AuthMiddleware: 認証チェック
    
    alt 認証失敗
        AuthMiddleware-->>Frontend: 401 Unauthorized
        Frontend-->>User: ログイン画面にリダイレクト
    else 認証成功
        AuthMiddleware-->>BookAPI: 次の処理へ
        BookAPI->>BookRepository: deleteBook(id)
        BookRepository->>Database: DELETE FROM books WHERE id = ?
        Database-->>BookRepository: 削除結果
        
        alt 書籍が存在しない
            BookRepository-->>BookAPI: エラー
            BookAPI-->>Frontend: 404 Not Found
            Frontend-->>User: 「書籍が見つかりません」
        else 削除成功
            BookRepository-->>BookAPI: 成功レスポンス
            BookAPI-->>Frontend: 成功レスポンス
            Frontend-->>User: 「書籍が削除されました」
        end
    end
```

## ディレクトリ構造

```
book-inventory-manager/
├── backend/                # バックエンドコード
│   ├── src/
│   │   ├── application/    # アプリケーションロジック
│   │   ├── domain/         # ドメインモデル
│   │   ├── infrastructure/ # インフラストラクチャ実装
│   │   └── presentation/   # コントローラとルート
│   ├── prisma/             # Prismaスキーマと移行
│   └── ...
├── frontend/               # フロントエンドコード
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── context/        # Reactコンテキスト
│   │   ├── hooks/          # カスタムフック
│   │   ├── pages/          # ページコンポーネント
│   │   └── services/       # APIサービス
│   └── ...
└── Document/               # ドキュメント
```

## APIエンドポイント

### 認証API

| エンドポイント         | メソッド | 説明                  | 認証必要 |
|----------------------|--------|----------------------|----------|
| `/api/auth/register` | POST   | 新規ユーザー登録        | いいえ    |
| `/api/auth/login`    | POST   | ユーザーログイン        | いいえ    |
| `/api/auth/refresh`  | POST   | アクセストークン更新    | いいえ    |
| `/api/auth/me`       | GET    | ログインユーザー情報取得 | はい      |

### 書籍API

| エンドポイント      | メソッド | 説明              | 認証必要 |
|-------------------|--------|------------------|----------|
| `/api/books`      | GET    | 書籍一覧を取得     | はい      |
| `/api/books/:id`  | GET    | 特定の書籍を取得   | はい      |
| `/api/books`      | POST   | 新規書籍を作成     | はい      |
| `/api/books/:id`  | PUT    | 書籍情報を更新     | はい      |
| `/api/books/:id`  | DELETE | 書籍を削除         | はい      |

## 認証フロー

1. ユーザーがログインすると、アクセストークンとリフレッシュトークンが発行されます
2. アクセストークンはlocalStorageに保存され、APIリクエストの`Authorization: Bearer [token]`ヘッダーで送信されます
3. アクセストークンが期限切れになると、リフレッシュトークンを使用して新しいアクセストークンを取得します
4. リフレッシュトークンも期限切れの場合、ユーザーは再度ログインする必要があります

## セキュリティ対策

1. パスワードはbcryptでハッシュ化して保存
2. JWT認証でAPIエンドポイントを保護
3. CORS設定で許可されたオリジンのみアクセス可能
4. 認証ミドルウェアでAPI保護