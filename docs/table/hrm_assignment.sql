-- PostgreSQL DDL: hrm_assignment
-- 발령 테이블

DROP TABLE IF EXISTS hrm_assignment CASCADE;

CREATE TABLE hrm_assignment (
  -- Primary Key
  assignment_key CHAR(80) PRIMARY KEY NOT NULL,
  
  -- Foreign Keys
  person_key CHAR(80) NOT NULL,
  employee_no VARCHAR(30) NOT NULL,
  
  -- Assignment Info
  assignment_date DATE NOT NULL,
  assignment_type_code VARCHAR(7) NOT NULL, -- FK: com_code 105
  dept_cd VARCHAR(30), -- FK: hrm_org_dept.dept_cd
  
  -- Employment & Grade
  employment_type_code VARCHAR(7), -- FK: com_code 104
  grade_code VARCHAR(7), -- FK: com_code 102 (평신도는 NULL 가능)
  position_code VARCHAR(7), -- FK: com_code 103
  job_title_code VARCHAR(7), -- FK: com_code 106
  
  -- Assignment Details
  assignment_content TEXT,
  assignment_end_date DATE,
  concurrent_assignment_yn CHAR(1) DEFAULT 'N' CHECK (concurrent_assignment_yn IN ('Y', 'N')),
  dispatch_country_code VARCHAR(2), -- FK: sys_country_code (선교사 파견국)
  
  -- Status
  remark TEXT,
  del_yn CHAR(1) NOT NULL DEFAULT 'N' CHECK (del_yn IN ('Y', 'N')),
  
  -- Audit Fields (6 columns)
  reg_user VARCHAR(50) NOT NULL,
  reg_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  reg_user_ip VARCHAR(50),
  upd_user VARCHAR(50) NOT NULL,
  upd_dtm TIMESTAMP NOT NULL DEFAULT NOW(),
  upd_user_ip VARCHAR(50),
  
  -- Constraint: assignment_end_date must be >= assignment_date
  CONSTRAINT chk_assignment_date_range CHECK (assignment_end_date IS NULL OR assignment_end_date >= assignment_date)
);

-- Indexes
CREATE INDEX idx_hrm_assignment_person_key ON hrm_assignment(person_key);
CREATE INDEX idx_hrm_assignment_employee_no ON hrm_assignment(employee_no);
CREATE INDEX idx_hrm_assignment_assignment_date ON hrm_assignment(assignment_date);
CREATE INDEX idx_hrm_assignment_assignment_type_code ON hrm_assignment(assignment_type_code);
CREATE INDEX idx_hrm_assignment_grade_code ON hrm_assignment(grade_code);
CREATE INDEX idx_hrm_assignment_dispatch_country_code ON hrm_assignment(dispatch_country_code);
CREATE INDEX idx_hrm_assignment_del_yn ON hrm_assignment(del_yn);

-- Foreign Key Constraints
ALTER TABLE hrm_assignment
ADD CONSTRAINT fk_hrm_assignment_person_key
FOREIGN KEY (person_key) REFERENCES hrm_person(person_key) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE hrm_assignment
ADD CONSTRAINT fk_hrm_assignment_dispatch_country_code
FOREIGN KEY (dispatch_country_code) REFERENCES sys_country_code(country_code) ON DELETE SET NULL ON UPDATE CASCADE;

COMMENT ON TABLE hrm_assignment IS '발령 정보';
COMMENT ON COLUMN hrm_assignment.assignment_key IS '발령키 (80글자 HEX, UUID 형식)';
COMMENT ON COLUMN hrm_assignment.person_key IS '사람키 (FK: hrm_person)';
COMMENT ON COLUMN hrm_assignment.employee_no IS '직원번호 (FK: hrm_person)';
COMMENT ON COLUMN hrm_assignment.assignment_date IS '발령일';
COMMENT ON COLUMN hrm_assignment.assignment_type_code IS '발령종류 (FK: com_code 105: 신규임용, 면직, 파견, 연수, 휴직)';
COMMENT ON COLUMN hrm_assignment.dept_cd IS '부서코드 (FK: hrm_org_dept.dept_cd)';
COMMENT ON COLUMN hrm_assignment.employment_type_code IS '고용형태 (FK: com_code 104)';
COMMENT ON COLUMN hrm_assignment.grade_code IS '직급 (FK: com_code 102)';
COMMENT ON COLUMN hrm_assignment.position_code IS '직위 (FK: com_code 103)';
COMMENT ON COLUMN hrm_assignment.job_title_code IS '직책 (FK: com_code 106)';
COMMENT ON COLUMN hrm_assignment.dispatch_country_code IS '파견국가코드 (FK: sys_country_code, 선교사용)';
COMMENT ON COLUMN hrm_assignment.concurrent_assignment_yn IS '겸임여부';
COMMENT ON COLUMN hrm_assignment.del_yn IS '삭제여부';
