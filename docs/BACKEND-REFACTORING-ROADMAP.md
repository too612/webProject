# 백엔드 리팩토링 로드맵 (2026-05, DB 기준)

## 0) 2026-05-24 현행화 메모

- 완료 판단: `mypage/user`, `system`, `official/about`, `official/worship`
- 진행중 판단: `official/news` (완료), `community` (완료)
- 대기: `erp`
- 다음 착수 순서: `erp`

## 목표

- common은 정비 완료 상태를 유지한다.
- 업무 도메인 구조는 `erp_menu_seed.sql` 시드 기준으로 맞춘다.
- Java/XML 폴더 기준은 `official/about/pastor`에서 검증된 패턴을 시작점으로 사용한다.
- 대규모 일괄 적용은 하지 않고, `official > news`, `official > worship` 단위로 순차 확장한다.

---

## 1) 현재 상태 요약

- common: 정비 완료
- 실제 CRUD 구현 완료: `official/about/pastor`
- 공식 적용 완료: `official/about` 1차 안정화
- 추가 정리 완료: `official/support` 평면화
- 추가 정리 완료: `official/worship` 평면화 (time / live / sermons)
- 추가 적용 완료: `official/news` (announcement / bulletin / registration / event 완료)
- 적용 완료: `mypage/user` (profile / password / activity / inquiry / notifications / withdraw)
- 적용 완료: `system` (user manager/role, config code/menu, log system/audit, backup policy/history)
- 적용 완료: `community` (group/facilities/saint/world 메뉴 폴더 구조 정리 완료, support 제거 완료)
- community/group 현재 기준: 연결포인트(라우트/API/메뉴 경로) 일치 우선 완료, 응답 스키마/컬럼 정합은 개별 개발 단계에서 진행
- community 진행 현황: `group`, `facilities`, `saint`, `world` 시드 기준 메뉴 폴더 구조 및 연결포인트 정리 완료, `support` 제거 완료
- 다음 핵심 대상: `erp`
- 문서 기준은 “현재 소스 모양”이 아니라 “DB 메뉴 경로”를 우선한다

---

## 2) 적용 전략

원칙

- 한 번에 전 그룹을 바꾸지 않는다.
- 중분류 단위로 하나씩 진행한다.
- 각 단계는 `Controller + Service + Mapper + dto` 세트를 기준으로 맞춘다.
- XML namespace와 Java Mapper 경로를 1:1로 맞춘다.

### 2-1. 그룹별 적용 순서

| 단계 | 대상               | 상태      | 비고                                                                                       |
| ---- | ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| 1    | `official/about`   | 완료      | pastor 기준 패턴 확정                                                                      |
| 2    | `official/worship` | 완료      | time / live / sermons - 패턴 확정                                                          |
| 3    | `official/news`    | 완료      | announcement / bulletin / registration / event 완료                                        |
| 4    | `mypage`           | 완료      | user 6개 메뉴 분리 + XML 6개 반영                                                          |
| 5    | `system`           | 완료      | user/config/log/backup 기능 분리 + legacy controller 제거                                  |
| 6    | `community`        | 완료      | `group/facilities/saint/world` 메뉴 폴더 구조 및 연결포인트 정리 완료, `support` 제거 완료 |
| 7    | `erp`              | 후속 작업 | humen / sermon / account / training / ministry / event / facility / comm / admin / stats   |

### 2-2. 파일 구조 적용 규칙

- 기능 폴더는 대분류/중분류 단위로 둔다.
- 기본 세트는 다음과 같다.
  - `XxxController.java`
  - `XxxService.java`
  - `XxxMapper.java`
  - `dto/XxxDto.java`
  - `dto/XxxRequest.java`
- 기능이 작으면 하위 폴더를 억지로 만들지 않는다.
- 기능이 커지면 `about/pastor`처럼 중분류 하위에만 분리한다.

### 2-3. 요청 해석 규칙

- 사용자가 `official/about` 기준으로 `official/ministries`를 수정해 달라고 하면, 작업 범위는 Java와 XML만 본다.
- 이 경우 프론트, 문서, 기타 공통 파일은 기본적으로 건드리지 않는다.
- 즉, 기준 패턴은 `official/about`이지만 실제 수정 대상은 요청받은 중분류의 Java/XML이다.
- 같은 규칙을 `official/news`, `official/worship`, `community`, `erp`, `mypage`, `system`에도 동일하게 적용한다.

### 2-4. 레거시 삭제 규칙

