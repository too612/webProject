# 백엔드 리팩토링 로드맵

> 목표: 공용 `AbstractBoardController` + `BoardContext` enum 기반의 통합 구조를  
> **도메인 중심 독립 구조**로 점진적으로 전환한다.  
> 개발 속도와 안정성을 유지하면서 단계별로 진행한다.

---

## 📐 목표 폴더 구조 (최종)

```
src/main/java/com/main/app/
│
├── common/                                  ← 진정한 공용 코드만 남김
│   ├── api/
│   │   └── ApiExceptionHandler.java
│   ├── dto/
│   │   ├── ApiResponse.java
│   │   ├── CommentDto.java                  ← 게시판 공용 유지
│   │   └── FileDto.java                     ← 게시판 공용 유지
│   ├── exception/
│   │   └── GlobalControllerAdvice.java
│   └── util/                                ← (신규) 공용 유틸 모음
│       ├── FileUploadUtil.java
│       └── PaginationUtil.java
│
├── auth/                                    ← 현재 구조 유지
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── UserController.java
│   ├── dto/
│   ├── mapper/
│   └── service/
│
├── official/                                ← 공개 사이트 도메인
│   ├── controller/                          ← 페이지 렌더링 전담
│   │   └── MainController.java
│   │
│   ├── worship/                             ← [리팩토링 Phase 1]
│   │   ├── controller/
│   │   │   └── SermonController.java        ← (신규) API + 페이지 통합
│   │   ├── service/
│   │   │   └── SermonService.java           ← (신규) 인터페이스 제거
│   │   ├── mapper/
│   │   │   └── SermonMapper.java            ← (신규)
│   │   └── dto/
│   │       ├── SermonDto.java               ← (신규)
│   │       └── SermonRequest.java           ← (신규) 요청 DTO 분리
│   │
│   ├── news/                                ← [리팩토링 Phase 2]
│   │   ├── announcement/
│   │   │   ├── controller/AnnouncementController.java
│   │   │   ├── service/AnnouncementService.java
│   │   │   ├── mapper/AnnouncementMapper.java
│   │   │   └── dto/AnnouncementDto.java
│   │   ├── bulletin/
│   │   │   ├── controller/BulletinController.java
│   │   │   ├── service/BulletinService.java
│   │   │   ├── mapper/BulletinMapper.java
│   │   │   └── dto/BulletinDto.java
│   │   └── registration/
│   │       ├── controller/RegistrationController.java
│   │       ├── service/RegistrationService.java
│   │       ├── mapper/RegistrationMapper.java
│   │       └── dto/RegistrationDto.java
│   │
│   ├── ministries/                          ← [리팩토링 Phase 2]
│   │   ├── children/
│   │   │   ├── controller/ChildrenController.java
│   │   │   ├── service/ChildrenService.java
│   │   │   ├── mapper/ChildrenMapper.java
│   │   │   └── dto/ChildrenDto.java
│   │   ├── youth/
│   │   │   ├── controller/YouthController.java
│   │   │   ├── service/YouthService.java
│   │   │   ├── mapper/YouthMapper.java
│   │   │   └── dto/YouthDto.java
│   │   └── mission/
│   │       ├── controller/MissionController.java
│   │       ├── service/MissionService.java
│   │       ├── mapper/MissionMapper.java
│   │       └── dto/MissionDto.java
│   │
│   ├── support/                             ← [리팩토링 Phase 3]
│   │   └── qna/
│   │       ├── controller/QnaController.java
│   │       ├── service/QnaService.java
│   │       ├── mapper/QnaMapper.java
│   │       └── dto/QnaDto.java
│   │
│   ├── about/                               ← 현재 구조 유지 (페이지만)
│   │   └── AboutController.java
│   │
│   └── [제거 예정]
│       └── api/                             ← 각 도메인으로 이동 후 제거
│           ├── SermonsBoardController.java
│           ├── AnnouncementBoardController.java
│           ├── BulletinBoardController.java
│           ├── RegistrationBoardController.java
│           ├── ChildrenBoardController.java
│           ├── YouthBoardController.java
│           ├── MissionBoardController.java
│           └── OfficialQnaBoardController.java
│
├── erp/                                     ← [리팩토링 Phase 4]
│   ├── controller/
│   │   └── ErpIndexController.java          ← 현재 구조 유지 (페이지)
│   ├── humen/
│   │   ├── controller/HumenController.java  ← /api/erp/humen (완료)
│   │   ├── service/HumenService.java        ← (신규)
│   │   ├── mapper/HumenMapper.java          ← (신규)
│   │   └── dto/HumenDto.java               ← (신규)
│   ├── sermon/
│   │   ├── controller/SermonController.java
│   │   ├── service/SermonService.java
│   │   ├── mapper/SermonMapper.java
│   │   └── dto/SermonDto.java
│   ├── account/
│   │   ├── controller/AccountController.java
│   │   ├── service/AccountService.java
│   │   ├── mapper/AccountMapper.java
│   │   └── dto/AccountDto.java
│   ├── training/
│   │   └── ... (동일 패턴)
│   ├── ministry/
│   │   └── ... (동일 패턴)
│   ├── event/
│   │   └── ... (동일 패턴)
│   ├── facility/
│   │   └── ... (동일 패턴)
│   ├── admin/
│   │   └── ... (동일 패턴)
│   ├── comm/
│   │   └── ... (동일 패턴)
│   └── stats/
│       └── ... (동일 패턴)
│
├── community/                               ← [리팩토링 Phase 5]
│   ├── controller/
│   │   ├── CommunityIndexController.java    ← 현재 구조 유지 (페이지)
│   │   └── CommunityLegacyRedirectController.java
│   ├── group/
│   │   ├── controller/GroupController.java
│   │   ├── service/GroupService.java
│   │   ├── mapper/GroupMapper.java
│   │   └── dto/GroupDto.java
│   ├── saint/
│   │   └── ... (동일 패턴)
│   ├── world/
│   │   └── ... (동일 패턴)
│   ├── facilities/
│   │   └── ... (동일 패턴)
│   └── qna/
│       └── ... (동일 패턴)
│
├── mypage/                                  ← [리팩토링 Phase 6]
│   ├── controller/
│   ├── service/
│   ├── mapper/
│   └── dto/
│
└── system/                                  ← 현재 구조 유지
    ├── backup/
    ├── config/
    ├── controller/
    ├── log/
    └── user/
```

