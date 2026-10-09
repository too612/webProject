-- Run AFTER sys_country_code.sql and sys_country_code_seed.sql if existing
-- hrm tables were retained. DROP CASCADE removes their country foreign keys.
-- Missing referenced countries fail validation; no HR data is deleted.
BEGIN;

DO $$
BEGIN
  IF to_regclass('hrm_assignment') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = to_regclass('hrm_assignment')
      AND conname = 'fk_hrm_assignment_dispatch_country_code'
  ) THEN
    ALTER TABLE hrm_assignment
      ADD CONSTRAINT fk_hrm_assignment_dispatch_country_code
      FOREIGN KEY (dispatch_country_code) REFERENCES sys_country_code(country_code)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF to_regclass('hrm_education') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = to_regclass('hrm_education')
      AND conname = 'fk_hrm_education_country_code'
  ) THEN
    ALTER TABLE hrm_education
      ADD CONSTRAINT fk_hrm_education_country_code
      FOREIGN KEY (country_code) REFERENCES sys_country_code(country_code)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
