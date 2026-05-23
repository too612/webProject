# 백엔드 리팩토링 로드맵 (2026-05, DB 기준)

## 목표

- common은 정비 완료 상태를 유지한다.
- 업무 도메인 구조는 `sys_menu_mgt` 시드 기준(현재 `src/main/resources/sql/erp_menu_seed.sql`)으로 맞춘다.
- Java/XML 모두 `official/about` 패턴(기능 폴더 + Controller/Service/Mapper + dto)을 기준으로 전 메뉴에 확장한다.
- CRUD 규칙은 현재 구현 완료된 `official/about/pastor` 버전을 기준으로 사용한다.

---

## 1) 현재 상태 요약

- common: 정비 완료
- 실제 CRUD 구현 완료: `official/about/pastor`
- 도메인별 소스는 일부 평면형/일부 하위 패키지 혼재 상태
- 문서 기준은 "현재 소스 모양"이 아니라 "DB 메뉴 경로"를 우선한다

---

## 2) 최종 목표 구조 (DB 메뉴 기준)

원칙

- 기능 단위 폴더로 구성한다.
- 기능 폴더 기본 세트:
  - `XxxController.java`
  - `XxxService.java`
  - `XxxMapper.java`
  - `dto/XxxDto.java`, `dto/XxxRequest.java`
- XML은 Java 패키지와 1:1 대응한다.

### 2-1. Java 목표 트리 (실제 파일명 기준)

```text
src/main/java/com/main/app/
├─ common/                                            (완료)
│  ├─ auth/{AuthController,UserService,UserMapper}.java
│  │  └─ dto/UserDto.java
│  ├─ menu/{MenuController,MenuService,MenuMapper}.java
│  │  └─ dto/MenuDto.java
│  ├─ config/{SecurityConfig,CorsConfig,SpaFallbackController}.java
│  ├─ advice/GlobalControllerAdvice.java
│  ├─ exception/ApiExceptionHandler.java
│  ├─ dto/{ApiResponse,CommentDto,FileDto,PageMetaDto}.java
│  └─ util/{FileUploadUtil,PaginationUtil}.java
│
├─ official/                                          (M_MAIN)
│  ├─ about/                                          (/about/*)
│  │  ├─ pastor/{PastorController,PastorService,PastorMapper}.java
│  │  │  └─ dto/{PastorDto,PastorRequest}.java
│  │  ├─ vision/{VisionController,VisionService,VisionMapper}.java
│  │  │  └─ dto/{VisionDto,VisionRequest}.java
│  │  ├─ history/{HistoryController,HistoryService,HistoryMapper}.java
│  │  │  └─ dto/{HistoryDto,HistoryRequest}.java
│  │  └─ beliefs/{BeliefsController,BeliefsService,BeliefsMapper}.java
│  │     └─ dto/{BeliefsDto,BeliefsRequest}.java
│  ├─ worship/                                        (/worship/time,/worship/live,/worship/sermons)
│  │  ├─ WorshipController.java
│  │  ├─ WorshipService.java
│  │  ├─ WorshipMapper.java
│  │  └─ sermon/{SermonController,SermonService,SermonMapper}.java
│  │     └─ dto/{SermonDto,SermonRequest}.java
│  ├─ news/                                           (/news/announcement,/news/event,/news/bulletin,/news/registration)
│  │  ├─ NewsController.java
│  │  ├─ NewsService.java
│  │  ├─ NewsMapper.java
│  │  ├─ announcement/{AnnouncementController,AnnouncementService,AnnouncementMapper}.java
│  │  │  └─ dto/{AnnouncementDto,AnnouncementRequest}.java
│  │  ├─ bulletin/{BulletinController,BulletinService,BulletinMapper}.java
│  │  │  └─ dto/{BulletinDto,BulletinRequest}.java
│  │  ├─ registration/{RegistrationController,RegistrationService,RegistrationMapper}.java
│  │  │  └─ dto/{RegistrationDto,RegistrationRequest}.java
│  │  └─ event/                                       (신규)
│  │     ├─ EventController.java
│  │     ├─ EventService.java
│  │     ├─ EventMapper.java
│  │     └─ dto/{EventDto,EventRequest}.java
│  ├─ ministries/                                     (/ministries/children,/ministries/youth,/ministries/mission)
│  │  ├─ MinistriesController.java
│  │  ├─ MinistriesService.java
│  │  ├─ MinistriesMapper.java
│  │  ├─ children/{ChildrenController,ChildrenService,ChildrenMapper}.java
│  │  │  └─ dto/{ChildrenDto,ChildrenRequest}.java
│  │  ├─ youth/{YouthController,YouthService,YouthMapper}.java
│  │  │  └─ dto/{YouthDto,YouthRequest}.java
│  │  └─ mission/{MissionController,MissionService,MissionMapper}.java
│  │     └─ dto/{MissionDto,MissionRequest}.java
│  └─ support/                                        (/support/location,/support/qna,/support/faq)
│     ├─ SupportController.java
│     ├─ SupportService.java
│     ├─ SupportMapper.java
│     ├─ qna/{QnaController,QnaService,QnaMapper}.java
│     │  └─ dto/{QnaDto,QnaRequest}.java
│     ├─ faq/                                         (신규)
│     │  ├─ FaqController.java
│     │  ├─ FaqService.java
│     │  ├─ FaqMapper.java
│     │  └─ dto/{FaqDto,FaqRequest}.java
│     └─ location/                                    (신규)
│        ├─ LocationController.java
│        ├─ LocationService.java
│        ├─ LocationMapper.java
│        └─ dto/{LocationDto,LocationRequest}.java
│
├─ erp/                                               (M_SYS)
│  ├─ controller/ErpIndexController.java
│  ├─ humen/{HumenController,HumenService,HumenMapper,HumenDto}.java
│  ├─ sermon/{SermonController,SermonService,SermonMapper,SermonErpDto}.java
│  ├─ account/{AccountController,AccountService,AccountMapper,AccountDto}.java
│  ├─ training/{TrainingController,TrainingService,TrainingMapper,TrainingDto}.java
│  ├─ ministry/{MinistryController,MinistryService,MinistryMapper,MinistryDto}.java
│  ├─ event/{EventController,EventService,EventMapper,EventDto}.java
│  ├─ facility/{FacilityController,FacilityService,FacilityMapper,FacilityDto}.java
│  ├─ comm/{CommController,CommService,CommMapper,CommDto}.java
│  ├─ admin/{AdminController,AdminService,AdminMapper,AdminDto}.java
│  └─ stats/{StatsController,StatsService,StatsMapper,StatsDto}.java
│
├─ mypage/                                            (M_MYPAGE)
│  └─ user/
│     ├─ MypageUserController.java
│     ├─ MypageUserService.java
│     ├─ MypageUserMapper.java
│     └─ dto/{MypageUserProfileDto,MypageUserPostDto,MypageUserCommentDto}.java
│
├─ community/                                         (M_GEN)
│  ├─ controller/{CommunityIndexController,CommunityLegacyRedirectController}.java
│  ├─ group/{GroupController,GroupService,GroupMapper,GroupDto}.java
│  ├─ facilities/{FacilitiesController,FacilitiesService,FacilitiesMapper,FacilitiesDto}.java
│  ├─ saint/{SaintController,SaintService,SaintMapper,SaintDto}.java
│  ├─ world/{WorldController,WorldService,WorldMapper,WorldDto}.java
│  └─ support/board/                                  (DB 메뉴 확장 시 신규)
│     ├─ BoardController.java
│     ├─ BoardService.java
│     ├─ BoardMapper.java
│     └─ dto/{BoardDto,BoardRequest}.java
│
└─ system/                                            (M_ADM)
   ├─ controller/{SystemIndexController,SystemLegacyRedirectController}.java
   ├─ user/{UserController,UserService,UserMapper}.java
   ├─ config/{ConfigController,ConfigService,ConfigMapper}.java
   ├─ log/{LogController,LogService,LogMapper}.java
   └─ backup/{BackupController,BackupService,BackupMapper}.java
```

