# Front 기준 Full-Stack 기능 개발 공통 명세 (FRONT-FULLSTACK-SPEC.md)

## 1. 목적 및 범위

이 문서는 Front 관점에서 기능을 설계하고 구현할 때, 백엔드 규칙까지 함께 맞추기 위한 공통 단일 기준 문서다.

- 기준 백엔드 규칙은 docs/PASTOR-JAVA-SPEC.md를 따르며, 본 문서는 해당 규칙을 Front 작업 흐름에 맞게 통합/해석한 실행 가이드다.
- 대상 도메인: official, community, erp, mypage, system, common
- 대상 파일: featurePage.tsx, featureHook.ts, featureApi.ts, featureModel.ts
- 연계 대상: Controller, Service, DTO, Mapper(XML)

---

## 2. 기능 기본 구조

### 2.1 Front 파일 구조 (4파일 세트)

기능 폴더는 아래 4파일을 기본 세트로 구성한다.

- featurePage.tsx: 화면 렌더링, 이벤트 바인딩, 조회/편집 모드 전환 책임
- featureHook.ts: 비즈니스 상태 관리 및 유스케이스(load, save, remove) 캡슐화
- featureApi.ts: HTTP 호출 및 백엔드 에러 메시지 표준화 처리
- featureModel.ts: 타입 계약 정의 및 도메인 전용 상수 관리

### 2.2 Back 파일 구조

- FeatureController.java: 엔드포인트 정의 및 최소한의 라우팅/응답 매핑 책임
- FeatureService.java: 비즈니스 검증, 데이터 보정, 트랜잭션 처리 및 유스케이스 구현
- FeatureMapper.java: MyBatis 쿼리 인터페이스
- FeatureMapper.xml: SQL 구현 및 DB 레벨 기본값 방어
- dto/{Feature}Request.java, dto/{Feature}Dto.java: 요청/응답 데이터 계약 구조

---

## 3. API 계약 및 명명 규칙

### 3.1 엔드포인트 및 URI 매핑 규칙

표준 CRUD 아키텍처에 따라 아래 4가지 기본 액션 명명 규칙을 엄격히 준수한다. HTTP URI와 컨트롤러 메서드명을 일치시킨다.

- 조회 (단건): getInfo
- 생성: setCreate
- 수정: setUpdate/{id}
- 삭제 (소프트 삭제): delRemove/{id}

- 목록/검색이 필요한 경우 getList, getPage, getDetail을 확장하되, 도메인 내부 네이밍은 혼용하지 않는다. 구체적인 HTTP URI 패턴은 SYSTEM-ARCHITECTURE.md와 동기화한다.

### 3.2 응답 포맷 및 전역 예외 처리

- 모든 API 응답은 백엔드의 ApiResponse<T> 기반 공통 규격을 따른다.
- Front에서는 예외 발생 시 전역 인터셉터가 아닌, featureApi.ts 레이어에서 getApiErrorMessage(error)를 통해 규격화된 에러 메시지를 파싱하여 사용자에게 노출한다.

### 3.3 멀티파트(파일 업로드) 규격

- Front에서 FormData 빌드 시, 메타데이터 JSON Blob은 "request"라는 키로 append하고, 첨부 파일들은 "files"라는 동일한 키로 반복 append한다. (이때 JSON Blob의 type은 application/json으로 명시한다.)
- Back 컨트롤러에서는 @RequestPart("request")와 @RequestPart(value = "files", required = false)로 수신한다. 파일이 첨부되지 않은 플로우도 정상 처리되어야 한다.

---

## 4. 타입 및 DTO 규칙

- 단일 Request DTO 유지: 생성(C)과 수정(U) 시 필드 차이가 충분히 크지 않다면 단일 Request DTO 타입을 공유하여 사용한다.
- 화면 전용 필드 제한: 응답 데이터 타입에는 화면 표시 목적의 필드만 포함하며, 불필요한 엔티티 내부 필드는 노출하지 않는다.
- Null / Blank 보정: 데이터 정합성을 위해 1차적으로 Front 레이어에서 빈 값을 보정하여 전송하고, Back 서비스 레이어에서 최종 검증 및 기본값을 보장한다.

---

## 5. Front 구현 가이드라인

### 5.1 Page Component (featurePage.tsx)

- 조회 모드와 편집 모드를 상태값 기반으로 명확히 분리한다.
- 편집 중 '취소' 이벤트 발생 시, 상태를 서버에서 조회해 온 원본 데이터(Standard Criteria)로 완벽히 복구(Fallback)시킨다.

### 5.2 Custom Hook (featureHook.ts)