---

## 🗑️ 제거 예정 파일 (리팩토링 완료 후)

| 파일                                             | 이유                    | 제거 시점         |
| ------------------------------------------------ | ----------------------- | ----------------- |
| `common/controller/AbstractBoardController.java` | 도메인별 Service로 대체 | Phase 3 완료 후   |
| `common/service/BoardService.java`               | 도메인별 Service로 대체 | Phase 3 완료 후   |
| `common/service/impl/BoardServiceImpl.java`      | 도메인별 Service로 대체 | Phase 3 완료 후   |
| `common/mapper/BoardMapper.java`                 | 도메인별 Mapper로 대체  | Phase 3 완료 후   |
| `common/dto/BoardDto.java`                       | 도메인별 DTO로 대체     | Phase 3 완료 후   |
| `common/dto/Board.java`                          | 도메인별 Entity로 대체  | Phase 3 완료 후   |
| `common/helper/BoardContext.java`                | 도메인 분리로 불필요    | Phase 3 완료 후   |
| `official/api/*BoardController.java` (8개)       | 도메인 폴더로 이동      | Phase 1~3 완료 후 |

---

## 🛠️ 신규 파일 생성 목록

| 파일                                          | 역할                   | 생성 시점  |
| --------------------------------------------- | ---------------------- | ---------- |
| `common/util/FileUploadUtil.java`             | 파일 업로드 공용 유틸  | Phase 1 전 |
| `common/util/PaginationUtil.java`             | 페이지네이션 공용 유틸 | Phase 1 전 |
| `official/worship/service/SermonService.java` | 설교 비즈니스 로직     | Phase 1    |
| `official/worship/mapper/SermonMapper.java`   | 설교 DB 매핑           | Phase 1    |
| `official/worship/dto/SermonDto.java`         | 설교 응답 DTO          | Phase 1    |
| `official/worship/dto/SermonRequest.java`     | 설교 요청 DTO          | Phase 1    |
| `erp/humen/service/HumenService.java`         | 성도 비즈니스 로직     | Phase 4    |
| `erp/humen/mapper/HumenMapper.java`           | 성도 DB 매핑           | Phase 4    |
| `erp/humen/dto/HumenDto.java`                 | 성도 DTO               | Phase 4    |
| _(나머지 erp 모듈 동일 패턴)_                 |                        | Phase 4    |

