# 메뉴 기준 코드 분석 및 구조 개편 보고서

**작성일**: 2026년 5월 15일  
**분석 기준**: `src/main/resources/sql/erp_menu_seed.sql` (6개 최상위 메뉴)  
**상태**: ✅ 분석 완료, 삭제 확정, 개편 계획 수립

---

## 📋 Executive Summary

### 분석 대상
- **Frontend 페이지**: 33개 .tsx 파일 (6개 메뉴 영역)
- **Backend Java**: 69개 Controller (xxxController + xxxApiController 패턴)
- **Backend Mapper**: 28개 XML 파일 (메뉴별 정렬)
- **메뉴 구조**: 6개 최상위 + 50개 이상 서브메뉴

### 주요 발견사항
- ✅ **33개 파일 분석 완료**: 메뉴 기준 정렬 확인
- ❌ **즉시 삭제 대상**: 5개 Frontend 파일 + Backend admin 패키지
- 🔄 **개편 필요**: Service/ServiceImpl 통합, Controller 통합 (점진적)

---

## 1️⃣ 메뉴 구조 및 코드 매핑

### 메뉴 데이터베이스 (erp_menu_seed.sql)

```
M_ADM (시스템관리)
  ├─ M_ADM_01: 사용자/권한관리 → /system/user/manager
  ├─ M_ADM_02: 운영설정관리 → /system/config/code
  ├─ M_ADM_03: 로그/감사관리 → /system/log/system
  └─ M_ADM_04: 백업/복구관리 → /system/backup/policy

M_COM (공통/회원)
  └─ M_COM_01: 회원관리 → /user (login, register)

M_GEN (커뮤니티메인)
  ├─ M_GEN_01: 셀모임관리 → /community/group/manager
  ├─ M_GEN_02: 교회관리 → /community/facilities/calendar
  ├─ M_GEN_03: 성도소식 → /community/saint/family
  └─ M_GEN_04: 일반뉴스 → /community/world/christian

M_MAIN (메인/공식)
  ├─ M_MAIN_01: 교회소개 → /about/pastor
  ├─ M_MAIN_02: 예배보기 → /worship/time
  ├─ M_MAIN_03: 모임 → /ministries/children
  ├─ M_MAIN_04: 소식 → /news/announcement
  └─ M_MAIN_05: 문의사항 → /support/location

M_MYPAGE (마이페이지)
  └─ M_MYPAGE_01: 마이페이지 → /user/profile (내정보, 비밀번호, 활동, 문의, 알림, 탈퇴)

M_SYS (ERP)
  ├─ M_SYS_01: 성도관리 → /erp/humen/manager
  ├─ M_SYS_02: 예배관리 → /erp/sermon/manager
  ├─ M_SYS_03: 재정관리 → /erp/account/manager
  ├─ M_SYS_04: 교육관리 → /erp/training/course
  ├─ M_SYS_05: 조직관리 → /erp/ministry/department
  ├─ M_SYS_06: 일정관리 → /erp/event/calendar
  ├─ M_SYS_07: 자원관리 → /erp/facility/reservation
  ├─ M_SYS_08: 커뮤니케이션 → /erp/comm/notice
  ├─ M_SYS_09: 행정관리 → /erp/admin/document
  └─ M_SYS_10: 통계관리 → /erp/stats/dashboard
```

---

## 2️⃣ 코드 인벤토리 분석

### 2.1 Frontend 파일 매핑 (메뉴별)

| 메뉴 영역 | 경로 | 파일 수 | 파일 목록 | 상태 |
|---------|------|--------|---------|------|
| **M_COM** | `/auth` | 5 | CheckPassword, FindAccount, Login, Register, ResetPassword | ✅ 정상 |
| **M_GEN** | `/community` | 6 | CommunityHome, FacilitiesApply, GroupActivity, QnaList, SaintList, WorldNews | ✅ 정상 |
| **M_SYS** | `/erp` | 10 | AccountList, AdminSettings, CommManagement, EventCalendar, FacilityStatus, HumanResources, MinistryOps, SermonData, StatisticalReport, TrainingCourse | ✅ 정상 |
| **M_MAIN** | `/official` | 5 | AboutUs, MinistriesIntro, NewsNotice, SupportGuide, WorshipInfo | ⚠️ admin 제외 |
| **M_MYPAGE** | `/mypage` | 3 | MyActivity, MyInfoUpdate, MyPayments | ✅ 정상 |
| **M_ADM** | `/system` | 4 | BackupManager, ConfigSettings, LogViewer, UserManagement | ✅ 정상 |
| **메뉴 외** | `/official/admin` | 3 | AdminDashboardPage, AdminLoginPage, AdminRegisterPage | ❌ 삭제 대상 |
| **중복** | `/auth/mypage` | 1 | MyPage.tsx | ❌ 삭제 대상 |

