# QnA 게시판 소스 분석 및 CRUD 흐름 정리

이 문서는 현재 코드베이스에서 개발자가 QnA 기능을 빠르게 이해할 수 있도록,
실제로 동작하는 소스 중심으로 역할과 흐름을 정리한 문서입니다.

---

## 1) 한눈에 보는 구조

QnA는 "공통 게시판 엔진"을 재사용하는 구조입니다.

- 컨트롤러 공통화: AbstractBoardController
- 서비스 공통화: BoardServiceImpl
- 매퍼 공통화: BoardMapper + BoardMapper.xml
- 게시판 구분값: BoardContext (QNA, COMMUNITY_QNA 등)
- 공식 QnA API: /api/support/qna
- 커뮤니티 QnA API: /api/community/support/qna

즉, QnA 전용 로직을 별도로 깊게 만들기보다,
게시판 공통 엔진에 boardType을 주입해 동작시키는 패턴입니다.

---

## 2) 소스 역할 맵 (개발자 관점)

### A. 백엔드 (QnA 실제 동작 경로)

1. src/main/java/com/main/app/official/api/OfficialQnaBoardApiController.java

- 역할: 공식 사이트 QnA API 엔드포인트 진입점
- 특징: AbstractBoardController 상속 + BoardContext.QNA 반환
- URL 베이스: /api/support/qna

2. src/main/java/com/main/app/community/api/CommunityQnaBoardApiController.java

- 역할: 커뮤니티 QnA API 진입점
- 특징: 동일 공통 컨트롤러 재사용, boardType만 COMMUNITY_QNA
- URL 베이스: /api/community/support/qna

3. src/main/java/com/main/app/common/controller/AbstractBoardController.java

- 역할: 게시판 공통 REST API 집합
- 담당 기능:
  - 목록: GET /
  - 작성폼/수정폼 데이터: GET /write
  - 답글폼 데이터: GET /reply
  - 등록: POST /write
  - 수정: POST /update
  - 삭제: POST /delete
  - 상세조회: GET /view
  - 비밀번호 확인 조회: POST /view
  - 첨부 다운로드: GET /download
  - 댓글 등록: POST /comment/write
  - 댓글 추천/비추천: POST /comment/vote

4. src/main/java/com/main/app/common/helper/BoardContext.java

- 역할: 게시판 타입과 경로 메타데이터 정의
- QNA 관련 핵심값:
  - boardType: QNA
  - basePath: /board
  - targetMenuPath: /support/qna

5. src/main/java/com/main/app/common/service/BoardService.java

- 역할: 게시판 공통 서비스 인터페이스
- QnA CRUD 관련 메서드:
  - getBoardList, getBoardDetail
  - saveBoard, updateBoard, deleteBoard
  - getFile, getCommentList, saveComment, handleVote

6. src/main/java/com/main/app/common/service/impl/BoardServiceImpl.java

- 역할: QnA 포함 게시판 공통 비즈니스 로직 구현
- 핵심 포인트:
  - 리스트/상세 조회
  - 등록/수정/삭제 트랜잭션 처리
  - 답글 계층(order/depth/group) 조정
  - 첨부파일 저장(uploadPath) 및 file_table 등록
  - 댓글 및 투표 처리

7. src/main/java/com/main/app/common/mapper/BoardMapper.java

- 역할: 게시판/파일/댓글 DB 접근 인터페이스

8. src/main/resources/mapper/community/BoardMapper.xml

- 역할: 실제 SQL 구현
- 중요 쿼리:
  - selectBoardList / countBoardList
  - selectBoardDetail / updateReadCount
  - insertBoard / updateBoard / deleteBoard
  - insertFile / selectFile / selectFileList / deleteFiles
  - insertComment / selectCommentList / selectReplies
  - increaseLike/decreaseLike, increaseDislike/decreaseDislike

### B. 프론트엔드 (QnA 화면 및 API 연결)

1. frontend/src/router/OfficialRoutes.tsx

- 역할: 공식 사이트 지원 메뉴 라우팅
- QnA 라우트:
  - /support/qna (목록)
  - /support/qna/view (상세)
  - /support/qna/write (작성/수정/답글)

2. frontend/src/api/boardApi.ts

- 역할: 게시판 백엔드 API 호출 래퍼
- QnA에서도 동일하게 사용
- 핵심 메서드:
  - getBoardList, getBoardView
  - getWriteForm, getReplyForm
  - saveBoard, updateBoard, deleteBoard
  - saveComment, voteComment

3. frontend/src/pages/official/support/QnaPage.tsx

