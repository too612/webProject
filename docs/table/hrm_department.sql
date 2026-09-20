-- PostgreSQL DDL: HRM organization reorg / department / department history
-- 목적: ERP 인사/조직 데이터를 AI 질의에 유리한 구조로 조회할 수 있도록 정규화한 설계안
-- 원본 현장 테이블명은 그대로 쓰지 않고, 의미가 드러나는 이름으로 재구성한다.
-- 운영 규칙: dept_cd는 시스템 채번 +1 방식으로만 생성하고 사용자 임의수정은 금지한다.
-- 최상위 부서는 예약 코드 D000000을 고정값으로 사용할 수 있다.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 조직개편 헤더
CREATE TABLE IF NOT EXISTS hrm_org_reorg (
  reorg_key          CHAR(80) PRIMARY KEY
                     DEFAULT encode(gen_random_bytes(40), 'hex'),

  reorg_dt           DATE NOT NULL,
  conf_yn            CHAR(1) NOT NULL DEFAULT 'N',
  use_yn             CHAR(1) NOT NULL DEFAULT 'Y',
  reorg_title        VARCHAR(200),
  remark             TEXT,

  reg_user           VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  reg_dtm            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reg_ip             INET,
  upd_user           VARCHAR(50),
  upd_dtm            TIMESTAMPTZ,
  upd_ip             INET,

  CONSTRAINT ck_hrm_org_reorg_key_hex
    CHECK (reorg_key ~ '^[0-9a-f]{80}$'),
  CONSTRAINT ck_hrm_org_reorg_conf_yn
    CHECK (conf_yn IN ('Y', 'N')),
  CONSTRAINT ck_hrm_org_reorg_use_yn
    CHECK (use_yn IN ('Y', 'N'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_org_reorg_reorg_dt
  ON hrm_org_reorg (reorg_dt)
;

CREATE INDEX IF NOT EXISTS ix_hrm_org_reorg_use_yn
  ON hrm_org_reorg (use_yn, reorg_dt DESC);

COMMENT ON TABLE hrm_org_reorg
  IS '조직개편 헤더 테이블';
COMMENT ON COLUMN hrm_org_reorg.reorg_key
  IS '조직개편 내부키(40byte 난수 HEX 80자리)';
COMMENT ON COLUMN hrm_org_reorg.reorg_dt
  IS '조직개편일자';
COMMENT ON COLUMN hrm_org_reorg.conf_yn
  IS '확정여부(Y/N)';
COMMENT ON COLUMN hrm_org_reorg.use_yn
  IS '사용여부(Y/N)';
COMMENT ON COLUMN hrm_org_reorg.reorg_title
  IS '조직개편명 또는 배치명';
COMMENT ON COLUMN hrm_org_reorg.remark
  IS '비고';
COMMENT ON COLUMN hrm_org_reorg.reg_user
  IS '등록자';
COMMENT ON COLUMN hrm_org_reorg.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN hrm_org_reorg.reg_ip
  IS '등록 IP';
COMMENT ON COLUMN hrm_org_reorg.upd_user
  IS '수정자';
COMMENT ON COLUMN hrm_org_reorg.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN hrm_org_reorg.upd_ip
  IS '수정 IP';

-- 부서 마스터
CREATE TABLE IF NOT EXISTS hrm_org_dept (
  dept_key            CHAR(80) PRIMARY KEY
                      DEFAULT encode(gen_random_bytes(40), 'hex'),

  reorg_key           CHAR(80) NOT NULL,
  dept_cd             VARCHAR(30) NOT NULL,
  dept_nm             VARCHAR(200) NOT NULL,
  eng_dept_nm         VARCHAR(200),
  parent_dept_key     CHAR(80),
  dept_level          INTEGER NOT NULL DEFAULT 1,
  change_type_cd      VARCHAR(20) NOT NULL,
  chef_emp_no         VARCHAR(30),
  dept_sys_cd         VARCHAR(30) NOT NULL,
  use_yn              CHAR(1) NOT NULL DEFAULT 'Y',
  remark              TEXT,

  reg_user            VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  reg_dtm             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reg_ip              INET,
  upd_user            VARCHAR(50),
  upd_dtm             TIMESTAMPTZ,
  upd_ip              INET,

  ai_profile          JSONB NOT NULL DEFAULT '{}'::JSONB,
  extra_attributes    JSONB NOT NULL DEFAULT '{}'::JSONB,

  CONSTRAINT ck_hrm_org_dept_key_hex
    CHECK (dept_key ~ '^[0-9a-f]{80}$'),
  CONSTRAINT ck_hrm_org_dept_parent_key_hex
    CHECK (parent_dept_key IS NULL OR parent_dept_key ~ '^[0-9a-f]{80}$'),
  CONSTRAINT ck_hrm_org_dept_level
    CHECK (dept_level > 0),
  CONSTRAINT ck_hrm_org_dept_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_hrm_org_dept_parent_not_self
    CHECK (parent_dept_key IS NULL OR parent_dept_key <> dept_key),
  CONSTRAINT fk_hrm_org_dept_parent_dept_key
    FOREIGN KEY (parent_dept_key) REFERENCES hrm_org_dept(dept_key)
      DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT fk_hrm_org_dept_reorg_key
    FOREIGN KEY (reorg_key) REFERENCES hrm_org_reorg(reorg_key)
      DEFERRABLE INITIALLY DEFERRED
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_org_dept_dept_cd
  ON hrm_org_dept (dept_cd)
;

CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_org_dept_dept_sys_cd
  ON hrm_org_dept (dept_sys_cd)
;

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_reorg_key
  ON hrm_org_dept (reorg_key, dept_level, dept_cd);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_parent_dept_key
  ON hrm_org_dept (parent_dept_key, dept_level, dept_cd);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_chef_emp_no
  ON hrm_org_dept (chef_emp_no);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_dept_nm_trgm
  ON hrm_org_dept USING GIN (dept_nm gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_eng_dept_nm_trgm
  ON hrm_org_dept USING GIN (eng_dept_nm gin_trgm_ops);

COMMENT ON TABLE hrm_org_dept
  IS '부서 마스터 테이블';
COMMENT ON COLUMN hrm_org_dept.dept_key
  IS '부서 내부키(40byte 난수 HEX 80자리)';
COMMENT ON COLUMN hrm_org_dept.reorg_key
  IS '조직개편 헤더키';
COMMENT ON COLUMN hrm_org_dept.dept_cd
  IS '부서코드(시스템 채번, 사용자 수정 금지, 최상위 부서는 D000000 사용 가능)';
COMMENT ON COLUMN hrm_org_dept.dept_nm
  IS '부서명';
COMMENT ON COLUMN hrm_org_dept.eng_dept_nm
  IS '부서영문명';
COMMENT ON COLUMN hrm_org_dept.parent_dept_key
  IS '상위부서 내부키';
COMMENT ON COLUMN hrm_org_dept.dept_level
  IS '부서레벨';
COMMENT ON COLUMN hrm_org_dept.change_type_cd
  IS '변경구분코드';
COMMENT ON COLUMN hrm_org_dept.chef_emp_no
  IS '부서장 사번';
COMMENT ON COLUMN hrm_org_dept.dept_sys_cd
  IS '원시스템코드';
COMMENT ON COLUMN hrm_org_dept.use_yn
  IS '사용여부(Y/N)';
COMMENT ON COLUMN hrm_org_dept.remark
  IS '비고';
COMMENT ON COLUMN hrm_org_dept.reg_user
  IS '등록자';
COMMENT ON COLUMN hrm_org_dept.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN hrm_org_dept.reg_ip
  IS '등록 IP';
COMMENT ON COLUMN hrm_org_dept.upd_user
  IS '수정자';
COMMENT ON COLUMN hrm_org_dept.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN hrm_org_dept.upd_ip
  IS '수정 IP';
COMMENT ON COLUMN hrm_org_dept.ai_profile
  IS 'AI 활용용 요약/태그/메타';
COMMENT ON COLUMN hrm_org_dept.extra_attributes
  IS '확장 속성(JSONB)';

-- 부서 변경 이력
CREATE TABLE IF NOT EXISTS hrm_org_dept_hist (
  dept_hist_key       CHAR(80) PRIMARY KEY
                      DEFAULT encode(gen_random_bytes(40), 'hex'),

  reorg_key           CHAR(80) NOT NULL,
  org_dept_key        CHAR(80),
  chg_dept_key        CHAR(80),
  org_dept_cd         VARCHAR(30) NOT NULL,
  org_dept_level      INTEGER NOT NULL,
  chg_dept_cd         VARCHAR(30) NOT NULL,
  chg_dept_level      INTEGER NOT NULL,
  change_type_cd      VARCHAR(20) NOT NULL,
  change_note         TEXT,

  reg_user            VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  reg_dtm             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reg_ip              INET,
  upd_user            VARCHAR(50),
  upd_dtm             TIMESTAMPTZ,
  upd_ip              INET,

  CONSTRAINT ck_hrm_org_dept_hist_key_hex
    CHECK (dept_hist_key ~ '^[0-9a-f]{80}$'),
  CONSTRAINT ck_hrm_org_dept_hist_org_level
    CHECK (org_dept_level > 0),
  CONSTRAINT ck_hrm_org_dept_hist_chg_level
    CHECK (chg_dept_level > 0),
  CONSTRAINT fk_hrm_org_dept_hist_reorg_key
    FOREIGN KEY (reorg_key) REFERENCES hrm_org_reorg(reorg_key)
      DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT fk_hrm_org_dept_hist_org_dept_key
    FOREIGN KEY (org_dept_key) REFERENCES hrm_org_dept(dept_key)
      DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT fk_hrm_org_dept_hist_chg_dept_key
    FOREIGN KEY (chg_dept_key) REFERENCES hrm_org_dept(dept_key)
      DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_hist_reorg_key
  ON hrm_org_dept_hist (reorg_key, change_type_cd, reg_dtm DESC);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_hist_org_dept_cd
  ON hrm_org_dept_hist (org_dept_cd, org_dept_level);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_hist_chg_dept_cd
  ON hrm_org_dept_hist (chg_dept_cd, chg_dept_level);

COMMENT ON TABLE hrm_org_dept_hist
  IS '부서 변경 이력 테이블';
COMMENT ON COLUMN hrm_org_dept_hist.dept_hist_key
  IS '부서이력 내부키(40byte 난수 HEX 80자리)';
COMMENT ON COLUMN hrm_org_dept_hist.reorg_key
  IS '조직개편 헤더키';
COMMENT ON COLUMN hrm_org_dept_hist.org_dept_key
  IS '원부서 내부키';
COMMENT ON COLUMN hrm_org_dept_hist.chg_dept_key
  IS '변경부서 내부키';
COMMENT ON COLUMN hrm_org_dept_hist.org_dept_cd
  IS '원부서코드';
COMMENT ON COLUMN hrm_org_dept_hist.org_dept_level
  IS '원부서레벨';
COMMENT ON COLUMN hrm_org_dept_hist.chg_dept_cd
  IS '변경부서코드';
COMMENT ON COLUMN hrm_org_dept_hist.chg_dept_level
  IS '변경부서레벨';
COMMENT ON COLUMN hrm_org_dept_hist.change_type_cd
  IS '변경구분코드';
COMMENT ON COLUMN hrm_org_dept_hist.change_note
  IS '변경 비고';
COMMENT ON COLUMN hrm_org_dept_hist.reg_user
  IS '등록자';
COMMENT ON COLUMN hrm_org_dept_hist.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN hrm_org_dept_hist.reg_ip
  IS '등록 IP';
COMMENT ON COLUMN hrm_org_dept_hist.upd_user
  IS '수정자';
COMMENT ON COLUMN hrm_org_dept_hist.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN hrm_org_dept_hist.upd_ip
  IS '수정 IP';

-- 샘플 데이터는 별도 파일 [docs/hrm_department_seed.sql]로 분리한다.
