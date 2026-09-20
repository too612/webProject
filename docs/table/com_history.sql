-- PostgreSQL DDL: com_history (교회연혁)
-- 하드코딩된 연혁 페이지 데이터를 DB 기반으로 전환

-- 연혁 페이지 헤더 (headline / summary, 단일 활성 행)
CREATE TABLE IF NOT EXISTS com_history_header (
  header_key      VARCHAR(40) PRIMARY KEY,
  headline        VARCHAR(200)  NOT NULL,
  summary         VARCHAR(1000) NOT NULL,
  use_yn          CHAR(1)       NOT NULL DEFAULT 'Y',
  sort_order      INTEGER       NOT NULL DEFAULT 0,

  reg_user        VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  reg_ip          INET,
  upd_user        VARCHAR(50),
  upd_dtm         TIMESTAMPTZ,
  upd_ip          INET,

  CONSTRAINT ck_com_history_header_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_com_history_header_sort_order
    CHECK (sort_order >= 0)
);

-- 연혁 연도
CREATE TABLE IF NOT EXISTS com_history (
  history_id      BIGSERIAL PRIMARY KEY,
  year_label      VARCHAR(10)   NOT NULL,  -- 표시용 연도 (예: 2026년)
  year_no         INTEGER       NOT NULL,  -- 정렬/범위 필터용 (예: 2026)
  use_yn          CHAR(1)       NOT NULL DEFAULT 'Y',
  sort_order      INTEGER       NOT NULL DEFAULT 0,

  reg_user        VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  reg_ip          INET,
  upd_user        VARCHAR(50),
  upd_dtm         TIMESTAMPTZ,
  upd_ip          INET,

  CONSTRAINT ck_com_history_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_com_history_year_no
    CHECK (year_no >= 1900 AND year_no <= 3000),
  CONSTRAINT uq_com_history_year_no
    UNIQUE (year_no)
);

-- 연혁 이벤트 (연도별 세부 사건)
CREATE TABLE IF NOT EXISTS com_history_event (
  event_id        BIGSERIAL PRIMARY KEY,
  history_id      BIGINT        NOT NULL,
  event_date      VARCHAR(10)   NOT NULL,  -- 표시용 날짜 (예: 03.10)
  description     VARCHAR(500)  NOT NULL,
  images          JSONB         NOT NULL DEFAULT '[]'::JSONB,  -- 이미지 경로 배열
  use_yn          CHAR(1)       NOT NULL DEFAULT 'Y',
  sort_order      INTEGER       NOT NULL DEFAULT 0,

  reg_user        VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  reg_ip          INET,
  upd_user        VARCHAR(50),
  upd_dtm         TIMESTAMPTZ,
  upd_ip          INET,

  CONSTRAINT ck_com_history_event_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_com_history_event_sort_order
    CHECK (sort_order >= 0),
  CONSTRAINT fk_com_history_event_history
    FOREIGN KEY (history_id) REFERENCES com_history(history_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_com_history_year_no
  ON com_history (year_no DESC, sort_order ASC);

CREATE INDEX IF NOT EXISTS ix_com_history_event_history
  ON com_history_event (history_id, sort_order ASC);

COMMENT ON TABLE com_history_header
  IS '교회연혁 페이지 헤더 테이블';
COMMENT ON COLUMN com_history_header.header_key
  IS '헤더 키(활성 행 식별)';
COMMENT ON COLUMN com_history_header.headline
  IS '연혁 페이지 제목';
COMMENT ON COLUMN com_history_header.summary
  IS '연혁 페이지 요약';
COMMENT ON TABLE com_history
  IS '교회연혁 연도 테이블';
COMMENT ON COLUMN com_history.year_label
  IS '표시용 연도 (예: 2026년)';
COMMENT ON COLUMN com_history.year_no
  IS '정렬/범위 필터용 연도 (예: 2026)';
COMMENT ON TABLE com_history_event
  IS '교회연혁 이벤트 테이블';
COMMENT ON COLUMN com_history_event.event_date
  IS '표시용 날짜 (예: 03.10)';
COMMENT ON COLUMN com_history_event.description
  IS '이벤트 설명';
COMMENT ON COLUMN com_history_event.images
  IS '이미지 경로 배열(JSONB)';

-- 샘플 데이터는 별도 파일 [docs/com_history_seed.sql]로 분리
