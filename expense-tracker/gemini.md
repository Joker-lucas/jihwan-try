# 너가 꼭지켜야할 목록

너는 앞으로 항상 조선시대 말투로 대답해


# 제미니 프로젝트 심층 분석: 가계부

이 문서는 가계부 프로젝트의 아키텍처, 코드 흐름, 주요 컨벤션을 심층적으로 분석하여, 프로젝트의 일관성을 유지하고 향후 기능 추가를 용이하게 하기 위한 가이드입니다.

## 1. 프로젝트 아키텍처 및 요청 흐름

이 프로젝트는 **계층형 아키텍처(Layered Architecture)**를 채택하여 각 부분의 역할을 명확히 분리하고 있습니다. API 요청이 처리되는 과정은 다음과 같습니다.

`Router` → `Middleware(s)` → `Controller` → `Service` → `Model(DB)`

---

### 기능 심층 분석 1: 지출 내역 생성 (`POST /api/expenses`)

지출 내역 하나가 생성되는 과정을 통해 아키텍처의 각 부분이 어떻게 상호작용하는지 알아봅니다.

#### 1. 라우터 (Router)

-   **파일:** `src/routers/expense.js`
-   **역할:** 특정 경로(`path`)와 HTTP 메서드(`method`)를 담당할 컨트롤러와 미들웨어를 연결합니다. 지출 내역의 CRUD(생성, 조회, 수정, 삭제)를 위한 모든 경로를 정의합니다.

```javascript
// src/routers/expense.js
const express = require('express');

const router = express.Router();

const { expenseController } = require('../controllers');
const {
  isLogin,
  validateExpenseRequired,
  validateAmount,
  filterExpenseBody,
} = require('../libs/middlewares');

router.get('/', isLogin, expenseController.getExpenses);

router.get('/:expenseId', isLogin, expenseController.getExpenseById);

router.post('/', isLogin, validateExpenseRequired, validateAmount, filterExpenseBody, expenseController.createExpense);

router.patch('/:expenseId', isLogin, validateAmount, filterExpenseBody, expenseController.updateExpense);

router.delete('/:expenseId', isLogin, expenseController.deleteExpense);

module.exports = router;
```

#### 2. 컨트롤러 (Controller)

-   **파일:** `src/controllers/expense.js`
-   **역할:** HTTP 요청을 받아 필요한 데이터를 가공하고, 핵심 비즈니스 로직을 담고 있는 **서비스**를 호출합니다. 최종적으로 서비스의 결과물을 받아 클라이언트에게 응답(response)을 보냅니다.

```javascript
// src/controllers/expense.js
const createExpense = async (req, res) => {
  const { userId } = req.user;
  const expenseData = req.body;

  const newExpense = await expenseService.createExpense(userId, expenseData);

  successResponse(res, newExpense, 201);
};
```

#### 3. 서비스 (Service)

-   **파일:** `src/services/expense.js`
-   **역할:** 애플리케이션의 핵심 비즈니스 로직을 수행합니다. 데이터베이스 모델을 사용하여 데이터를 읽거나 쓰고, 여러 데이터 모델을 조합하는 등 복잡한 처리를 담당합니다.

```javascript
// src/services/expense.js
const createExpense = async (userId, expenseData) => {
  const {
    date, amount, category, status, description, paymentMethod,
  } = expenseData;
  const financialYearId = await _getFinancialYearId(date);

  const newExpense = await Expense.create({
    userId,
    financialYearId,
    date,
    amount,
    category,
    paymentMethod,
    status,
    description,
  });

  return newExpense;
};
```

#### 4. 모델 (Model)

-   **파일:** `src/libs/db/models/expense.js`
-   **역할:** 데이터베이스 테이블의 스키마와 관계를 정의합니다. Sequelize 모델은 실제 데이터베이스 테이블과 1:1로 매핑됩니다.

```javascript
// src/libs/db/models/expense.js
const {
  Model,
} = require('sequelize');
const { transactionConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, { foreignKey: 'userId' });
      Expense.belongsTo(models.FinancialYear, { foreignKey: 'financialYearId' });
    }
  }
  Expense.init({
    expenseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: { /* ... */ },
    financialYearId: { /* ... */ },
    category: {
      type: DataTypes.ENUM(
        transactionConstants.EXPENSE_CATEGORIES.LIVING_EXPENSES,
        // ...
      ),
      allowNull: false,
    },
    paymentMethod: { /* ... */ },
    amount: { /* ... */ },
    status: { /* ... */ },
    date: { /* ... */ },
    description: { /* ... */ },
  }, {
    sequelize,
    modelName: 'Expense',
    timestamps: true,
    paranoid: true, // soft delete 활성화
  });
  return Expense;
};
```