- 새 경로의 Java/XML가 빌드에서 통과하고, 옛 경로가 더 이상 어떤 import/namespace에서도 참조되지 않으면 기존 하위 패키지 파일은 삭제한다.
- 삭제 대상은 중복 브리지 파일과 이전 패키지의 controller/service/mapper 구현이다.
- MyBatis XML은 새 mapper 인터페이스 namespace로 옮긴 뒤 옛 namespace 파일을 제거한다.
- 실제 소스가 아닌 `frontend/dist` 같은 생성 산출물은 별도 정리 대상으로 보고, 기능 마이그레이션 판단 기준에 포함하지 않는다.
- 도메인별로 새 경로가 확정되면, 그 도메인에 남아 있는 상위 셸 파일(도메인명과 같은 Controller/Service/Mapper, 페이지 메타 브리지 등)과 옛 하위 패키지 구현은 삭제 대상이 된다.
- 도메인별로 루트 feature 패키지의 Java/XML만 남기고, 옛 구조에서만 쓰이던 빈 `controller/mapper/service` 하위 폴더는 제거한다.
- 폴더 안에 파일이 없어도, 과거 구조를 드러내는 빈 폴더가 남아 있으면 정리 대상이다.

삭제 대상 형태 예시

- 상위 셸 파일 예시: `src/main/java/com/main/app/official/<domain>/<Domain>Controller.java`, `.../<Domain>Service.java`, `.../<Domain>Mapper.java`
- 상위 XML 예시: `src/main/resources/mapper/official/<domain>/<Domain>Mapper.xml`
- 브리지/중계 파일 예시: `src/main/java/com/main/app/official/<domain>/controller/<Domain>PageMetaController.java`
- 옛 구조 폴더 예시: `src/main/java/com/main/app/official/<domain>/<feature>/controller`, `.../mapper`, `.../service`
- 생성 산출물 예시: `frontend/dist/**`

---

## 3) 공식 적용 기준

### 3-1. 현재 기준점

- CRUD 규칙은 `official/about/pastor` 구현을 기준으로 한다.
- `official/about`는 이미 1차 안정화가 끝났다.

### 3-2. 다음에 적용할 중분류

- `official/news`
  - `event` (announcement / bulletin / registration과 함께 완료)
- `community` (backend)
  - `group`
  - `facilities`
  - `saint`
  - `world`
- `erp`
  - `humen / sermon / account / training / ministry / event / facility / comm / admin / stats`

### 3-3. 적용 시 제외할 내용

- 전 그룹 일괄 세부 트리 작성은 하지 않는다.
- 아직 확정되지 않은 보조 폴더는 문서에서 과도하게 펼치지 않는다.
- 실제 작업 전에 백엔드 메뉴/화면 단위가 확인된 것만 추가한다.

---

## 4) pastor 기준 CRUD 규칙 (현행)

엔드포인트

- GET `/api/official/about/pastor`
- POST `/api/official/about/pastor`
- PUT `/api/official/about/pastor/{corpId}`
- DELETE `/api/official/about/pastor/{corpId}?updatedBy=...&updatedIp=...`

서비스 규칙

- 조회: `@Transactional(readOnly = true)`
- 등록/수정/삭제: `@Transactional`
- 필수값: `chiefName`, `businessRegistrationNumber`
- 기본값: `corpName=기관정보`, `createdBy/updatedBy=system`, `createdIp/updatedIp=127.0.0.1`

삭제 정책

- 물리 삭제 금지
- `is_deleted = TRUE`, `is_active = FALSE` 소프트 삭제

---

## 5) 확정 사항

- common은 완료 상태 유지
- 업무단 구조 기준은 DB 메뉴 경로
- CRUD 기준 구현은 `official/about/pastor`
- 현재 우선순위는 `erp` 순차 적용
- 요청 해석은 `official/about`를 템플릿으로 삼되, 실제 변경은 요청된 중분류의 Java/XML만 수행한다.
- 본 문서는 전 메뉴 Java/XML 파일 구조 제안의 기준 문서로 사용
- 레거시 삭제는 "새 경로 빌드 통과 + 옛 경로 참조 0건"을 만족할 때만 수행한다.
- 도메인별 레거시 삭제는 위 조건에 더해, 옛 구조를 대표하는 상위 셸 파일과 브리지 파일이 0건이어야 완료로 본다.

---

## 6) 남은 작업 체크리스트 (현재 기준)

- `community` backend 세부 정리 완료
- `community/support` 제거 완료
- `src/main/java/com/main/app/community/controller/CommunityIndexController.java` 제거 완료
- `src/main/java/com/main/app/community/controller/CommunityLegacyRedirectController.java` 제거 완료
- `src/main/java/com/main/app/community/controller` 빈 폴더 제거 완료
- `group/facilities/saint/world` 메뉴별 폴더 구조 및 API 연결포인트(`/api/community/*`) 정리 완료
- `community/group` 응답 스키마/컬럼 정합은 개별 개발 단계에서 진행
- `erp`를 DB 메뉴 기준 하위 기능 단위로 재분해
- 각 도메인 완료 시점마다 "빌드 통과 + 옛 경로 참조 0건" 검증 후 레거시 파일/빈 폴더 삭제