### 2-2. XML 목표 트리 (실제 파일명 기준)

```text
src/main/resources/mapper/
├─ common/
│  ├─ auth/UserMapper.xml
│  └─ menu/MenuMapper.xml
├─ official/
│  ├─ about/
│  │  ├─ pastor/PastorMapper.xml
│  │  ├─ vision/VisionMapper.xml
│  │  ├─ history/HistoryMapper.xml
│  │  └─ beliefs/BeliefsMapper.xml
│  ├─ worship/
│  │  ├─ WorshipMapper.xml
│  │  └─ sermon/SermonMapper.xml
│  ├─ news/
│  │  ├─ NewsMapper.xml
│  │  ├─ announcement/AnnouncementMapper.xml
│  │  ├─ bulletin/BulletinMapper.xml
│  │  ├─ registration/RegistrationMapper.xml
│  │  └─ event/EventMapper.xml                     (신규)
│  ├─ ministries/
│  │  ├─ MinistriesMapper.xml
│  │  ├─ children/ChildrenMapper.xml
│  │  ├─ youth/YouthMapper.xml
│  │  └─ mission/MissionMapper.xml
│  └─ support/
│     ├─ SupportMapper.xml
│     ├─ qna/QnaMapper.xml
│     ├─ faq/FaqMapper.xml                         (신규)
│     └─ location/LocationMapper.xml               (신규)
├─ erp/
│  ├─ humen/HumenMapper.xml
│  ├─ sermon/SermonMapper.xml
│  ├─ account/AccountMapper.xml
│  ├─ training/TrainingMapper.xml
│  ├─ ministry/MinistryMapper.xml
│  ├─ event/EventMapper.xml
│  ├─ facility/FacilityMapper.xml
│  ├─ comm/CommMapper.xml
│  ├─ admin/AdminMapper.xml
│  └─ stats/StatsMapper.xml
├─ mypage/user/MypageUserMapper.xml
├─ community/
│  ├─ group/GroupMapper.xml
│  ├─ facilities/FacilitiesMapper.xml
│  ├─ saint/SaintMapper.xml
│  ├─ world/WorldMapper.xml
│  └─ support/board/BoardMapper.xml               (DB 메뉴 확장 시 신규)
└─ system/
   ├─ user/UserMapper.xml
   ├─ config/ConfigMapper.xml
   ├─ log/LogMapper.xml
   └─ backup/BackupMapper.xml
```

---

## 3) 전 메뉴 적용 시 수정 대상 규칙

- 기능 폴더 단위로 `Controller + Service + Mapper + dto` 세트 정렬
- XML namespace와 Java Mapper 경로를 1:1 정렬
- 구형 `*BoardMapper`는 도메인 본 매퍼로 통합 검토
- 신규 DB 메뉴 경로(`news/event`, `support/faq`, `support/location`)는 신규 파일 생성

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
- 본 문서는 전 메뉴 Java/XML 파일 구조 제안의 기준 문서로 사용