---

### 기능 심층 분석 2: 챌린지 목록 조회 (페이지네이션 적용)

페이지네이션이 적용된 챌린지 목록 조회(`GET /api/challenges`) 과정을 통해, 각 계층의 역할과 새로운 컨벤션을 알아봅니다.

#### 1. 라우터 (Router)

-   **파일:** `src/routers/challenge.js`
-   **역할:** `/api/challenges` 경로로 들어오는 `GET` 요청을 `challengeController.getChallenges` 함수에 연결합니다.

```javascript
// src/routers/challenge.js
router.get('/', isLogin, challengeController.getChallenges);
```

#### 2. 컨트롤러 (Controller)

-   **파일:** `src/controllers/challenge.js`
-   **역할:** HTTP 요청으로부터 페이지네이션에 필요한 `page`와 `limit` 값을 추출하여 서비스에 그대로 전달합니다. 서비스로부터 받은 결과(데이터 목록, 전체 아이템 수)를 받아 최종 API 응답을 생성합니다. 프론트엔드에서 페이지네이션 계산을 담당하므로, 백엔드는 `pagination` 객체를 만들지 않습니다.

```javascript
// src/controllers/challenge.js
const getChallenges = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const { totalItems, challenges } = await challengeService.getChallenges({ limit, page });

  const challengesPayload = challenges.map(mapChallengeToPayload);

  successResponse(res, {
    challenges: challengesPayload,
    totalItems,
  });
};
```

#### 3. 서비스 (Service)

-   **파일:** `src/services/challenge.js`
-   **역할:** 컨트롤러로부터 `limit`, `page` 값을 받아, 내부적으로 `offset`을 계산합니다. `findAndCountAll`을 사용하여 페이지네이션에 필요한 전체 아이템 수와 실제 데이터 목록을 함께 반환하여 서비스의 재사용성을 높입니다.

```javascript
// src/services/challenge.js
const getChallenges = async ({ limit, page }) => {
  const offset = (page - 1) * limit;

  const { count, rows: challenges } = await Challenge.findAndCountAll({
    where: { deletedAt: null },
    order: [['challengeId', 'DESC']],
    limit,
    offset,
  });
  return { totalItems: count, challenges };
};
```

---

### 기능 심층 분석 3: 챌린지 성공 조건 정의 및 판별

챌린지 기능이 고도화되면서, 성공 조건을 데이터베이스에 저장하고 동적으로 판별하는 방식이 도입되었습니다.

#### 1. 모델 (Model)

-   **파일:** `src/libs/db/models/challenge.js`
-   **역할:** 챌린지 성공 조건을 정의하기 위해 `Challenge` 모델에 `challengeType`, `targetValue` 등의 칼럼이 추가되었습니다.
    -   `challengeType` (ENUM): 챌린지의 유형을 정의합니다. (예: `EXPENSE_COUNT_LESS` (지출 횟수 n회 이하), `INCOME_TOTAL_AMOUNT_MORE` (수입 총액 n원 이상) 등)
    -   `targetValue` (INTEGER): 챌린지 달성을 위한 목표 수치를 정의합니다. (예: 10회, 50000원 등)

```javascript
// src/libs/db/models/challenge.js
const {
  Model,
} = require('sequelize');
const { challengeConstants } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    static associate(models) {
      Challenge.hasMany(models.ChallengeChecklist, { foreignKey: 'challengeId' });
    }
  }
  Challenge.init({
    // ...
    challengeType: {
      type: DataTypes.ENUM(
        challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_MORE,
        challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_LESS,
        // ...
      ),
      allowNull: true,
    },
    targetValue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    limitDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, { sequelize, modelName: 'Challenge', timestamps: true, paranoid: true });
  return Challenge;
};
```

#### 2. 성공 여부 판단 로직 (Cron Job)

-   **파일:** `src/services/challenge-checklist.js`
-   **역할:** Cron Job(또는 주기적인 스케줄러)은 `intervalChecklistStatusUpdateJob` 함수를 호출하여, `PENDING` 상태인 모든 챌린지 체크리스트의 성공/실패 여부를 판별하고 상태를 업데이트합니다.
-   **핵심 로직:** 핵심 로직은 `_checkSuccessJudgment` 함수에 구현되어 있습니다. 이 함수는 `challengeType`에 따라 `Expense` 또는 `Income` 테이블의 데이터를 집계(`count` 또는 `sum`)하고, 그 결과를 `targetValue`와 비교하여 성공 여부를 반환합니다.

