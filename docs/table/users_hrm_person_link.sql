-- Apply after users and hrm_person have been created.
-- Keeps login accounts unlinked until an administrator assigns the matching employee number.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS employee_no VARCHAR(30);

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_employee_no
    ON users (employee_no);

-- Do not infer identity from a name or email address. Set employee_no only after
-- confirming the account-to-employee relationship through an approved process.
-- Example: UPDATE users SET employee_no = '<employee_no>' WHERE user_id = '<user_id>';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_users_hrm_person_employee_no'
          AND conrelid = 'users'::regclass
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT fk_users_hrm_person_employee_no
            FOREIGN KEY (employee_no)
            REFERENCES hrm_person (employee_no)
            ON UPDATE CASCADE
            ON DELETE SET NULL;
    END IF;
END;
$$;
