-- PostgreSQL DDL: hrm_worship_time (예배시간)
-- 하드코딩된 예배시간 페이지 데이터를 DB 기반으로 전환

CREATE TABLE IF NOT EXISTS hrm_worship_time (
  time_id       BIGSERIAL PRIMARY KEY,
  category      VARCHAR(50)  NOT NULL,   -- 구분 (새벽예배, 주일예배, ...)
  title         VARCHAR(100) NOT NULL,   -- 예배명
  time          VARCHAR(100) NOT NULL,   -- 예배시간
  note          VARCHAR(300),            -- 비고
  location      VARCHAR(100),            -- 장소
  order_no      INTEGER      NOT NULL DEFAULT 0,  -- 표시 순서
  use_yn        CHAR(1)      NOT NULL DEFAULT 'Y',
  sort_order    INTEGER      NOT NULL DEFAULT 0,

  reg_user      VARCHAR(50)  NOT NULL DEFAULT 'SYSTEM',
  reg_dtm       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  reg_ip        INET,
  upd_user      VARCHAR(50),
  upd_dtm       TIMESTAMPTZ,
  upd_ip        INET,

  CONSTRAINT ck_hrm_worship_time_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_hrm_worship_time_order_no
    CHECK (order_no >= 0),
  CONSTRAINT ck_hrm_worship_time_sort_order
    CHECK (sort_order >= 0)
);

CREATE INDEX IF NOT EXISTS ix_hrm_worship_time_order
  ON hrm_worship_time (order_no ASC, sort_order ASC);

COMMENT ON TABLE hrm_worship_time
  IS '예배시간 안내 테이블';
COMMENT ON COLUMN hrm_worship_time.category
  IS '구분 (새벽예배, 주일예배, 월요예배, 수요예배, 금요예배, 성도모임 등)';
COMMENT ON COLUMN hrm_worship_time.title
  IS '예배명';
COMMENT ON COLUMN hrm_worship_time.time
  IS '예배시간';
COMMENT ON COLUMN hrm_worship_time.note
  IS '비고';
COMMENT ON COLUMN hrm_worship_time.location
  IS '장소';
COMMENT ON COLUMN hrm_worship_time.order_no
  IS '표시 순서';
COMMENT ON COLUMN hrm_worship_time.use_yn
  IS '사용여부(Y/N)';

-- 샘플 데이터는 별도 파일 [docs/hrm_worship_time_seed.sql]로 분리