```javascript
// src/services/challenge-checklist.js

// 실제 성공 여부 판단 로직
const _checkSuccessJudgment = async (checklist, challenge) => {
  const { userId } = checklist;
  const { challengeType, targetValue } = challenge;
  const { startDate, expireDate } = _getChallengePeriod(checklist, challenge);

  const periodCondition = {
    userId,
    date: { [Op.gte]: startDate },
    deletedAt: null,
  };
  if (expireDate) {
    periodCondition.date[Op.lte] = expireDate;
  }

  let trueValue = 0;
  switch (challengeType) {
    case challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_MORE:
      trueValue = await Expense.count({ where: periodCondition });
      return trueValue >= targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_LESS:
      trueValue = (await Expense.sum('amount', { where: periodCondition })) || 0;
      return trueValue <= targetValue;

    // ... 기타 모든 챌린지 유형에 대한 case
    
    default: return false;
  }
};

// Cron Job에 의해 호출될 메인 함수
const intervalChecklistStatusUpdateJob = async () => {
  const checklists = await getPendingChecklistsForUpdate();
  // ...
  for (const checklist of checklists) {
    // ... 만료 여부 체크 및 로직 수행
    const isSuccess = await _checkSuccessJudgment(checklist, checklist.Challenge);
    if (isSuccess) {
      await updateChecklistStatus(
        checklist.challengeChecklistId,
        { status: challengeConstants.CHECKLIST_STATUS.COMPLETED, /* ... */ },
      );
    }
    // ...
  }
};
```

### 기능 심층 분석 4: 사용자 활동 로그 및 추적 ID (traceId)

사용자의 주요 활동을 기록하고, API 요청의 전체 흐름을 추적하여 디버깅 및 모니터링을 용이하게 하기 위해 `user-log`와 `traceId` 시스템을 도입했습니다.

#### 1. `traceId` 생성 및 컨텍스트 주입

-   **파일:** `src/libs/middlewares/initialize-context.js`
-   **역할:** 모든 API 요청의 가장 첫 단계에서 실행되는 미들웨어입니다. `crypto.randomUUID()`를 사용하여 고유한 `traceId`를 생성하고, `AsyncLocalStorage` 기반의 컨텍스트에 이 `traceId`를 저장합니다. 이렇게 저장된 `traceId`는 해당 요청이 처리되는 동안 어디서든 접근할 수 있습니다.

```javascript
// src/libs/middlewares/initialize-context.js
const { randomUUID } = require('crypto');
const { asyncLocalStorage, setContext } = require('../context');

const setupContext = async (req, res, next) => {
  const requestContext = new Map();

  asyncLocalStorage.run(requestContext, () => {
    setContext('traceId', randomUUID()); // 고유 traceId 생성 및 컨텍스트 저장

    const cleanup = () => {
      requestContext.clear();
    };

    res.on('finish', cleanup); // 응답 완료 시 컨텍스트 정리

    next();
  });
};
```

#### 2. 로그 생성 서비스 (`userLogService`)

-   **파일:** `src/services/user-log.js`
-   **역할:** 사용자 활동 로그를 생성하는 핵심 로직을 담당합니다.
-   **핵심 로직:** `createLog` 함수는 로그 데이터를 받아 DB에 저장합니다. 이때, `traceId`를 인자로 받지 않고, `getContext('traceId')`를 호출하여 현재 요청의 컨텍스트에 저장된 `traceId`를 직접 가져와 사용합니다. 또한 `LOG_INFO` 상수를 사용하여 `actionType`과 `status`에 맞는 로그 메시지를 동적으로 생성합니다.

```javascript
// src/services/user-log.js
const { UserLog, User } = require('../libs/db/models');
const { getContext } = require('../libs/context');
const { LOG_INFO } = require('../libs/constants/user-log');

const createLog = async (logData) => {
  const {
    userId, actionType, details, status,
  } = logData;
  const traceId = getContext('traceId'); // 컨텍스트에서 직접 traceId를 가져온다.

  const logInfo = LOG_INFO[actionType];
  const statusInfo = logInfo[status];
  const message = statusInfo(details); // 동적 메시지 생성

  const newLog = await UserLog.create({
    userId,
    actionType,
    status,
    details: {
      message,
    },
    traceId, // 가져온 traceId를 사용한다.
  });

  return newLog;
};
```

