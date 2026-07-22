-- PostgreSQL DDL: common_code
-- 공통 코드 관리 테이블

CREATE TABLE IF NOT EXISTS common_code (
  code                VARCHAR(7) PRIMARY KEY,
  code_name           VARCHAR(100) NOT NULL,
  parent_code         VARCHAR(7) NOT NULL,
  category_code       CHAR(3),

  extra1              VARCHAR(200),
  extra2              VARCHAR(200),
  extra3              VARCHAR(200),
  extra4              VARCHAR(200),
  extra5              VARCHAR(200),
  extra6              VARCHAR(200),
  extra7              VARCHAR(200),
  extra8              VARCHAR(200),
  extra9              VARCHAR(200),
  extra10             VARCHAR(200),

  remark              TEXT,
  use_yn              CHAR(1) NOT NULL DEFAULT 'Y',
  sort_order          INTEGER NOT NULL DEFAULT 0,

  reg_user            VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  reg_dtm             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reg_ip              INET,
  upd_user            VARCHAR(50),
  upd_dtm             TIMESTAMPTZ,
  upd_ip              INET,

  CONSTRAINT ck_common_code_format
    CHECK (code ~ '^\d{3}(-\d{3})?$'),
  CONSTRAINT ck_common_code_parent_format
    CHECK (parent_code = '000' OR parent_code ~ '^\d{3}(-\d{3})?$'),
  CONSTRAINT ck_common_code_category
    CHECK (category_code IS NULL OR category_code ~ '^\d{3}$'),
  CONSTRAINT ck_common_code_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_common_code_sort_order
    CHECK (sort_order >= 0),
  CONSTRAINT ck_common_code_parent_not_self
    CHECK (code = '000' OR code <> parent_code),
  CONSTRAINT uq_common_code_parent_name
    UNIQUE (parent_code, code_name),
  CONSTRAINT fk_common_code_parent_code
    FOREIGN KEY (parent_code) REFERENCES common_code(code)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS ix_common_code_parent_code
  ON common_code (parent_code, sort_order, code);

CREATE INDEX IF NOT EXISTS ix_common_code_category_code
  ON common_code (category_code, sort_order, code);

CREATE INDEX IF NOT EXISTS ix_common_code_use_yn
  ON common_code (use_yn, sort_order, code);

CREATE INDEX IF NOT EXISTS ix_common_code_code_name
  ON common_code (code_name);

COMMENT ON TABLE common_code
  IS '공통코드 테이블';
COMMENT ON COLUMN common_code.code
  IS '코드 (000 또는 000-000 형식)';
COMMENT ON COLUMN common_code.code_name
  IS '코드명(사용자 노출 텍스트)';
COMMENT ON COLUMN common_code.parent_code
  IS '상위코드 (최상위는 000)';
COMMENT ON COLUMN common_code.category_code
  IS '분류코드(업무분류 000 형식)';
COMMENT ON COLUMN common_code.extra1
  IS '기타1';
COMMENT ON COLUMN common_code.extra2
  IS '기타2';
COMMENT ON COLUMN common_code.extra3
  IS '기타3';
COMMENT ON COLUMN common_code.extra4
  IS '기타4';
COMMENT ON COLUMN common_code.extra5
  IS '기타5';
COMMENT ON COLUMN common_code.extra6
  IS '기타6';
COMMENT ON COLUMN common_code.extra7
  IS '기타7';
COMMENT ON COLUMN common_code.extra8
  IS '기타8';
COMMENT ON COLUMN common_code.extra9
  IS '기타9';
COMMENT ON COLUMN common_code.extra10
  IS '기타10';
COMMENT ON COLUMN common_code.remark
  IS '비고';
COMMENT ON COLUMN common_code.use_yn
  IS '사용여부(Y/N)';
COMMENT ON COLUMN common_code.sort_order
  IS '정렬순서(코드값과 무관한 표시순서)';
COMMENT ON COLUMN common_code.reg_user
  IS '등록자';
COMMENT ON COLUMN common_code.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN common_code.reg_ip
  IS '등록IP';
COMMENT ON COLUMN common_code.upd_user
  IS '수정자';
COMMENT ON COLUMN common_code.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN common_code.upd_ip
  IS '수정IP';

-- 샘플 데이터는 별도 파일 [docs/common_code_seed.sql]로 분리
