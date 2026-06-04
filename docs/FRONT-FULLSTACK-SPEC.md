# Front 기준 Full-Stack 기능 개발 공통 명세

## 1. 목적

이 문서는 Front 관점에서 기능을 설계하고 구현할 때,
백엔드 규칙까지 함께 맞추기 위한 공통 기준 문서다.

기준 백엔드 규칙은 docs/PASTOR-JAVA-SPEC.md를 따른다.
본 문서는 해당 규칙을 Front 작업 흐름에 맞게 통합/해석한 실행 가이드다.

## 2. 적용 범위

- 대상 도메인: official, community, erp, mypage, system, common
- 대상 파일: featurePage.tsx, featureHook.ts, featureApi.ts, featureModel.ts
- 연계 대상: Controller, Service, DTO, Mapper(XML)

## 3. Front 기능 기본 구조

기능 폴더는 아래 4파일을 기본 세트로 구성한다.

# Full-Stack 기능 개발 통합 명세

## 1. 목적

이 문서는 Front와 Back을 함께 고려한 기능 개발 단일 기준 문서다.
새 메뉴를 만들거나 기존 메뉴를 개선할 때 이 문서만 기준으로 사용한다.

## 2. 적용 범위

- 대상 도메인: official, community, erp, mypage, system, common
- Front: featurePage.tsx, featureHook.ts, featureApi.ts, featureModel.ts
- Back: FeatureController.java, FeatureService.java, FeatureMapper.java, FeatureMapper.xml, DTO
- 공통: API 계약, 파일 업로드, 기본값 보정, 소프트 삭제, 문서화, 검증

## 3. 기능 기본 구조

### 3.1 Front 파일 구조

- featurePage.tsx: 화면 렌더링, 이벤트, 모드 전환
- featureHook.ts: 상태와 유스케이스(load/save/remove)
- featureApi.ts: HTTP 호출과 에러 메시지 표준화
- featureModel.ts: 타입 계약, 도메인 상수

### 3.2 Back 파일 구조

- FeatureController.java: 엔드포인트 정의, 최소한의 라우팅 책임
- FeatureService.java: 검증, 보정, 트랜잭션, 유스케이스 처리
- FeatureMapper.java: 쿼리 인터페이스
- FeatureMapper.xml: SQL 구현 및 기본값 방어
- dto/{Feature}Request.java, dto/{Feature}Dto.java: 요청/응답 계약

## 4. API 계약 규칙

### 4.1 엔드포인트 네이밍

- 조회 단건: getInfo
- 생성: setCreate
- 수정: setUpdate/{id}
- 삭제(소프트): delRemove/{id}

목록/검색이 필요하면 getList, getPage, getDetail을 확장하되, 도메인 내부 네이밍은 혼용하지 않는다.

### 4.2 응답 규격

- 공통 응답: ApiResponse<T>
- 성공 메시지: 사용자 관점의 간결 문구
- 예외 응답: 전역 예외 처리 정책에 일치

### 4.3 멀티파트 규격

- Front: FormData에 request(JSON Blob), files 반복 append
- Back: @RequestPart("request"), @RequestPart(name = "files", required = false)
- 파일 미첨부도 정상 플로우로 처리

## 5. 타입 및 DTO 규칙

### 5.1 요청 타입

- 기본 원칙은 단일 Request 타입 유지
- 생성/수정 분리 DTO는 필드 차이가 충분히 클 때만 도입
- 감사 필드는 포함 가능하나 최종 보정은 Service/SQL이 담당

### 5.2 응답 타입

- 화면 표시 목적 필드만 포함
- 첨부 기능은 fileList 포함
- nullable/blank는 Front에서 1차 보정, Back에서 최종 보장

## 6. Front 구현 규칙

### 6.1 Page 규칙

- 조회 모드/편집 모드를 명확히 분리
- 편집 시작/취소/저장/삭제 핸들러를 분리
- 취소 시 서버 기준 데이터로 폼 복구
- 도메인 모드값은 허용값 집합으로 정규화

### 6.2 Hook 규칙

- 표준 상태: data(profile), loading, error
- 표준 유스케이스: loadXxx, saveXxx, removeXxx
- save는 신규/수정 분기 후 재조회
- 에러는 사용자 메시지로 변환해 상태 관리

### 6.3 Api 규칙

