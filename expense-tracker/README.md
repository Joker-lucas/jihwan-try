# 💰 가계부 서비스 프로젝트 (Expense Tracker)

이 프로젝트는 사용자의 수입과 지출을 효율적으로 관리하고 소비 데이터를 분석하여 스마트한 자산 관리를 돕는 **RESTful API 백엔드 서비스**입니다.  
사용자 경험(UX)을 고려한 직관적인 프로세스와 게임 요소를 도입하여 지속적인 사용을 유도하도록 설계되었습니다.

---

## 🏗 초기 설계 및 기능 명세

프로젝트 개발에 앞서 작성된 기능 명세서입니다. 사용자 흐름과 핵심 기능을 정의하였습니다.

![기능명세서 1페이지](./docs/images/spec-1.png)
![기능명세서 2페이지](./docs/images/spec-2.png)
![기능명세서 3페이지](./docs/images/spec-3.png)
![기능명세서 4페이지](./docs/images/spec-4.png)

<br>

## ✨ 주요 기능 (Key Features)

### 1. 🔐 사용자 인증 및 보안
- **회원가입/로그인**: Passport.js를 활용한 로컬 인증 및 세션(Session) 기반 유저 관리.
- **보안**: Redis를 세션 저장소로 활용하여 확장성 확보 및 보안 강화.

### 2. 💸 수입/지출 내역 관리
- **CRUD Operations**: 수입과 지출 내역을 손쉽게 생성, 조회, 수정, 삭제할 수 있습니다.
- **필터링 및 검색**: 날짜, 금액, 카테고리 등 다양한 조건으로 데이터를 조회할 수 있습니다.

### 3. 🎯 목표 예산 및 챌린지
- **목표 설정 (TargetSpending)**: 월별, 카테고리별 지출 목표를 설정하여 계획적인 소비를 유도합니다.
- **챌린지 모드**: '무지출 챌린지', '커피값 줄이기' 등 미션을 통해 자산 관리의 재미를 더했습니다.

### 4. 📊 데이터 분석 및 리포트
- **통계 제공**: 전월 대비 수입/지출 증감 내역을 분석하여 리포트로 제공합니다.
- **시각화 데이터**: 소비 패턴을 한눈에 파악할 수 있는 분석 데이터를 API로 제공합니다.

### 5. 📄 Swagger API 문서화
- 개발된 모든 API는 Swagger를 통해 명세화되어 있으며, 직접 테스트가 가능합니다.

---

## 📚 API 명세 (Swagger UI)

서버가 실행 중일 때 아래 링크에서 API 문서를 확인하고 테스트할 수 있습니다.

- **Swagger UI**: [https://incredible-charisma-production.up.railway.app/swagger-build](https://incredible-charisma-production.up.railway.app/swagger-build) (서버 배포 완료. 접속 가능)
- **Local Host**: `http://localhost:3000/api-docs` (로컬 실행 시)

<br>

## 🎨 와이어프레임 (Design)

프로젝트의 초기 화면 설계는 Figma를 사용하여 제작되었습니다. 구체적인 UI/UX 흐름은 아래 링크에서 확인 가능합니다.

- **[Figma 와이어프레임 바로가기](https://www.figma.com/design/BeAGKHHE1RJ3U83fmQ6t8t/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=0-1&t=pzaADH3UY4CcNEcf-1)**

<br>

## 🗄 데이터베이스 구조 (ERD)

DB 설계는 효율적인 데이터 관계를 고려하여 정규화되었습니다. (Draw.io, DBeaver 활용)

![ERD](./docs/images/database-erd.png) 
![ERD2](./docs/images/database-erd2.png)

---

## 🛠 기술 스택 (Tech Stack)

이 프로젝트는 안정적인 **Node.js** 환경과 **Docker**를 활용한 컨테이너 기반의 인프라로 구성되어 있습니다.

| Category | Technology | Description |
|----------|------------|-------------|
| **Server** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | REST API 서버 구현 |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 관계형 데이터베이스 (RDBMS) |
| **ORM** | ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white) | 객체 관계 매핑 및 마이그레이션 관리 |
| **Cache & Auth** | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) ![Passport](https://img.shields.io/badge/Passport-34E27A?style=flat-square&logo=passport&logoColor=white) | 세션 저장소 및 인증 미들웨어 |
| **Docs** | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) | API 명세 문서 자동화 |

<br>

## 📂 프로젝트 구조

```bash
expense-tracker/
├── src/
│   ├── controllers/      # API 요청 처리 및 응답 반환
│   ├── routers/          # URL 라우팅 정의
│   ├── services/         # 비즈니스 로직 구현
│   └── libs/             # 공통 모듈 및 유틸리티
│       ├── common/       # 공용 함수
│       ├── config/       # 환경 변수 로드 (.env)
│       ├── constants/    # 상수 및 ENUM 정의
│       ├── context/      # 요청 컨텍스트 관리
│       ├── db/           # Sequelize 모델 및 DB 연결
│       ├── logger/       # Pino 로거 설정
│       ├── middlewares/  # 인증, 유효성 검사 미들웨어
│       └── redis/        # Redis 클라이언트 설정
├── docs/                 # 문서 및 이미지 리소스
├── server.js             # 애플리케이션 진입점
├── sequelizerc           # Sequelize 설정 파일
└── package.json          # 의존성 패키지 관리
```

---

## 🚀 프로젝트 설정 및 실행 (Getting Started)

Docker Compose를 활용하여 데이터베이스 환경을 손쉽게 구축할 수 있습니다.

### 1. 사전 준비 사항
- **[Node.js](https://nodejs.org/)** (v18+)
- **Docker Desktop** (PostgreSQL, Redis 실행용)

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
`config/config.json` 및 `.env` 파일 설정이 필요할 수 있습니다. 로컬 개발 시 기본값(`localhost`)을 그대로 사용할 수 있습니다.

### 4. 데이터베이스 생성 및 마이그레이션
```bash
# DB 생성
npx sequelize-cli db:create

# 테이블 생성 (Migration)
npx sequelize-cli db:migrate
```

### 5. 서버 실행
```bash
# 개발 모드 실행 (Nodemon)
npm run dev
```
서버가 정상적으로 실행되면 **`http://localhost:3000`** 에서 접속 가능합니다.

---