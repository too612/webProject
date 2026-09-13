-- =====================================================================
-- 교회 행사달력 (CAL) 도메인 DDL - PostgreSQL
--
-- 명명규칙 (docs/hrm_person.sql, docs/hrm_department.sql, docs/com_code.sql 과 동일)
--   테이블명   : {구분}_{내용}   예) cal_event
--   PK 컬럼명  : {내용}_key  CHAR(80)  (40byte 난수 HEX, DB 기본값으로 자동 채번)
--   코드 컬럼  : {의미}_cd   VARCHAR
--   Y/N 컬럼   : {의미}_yn   CHAR(1), 'Y'/'N'
--   일시 컬럼  : {의미}_dtm  TIMESTAMPTZ
--
-- 공통 감사컬럼 (hrm_person.sql 의 감사필드 규격과 동일)
--   reg_user  VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM'
--   reg_dtm   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
--   reg_ip    INET
--   upd_user  VARCHAR(50)
--   upd_dtm   TIMESTAMPTZ
--   upd_ip    INET
--
-- 구분값(주일학교/청년부/장년부/교회)은 com_code(공통코드)로 관리한다.
--   - 부모코드 401 = 행사구분
--   - 각 구분값의 표시 색상은 com_code.extra1 에 저장 (예: sky/green/orange/indigo)
--   - 구분값은 현재 구현 목적의 임의값이며, com_code 에 행만 추가/변경하면
--     화면(필터/다이얼로그)에 자동 반영된다.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- 1. cal_event : 교회 행사 일정 마스터
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cal_event (
    event_key      CHAR(80) PRIMARY KEY
                   DEFAULT encode(gen_random_bytes(40), 'hex'),

    category_cd    VARCHAR(30) NOT NULL,                 -- 구분값 (com_code.code, parent_code=401)
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    start_dtm      TIMESTAMPTZ NOT NULL,
    end_dtm        TIMESTAMPTZ NOT NULL,
    all_day_yn     CHAR(1) NOT NULL DEFAULT 'N',
    location_nm    VARCHAR(200),
    color_cd       VARCHAR(20) NOT NULL DEFAULT 'indigo', -- 구분값에서 파생된 표시 색상(스냅샷)
    use_yn         CHAR(1) NOT NULL DEFAULT 'Y',

    reg_user       VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    reg_dtm        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reg_ip         INET,
    upd_user       VARCHAR(50),
    upd_dtm        TIMESTAMPTZ,
    upd_ip         INET,

    CONSTRAINT ck_cal_event_key_hex
        CHECK (event_key ~ '^[0-9a-f]{80}$'),
    CONSTRAINT ck_cal_event_all_day_yn
        CHECK (all_day_yn IN ('Y', 'N')),
    CONSTRAINT ck_cal_event_use_yn
        CHECK (use_yn IN ('Y', 'N')),
    CONSTRAINT ck_cal_event_time_range
        CHECK (end_dtm >= start_dtm)
);

COMMENT ON TABLE cal_event IS '교회 행사 일정 마스터';
COMMENT ON COLUMN cal_event.event_key IS '일정 내부키(40byte 난수 HEX 80자리)';
COMMENT ON COLUMN cal_event.category_cd IS '행사 구분값(com_code.code, parent_code=401)';
COMMENT ON COLUMN cal_event.title IS '행사 제목';
COMMENT ON COLUMN cal_event.description IS '행사 내용';
COMMENT ON COLUMN cal_event.start_dtm IS '시작 일시';
COMMENT ON COLUMN cal_event.end_dtm IS '종료 일시';
COMMENT ON COLUMN cal_event.all_day_yn IS '종일 여부(Y/N)';
COMMENT ON COLUMN cal_event.location_nm IS '장소';
COMMENT ON COLUMN cal_event.color_cd IS '표시 색상(구분값의 색상을 저장한 스냅샷)';
COMMENT ON COLUMN cal_event.use_yn IS '사용 여부(Y/N, 소프트 삭제)';
COMMENT ON COLUMN cal_event.reg_user IS '등록자';
COMMENT ON COLUMN cal_event.reg_dtm IS '등록일시';
COMMENT ON COLUMN cal_event.reg_ip IS '등록 IP';
COMMENT ON COLUMN cal_event.upd_user IS '수정자';
COMMENT ON COLUMN cal_event.upd_dtm IS '수정일시';
COMMENT ON COLUMN cal_event.upd_ip IS '수정 IP';

CREATE INDEX IF NOT EXISTS ix_cal_event_time_range
    ON cal_event (start_dtm, end_dtm) WHERE use_yn = 'Y';
CREATE INDEX IF NOT EXISTS ix_cal_event_category_cd
    ON cal_event (category_cd) WHERE use_yn = 'Y';
CREATE INDEX IF NOT EXISTS ix_cal_event_reg_dtm
    ON cal_event (reg_dtm DESC);

-- ---------------------------------------------------------------------
-- 2. 구분값(행사구분) 샘플 시드 - com_code 사용
--    ※ 실제 데이터는 docs/com_code_seed.sql 과 동일한 방식으로 관리한다.
-- ---------------------------------------------------------------------
INSERT INTO com_code (
    code, code_name, parent_code, category_code, extra1, remark, use_yn, sort_order,
    reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip
) VALUES
    ('010-400', '행사관리', '010', '400', NULL, '행사달력 구분 상위코드', 'Y', 40, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'),
    ('401',     '행사구분', '010-400', '400', NULL, '교회 행사 구분값 그룹', 'Y', 10, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'),
    ('401-010', '주일학교', '401', '400', 'sky',    '주일학교 행사', 'Y', 10, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'),
    ('401-020', '청년부',   '401', '400', 'green',  '청년부 행사',   'Y', 20, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'),
    ('401-030', '장년부',   '401', '400', 'orange', '장년부 행사',   'Y', 30, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'),
    ('401-040', '교회',     '401', '400', 'indigo', '교회 공통 행사', 'Y', 40, 'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1')
ON CONFLICT (code) DO NOTHING;
