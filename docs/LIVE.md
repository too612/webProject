# 온라인 예배 영상 데이터 매핑 명세 (YouTube API -> PostgreSQL)

본 문서는 YouTube Data API v3(playlistItems)로부터 수집된 데이터를 시스템 DB에 저장하기 위한 매핑 구조와 SQL 스크립트를 정의합니다.

## 1. YouTube API 응답 파라미터 정의

`playlistItems.list` API의 `snippet` 객체에서 추출하는 주요 항목입니다.

| 파라미터 경로                 | 설명                         | 데이터 타입 | 비고                                        |
| :---------------------------- | :--------------------------- | :---------- | :------------------------------------------ |
| `snippet.resourceId.videoId`  | 유튜브 영상 고유 식별자      | String      | 실제 영상 URL의 `v=` 파라미터 값            |
| `snippet.playlistId`          | 해당 영상이 속한 재생목록 ID | String      | 카테고리 구분(주일낮, 주일저녁 등)의 기준   |
| `snippet.title`               | 영상 제목                    | String      | 비공개 영상 필터링의 기준 ("Private video") |
| `snippet.description`         | 영상 상세 설명               | String      | 본문 내용                                   |
| `snippet.publishedAt`         | 재생목록 등록 일시           | ISO 8601    | 최신순 정렬 시 활용                         |
| `snippet.thumbnails.high.url` | 고해상도 썸네일 URL          | String      | 480x360 해상도 이미지                       |
| `snippet.position`            | 재생목록 내 순서             | Integer     | 관리자가 유튜브에서 설정한 순서             |

## 2. PostgreSQL 테이블 설계 스크립트

```sql
-- 온라인 예배 영상 관리 테이블
CREATE TABLE com_live_worship (
    video_id       VARCHAR(20) PRIMARY KEY,      -- 유튜브 영상 고유 ID
    category_type  VARCHAR(50) NOT NULL,         -- 예배 구분 (sunday_day, sunday_evening, friday)
    playlist_id    VARCHAR(50) NOT NULL,         -- 유튜브 재생목록 ID
    title          VARCHAR(500) NOT NULL,        -- 영상 제목
    description    TEXT,                         -- 영상 상세 설명
    thumbnail_url  VARCHAR(500),                 -- 썸네일 이미지 경로
    published_at   TIMESTAMP WITH TIME ZONE,     -- 유튜브 등록 일시
    order_no       INTEGER DEFAULT 0,            -- 정렬 순서
    is_active      BOOLEAN DEFAULT TRUE,         -- 활성화 여부
    is_deleted     BOOLEAN DEFAULT FALSE,        -- 삭제 여부 (소프트 삭제)
    ins_dt         TIMESTAMP DEFAULT NOW(),      -- 등록 일시
    upt_dt         TIMESTAMP DEFAULT NOW()       -- 수정 일시
);

-- 인덱스 설정: 카테고리별 최신순/순서별 조회를 위한 복합 인덱스
CREATE INDEX idx_live_worship_list ON com_live_worship (category_type, order_no ASC, published_at DESC)
WHERE is_deleted = FALSE AND is_active = TRUE;

-- 코멘트 추가
COMMENT ON TABLE com_live_worship IS '온라인 예배 및 유튜브 재생목록 동기화 테이블';
COMMENT ON COLUMN com_live_worship.video_id IS '유튜브 비디오 고유 ID (resourceId.videoId)';
COMMENT ON COLUMN com_live_worship.category_type IS '예배 분류 (sunday_day: 주일낮, sunday_evening: 주일저녁, friday: 금요)';
COMMENT ON COLUMN com_live_worship.playlist_id IS '유튜브 재생목록 식별자';
COMMENT ON COLUMN com_live_worship.title IS '영상 제목';
COMMENT ON COLUMN com_live_worship.description IS '영상 상세 설명 내용';
COMMENT ON COLUMN com_live_worship.thumbnail_url IS '유튜브 썸네일 이미지 주소 (high)';
COMMENT ON COLUMN com_live_worship.published_at IS '유튜브 실제 게시 일시';
COMMENT ON COLUMN com_live_worship.order_no IS '재생목록 내 표시 순번 (position)';
COMMENT ON COLUMN com_live_worship.is_deleted IS '소프트 삭제 플래그 (TRUE: 삭제됨)';
```

## 3. 데이터 매핑 참조표

| 유튜브 API 필드 (Source)      | DB 컬럼명 (Target) | 변환/가공 규칙                                             |
| :---------------------------- | :----------------- | :--------------------------------------------------------- |
| `snippet.resourceId.videoId`  | `video_id`         | 원본값 유지 (PK)                                           |
| (파라미터 전달값)             | `category_type`    | `sunday_day`, `sunday_evening`, `friday` 등 내부 코드 매핑 |
| `snippet.playlistId`          | `playlist_id`      | 원본값 유지                                                |
| `snippet.title`               | `title`            | `null`일 경우 '제목 없음' 보정                             |
| `snippet.description`         | `description`      | `null` 또는 공백 보정                                      |
| `snippet.thumbnails.high.url` | `thumbnail_url`    | 고해상도(`high`) 우선, 없을 시 `standard` 적용             |
| `snippet.publishedAt`         | `published_at`     | `ISO 8601` 문자열을 `TIMESTAMP`로 변환                     |
| `snippet.position`            | `order_no`         | 원본 숫자 유지                                             |
| (System)                      | `is_active`        | 기본값 `TRUE`, 비공개 영상 필터링 시 `FALSE` 처리 가능     |
| (System)                      | `is_deleted`       | 기본값 `FALSE`, 배치 동기화 시 목록에 없으면 `TRUE`        |

## 4. 배치 동기화 로직 가이드 (AI 참조용)

1. **수집**: 1시간 주기로 각 탭(`category_type`)에 해당하는 `playlistId`로 API 요청.
2. **필터링**: 제목이 `Private video` 또는 `This video is private.` 인 경우 저장 제외.
3. **저장(UPSERT)**:
   - `video_id`가 이미 존재하면 `upt_dt`, `title`, `thumbnail_url`, `order_no` 업데이트.
   - 존재하지 않으면 신규 `INSERT`.
4. **정리**: API 응답 목록에는 없지만 DB에는 `is_deleted = FALSE`인 데이터가 있다면, 해당 영상이 재생목록에서 삭제된 것이므로 `is_deleted = TRUE`로 변경.