**소계**: 33개 파일 (32개 유지 + 4개 삭제)

### 2.2 Backend Java 구조 분석

#### Controller 현황 (69개)

**문제점**: xxxController + xxxApiController 패턴의 산재

```
[auth/]
  - UserController.java
  - AuthApiController.java (✓ REST 통합 필요)

[community/]
  - QnaController.java, QnaApiController.java
  - GroupController.java, GroupApiController.java
  - SaintController.java, SaintApiController.java
  - FacilitiesController.java, FacilitiesApiController.java
  - WorldController.java, WorldApiController.java
  - CommunityIndexController.java
  - CommunityLegacyRedirectController.java
  - CommunityBoardApiController.java, CommunityQnaBoardApiController.java
  
[erp/]
  - HumenController.java, HumenApiController.java
  - SermonController.java, SermonApiController.java
  - AccountController.java, AccountApiController.java
  - TrainingController.java, TrainingApiController.java
  - MinistryController.java, MinistryApiController.java
  - EventController.java, EventApiController.java
  - FacilityController.java, FacilityApiController.java
  - CommController.java, CommApiController.java
  - StatsController.java, StatsApiController.java
  - AdminController.java, AdminApiController.java
  - ErpIndexController.java
  - ErpApiController.java
  
[official/]
  - AboutController.java, AboutApiController.java
  - NewsController.java, NewsApiController.java
  - MinistriesController.java, MinistriesApiController.java
  - WorshipController.java, WorshipApiController.java
  - SupportController.java, SupportApiController.java
  - MainController.java
  - MenuApiController.java
  - [다수의 Board ApiController들]
  
[system/]
  - UserController.java
  - ConfigController.java
  - LogController.java
  - BackupController.java
  - SystemApiController.java
  - SystemIndexController.java
  - SystemLegacyRedirectController.java
```

**개편 목표**: 메뉴 중분류별 통합 Controller

### 2.3 Backend Mapper XML 구조 (28개)

```
[auth/]          - UserMapper.xml
[common/]        - AutoNoMapper.xml, MenuMapper.xml
[community/]     - BoardMapper.xml, FacilitiesMapper.xml, GroupMapper.xml, QnaMapper.xml, SaintMapper.xml, WorldMapper.xml
[erp/]           - AccountMapper.xml, AdminMapper.xml, CommMapper.xml, EventMapper.xml, FacilityMapper.xml, HumenMapper.xml, MinistryMapper.xml, SermonMapper.xml, StatsMapper.xml, TrainingMapper.xml
[official/]      - AboutMapper.xml, MinistriesMapper.xml, NewsMapper.xml, SupportMapper.xml, WorshipMapper.xml
[system/]        - BackupMapper.xml, ConfigMapper.xml, LogMapper.xml, UserMapper.xml
```

**상태**: ✅ 규칙적 구조, 모두 보존

---

## 3️⃣ 즉시 삭제 확정 (Phase 1)

### Frontend 삭제 대상 (5개)

#### ❌ 1. `frontend/src/pages/auth/MyPage.tsx`
- **위치**: `/auth/mypage` 라우팅
- **문제**: M_MYPAGE 범주에 속함 (메뉴 정의 위치: `/mypage`)
- **중복**: `mypage/user/ProfilePage.tsx`에서 동일 역할 수행 중
- **대체**: 이미 mypage 영역에서 처리됨
- **액션**: **즉시 삭제**

#### ❌ 2-4. `frontend/src/pages/official/admin/` (3개 파일)
- **파일**: AdminDashboardPage.tsx, AdminLoginPage.tsx, AdminRegisterPage.tsx
- **문제**: 메뉴(erp_menu_seed.sql)에 정의되지 않음
- **범주**: 메뉴 범주 벗어남
- **액션**: **폴더 전체 삭제**

### Backend 삭제 대상 (패키지)

#### ❌ 5. `src/main/java/com/main/app/official/admin/` (패키지)
- **문제**: 메뉴에 정의되지 않은 범주
- **내용**: official/admin 관련 모든 Java 파일
- **액션**: **패키지 전체 삭제**

#### ❌ 6. 관련 Mapper (있다면)
- **확인**: `src/main/resources/mapper/official/admin/*.xml`
- **상태**: 현재 확인된 admin mapper는 없음
- **액션**: 삭제 확정 후 재확인