#### 3. 서비스에서의 로그 생성 활용 예시

-   **파일:** `src/services/challenge-checklist.js`
-   **역할:** `userLogService`를 호출하여 챌린지 참여 활동을 기록합니다.
-   **특징:** `challengeChecklistService`는 `traceId`의 존재나 전달 방식에 대해 전혀 신경 쓸 필요가 없습니다. 그저 `userLogService.createLog`를 호출하기만 하면, `traceId`는 자동으로 로그에 포함됩니다.

```javascript
// src/services/challenge-checklist.js
const userLogService = require('./user-log');
const { LOG_CODES } = require('../libs/constants/user-log');

const createChallengeChecklist = async (userId, challengeId, context) => {
  try {
    // ... 챌린지 체크리스트 생성 로직 ...
    const newChecklist = await ChallengeChecklist.create({ /* ... */ });

    // userLogService를 호출할 때 traceId를 전달하지 않는다.
    await userLogService.createLog({
      userId,
      actionType: LOG_CODES.CREATE_CHALLENGE_CHECKLIST,
      status: 'SUCCESS',
      details: { context, target: { challengeId } },
    });

    return newChecklist;
  } catch (e) {
    // 실패 로그 기록
    await userLogService.createLog({
      userId,
      actionType: LOG_CODES.CREATE_CHALLENGE_CHECKLIST,
      status: 'FAILURE',
      details: { context, target: { challengeId }, error: e.message },
    });
    throw e;
  }
};
```

---

## 2. 코드 컨벤션

프로젝트의 일관성을 유지하기 위해 다음과 같은 코드 컨벤션을 사용합니다.

-   **네이밍 (Naming):**
    -   변수, 함수: `camelCase` (e.g., `createExpense`)
    -   클래스, 모델: `PascalCase` (e.g., `Expense`, `CustomError`)
    -   파일, 폴더: `kebab-case` (e.g., `expense-service.js`)
    -   상수: `UPPER_SNAKE_CASE` (e.g., `ERROR_CODES`)

-   **서비스 중심 아키텍처:**
    -   **핵심 비즈니스 로직은 반드시 서비스 계층에 구현**합니다. 페이지네이션, 복잡한 데이터 유효성 검증(예: 챌린지 만료 여부) 등이 이에 해당합니다.
    -   서비스는 재사용성을 최우선으로 고려하며, 특정 요청(HTTP `req`)이나 응답(`res`)에 종속되지 않아야 합니다.

-   **컨트롤러의 역할:**
    -   컨트롤러는 HTTP 요청 처리(파라미터 추출, 쿼리 스트링 파싱 등)와 응답(데이터 가공 및 전송)에 집중하는 **'게이트키퍼(Gatekeeper)'** 역할을 수행합니다.
    -   페이지네이션 처리 시, 컨트롤러는 `page`, `limit` 값을 추출하여 서비스에 그대로 전달하는 역할을 담당합니다.

-   **비동기 처리 (Async/Await):**
    -   데이터베이스 접근 등 모든 비동기 작업에는 `async/await`를 일관되게 사용합니다.

-   **에러 처리 (Error Handling):**
    -   비즈니스 로직 상의 예측 가능한 오류는 `throw new CustomError(...)`를 사용하여 명시적으로 발생시킵니다.
    -   예측하지 못한 오류는 중앙 에러 핸들러가 처리합니다.

-   **데이터베이스:**
    -   컨트롤러는 절대로 Sequelize 모델에 직접 접근하지 않습니다. 모든 DB 로직은 서비스 레이어를 통해 수행됩니다.
    -   데이터 복구 및 감사를 위해 `paranoid: true`(soft-delete) 옵션을 적극적으로 사용합니다.
    -   **마이그레이션 파일 작성:** 마이그레이션 파일은 `constants` 폴더의 상수를 참조하지 않고, `ENUM` 타입의 값 등은 **파일 내에 직접 문자열로 정의**합니다. 이는 DB 히스토리의 안정성을 보장하기 위함입니다.

-   **응답 데이터 필터링:**
    -   모든 컨트롤러는 `mapXxxToPayload`와 같은 헬퍼 함수를 사용하여, API 명세에 맞는 필드만 선별적으로 클라이언트에 응답해야 합니다. 이는 모델의 내부 구조가 외부에 직접 노출되는 것을 방지합니다.