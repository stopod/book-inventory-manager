# 前提

これは生成 AI を使用して頑張ってもらっているリポジトリです

# Book Inventory Manager

A modern web application for managing book inventory with authentication, built following DDD (Domain-Driven Design) and Onion Architecture principles.

## Features

- 🔐 User authentication (register, login, token refresh)
- 📚 Book inventory management (CRUD operations)
- 🔍 Search and filter books
- 📊 Track book quantities and categories
- 🛡️ Secure API with JWT authentication
- 🧅 Domain-Driven Design architecture

## Tech Stack

### Backend

- TypeScript
- Node.js
- Hono (lightweight web framework)
- PostgreSQL (with Prisma ORM)
- Domain-Driven Design / Onion Architecture
- JWT Authentication

### Frontend

- React
- TypeScript
- React Router
- React Hook Form / Zod
- Tailwind CSS
- Axios

## Project Structure

The project follows a clean, domain-driven architecture:

```
book-inventory-manager/
├── backend/                  # Backend API
│   ├── prisma/               # Database schema and migrations
│   └── src/
│       ├── domain/           # Core domain models and business rules
│       │   ├── models/       # Domain entities and value objects
│       │   ├── repositories/ # Repository interfaces
│       │   └── services/     # Domain services
│       ├── application/      # Application services and use cases
│       │   ├── dtos/         # Data Transfer Objects
│       │   ├── services/     # Application services
│       │   └── usecases/     # Business use cases
│       ├── infrastructure/   # Infrastructure concerns
│       │   ├── auth/         # Authentication services
│       │   ├── database/     # Database connection
│       │   └── repositories/ # Repository implementations
│       └── presentation/     # API endpoints and controllers
│           ├── api/          # API routes
│           ├── controllers/  # Request handlers
│           └── middlewares/  # HTTP middlewares
├── frontend/                 # React frontend
│   ├── public/               # Public assets
│   └── src/
│       ├── components/       # Reusable React components
│       ├── context/          # React context providers
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page components
│       ├── services/         # API services
│       └── types/            # TypeScript type definitions
└── compose.yaml              # Docker Compose configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for running PostgreSQL)

### Installation

1. Clone the repository:

   ```bash
   git clone https://your-repository-url/book-inventory-manager.git
   cd book-inventory-manager
   ```

2. Start the database and services with Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the application

1. Start the backend development server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## License

This project is licensed under the MIT License.

## スクショ
トップ画面
![image](https://github.com/user-attachments/assets/f58a8eec-47c4-4f21-8124-294eb2186f8b)
一覧
![image](https://github.com/user-attachments/assets/1c7e3036-8fea-4ffe-9aca-71d2c02803b6)
詳細
![image](https://github.com/user-attachments/assets/d0f4d78c-c3a2-4062-a31e-1df1266c41e8)
編集
![image](https://github.com/user-attachments/assets/112b65d2-16bf-4c75-81e8-6610a32af44f)
新規登録
![image](https://github.com/user-attachments/assets/7481997e-9847-4b6e-94d5-445cee633c02)
登録後
![image](https://github.com/user-attachments/assets/42735480-1d31-4888-9ed4-9cfa84430341)