### Router 업데이트 필요

**수정 파일**: `frontend/src/router/OfficialRoutes.tsx`

```tsx
// 제거할 import 및 라우팅
import AdminDashboardPage from '../pages/official/admin/AdminDashboardPage';
import AdminLoginPage from '../pages/official/admin/AdminLoginPage';
import AdminRegisterPage from '../pages/official/admin/AdminRegisterPage';

// 해당 라우팅 제거:
// {
//   path: 'admin',
//   element: <AdminDashboardPage />,
// }
```

---

## 4️⃣ 보존 확정 파일 (Phase 2 - 유지)

### Frontend 보존 (32개)

✅ 모든 메뉴 대응 페이지 파일 보존
- **규칙**: 메뉴 구조 기준, 빈 파일이어도 보존
- **예외**: admin 파일만 삭제

### Backend 보존

✅ 모든 Service, Mapper 보존 (구조 개편 예정)
- **Service**: 향후 impl 통합 예정
- **Mapper**: 메뉴별 규칙적 구조 유지
- **Controller**: 개편 계획 있음 (점진적)

---

## 5️⃣ Backend 구조 개편 계획 (Phase 3 - 점진적)

### 5.1 Service 레이어 현대화

#### 현재 구조 (오래된 방식)
```
Service (인터페이스)
  ↓
ServiceImpl (구현체) - 별도 클래스
```

#### 목표 구조 (최신 Spring Boot 3.x)
```
Service (직접 구현)
  - @Service 어노테이션
  - impl 통합
```

#### 실행 방안
1. **단계적 마이그레이션**: 메뉴별로 하나씩 진행
2. **우선순위**: 
   - Phase 3-1: auth, system (간단함)
   - Phase 3-2: official, community (중간)
   - Phase 3-3: erp (복잡함)

### 5.2 Controller 구조 개편

#### 현재 구조 (문제점)
```
xxxController (화면)
  └─ MVC 응답

xxxApiController (API)
  └─ REST 응답
```

**문제**: 같은 기능을 두 개 파일에서 관리

#### 목표 구조 (메뉴 중분류별 통합)
```
[메뉴 중분류]Controller
  ├─ @GetMapping (화면 렌더링)
  └─ @PostMapping/@GetMapping (REST API)
```

#### 예시 마이그레이션

**Before**:
```
erp/sermon/SermonController.java
erp/sermon/SermonApiController.java
```

**After**:
```
erp/sermon/SermonController.java (통합)
  - GetMapping("/write") → HTML 렌더링
  - PostMapping("/api/save") → JSON 응답
```

#### 실행 방안 (점진적)
1. **Phase 3: 준비 단계** (지금)
   - 패턴 문서화
   - 테스트 케이스 작성
   
2. **Phase 4: 점진적 리팩토링**
   - 메뉴별로 하나씩 통합
   - 각 단계마다 테스트 및 검증

### 5.3 구조 현대화 가이드

#### 목표 레이어 구조 (최신 Spring Boot)
```
Request
  ↓
Controller (화면 + REST)
  ├─ @GetMapping (화면/API)
  ├─ @PostMapping (API)
  └─ @PutMapping/@DeleteMapping (API)
  ↓
Service (비즈니스 로직)
  - 순수 로직만 담당
  - 구현 통합 (impl 없음)
  ↓
Repository/Mapper (데이터 접근)
  - MyBatis Mapper
  ↓
Database
```

#### 장점
- ✅ 유지보수성 향상 (파일 수 감소)
- ✅ Spring Boot 표준 구조
- ✅ 향후 확장 용이 (메뉴 추가 시)

---

## 6️⃣ Frontend 라우팅 정리

### 라우터 파일 구조 (보존)

```
frontend/src/router/
  ├─ AuthRoutes.tsx       → /auth
  ├─ CommunityRoutes.tsx  → /community
  ├─ ErpRoutes.tsx        → /erp
  ├─ MypageRoutes.tsx     → /mypage
  ├─ OfficialRoutes.tsx   → / (루트) + admin 제거 필요
  ├─ SystemRoutes.tsx     → /system
  └─ index.tsx            → 통합 라우터
```

### Router 파일별 액션

