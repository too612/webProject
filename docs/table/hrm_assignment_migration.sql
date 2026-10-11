-- 비파괴 마이그레이션. 백업 및 기존 코드/조직 무결성 점검 후 운영 배포 단계에서 실행한다.
-- 선행: hrm_person, hrm_org_dept, com_code, sys_country_code, hrm_assignment 기본 DDL/seed.
-- hrm_concurrent_person.sql은 별도 선행 실행할 필요 없이 동일 정의를 여기서 생성한다.
BEGIN;
LOCK TABLE hrm_person, hrm_assignment IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE hrm_person ADD COLUMN IF NOT EXISTS job_title_code VARCHAR(7);
ALTER TABLE hrm_person ADD COLUMN IF NOT EXISTS applied_assignment_key CHAR(80);
ALTER TABLE hrm_person ADD COLUMN IF NOT EXISTS applied_assignment_version BIGINT;
ALTER TABLE hrm_person ADD COLUMN IF NOT EXISTS next_concurrent_number BIGINT NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS hrm_concurrent_person (
    concurrent_key CHAR(80) PRIMARY KEY,
    person_key CHAR(80) NOT NULL REFERENCES hrm_person(person_key),
    employee_no VARCHAR(64) NOT NULL UNIQUE,
    concurrent_number BIGINT NOT NULL CHECK (concurrent_number > 0),
    dept_cd VARCHAR(30), grade_code VARCHAR(7), position_code VARCHAR(7),
    employment_type_code VARCHAR(7), job_title_code VARCHAR(7), service_status_code VARCHAR(7),
    retire_date DATE, applied_assignment_key CHAR(80), applied_assignment_version BIGINT,
    del_yn CHAR(1) NOT NULL DEFAULT 'N' CHECK (del_yn IN ('Y','N')),
    reg_user VARCHAR(50) NOT NULL, reg_dtm TIMESTAMPTZ NOT NULL DEFAULT NOW(), reg_ip INET,
    upd_user VARCHAR(50), upd_dtm TIMESTAMPTZ, upd_ip INET,
    CONSTRAINT uq_hrm_concurrent_person_number UNIQUE(person_key,concurrent_number),
    CONSTRAINT uq_hrm_concurrent_person_identity UNIQUE(person_key,concurrent_key),
    CONSTRAINT ck_hrm_concurrent_applied_pair CHECK (
        (applied_assignment_key IS NULL AND applied_assignment_version IS NULL)
        OR (applied_assignment_key IS NOT NULL AND applied_assignment_version IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS ix_hrm_concurrent_person_person ON hrm_concurrent_person(person_key);
ALTER TABLE hrm_assignment ADD COLUMN IF NOT EXISTS concurrent_key CHAR(80);
ALTER TABLE hrm_assignment ADD COLUMN IF NOT EXISTS assignment_order INTEGER;
ALTER TABLE hrm_assignment ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE hrm_assignment ADD COLUMN IF NOT EXISTS historical_reason TEXT;
ALTER TABLE hrm_assignment ALTER COLUMN employee_no TYPE VARCHAR(64);

-- 기존 Y 행은 대상 묶음이 명시되지 않아 행마다 독립 마스터로 보존한다.
-- 기존/삭제 마스터를 모두 포함하여 번호를 전진시키고 재실행에도 같은 키를 유지한다.
UPDATE hrm_person p SET next_concurrent_number=GREATEST(p.next_concurrent_number,
    COALESCE((SELECT MAX(c.concurrent_number)+1 FROM hrm_concurrent_person c WHERE c.person_key=p.person_key),1));
WITH legacy AS (
    SELECT a.*, p.employee_no AS original_employee_no,
        p.next_concurrent_number + ROW_NUMBER() OVER (
            PARTITION BY a.person_key ORDER BY a.assignment_date,a.reg_dtm,a.assignment_key) - 1 AS suffix
    FROM hrm_assignment a JOIN hrm_person p ON p.person_key=a.person_key
    WHERE a.concurrent_assignment_yn='Y' AND a.concurrent_key IS NULL
)
INSERT INTO hrm_concurrent_person(concurrent_key,person_key,employee_no,concurrent_number,
    dept_cd,grade_code,position_code,employment_type_code,job_title_code,reg_user,upd_user,del_yn)
SELECT assignment_key,person_key,original_employee_no || '_' || suffix,suffix,
    dept_cd,grade_code,position_code,employment_type_code,job_title_code,reg_user,upd_user,del_yn
FROM legacy ON CONFLICT(concurrent_key) DO NOTHING;
UPDATE hrm_assignment a SET concurrent_key=c.concurrent_key,employee_no=c.employee_no
FROM hrm_concurrent_person c
WHERE a.assignment_key=c.concurrent_key AND a.concurrent_assignment_yn='Y' AND a.concurrent_key IS NULL;
UPDATE hrm_person p SET next_concurrent_number=GREATEST(p.next_concurrent_number,
    COALESCE((SELECT MAX(c.concurrent_number)+1 FROM hrm_concurrent_person c WHERE c.person_key=p.person_key),1));

-- 초기 순서는 날짜/등록시각/키로 안정적으로 정한다. 이미 부여된 순서는 바꾸지 않는다.
WITH ranked AS (
    SELECT assignment_key, ROW_NUMBER() OVER (
        PARTITION BY person_key,concurrent_key,assignment_date ORDER BY reg_dtm,assignment_key) AS ordinal
    FROM hrm_assignment
)
UPDATE hrm_assignment a SET assignment_order=r.ordinal
FROM ranked r WHERE a.assignment_key=r.assignment_key AND a.assignment_order IS NULL;
-- 테스트 seed의 누락 직급만 복구한다. 102-050은 반드시 seed에서 유효한 직급이어야 한다.
UPDATE hrm_assignment a SET grade_code=COALESCE(a.grade_code,NULLIF(p.grade_code,''),'102-050'),
    dept_cd=COALESCE(a.dept_cd,p.dept_cd)
FROM hrm_person p WHERE a.person_key=p.person_key AND (a.grade_code IS NULL OR a.dept_cd IS NULL);
ALTER TABLE hrm_assignment ALTER COLUMN assignment_order SET DEFAULT 1;
ALTER TABLE hrm_assignment ALTER COLUMN assignment_order SET NOT NULL;
ALTER TABLE hrm_assignment ALTER COLUMN dept_cd SET NOT NULL;
ALTER TABLE hrm_assignment ALTER COLUMN grade_code SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_assignment_main_order
    ON hrm_assignment(person_key,assignment_date,assignment_order) WHERE del_yn='N' AND concurrent_key IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_assignment_concurrent_order
    ON hrm_assignment(concurrent_key,assignment_date,assignment_order) WHERE del_yn='N' AND concurrent_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_hrm_assignment_due ON hrm_assignment(person_key,concurrent_key,assignment_date DESC,assignment_order DESC) WHERE del_yn='N';
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='hrm_assignment'::regclass AND conname='ck_hrm_assignment_order') THEN
        ALTER TABLE hrm_assignment ADD CONSTRAINT ck_hrm_assignment_order CHECK (assignment_order > 0);
        ALTER TABLE hrm_assignment ADD CONSTRAINT ck_hrm_assignment_version CHECK (version >= 0);
        ALTER TABLE hrm_assignment ADD CONSTRAINT ck_hrm_assignment_scope CHECK (
            (concurrent_assignment_yn='N' AND concurrent_key IS NULL)
            OR (concurrent_assignment_yn='Y' AND concurrent_key IS NOT NULL));
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_concurrent
            FOREIGN KEY(person_key,concurrent_key) REFERENCES hrm_concurrent_person(person_key,concurrent_key);
        -- hrm_org_dept는 조직개편별 스냅샷이므로 dept_cd 단일 컬럼은 FK 대상이 아니다.
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_grade FOREIGN KEY(grade_code) REFERENCES com_code(code);
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_type FOREIGN KEY(assignment_type_code) REFERENCES com_code(code);
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_position FOREIGN KEY(position_code) REFERENCES com_code(code);
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_employment FOREIGN KEY(employment_type_code) REFERENCES com_code(code);
        ALTER TABLE hrm_assignment ADD CONSTRAINT fk_hrm_assignment_job FOREIGN KEY(job_title_code) REFERENCES com_code(code);
    END IF;
END $$;
COMMENT ON COLUMN hrm_assignment.assignment_order IS '동일 대상/발령일 양수 순서; 도래일 DESC, 순서 DESC 최신 한 건만 적용';
COMMENT ON COLUMN hrm_assignment.assignment_end_date IS '설명용 종료일; 적용 제외나 원복 조건으로 사용하지 않음';
COMMENT ON COLUMN hrm_person.applied_assignment_key IS '마지막 적용 발령키, 적용 버전과 함께 중복/오래된 이력 재적용 방지';
COMMIT;
