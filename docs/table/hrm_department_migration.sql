-- 기존 조직 테이블을 조직개편별 스냅샷 구조로 전환하는 비파괴 마이그레이션.
-- 적용 후 동일한 dept_cd/dept_sys_cd를 서로 다른 reorg_key에서 재사용할 수 있다.
BEGIN;

LOCK TABLE hrm_org_reorg, hrm_org_dept IN SHARE ROW EXCLUSIVE MODE;

ALTER TABLE hrm_org_dept
    ADD COLUMN IF NOT EXISTS sort_order INTEGER;

WITH ranked AS (
    SELECT dept_key,
           ROW_NUMBER() OVER (
               PARTITION BY reorg_key, parent_dept_key
               ORDER BY dept_cd, dept_key
           )::INTEGER AS sort_order
    FROM hrm_org_dept
)
UPDATE hrm_org_dept department
SET sort_order = ranked.sort_order
FROM ranked
WHERE ranked.dept_key = department.dept_key
  AND department.sort_order IS NULL;

ALTER TABLE hrm_org_dept
    ALTER COLUMN sort_order SET DEFAULT 1,
    ALTER COLUMN sort_order SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ck_hrm_org_dept_sort_order'
          AND conrelid = 'hrm_org_dept'::regclass
    ) THEN
        ALTER TABLE hrm_org_dept
            ADD CONSTRAINT ck_hrm_org_dept_sort_order CHECK (sort_order > 0);
    END IF;
END
$$;

-- dept_cd가 더 이상 전역 유일키가 아니므로 해당 단일 컬럼을 참조하는 FK를 제거한다.
-- 현재 업무 테이블의 dept_cd는 논리 부서코드이며, 적용 조직은 reorg_dt/conf_yn/use_yn으로 판별한다.
DO $$
DECLARE
    dependency RECORD;
BEGIN
    FOR dependency IN
        SELECT constraint_row.conrelid::regclass AS relation_name,
               constraint_row.conname
        FROM pg_constraint constraint_row
        JOIN pg_attribute target_column
          ON target_column.attrelid = constraint_row.confrelid
         AND target_column.attnum = ANY (constraint_row.confkey)
        WHERE constraint_row.contype = 'f'
          AND constraint_row.confrelid = 'hrm_org_dept'::regclass
          AND target_column.attname = 'dept_cd'
    LOOP
        EXECUTE format(
            'ALTER TABLE %s DROP CONSTRAINT %I',
            dependency.relation_name,
            dependency.conname
        );
    END LOOP;
END
$$;

DROP INDEX IF EXISTS uq_hrm_org_reorg_active;

DROP INDEX IF EXISTS uq_hrm_org_dept_dept_cd;
CREATE UNIQUE INDEX uq_hrm_org_dept_dept_cd
    ON hrm_org_dept (reorg_key, dept_cd);

DROP INDEX IF EXISTS uq_hrm_org_dept_dept_sys_cd;
CREATE UNIQUE INDEX uq_hrm_org_dept_dept_sys_cd
    ON hrm_org_dept (reorg_key, dept_sys_cd);

CREATE INDEX IF NOT EXISTS ix_hrm_org_dept_sibling_order
    ON hrm_org_dept (reorg_key, parent_dept_key, sort_order, dept_cd);

CREATE INDEX IF NOT EXISTS ix_hrm_org_reorg_active_date
    ON hrm_org_reorg (reorg_dt DESC)
    WHERE conf_yn = 'Y' AND use_yn = 'Y';

COMMIT;