- 표준 상태 인터페이스(data, loading, error)를 반드시 유지한다.
- 명세에 따른 표준 유스케이스 함수인 loadXxx, saveXxx, removeXxx 구조로 바인딩 로직을 추상화한다.

---

## 6. Back 구현 가이드라인

### 6.1 Service Layer

- 단순 조회성 로직에는 @Transactional(readOnly = true)을 부여하여 성능을 최적화한다.
- CUD 작업에는 @Transactional을 부여하고, 필수값 검증 실패 시 즉시 예외를 발생시킨다. CUD 수행 후 영향받은 결과 건수(영향받은 row 수 == 1)를 명시적으로 확인하여 검증한다.

### 6.2 감사(Audit) 필드 처리

- 생성자/수정자 IP 정보 처리 시, Front가 전송한 데이터는 신뢰하지 않는다.
- 백엔드 서버 레이어에서 RequestContextHolder와 프로젝트 공통 유틸인 ClientIpUtil을 사용해 IP를 직접 추출하고 최종 결정하여 DB에 기록한다.

### 6.3 Mapper 및 XML SQL 작성

- Java 인터페이스 경로와 XML의 namespace를 1:1로 엄격히 일치시킨다.
- 다중 파라미터를 넘길 경우 XML 매핑 오류를 방지하기 위해 @Param 어노테이션을 필수로 사용한다.
- 소프트 삭제 정책에 따라, 모든 조회(SELECT) 쿼리에는 is_deleted = FALSE 조건이 누락되지 않도록 철저히 방어 조건을 심는다.

---

## 7. 주석 작성 규칙

### 7.1 Front 주석 구조

모든 프런트엔드 파일은 코드 가독성과 유지보수 통일성을 위해 아래 지정된 4가지 섹션 주석 구조(HEADER & CONFIG, COMPONENT & LIFECYCLE, LOGIC & EVENT HANDLERS, RENDER METHODS)를 대형 주석 블록 형태로 파일 내에 반드시 준수하여 작성한다.

### 7.2 Back Javadoc 표준

- 공개(public) 메서드에는 단순 코드를 한글로 번역한 주석(구현 번역형 설명) 작성을 금지한다.
- 해당 메서드가 수행하는 비즈니스적 역할, 보장하는 결과, 데이터 보정 규칙 중심으로 Javadoc을 작성한다.
- @param, @throws 문구는 비즈니스적으로 특별한 의미를 가질 때만 최소한으로 작성한다.

---

## 8. 검증 체크리스트 (Definition of Done)

기능 개발 완료 및 반영 전, 아래 체크리스트를 통과해야 한다.

1. Front build 에러 없이 성공
2. Back compileJava 빌드 성공
3. getInfo / setCreate / setUpdate / delRemove 엔드포인트 정상 연동 및 CRUD 시나리오 확인
4. 파일 업로드 및 삭제 컴포넌트 유기적 동작 확인
5. 서버 에러 발생 시 UI 상에 올바른 에러 메시지 표시 확인

-권장 추가 검증 항목:

- Null 또는 빈값 데이터 유입 시 초기 렌더링 방어 및 보정 여부
- 데이터 삭제 후 해당 메뉴 재진입 시 상태값 초기화 여부
- 비정상적인 모드값 유입 시 Fallback 동작 여부

---

## 9. 문서화 규칙

기능 개발이 최종 완료되면 프로젝트 docs/ 디렉터리에 아래 항목을 명시한 개발 완료 문서를 남긴다.

- 최종 확정된 API 엔드포인트 주소
- 주고받는 요청(Request) / 응답(Response) 타입 스키마
- 특이 케이스에 대한 검증/보정 비즈니스 규칙
- SQL에서 처리한 기본값 정책 및 소프트 삭제 쿼리 조건
- 자체 검증 완료 결과 리포트

---

## 10. Pastor 레퍼런스 (참조 표준 코드 위치)

새로운 도메인이나 기능을 개발할 때 구조가 헷갈린다면, 아키텍처 표준이 가장 완벽하게 적용되어 있는 아래 Pastor(목회자 관리) 모듈의 소스 코드를 그대로 복사하여 뼈대로 사용한다.

### 10.1 Front-End 표준 소스

- frontend/src/official/about/pastor/pastorPage.tsx
- frontend/src/official/about/pastor/pastorHook.ts
- frontend/src/official/about/pastor/pastorApi.ts
- frontend/src/official/about/pastor/pastorModel.ts

### 10.2 Back-End 표준 소스

- src/main/java/com/main/app/official/about/pastor/PastorController.java
- src/main/java/com/main/app/official/about/pastor/PastorService.java
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java
- src/main/resources/mapper/official/about/PastorMapper.xml
- src/main/java/com/main/app/official/about/pastor/dto/PastorRequest.java
