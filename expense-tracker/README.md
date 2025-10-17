# 가계부 서비스 프로젝트

이 프로젝트는 사용자의 수입과 지출을 효율적으로 관리하고 분석할 수 있도록 돕는 웹 서비스입니다.

<br>

## 주요 기능


![기능명세서 1페이지](./docs/images/spec-1.png)
![기능명세서 2페이지](./docs/images/spec-2.png)
![기능명세서 3페이지](./docs/images/spec-3.png)
![기능명세서 4페이지](./docs/images/spec-4.png)

<br>

## 기술 스택

-   **백엔드:** Node.js, Express.js
-   **데이터베이스:** PostgreSQL, Sequelize 
-   **인증:** Passport.js, express-session, Redis
-   **API 문서:** Swagger (OpenAPI 3.0)

<br>

  **API 문서 빌드 (최초 1회 및 수정 시)**
    npm run api-docs

  **서버 실행**
    npm run dev

<br>

## API 명세

서버 실행 후, 아래 주소에서 상세한 API 문서를 실시간으로 테스트해볼 수 있습니다.

-   **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

<br>


##  와이어프레임

프로젝트의 초기 화면 설계는 Figma를 사용하여 제작되었습니다. 아래 링크에서 전체 와이어프레임을 확인하실 수 있습니다.

-   **[Figma 와이어프레임 바로가기](https://www.figma.com/design/BeAGKHHE1RJ3U83fmQ6t8t/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=0-1&t=pzaADH3UY4CcNEcf-1)**

<br>

## 데이터베이스 구조

데이터베이스의 전체 구조는 Draw.io를 사용하여 설계되었습니다.

![ERD](./docs/images/database-erd.png)
