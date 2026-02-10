# 🚀 Jihwan's Dev Log

이곳은 저의 개인 프로젝트 및 학습 결과물을 모아둔 저장소입니다. 다양한 기술 스택을 실험하고 적용하며 성장하는 과정을 기록합니다.

---

## 🛠 Main Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) |
| **Frameworks** | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) |
| **Tools** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) |

---

## 📂 Projects Overview


### 1️⃣ [Expense Tracker Service](./expense-tracker/)
> **"체계적인 개인 자산 관리를 위한 가계부"**
>
> 사용자의 수입/지출을 기록하고 예산을 설정하여 관리할 수 있는 웹 백엔드입니다.  
> 단순 기록을 넘어, 소비 습관을 분석하고 챌린지 기능을 통해 자산 관리의 재미를 더했습니다.

- **Key Features**: 세션 인증, 지출/수입 CRUD, 통계 리포트, 예산 설정, 챌린지 모드
- **Tech Stack**: `Node.js`, `Express`, `Sequelize`, `PostgreSQL`, `Redis`, `BullMQ`

### 2️⃣ [Express Seed](./express-server/)
> **"베이스가 되는 시드 프로젝트"**
>
> 확장 가능한 서버 애플리케이션을 빠르게 구축하기 위한 시드(Seed) 프로젝트입니다.  
> 인증, 로깅, 데이터베이스 연동 등 필수적인 기능을 미리 구현하여 비즈니스 로직에 집중할 수 있도록 했습니다.

- **Key Features**: Passport 인증, Pino 로깅, Sequelize ORM 설정
- **Tech Stack**: `Node.js`, `Express`, `PostgreSQL`

### 3️⃣ [NestJS Seed](./nest-seed/)
> **"베이스가 되는 시드 프로젝트"**
>
> TypeScript와 NestJS의 장점을 살려 모듈화된 아키텍처를 구성한 템플릿입니다.  
> 대규모 트래픽 처리를 고려한 구조와 타입 안정성을 보장합니다.

- **Key Features**: 모듈 기반 아키텍처, TypeORM/Sequelize 지원, 환경변수 관리
- **Tech Stack**: `NestJS`, `TypeScript`, `PostgreSQL`, `Redis`, `Sequelize`

---
