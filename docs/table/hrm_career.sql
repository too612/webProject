-- PostgreSQL DDL: hrm_career
-- 경력 테이블

DROP TABLE IF EXISTS hrm_career CASCADE;

CREATE TABLE hrm_career (
  -- Primary Key
  career_key CHAR(80) PRIMARY KEY NOT NULL,
  
  -- Foreign Keys
  person_key CHAR(80) NOT NULL,
  employee_no VARCHAR(30) NOT NULL,
  
  -- Career Info
  hire_date DATE NOT NULL,
  retire_date DATE,
  company_name VARCHAR(200) NOT NULL,
  
  -- Employment Details
  employment_type_code VARCHAR(7), -- FK: com_code 104
  job_title VARCHAR(100),
  job_responsibility TEXT,
  
  -- Status
  remark TEXT,
  del_yn CHAR(1) NOT NULL DEFAULT 'N' CHECK (del_yn IN ('Y', 'N')),
  
  -- Audit Fields (6 columns)
  reg_user VARCHAR(50) NOT NULL,
  reg_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  reg_user_ip VARCHAR(50),
  upd_user VARCHAR(50) NOT NULL,
  upd_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  upd_user_ip VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_hrm_career_person_key ON hrm_career(person_key);
CREATE INDEX idx_hrm_career_employee_no ON hrm_career(employee_no);
CREATE INDEX idx_hrm_career_hire_date ON hrm_career(hire_date);
CREATE INDEX idx_hrm_career_retire_date ON hrm_career(retire_date);
CREATE INDEX idx_hrm_career_del_yn ON hrm_career(del_yn);

-- Foreign Key Constraints
ALTER TABLE hrm_career
ADD CONSTRAINT fk_hrm_career_person_key
FOREIGN KEY (person_key) REFERENCES hrm_person(person_key) ON DELETE CASCADE ON UPDATE CASCADE;

COMMENT ON TABLE hrm_career IS '경력 정보';
COMMENT ON COLUMN hrm_career.career_key IS '경력키 (80글자 HEX, UUID 형식)';
COMMENT ON COLUMN hrm_career.person_key IS '사람키 (FK: hrm_person)';
COMMENT ON COLUMN hrm_career.employee_no IS '직원번호 (FK: hrm_person)';
COMMENT ON COLUMN hrm_career.hire_date IS '채용일';
COMMENT ON COLUMN hrm_career.retire_date IS '퇴직일';
COMMENT ON COLUMN hrm_career.company_name IS '회사명 또는 기관명';
COMMENT ON COLUMN hrm_career.employment_type_code IS '고용형태 (FK: com_code 104)';
COMMENT ON COLUMN hrm_career.job_title IS '직책 또는 직위';
COMMENT ON COLUMN hrm_career.job_responsibility IS '직무 책임';
COMMENT ON COLUMN hrm_career.del_yn IS '삭제여부';
