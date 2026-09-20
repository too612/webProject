# official 도메인 구조 가이드

## 기준 표준

현재 프로젝트에서 가장 신뢰할 수 있는 표준은 `official/about/pastor` 입니다.
이 구조를 기준으로 다른 기능과 다른 도메인을 확장해야 합니다.

## 표준 원칙

- 기능은 `domain/feature` 구조로 만든다.
- 역할별 하위 폴더(`controller`, `service`, `mapper`)를 만들지 않는다.
- 기능 단위 파일은 아래 형식을 따른다.
- 다른 대분류 도메인은 이 표준을 복제해 확장한다.

## 백엔드 표준

### 경로

src/main/java/com/main/app/official/about/pastor/

- PastorController.java
- PastorService.java
- PastorMapper.java
- dto/
  - PastorDto.java
  - PastorRequest.java

### mapper XML 경로

src/main/resources/mapper/official/about/pastor/

- PastorMapper.xml

### 네임스페이스 규칙

- XML namespace는 Java Mapper 전체 경로와 1:1로 맞춘다.
- 예: `com.main.app.official.about.pastor.PastorMapper`

### 메서드 규칙

- 조회: `getInfo`
- 생성: `setCreate`
- 수정: `setUpdate`
- 삭제: `delRemove`
- 삭제는 물리 삭제가 아니라 소프트 삭제를 사용한다.

## 프론트엔드 표준

### 경로

frontend/src/official/about/pastor/

- pastorPage.tsx
- pastorHook.ts
- pastorApi.ts
- pastorModel.ts

### 구조 규칙

- 화면 단일화면이면 `Page` 중심 구조로 만든다.
- 목록/상세/작성 화면이 나뉘면 `List/View/Write` 구조를 우선한다.
- 공통 로직은 `frontend/src/common`을 확인하고 재사용한다.

## 복붙용 템플릿

### 백엔드 템플릿

```text
src/main/java/com/main/app/official/{domain}/{feature}/
- {Feature}Controller.java
- {Feature}Service.java
- {Feature}Mapper.java
- dto/
  - {Feature}Dto.java
  - {Feature}Request.java
```

### mapper XML 템플릿

```text
src/main/resources/mapper/official/{domain}/{feature}/
- {Feature}Mapper.xml
```

### 프론트 템플릿

```text
frontend/src/official/{domain}/{feature}/
- {feature}Page.tsx
- {feature}Hook.ts
- {feature}Api.ts
- {feature}Model.ts
```

## 실전 사용 방법

1. 표준 구현인 `official/about/pastor`를 확인한다.
2. 같은 패턴으로 새 기능 폴더를 만든다.
3. `Feature` 이름만 바꿔서 파일명을 맞춘다.
4. API 경로와 DB 테이블명을 도메인 구조에 맞게 조정한다.
5. 권한, 메뉴, 라우트는 DB 기준을 우선으로 확인한다.

## 사용 목적

이 문서는 현재 작업의 기준 문서이며, 다른 도메인 확장 시 가장 먼저 복사해서 재사용하는 템플릿입니다.