- 역할: QnA 목록 화면 래퍼
- 실제 렌더링은 OfficialBoardListPage 재사용

4. frontend/src/pages/official/support/QnaWritePage.tsx

- 역할: QnA 작성 화면 래퍼
- 실제 작성/수정/답글 로직은 OfficialBoardWritePage 재사용

5. frontend/src/pages/official/support/QnaViewPage.tsx

- 역할: QnA 상세 화면 래퍼
- 실제 상세/댓글/투표는 OfficialBoardViewPage 재사용

6. frontend/src/pages/official/shared/OfficialBoardListPage.tsx

- 역할: 목록/검색/페이징/비밀글 진입 처리

7. frontend/src/pages/official/shared/OfficialBoardWritePage.tsx

- 역할: 작성/수정/답글 폼, 유효성검사, 파일첨부 업로드

8. frontend/src/pages/official/shared/OfficialBoardViewPage.tsx

- 역할: 상세 본문, 첨부다운로드, 댓글/대댓글, 추천/비추천, 비밀번호 검증 후 수정/삭제

### C. 템플릿/지원 모듈

1. src/main/java/com/main/app/official/support/SupportController.java

- 역할: /support 하위 페이지 템플릿 라우팅(MVC)

2. src/main/java/com/main/app/official/api/SupportApiController.java

- 역할: 지원 페이지 메타 정보 API

3. src/main/java/com/main/app/official/support/SupportService.java
4. src/main/java/com/main/app/official/support/impl/SupportServiceImpl.java
5. src/main/java/com/main/app/official/support/SupportMapper.java

- 역할: 현재 TODO 스텁 상태 (QnA CRUD의 실제 경로 아님)

---

## 3) QnA CRUD 실제 흐름

아래는 공식 QnA 기준(/api/support/qna) 흐름입니다.

### 3-1. 목록 조회 (Read List)

1. 프론트

- OfficialBoardListPage가 boardApi.getBoardList("/support/qna", { page, searchType, keyword }) 호출

2. API

- GET /api/support/qna?page=0&searchType=...&keyword=...
- OfficialQnaBoardApiController -> AbstractBoardController.list

3. 서비스

- BoardServiceImpl.getBoardList(pageable, searchType, keyword, "QNA")

4. SQL

- BoardMapper.xml selectBoardList + countBoardList
- board_type = QNA 필터로 데이터 조회
- 파일 유무/총용량/댓글수 서브쿼리 포함

5. 응답

- ApiResponse<Page<BoardDto>>
- 프론트에서 rows로 가공하여 테이블 렌더링

### 3-2. 상세 조회 (Read One)

1. 프론트

- /support/qna/view?rqstNo=... 진입 시 boardApi.getBoardView("/support/qna", rqstNo)

2. API

- GET /api/support/qna/view?rqstNo=...
- AbstractBoardController.view

3. 서비스

- getBoardDetail(rqstNo, "QNA")
- 내부에서 updateReadCount 후 selectBoardDetail
- selectFileList로 첨부 목록 결합
- getCommentList로 댓글 트리 로드

4. 응답 payload

- board, comments, commentCount, userVotes(session)

주의:

- 상세 조회 시 조회수 증가가 서비스 내부에서 항상 수행됨

### 3-3. 등록 (Create)

1. 프론트

- OfficialBoardWritePage onSubmit
- boardApi.saveBoard("/support/qna", payload, files)
- multipart/form-data 전송

2. API

- POST /api/support/qna/write
- AbstractBoardController.save

3. 서비스

- saveBoard(BoardDto, files)
- rqstNo 없으면 신규 등록
- 일반글:
  - groupNo = rqstNo, depth = 0, orderNo = 0
- 답글(parentNo 존재):
  - 부모 조회
  - updateReplyOrder로 정렬 자리 확보
  - depth/orderNo 계산 후 insert
- processFiles에서 디스크 저장 + file_table insert

4. DB

- board insert
- file_table insert(첨부 있을 때)

### 3-4. 수정 (Update)

1. 프론트

- boardApi.updateBoard("/support/qna", payload, files)

2. API

- POST /api/support/qna/update

3. 서비스

- updateBoard(BoardDto, files)
- board update
- 신규 첨부 processFiles

주의:

- 기존 첨부의 물리파일 정리 정책은 현재 코드에서 별도 처리 로직이 제한적이므로,
  운영 시 파일 수명주기 정책 점검 필요

### 3-5. 삭제 (Delete)

1. 프론트

