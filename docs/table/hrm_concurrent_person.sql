-- PostgreSQL: 독립 겸임 마스터. 원본 hrm_person/users는 복제하지 않는다.
CREATE TABLE IF NOT EXISTS hrm_concurrent_person (
    concurrent_key CHAR(80) PRIMARY KEY,
    person_key CHAR(80) NOT NULL REFERENCES hrm_person(person_key),
    employee_no VARCHAR(64) NOT NULL UNIQUE,
    concurrent_number BIGINT NOT NULL CHECK (concurrent_number > 0),
    dept_cd VARCHAR(30),
    grade_code VARCHAR(7),
    position_code VARCHAR(7),
    employment_type_code VARCHAR(7),
    job_title_code VARCHAR(7),
    service_status_code VARCHAR(7),
    retire_date DATE,
    applied_assignment_key CHAR(80),
    applied_assignment_version BIGINT,
    del_yn CHAR(1) NOT NULL DEFAULT 'N' CHECK (del_yn IN ('Y','N')),
    reg_user VARCHAR(50) NOT NULL,
    reg_dtm TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reg_ip INET,
    upd_user VARCHAR(50),
    upd_dtm TIMESTAMPTZ,
    upd_ip INET,
    CONSTRAINT uq_hrm_concurrent_person_number UNIQUE(person_key,concurrent_number),
    CONSTRAINT uq_hrm_concurrent_person_identity UNIQUE(person_key,concurrent_key),
    CONSTRAINT ck_hrm_concurrent_applied_pair CHECK (
        (applied_assignment_key IS NULL AND applied_assignment_version IS NULL)
        OR (applied_assignment_key IS NOT NULL AND applied_assignment_version IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS ix_hrm_concurrent_person_person ON hrm_concurrent_person(person_key);
COMMENT ON TABLE hrm_concurrent_person IS '원본 사람에 연결된 독립 겸임 인사 마스터; 로그인 전환은 별도 후속 기능';
COMMENT ON COLUMN hrm_concurrent_person.employee_no IS '원본사번_단조증가번호, 삭제된 번호도 재사용하지 않음';