---

## 📅 단계별 로드맵

### ✅ 완료

- `erp` 모듈 컨트롤러 10개: `@RestController` + `/api/erp/{module}` 경로 통일
- Official/ERP/Community API 경로 통일 (`/api`로 시작)

---

### 🟦 Phase 0 — 준비 (현재)

**목표:** 공용 유틸 정리 및 신규 개발 기준 문서화

- [ ] `common/util/FileUploadUtil.java` 추출 (AbstractBoardController에서 분리)
- [ ] `common/util/PaginationUtil.java` 추출
- [ ] 신규 컨트롤러 작성 가이드 기준 정립
  - `@RestController` + `@RequestMapping("/api/...")`
  - 인터페이스 없이 `@Service` 클래스 직접 사용
  - `impl/` 폴더 사용 안 함

---

### 🟦 Phase 1 — Official Worship 분리

**목표:** `SermonsBoardController` + `WorshipController` → `official/worship/` 독립

- [ ] `official/worship/service/SermonService.java` 작성
- [ ] `official/worship/mapper/SermonMapper.java` 작성 (SQL Mapper 이동)
- [ ] `official/worship/dto/SermonDto.java` 작성 (BoardDto 대체)
- [ ] `official/worship/dto/SermonRequest.java` 작성
- [ ] `official/worship/controller/SermonController.java` 통합
  - 기존 `WorshipController` (페이지) 흡수 또는 유지
  - 기존 `SermonsBoardController` (API) 흡수
- [ ] 테스트 완료 후 `official/api/SermonsBoardController.java` 제거
- [ ] `BoardContext.SERMONS` 항목 제거

---

### 🟦 Phase 2 — Official News / Ministries 분리

**목표:** news 3개 + ministries 3개 게시판 독립

- [ ] `official/news/announcement/` 구조 생성 및 이관
- [ ] `official/news/bulletin/` 구조 생성 및 이관
- [ ] `official/news/registration/` 구조 생성 및 이관
- [ ] `official/ministries/children/` 구조 생성 및 이관
- [ ] `official/ministries/youth/` 구조 생성 및 이관
- [ ] `official/ministries/mission/` 구조 생성 및 이관
- [ ] 대응하는 `official/api/*BoardController.java` 6개 제거
- [ ] `BoardContext` 해당 항목 제거

---

### 🟦 Phase 3 — Official Support (QnA) 분리 + 공용 코드 제거

**목표:** QnA 분리 완료 후 `common/` 게시판 공용 코드 제거

- [ ] `official/support/qna/` 구조 생성 및 이관
- [ ] `community/qna/` 중복 정리
- [ ] 아래 파일 제거:
  - `common/controller/AbstractBoardController.java`
  - `common/service/BoardService.java`
  - `common/service/impl/BoardServiceImpl.java`
  - `common/mapper/BoardMapper.java`
  - `common/dto/BoardDto.java`
  - `common/dto/Board.java`
  - `common/helper/BoardContext.java`
  - `official/api/` 폴더 전체 제거

---

### 🟦 Phase 4 — ERP 모듈 Service/Mapper 구체화

