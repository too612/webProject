-- PostgreSQL DDL: hrm_person master table (restructured)
-- 내부 식별키는 40byte 난수(HEX 80자리) 기반으로 사용하고,
-- 사용자 노출/업무 처리는 employee_no(사번)로 분리한다.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS hrm_person (
  person_key              CHAR(80) PRIMARY KEY
                          DEFAULT encode(gen_random_bytes(40), 'hex'),

  -- 사용자/업무용 식별자
  employee_no             VARCHAR(30) NOT NULL,
  name_ko                 VARCHAR(100) NOT NULL,

  -- 이름 확장
  name_en                 VARCHAR(100),
  name_hanja              VARCHAR(100),

  -- 인사 구분 체계
  dept_cd                VARCHAR(30),
  grade_code              VARCHAR(30),
  position_code           VARCHAR(30),
  employment_type_code    VARCHAR(30),
  service_status_code     VARCHAR(30),

  -- 민감정보(평문 저장 금지)
  rrn_ciphertext          BYTEA,
  rrn_hash_sha256         CHAR(64),

  -- 주소
  postal_code             VARCHAR(10),
  address_line1           VARCHAR(255),
  address_line2           VARCHAR(255),

  -- 기본 인적정보
  birth_date              DATE,
  gender_code             CHAR(1),

  -- 인사 이벤트
  hire_date               DATE,
  retire_date             DATE,
  promotion_date          DATE,

  -- 이미지
  photo_url               TEXT,
  profile_photo_url       TEXT,

  -- 감사필드
  reg_user                VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  reg_dtm                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reg_ip                  INET,
  upd_user                VARCHAR(50),
  upd_dtm                 TIMESTAMPTZ,
  upd_ip                  INET,

  -- AI 확장
  ai_profile              JSONB NOT NULL DEFAULT '{}'::JSONB,
  extra_attributes        JSONB NOT NULL DEFAULT '{}'::JSONB,

  CONSTRAINT ck_person_key_hex
    CHECK (person_key ~ '^[0-9a-f]{80}$'),
  CONSTRAINT ck_gender_code
    CHECK (gender_code IS NULL OR gender_code IN ('M', 'F', 'O', 'U')),
  CONSTRAINT ck_retire_date
    CHECK (retire_date IS NULL OR hire_date IS NULL OR retire_date >= hire_date),
  CONSTRAINT ck_promotion_date
    CHECK (promotion_date IS NULL OR hire_date IS NULL OR promotion_date >= hire_date)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_person_employee_no
  ON hrm_person (employee_no);

CREATE INDEX IF NOT EXISTS ix_hrm_person_dept_cd
  ON hrm_person (dept_cd);

CREATE INDEX IF NOT EXISTS ix_hrm_person_name_ko
  ON hrm_person (name_ko);

CREATE INDEX IF NOT EXISTS ix_hrm_person_hire_date
  ON hrm_person (hire_date);

CREATE INDEX IF NOT EXISTS ix_hrm_person_birth_date
  ON hrm_person (birth_date);

CREATE INDEX IF NOT EXISTS ix_hrm_person_reg_dtm
  ON hrm_person (reg_dtm DESC);

CREATE INDEX IF NOT EXISTS ix_hrm_person_ai_profile_gin
  ON hrm_person USING GIN (ai_profile);

CREATE INDEX IF NOT EXISTS ix_hrm_person_extra_attributes_gin
  ON hrm_person USING GIN (extra_attributes);

CREATE INDEX IF NOT EXISTS ix_hrm_person_name_ko_trgm
  ON hrm_person USING GIN (name_ko gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ix_hrm_person_name_en_trgm
  ON hrm_person USING GIN (name_en gin_trgm_ops);

COMMENT ON TABLE hrm_person
  IS '인사 기본 테이블 (내부키: 40byte 난수, 노출키: 사번 분리)';

COMMENT ON COLUMN hrm_person.person_key
  IS '내부 시스템 식별키(40byte 난수의 HEX 80자리)';
COMMENT ON COLUMN hrm_person.employee_no
  IS '사번 (사용자 노출/업무용 식별자)';
COMMENT ON COLUMN hrm_person.dept_cd
  IS '부서코드';
COMMENT ON COLUMN hrm_person.name_ko
  IS '이름(한글, 필수)';
COMMENT ON COLUMN hrm_person.name_en
  IS '영문 이름';
COMMENT ON COLUMN hrm_person.name_hanja
  IS '한문 이름';
COMMENT ON COLUMN hrm_person.grade_code
  IS '직급 코드(공통코드 102-xxx 참조)';
COMMENT ON COLUMN hrm_person.position_code
  IS '직위 코드(공통코드 103-xxx 참조)';
COMMENT ON COLUMN hrm_person.employment_type_code
  IS '고용형태 코드(공통코드 104-xxx 참조)';
COMMENT ON COLUMN hrm_person.service_status_code
  IS '재직구분 코드(공통코드 101-xxx 참조)';
COMMENT ON COLUMN hrm_person.rrn_ciphertext
  IS '주민등록번호 암호문 (평문 저장 금지)';
COMMENT ON COLUMN hrm_person.rrn_hash_sha256
  IS '주민등록번호 SHA-256 해시 (중복검사/탐색용)';
COMMENT ON COLUMN hrm_person.postal_code
  IS '우편번호';
COMMENT ON COLUMN hrm_person.address_line1
  IS '주소1';
COMMENT ON COLUMN hrm_person.address_line2
  IS '주소2(상세주소)';
COMMENT ON COLUMN hrm_person.birth_date
  IS '생년월일';
COMMENT ON COLUMN hrm_person.gender_code
  IS '성별 코드(M/F/O/U)';
COMMENT ON COLUMN hrm_person.hire_date
  IS '입사일자';
COMMENT ON COLUMN hrm_person.retire_date
  IS '퇴사일자';
COMMENT ON COLUMN hrm_person.promotion_date
  IS '최근 승진일자';
COMMENT ON COLUMN hrm_person.photo_url
  IS '원본 사진 경로 또는 URL';
COMMENT ON COLUMN hrm_person.profile_photo_url
  IS '프로필사진 경로 또는 URL';
COMMENT ON COLUMN hrm_person.reg_user
  IS '등록자';
COMMENT ON COLUMN hrm_person.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN hrm_person.reg_ip
  IS '등록 IP';
COMMENT ON COLUMN hrm_person.upd_user
  IS '수정자';
COMMENT ON COLUMN hrm_person.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN hrm_person.upd_ip
  IS '수정 IP';
COMMENT ON COLUMN hrm_person.ai_profile
  IS 'AI 활용용 요약/태그/점수';
COMMENT ON COLUMN hrm_person.extra_attributes
  IS '확장 속성(JSONB)';

-- 샘플 데이터는 별도 파일 [docs/hrm_person_seed.sql]로 분리한다.
