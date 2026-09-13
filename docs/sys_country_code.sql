-- PostgreSQL DDL: sys_country_code
-- 국가코드 마스터 테이블
-- ISO 3166-1 alpha-2 format

DROP TABLE IF EXISTS sys_country_code CASCADE;

CREATE TABLE sys_country_code (
  -- Primary Key
  country_code VARCHAR(2) PRIMARY KEY NOT NULL,
  
  -- Country Info
  country_name_ko VARCHAR(100) NOT NULL,
  country_name_en VARCHAR(100) NOT NULL,
  flag_emoji CHAR(2) NOT NULL,
  region_code VARCHAR(20),
  
  -- Status
  use_yn CHAR(1) NOT NULL DEFAULT 'Y' CHECK (use_yn IN ('Y', 'N')),
  sort_order INT NOT NULL DEFAULT 0,
  
  -- Audit Fields (6 columns)
  reg_user VARCHAR(50) NOT NULL,
  reg_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  reg_user_ip VARCHAR(50),
  upd_user VARCHAR(50) NOT NULL,
  upd_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  upd_user_ip VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_sys_country_code_region_code ON sys_country_code(region_code);
CREATE INDEX idx_sys_country_code_use_yn ON sys_country_code(use_yn);
CREATE INDEX idx_sys_country_code_reg_dtm ON sys_country_code(reg_dtm);

COMMENT ON TABLE sys_country_code IS '국가코드 마스터 (ISO 3166-1 alpha-2)';
COMMENT ON COLUMN sys_country_code.country_code IS '국가코드 (ISO 3166-1 alpha-2, 예: KR, US, JP)';
COMMENT ON COLUMN sys_country_code.country_name_ko IS '국가명(한글)';
COMMENT ON COLUMN sys_country_code.country_name_en IS '국가명(영문)';
COMMENT ON COLUMN sys_country_code.flag_emoji IS '국기 이모지 (2글자, 예: 🇰🇷)';
COMMENT ON COLUMN sys_country_code.region_code IS '지역코드 (ASIA, AMERICA, EUROPE, AFRICA, OCEANIA, MIDDLE_EAST)';
COMMENT ON COLUMN sys_country_code.use_yn IS '사용여부 (Y/N)';
COMMENT ON COLUMN sys_country_code.sort_order IS '정렬순서';
