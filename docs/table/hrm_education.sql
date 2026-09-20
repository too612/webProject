-- PostgreSQL DDL: hrm_education
-- 학력 테이블

DROP TABLE IF EXISTS hrm_education CASCADE;

CREATE TABLE hrm_education (
  -- Primary Key
  education_key CHAR(80) PRIMARY KEY NOT NULL,
  
  -- Foreign Keys
  person_key CHAR(80) NOT NULL,
  employee_no VARCHAR(30) NOT NULL,
  
  -- Education Info
  school_type_code VARCHAR(7) NOT NULL, -- FK: com_code 110
  admission_date DATE,
  graduation_date DATE,
  school_name VARCHAR(200) NOT NULL,
  
  -- Education Details
  graduation_status_code VARCHAR(7), -- FK: com_code 120
  degree_code VARCHAR(7), -- FK: com_code 130
  field_code VARCHAR(7), -- FK: com_code 140
  major VARCHAR(200),
  credits_earned NUMERIC(5,2),
  credits_total NUMERIC(5,2),
  minor VARCHAR(200),
  country_code VARCHAR(2), -- FK: sys_country_code
  
  -- Final Education Flag
  is_final_education BOOLEAN DEFAULT FALSE,
  
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
CREATE INDEX idx_hrm_education_person_key ON hrm_education(person_key);
CREATE INDEX idx_hrm_education_employee_no ON hrm_education(employee_no);
CREATE INDEX idx_hrm_education_school_type_code ON hrm_education(school_type_code);
CREATE INDEX idx_hrm_education_is_final_education ON hrm_education(is_final_education);
CREATE INDEX idx_hrm_education_del_yn ON hrm_education(del_yn);

-- Foreign Key Constraints
ALTER TABLE hrm_education
ADD CONSTRAINT fk_hrm_education_person_key
FOREIGN KEY (person_key) REFERENCES hrm_person(person_key) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE hrm_education
ADD CONSTRAINT fk_hrm_education_country_code
FOREIGN KEY (country_code) REFERENCES sys_country_code(country_code) ON DELETE SET NULL ON UPDATE CASCADE;

COMMENT ON TABLE hrm_education IS '학력 정보';
COMMENT ON COLUMN hrm_education.education_key IS '학력키 (80글자 HEX, UUID 형식)';
COMMENT ON COLUMN hrm_education.person_key IS '사람키 (FK: hrm_person)';
COMMENT ON COLUMN hrm_education.employee_no IS '직원번호 (FK: hrm_person)';
COMMENT ON COLUMN hrm_education.school_type_code IS '학교구분 (FK: com_code 110)';
COMMENT ON COLUMN hrm_education.admission_date IS '입학일';
COMMENT ON COLUMN hrm_education.graduation_date IS '졸업일';
COMMENT ON COLUMN hrm_education.school_name IS '학교명';
COMMENT ON COLUMN hrm_education.graduation_status_code IS '졸업구분 (FK: com_code 120)';
COMMENT ON COLUMN hrm_education.degree_code IS '학위 (FK: com_code 130)';
COMMENT ON COLUMN hrm_education.field_code IS '계열 (FK: com_code 140)';
COMMENT ON COLUMN hrm_education.major IS '전공';
COMMENT ON COLUMN hrm_education.is_final_education IS '최종학력 여부 (1명당 1개만 Y)';
COMMENT ON COLUMN hrm_education.country_code IS '국가코드 (FK: sys_country_code)';
COMMENT ON COLUMN hrm_education.del_yn IS '삭제여부';