- 상세 화면에서 비밀번호 확인 후 boardApi.deleteBoard("/support/qna", rqstNo)

2. API

- POST /api/support/qna/delete

3. 서비스(트랜잭션)

- deleteComments(rqstNo)
- deleteFiles(rqstNo)
- deleteBoard(rqstNo)

주의:

- DB 레코드는 삭제되지만, 업로드된 실제 파일(디스크)은 서비스 코드에서 별도 삭제하지 않음
- 장기 운영 시 orphan 파일 정리 배치 필요

---

## 4) 댓글/투표 흐름 (QnA 확장 기능)

### 댓글 등록

- POST /api/support/qna/comment/write
- insertComment(comment)
- parentCommentId로 대댓글 계층 구성

### 댓글 조회

- 상세 조회 시 selectCommentList + selectReplies(resultMap collection)
- 트리 구조로 응답

### 투표(좋아요/싫어요)

- POST /api/support/qna/comment/vote
- session voteHistory 기반 중복/토글/전환 처리
- handleVote에서 like/dislike 증감

---

## 5) 비밀글/비밀번호 처리

1. 게시글 등록/수정 시 secret, password 저장
2. 상세에서 수정/삭제 전 프론트가 checkPassword 호출
3. API POST /view에서 비밀번호 일치 여부 검증
4. 불일치 시 400 + fail 응답

주의:

- 현재 구현은 평문 비교(password.equals(board.getPassword()))
- 보안 강화를 위해 해시 저장(BCrypt 등)으로 개선 권장

---

## 6) 데이터 모델 핵심 필드

### board

- rqst_no: 게시글 PK
- group_no: 스레드 그룹(원글 기준)
- parent_no: 부모 글 번호
- depth: 답글 깊이
- order_no: 그룹 내 정렬
- board_type: 게시판 구분(QNA 등)
- secret, password: 비밀글/비밀번호

### file_table

- board_no: 게시글 FK
- org_file_nm, stored_file_nm, file_path, file_size

### comment

- board_no: 게시글 FK
- parent_comment_id: 대댓글 부모
- likes/dislikes: 투표 카운트
- secret/password/spoiler: 댓글 옵션

---

## 7) 개발 시 빠른 추적 순서 (권장)

QnA 이슈를 디버깅할 때는 아래 순서로 보면 가장 빠릅니다.

1. 프론트 호출 경로

- boardApi.ts에서 어떤 path/파라미터로 호출하는지 확인

2. API 엔트리

- OfficialQnaBoardApiController -> AbstractBoardController 어떤 메서드 타는지 확인

3. 서비스 로직

- BoardServiceImpl에서 트랜잭션/부가처리(조회수, 첨부, 답글 정렬) 확인

4. SQL

- BoardMapper.xml에서 실제 WHERE(board_type), JOIN, ORDER BY, LIMIT/OFFSET 확인

5. DB 데이터

- board/group_no/depth/order_no 정합성, file_table/comment 연결 확인

---

## 8) 혼동 포인트 정리

아래 파일들은 현재 QnA CRUD의 핵심 경로가 아니라 스텁/레거시 성격이 강합니다.

- src/main/java/com/main/app/community/qna/QnaController.java
- src/main/java/com/main/app/community/qna/QnaCommunityController.java
- src/main/java/com/main/app/community/qna/QnaMapper.java
- src/main/resources/mapper/community/qna/QnaMapper.xml
- src/main/java/com/main/app/official/support/SupportService.java
- src/main/java/com/main/app/official/support/impl/SupportServiceImpl.java
- src/main/java/com/main/app/official/support/SupportMapper.java

실제 운영 CRUD는 공통 게시판 엔진(AbstractBoardController + BoardServiceImpl + BoardMapper.xml) 경로를 우선 기준으로 보면 됩니다.

---

## 9) 개선 포인트 (분석 결과)

1. 비밀번호 평문 저장/비교 개선

- 해시 저장 + 검증 방식으로 전환 필요

2. 파일 삭제 정책 보강

- 게시글 삭제/첨부 교체 시 물리 파일 정리 로직 추가 권장

3. 중복/스텁 패키지 정리

- community.qna 하위 빈 컨트롤러/매퍼 정리로 혼선 감소

4. 검색 타입 상수 일관화

- 프론트(rqstId/cont)와 SQL(writer/content) 키워드 매핑 명확화 필요

5. 조회수 증가 정책

- GET /view에서 매번 증가하는 현재 정책이 요구사항에 맞는지 재검토 권장

---

문서 버전: 1.0
작성일: 2026-05-06