| 파일 | 액션 | 상세 |
|------|------|------|
| AuthRoutes.tsx | 유지 | `/auth` 라우팅 유지 |
| CommunityRoutes.tsx | 유지 | `/community` 라우팅 유지 |
| ErpRoutes.tsx | 유지 | `/erp` 라우팅 유지 |
| MypageRoutes.tsx | 유지 | `/mypage` 라우팅 유지 |
| OfficialRoutes.tsx | ✏️ 수정 | `/admin` 라우팅 제거 |
| SystemRoutes.tsx | 유지 | `/system` 라우팅 유지 |

---

## 7️⃣ Frontend 페이지 구조 표준화

### 메뉴 기준 폴더 구조 (표준)

```
frontend/src/pages/
  ├─ auth/                  (M_COM: 로그인/회원가입)
  │   ├─ CheckPassword.tsx
  │   ├─ FindAccount.tsx
  │   ├─ Login.tsx
  │   ├─ Register.tsx
  │   └─ ResetPassword.tsx
  │
  ├─ community/             (M_GEN: 커뮤니티)
  │   ├─ CommunityHome.tsx
  │   ├─ FacilitiesApply.tsx
  │   ├─ GroupActivity.tsx
  │   ├─ QnaList.tsx
  │   ├─ SaintList.tsx
  │   ├─ WorldNews.tsx
  │   └─ shared/
  │
  ├─ erp/                   (M_SYS: ERP)
  │   ├─ AccountList.tsx
  │   ├─ AdminSettings.tsx  (⚠️ erp/admin 명확히, official/admin과 구분)
  │   ├─ CommManagement.tsx
  │   ├─ EventCalendar.tsx
  │   ├─ FacilityStatus.tsx
  │   ├─ HumanResources.tsx
  │   ├─ MinistryOps.tsx
  │   ├─ SermonData.tsx
  │   ├─ StatisticalReport.tsx
  │   ├─ TrainingCourse.tsx
  │   └─ shared/
  │
  ├─ mypage/                (M_MYPAGE: 마이페이지)
  │   ├─ MyActivity.tsx
  │   ├─ MyInfoUpdate.tsx
  │   ├─ MyPayments.tsx
  │   └─ user/
  │       └─ ProfilePage.tsx
  │
  ├─ official/              (M_MAIN: 공식)
  │   ├─ AboutUs.tsx
  │   ├─ MinistriesIntro.tsx
  │   ├─ NewsNotice.tsx
  │   ├─ SupportGuide.tsx
  │   ├─ WorshipInfo.tsx
  │   └─ shared/
  │
  └─ system/                (M_ADM: 시스템)
      ├─ BackupManager.tsx
      ├─ ConfigSettings.tsx
      ├─ LogViewer.tsx
      ├─ UserManagement.tsx
      └─ shared/
```

### 규칙

✅ **메뉴 구조 우선**: 메뉴 중분류 단위로 폴더 구성  
✅ **shared 폴더**: 해당 메뉴 영역 공유 컴포넌트  
✅ **파일명**: PascalCase (Page/Component suffix)  
❌ **컴포넌트 통합**: 명확한 경우만 (메뉴 구조 우선)

---

## 8️⃣ 병합 전략

### Frontend: 매우 보수적 ⚠️

**원칙**: 메뉴 구조 기반 파일 조직 우선

1. **파일 삭제**: 메뉴 범주 벗어난 파일만
2. **컴포넌트 통합**: 명확한 경우만 검토
3. **폴더 재정렬**: 현재 구조 유지 (메뉴 기준 이미 적용됨)

**사유**: 향후 각 화면을 메뉴 특성에 맞게 개별 수정 예정

### Backend: 적극적 🚀

**원칙**: 최신 Spring Boot 표준 구조

1. **Service 통합**: impl 폐기, 구현 통합
2. **Controller 통합**: xxx + xxxApi 통합
3. **구조 현대화**: 점진적 마이그레이션

**우선순위**:
1. **High**: admin 삭제 (메뉴 없음)
2. **High**: Service impl 통합 (기본 구조)
3. **Medium**: Controller 통합 (점진적)

---

## 9️⃣ 실행 계획 (Phase별 세부)

### Phase 1: Frontend 정리 (즉시 가능)

**목표**: 메뉴 범위 벗어난 파일 삭제  
**예상 시간**: 20분

**작업**:
1. [ ] `frontend/src/pages/auth/MyPage.tsx` 삭제
2. [ ] `frontend/src/pages/official/admin/` 폴더 삭제 (3개 파일)
3. [ ] `frontend/src/router/OfficialRoutes.tsx` 수정 (admin 라우팅 제거)
4. [ ] 빌드 테스트 (`npm run build`)

**검증**:
```bash
npm run build  # 성공 여부 확인
```