**목표:** ERP 컨트롤러에 실제 비즈니스 로직 연결

- [ ] 각 ERP 모듈에 `service/`, `mapper/`, `dto/` 폴더 생성
  - `humen`, `sermon`, `account`, `training`, `ministry`
  - `event`, `facility`, `admin`, `comm`, `stats`
- [ ] 현재 `return ApiResponse.ok(null)` 더미 응답을 실제 DB 연결로 교체
- [ ] ERP 전용 SQL Mapper 파일 생성 (`resources/mapper/erp/`)
- [ ] `ErpIndexController` 페이지 라우팅 정리

---

### 🟦 Phase 5 — Community 모듈 구조 정비

**목표:** Community도 동일한 도메인 중심 구조로 전환

- [ ] `community/group/` 서비스/매퍼 구체화
- [ ] `community/saint/` 서비스/매퍼 구체화
- [ ] `community/world/`, `community/facilities/` 구체화
- [ ] `community/api/` 폴더 정리 (도메인으로 이동 후 제거)
- [ ] 중복 QnA 컨트롤러 정리 (`QnaController`, `QnaCommunityController`, `qna/QnaController`)

---

### 🟦 Phase 6 — Mypage 구조 정비

**목표:** Mypage 도메인 완성

- [ ] `mypage/controller/` → `@RestController` 기반으로 정비
- [ ] `mypage/service/`, `mypage/mapper/`, `mypage/dto/` 구체화
- [ ] 사용자 프로필, 게시글 목록, 댓글 관리 API 완성

---

## 📏 코딩 컨벤션 (신규 파일 작성 기준)

### 컨트롤러

```java
// ✅ 새로운 방식
@RestController
@RequestMapping("/api/worship/sermons")
public class SermonController {

    private final SermonService sermonService;

    public SermonController(SermonService sermonService) {
        this.sermonService = sermonService;  // 생성자 주입
    }

    @GetMapping
    public ApiResponse<Page<SermonDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(sermonService.getList(page, keyword));
    }

    @PostMapping
    public ApiResponse<Void> save(@RequestBody SermonRequest req) {
        sermonService.save(req);
        return ApiResponse.ok(null);
    }
}
```

### 서비스

```java
// ✅ 인터페이스 제거, impl/ 폴더 없음
@Service
@Transactional
public class SermonService {

    private final SermonMapper sermonMapper;

    public SermonService(SermonMapper sermonMapper) {
        this.sermonMapper = sermonMapper;
    }

    public Page<SermonDto> getList(int page, String keyword) {
        // 비즈니스 로직
    }

    public void save(SermonRequest req) {
        // 설교 특화 저장 로직
    }
}
```

### DTO 분리

```java
// ✅ 요청/응답 DTO 분리
// SermonRequest.java  ← 클라이언트 → 서버
public class SermonRequest {
    private String title;
    private String preacher;
    private String bibleRef;
    // ...
}

// SermonDto.java  ← 서버 → 클라이언트
public class SermonDto {
    private String id;
    private String title;
    private String preacher;
    private LocalDateTime date;
    // ...
}
```

---

## 🔑 핵심 원칙

| 원칙                   | 내용                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| **도메인 중심**        | 기능이 아닌 도메인(업무 영역)을 기준으로 폴더 구조 구성           |
| **impl 폴더 제거**     | 서비스는 구현 클래스 하나만, 필요 시만 인터페이스 추가            |
| **생성자 주입**        | `@Autowired` 필드 주입 대신 생성자 주입 사용                      |
| **DTO 분리**           | Request / Response DTO를 별도 클래스로 분리                       |
| **API 경로 통일**      | 모든 REST API는 `/api/` 로 시작                                   |
| **페이지 렌더링 분리** | `@Controller` (페이지)와 `@RestController` (API) 역할 명확히 분리 |
| **점진적 전환**        | 한 번에 전체 변경 금지, Phase 단위로 완료 후 다음 단계 진행       |