- 공통 client 사용
- ApiResponse<T> 해석
- getApiErrorMessage로 오류 메시지 통일
- Content-Type을 호출 타입에 맞게 명시

### 6.4 첨부 처리 규칙

- 신규/기존/삭제 파일 상태를 분리
- 미리보기 URL 생성/해제를 수명주기에 맞춰 처리
- 저장 시 deletedFileIds를 함께 전달

## 7. Back 구현 규칙

### 7.1 Service 규칙

- 조회: @Transactional(readOnly = true)
- 생성/수정/삭제: @Transactional
- 필수값 검증은 서비스에서 명시 처리
- 도메인 규칙값 정규화(허용값 집합)
- insert/update/delete 결과 건수 확인(일반적으로 1건)

### 7.2 감사 필드/IP 규칙

- IP는 서버에서 최종 결정
- RequestContextHolder + ClientIpUtil 사용
- IP/작성자/수정자는 기본값 보정 수행
- Front에서 전달된 IP는 신뢰하지 않음

### 7.3 Mapper/XML 규칙

- Mapper namespace와 XML namespace 일치
- 다중 인자는 @Param 사용
- SQL 기본값 방어는 COALESCE(NULLIF(..., ''), default) 우선
- soft delete는 is_deleted/is_active/updated_at 동시 갱신
- 조회 시 is_deleted = FALSE 조건 누락 금지

## 8. 공통 Util 규칙

- 범용 로직만 common/util로 승격
- 도메인 의미가 있는 규칙은 서비스에 유지
- 문자열 기본값: StringUtil.coalesceBlank
- 숫자 안전 파싱: NumberUtil.parse\*OrDefault

금지:

- 의미 중복 유틸 다중 생성
- CommonUtil 단일 파일에 도메인 규칙 혼재

## 9. 주석 규칙

### 9.1 Front 섹션 주석

- file header
- config/constant method
- component method
- initial/lifecycle method
- logic method
- event method
- render method

추가 권장:

- model: type method
- hook: hook method, tran/data method
- api: api method

### 9.2 Back Javadoc

- 공개 메서드에 역할/보장/보정 규칙 중심으로 작성
- 구현 번역형 설명 금지
- @param, @throws는 의미가 있을 때만 최소 작성

## 10. 검증 체크리스트

기능 반영 후 최소 검증:

1. Front build 성공
2. Back compileJava 성공
3. getInfo/setCreate/setUpdate/delRemove 연동 확인
4. 파일 업로드/삭제 동작 확인
5. 에러 메시지 표시 확인

권장 추가 검증:

- null/빈값 데이터 초기 렌더 보정
- 삭제 후 재진입 상태 초기화
- 모드값 fallback 동작

## 11. 문서화 규칙

기능 완료 시 docs 문서에 아래 항목을 남긴다.

- 엔드포인트
- 요청/응답 타입
- 검증/보정 규칙
- SQL 기본값/삭제 정책
- 검증 결과

## 12. Pastor 레퍼런스

### 12.1 Front

- frontend/src/official/about/pastor/pastorPage.tsx
- frontend/src/official/about/pastor/pastorHook.ts
- frontend/src/official/about/pastor/pastorApi.ts
- frontend/src/official/about/pastor/pastorModel.ts

### 12.2 Back

- src/main/java/com/main/app/official/about/pastor/PastorController.java
- src/main/java/com/main/app/official/about/pastor/PastorService.java
- src/main/java/com/main/app/official/about/pastor/PastorMapper.java
- src/main/resources/mapper/official/about/pastor/PastorMapper.xml
- src/main/java/com/main/app/official/about/pastor/dto/PastorRequest.java
- src/main/java/com/main/app/official/about/pastor/dto/PastorDto.java

Pastor 구현은 본 문서의 API 네이밍, 단일 Request 타입, 멀티파트 계약, 기본값 보정, 소프트 삭제, 주석 패턴을 충족하는 기준 사례다.

## 13. 신규 메뉴 적용 절차

1. featureModel로 타입 계약 정의
2. featureApi로 경로/요청 포맷 구현
3. featureHook으로 load/save/remove 구성
4. featurePage로 조회/편집/첨부/메시지 흐름 구성
5. Back Controller/Service/Mapper/XML 구현
6. Front build, Back compileJava, 연동 검증
7. 본 문서 기준으로 변경사항 기록