### Phase 2: Backend 정리

**목표**: 메뉴 범위 벗어난 코드 삭제  
**예상 시간**: 30분

**작업**:
1. [ ] `src/main/java/com/main/app/official/admin/` 삭제
2. [ ] 관련 Mapper 확인 및 삭제
3. [ ] 컴파일 테스트 (`gradlew test`)

**검증**:
```bash
gradlew test  # 성공 여부 확인
```

### Phase 3: Backend Service 통합 (점진적)

**목표**: Service + ServiceImpl 구조 → Service 통합  
**예상 시간**: 2-3시간 (메뉴별)

**순서**:
1. **3-1**: auth Service 통합 (간단함)
2. **3-2**: system Service 통합
3. **3-3**: community Service 통합
4. **3-4**: official Service 통합
5. **3-5**: erp Service 통합 (복잡함)

### Phase 4: Backend Controller 통합 (점진적)

**목표**: xxxController + xxxApiController → 통합  
**예상 시간**: 4-6시간 (메뉴별)

**순서**: Phase 3과 동일하게 단계적 진행

---

## 🔟 병합 검증 기준

### Frontend 검증

```bash
# 타입 체크
npm run type-check

# 빌드
npm run build

# 라우팅 확인
- /auth/login ✅
- /community ✅
- /erp ✅
- /mypage ✅
- /official ✅
- /system ✅
- /admin ❌ (라우팅 없음 확인)
```

### Backend 검증

```bash
# 테스트
gradlew test

# 빌드
gradlew build

# 실행
gradlew bootRun
```

---

## 1️⃣1️⃣ 추가 고려사항

### 1. Mapper 규칙성 확인

✅ 현재 Mapper XML 구조는 메뉴별로 규칙적임  
✅ admin mapper 없음 (삭제 시 문제 없음)  
✅ 빈 mapper도 규칙적 구조이므로 보존

### 2. 컴포넌트 중복 확인 필요

추후 상세 분석:
- `official/support` vs `community/*` 중복 여부
- `system/user` vs `auth/*` 연관성
- 공유 컴포넌트 추출 기준

### 3. Router 라우팅 경로 충돌

현재 확인된 것:
- `/auth/mypage` ← auth 라우터에 있지만 mypage 범주 (파일 삭제로 해결)
- `/admin` (official) ← 메뉴 정의 없음 (라우팅 제거로 해결)

### 4. 메뉴 확장 대응

향후 새 메뉴 추가 시:
1. `erp_menu_seed.sql`에 메뉴 정의
2. Frontend: `frontend/src/pages/{menu_area}/` 폴더 생성
3. Backend: `src/main/java/.../app/{menu_area}/` 패키지 생성
4. Mapper: `src/main/resources/mapper/{menu_area}/` 폴더 생성

---

## 📊 변경 영향도 분석

### 삭제 대상 파일 (의존성 확인 필요)

| 파일 | 삭제 전 검사 | 예상 영향 |
|------|-------------|---------|
| auth/MyPage.tsx | import 검색 | OfficialRoutes에 라우팅 없음 (안전) |
| official/admin/*.tsx | import 검색 | 3개 파일만 영향 |
| official/admin/*.java | import 검색 | admin 패키지만 영향 |

### 보존 파일 (변경 없음)

✅ 33-4 = 29개 Frontend 파일 (변경 없음)  
✅ 모든 Mapper XML (변경 없음)  
✅ 모든 Service (향후 impl 통합)  
✅ 모든 Controller (향후 통합)

---

## 📝 결론

### 현황
- ✅ 메뉴 기준 코드 분석 완료
- ✅ 삭제 대상 명확화 (메뉴 범위 외 4개 삭제)
- ✅ 보존 대상 확정 (29개 파일 + 모든 Mapper/Service)
- ✅ 개편 계획 수립 (Service/Controller 현대화)

### 다음 단계
1. **Phase 1 실행**: Frontend 정리 (즉시 가능)
2. **Phase 2 실행**: Backend 정리 (즉시 가능)
3. **Phase 3-4**: Backend 구조 개편 (점진적, 메뉴별)

### 기대 효과
- 📦 코드 복잡성 감소 (산재된 Controller 통합)
- 🔍 유지보수성 향상 (메뉴 기준 명확화)
- 📈 확장성 개선 (새 메뉴 추가 시 표준 구조)
- ⚡ 개발 속도 향상 (표준 패턴 적용)

---

**작성자**: GitHub Copilot  
**버전**: 1.0.0  
**최종 업데이트**: 2026년 5월 15일
