# 🚅 Express.js Server Boilerplate

확장 가능하고 견고한 Express 애플리케이션을 빠르게 개발하기 위한 **Production-Ready** 스타터 키트입니다.  
프로젝트 초기 설정에 들어가는 반복 작업을 줄이고, **3-Layer Architecture** (Controller-Service-Repository)와 유용한 유틸리티들을 미리 구성하여 비즈니스 로직에 집중할 수 있도록 했습니다.

## ✨ Key Features

- **Layered Architecture**: Controller, Service, Router로 명확히 분리된 책임 구조.
- **Modular Utilities (`libs`)**: 데이터베이스, 로깅, 설정 등 공통 기능을 `libs` 폴더에서 모듈화하여 관리.
- **Authentication**: `Passport.js` (Local, JWT) 기반의 확장 가능한 인증 시스템.
- **ORM & Database**: `Sequelize`를 활용한 PostgreSQL 연동 및 마이그레이션 환경 구축.
- **Structured Logging**: `Pino` 로거를 도입하여 JSON 형식의 구조화된 로그 기록.
- **Redis Integration**: 세션 관리 및 캐싱을 위한 Redis 클라이언트 설정.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: PostgreSQL (Sequelize ORM)
- **Cache**: Redis
- **Logging**: Pino
- **Authentication**: Passport.js

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Start-Jihwan/jihwan-try.git
cd express-server

# Install dependencies
npm install
```

### 1. Configuration (`.env`)

`.env` 파일을 생성하고 다음 변수들을 설정합니다.

```ini
PORT=
NODE_ENV=
DB_HOST=
DB_USER=
DB_PASS=
JWT_SECRET=
REDIS_HOST=
REDIS_PORT=
```

### 3. Database Setup

```bash
# 데이터베이스 생성, 마이그레이션 및 시딩
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Running the Server

```bash
# Development Mode (with Nodemon)
npm run dev

# Production Mode
npm start
```

---

## 📂 Project Structure

```bash
express-server/
├── src/
│   ├── controllers/    # Request handlers (User, Auth)
│   ├── routers/        # Route definitions
│   ├── services/       # Business logic
│   ├── libs/           # Shared utilities & configurations
│   │   ├── common/     # Common constants & helpers
│   │   ├── config/     # Environment configurations
│   │   ├── context/    # Request context management
│   │   ├── db/         # Sequelize init, models, migrations
│   │   ├── logger/     # Pino logger setup
│   │   ├── middlewares/# Express middlewares (Passport, etc.)
│   │   └── redis/      # Redis connection client
│   └── server.js       # App entry point
├── .env                # Environment variables
├── .sequelizerc        # Sequelize configuration path
└── package.json        # Dependencies
```
