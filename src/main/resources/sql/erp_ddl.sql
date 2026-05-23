-- ============================================================
-- ERP 모듈 DDL (PostgreSQL)
-- 작성일: 2026-05-20
-- ============================================================

-- ── 성도관리 (humen) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_district (
    district_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    district_name VARCHAR(100) NOT NULL,
    leader_name   VARCHAR(50),
    description   VARCHAR(500),
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_district PRIMARY KEY (district_id)
);

CREATE TABLE IF NOT EXISTS erp_member (
    member_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    name         VARCHAR(50)  NOT NULL,
    gender       VARCHAR(10),
    birth_date   DATE,
    phone        VARCHAR(20),
    email        VARCHAR(100),
    address      VARCHAR(300),
    district_id  VARCHAR(36),
    join_date    DATE,
    member_type  VARCHAR(20)  NOT NULL DEFAULT 'REGULAR',  -- REGULAR, NEWCOMER, INACTIVE
    status       VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_member PRIMARY KEY (member_id),
    CONSTRAINT fk_erp_member_district FOREIGN KEY (district_id) REFERENCES erp_district(district_id)
);

CREATE TABLE IF NOT EXISTS erp_member_change (
    change_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    member_id    VARCHAR(36)  NOT NULL,
    change_type  VARCHAR(30)  NOT NULL,  -- JOIN, TRANSFER_IN, TRANSFER_OUT, INACTIVE, RESTORE
    change_date  DATE         NOT NULL,
    prev_status  VARCHAR(20),
    new_status   VARCHAR(20),
    reason       VARCHAR(500),
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_member_change PRIMARY KEY (change_id)
);

-- ── 예배관리 (sermon) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_worship (
    worship_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title        VARCHAR(200) NOT NULL,
    preacher     VARCHAR(50),
    scripture    VARCHAR(200),
    worship_date DATE         NOT NULL,
    worship_type VARCHAR(30)  NOT NULL DEFAULT 'SUNDAY',  -- SUNDAY, WEDNESDAY, SPECIAL
    video_url    VARCHAR(500),
    description  TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_worship PRIMARY KEY (worship_id)
);

CREATE TABLE IF NOT EXISTS erp_worship_order (
    order_id     VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    worship_id   VARCHAR(36)  NOT NULL,
    order_seq    INTEGER      NOT NULL DEFAULT 0,
    role_name    VARCHAR(100) NOT NULL,
    participant  VARCHAR(100),
    CONSTRAINT pk_erp_worship_order PRIMARY KEY (order_id),
    CONSTRAINT fk_erp_worship_order_worship FOREIGN KEY (worship_id) REFERENCES erp_worship(worship_id)
);

CREATE TABLE IF NOT EXISTS erp_attendance (
    attendance_id VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    worship_id    VARCHAR(36),
    member_id     VARCHAR(36),
    member_name   VARCHAR(50),
    attend_date   DATE        NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'PRESENT',  -- PRESENT, ABSENT, LATE
    CONSTRAINT pk_erp_attendance PRIMARY KEY (attendance_id)
);

-- ── 재정관리 (account) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_offering (
    offering_id   VARCHAR(36)   NOT NULL DEFAULT gen_random_uuid()::text,
    member_id     VARCHAR(36),
    member_name   VARCHAR(50),
    amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
    offering_type VARCHAR(30)   NOT NULL DEFAULT 'TITHE',  -- TITHE, SPECIAL, BUILDING, MISSION
    offering_date DATE          NOT NULL,
    description   VARCHAR(500),
    input_by      VARCHAR(50),
    reg_date      TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_offering PRIMARY KEY (offering_id)
);

CREATE TABLE IF NOT EXISTS erp_budget (
    budget_id      VARCHAR(36)   NOT NULL DEFAULT gen_random_uuid()::text,
    budget_year    INTEGER       NOT NULL,
    category       VARCHAR(100)  NOT NULL,
    planned_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    description    VARCHAR(500),
    status         VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT pk_erp_budget PRIMARY KEY (budget_id)
);

CREATE TABLE IF NOT EXISTS erp_expense (
    expense_id   VARCHAR(36)   NOT NULL DEFAULT gen_random_uuid()::text,
    expense_date DATE          NOT NULL,
    category     VARCHAR(100)  NOT NULL,
    amount       NUMERIC(15,2) NOT NULL DEFAULT 0,
    description  VARCHAR(500),
    approved_by  VARCHAR(50),
    reg_date     TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_expense PRIMARY KEY (expense_id)
);

-- ── 교육관리 (training) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_course (
    course_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    course_name  VARCHAR(200) NOT NULL,
    instructor   VARCHAR(100),
    start_date   DATE,
    end_date     DATE,
    description  TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_course PRIMARY KEY (course_id)
);

CREATE TABLE IF NOT EXISTS erp_training_student (
    student_id       VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    course_id        VARCHAR(36) NOT NULL,
    member_id        VARCHAR(36),
    member_name      VARCHAR(50),
    enroll_date      DATE,
    completion_date  DATE,
    status           VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',  -- ENROLLED, COMPLETE, DROP
    CONSTRAINT pk_erp_training_student PRIMARY KEY (student_id),
    CONSTRAINT fk_erp_training_student_course FOREIGN KEY (course_id) REFERENCES erp_course(course_id)
);

CREATE TABLE IF NOT EXISTS erp_training_attendance (
    ta_id        VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    course_id    VARCHAR(36) NOT NULL,
    member_id    VARCHAR(36),
    member_name  VARCHAR(50),
    attend_date  DATE        NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    CONSTRAINT pk_erp_training_attendance PRIMARY KEY (ta_id)
);

-- ── 사역관리 (ministry) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_ministry_dept (
    dept_id     VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    dept_name   VARCHAR(100) NOT NULL,
    leader_name VARCHAR(50),
    parent_id   VARCHAR(36),
    description VARCHAR(500),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date    TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_ministry_dept PRIMARY KEY (dept_id)
);

CREATE TABLE IF NOT EXISTS erp_ministry_schedule (
    schedule_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    dept_id       VARCHAR(36),
    dept_name     VARCHAR(100),
    title         VARCHAR(200) NOT NULL,
    schedule_date DATE         NOT NULL,
    description   VARCHAR(500),
    status        VARCHAR(20)  NOT NULL DEFAULT 'SCHEDULED',
    reg_date      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_ministry_schedule PRIMARY KEY (schedule_id)
);

CREATE TABLE IF NOT EXISTS erp_ministry_volunteer (
    volunteer_id VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    member_id    VARCHAR(36),
    member_name  VARCHAR(50),
    dept_id      VARCHAR(36),
    dept_name    VARCHAR(100),
    role         VARCHAR(100),
    start_date   DATE,
    end_date     DATE,
    status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT pk_erp_ministry_volunteer PRIMARY KEY (volunteer_id)
);

CREATE TABLE IF NOT EXISTS erp_ministry_report (
    report_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    dept_id      VARCHAR(36),
    dept_name    VARCHAR(100),
    title        VARCHAR(200) NOT NULL,
    report_date  DATE         NOT NULL,
    content      TEXT,
    author_name  VARCHAR(50),
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_ministry_report PRIMARY KEY (report_id)
);

-- ── 행사관리 (event) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_event (
    event_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title      VARCHAR(200) NOT NULL,
    event_date DATE         NOT NULL,
    end_date   DATE,
    location   VARCHAR(200),
    description TEXT,
    capacity   INTEGER      DEFAULT 0,
    organizer  VARCHAR(100),
    status     VARCHAR(20)  NOT NULL DEFAULT 'SCHEDULED',  -- SCHEDULED, ONGOING, COMPLETE, CANCEL
    reg_date   TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_event PRIMARY KEY (event_id)
);

CREATE TABLE IF NOT EXISTS erp_event_apply (
    apply_id    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    event_id    VARCHAR(36) NOT NULL,
    event_title VARCHAR(200),
    member_id   VARCHAR(36),
    member_name VARCHAR(50),
    apply_date  TIMESTAMP   NOT NULL DEFAULT now(),
    status      VARCHAR(20) NOT NULL DEFAULT 'APPLIED',  -- APPLIED, CONFIRM, CANCEL
    CONSTRAINT pk_erp_event_apply PRIMARY KEY (apply_id),
    CONSTRAINT fk_erp_event_apply_event FOREIGN KEY (event_id) REFERENCES erp_event(event_id)
);

-- ── 시설관리 (facility) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_reservation (
    reservation_id VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    facility_name  VARCHAR(100) NOT NULL,
    reserver_name  VARCHAR(50),
    reservation_date DATE        NOT NULL,
    start_time     VARCHAR(10),
    end_time       VARCHAR(10),
    purpose        VARCHAR(300),
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING, CONFIRM, CANCEL
    reg_date       TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_reservation PRIMARY KEY (reservation_id)
);

CREATE TABLE IF NOT EXISTS erp_vehicle (
    vehicle_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    vehicle_name VARCHAR(100) NOT NULL,
    plate_number VARCHAR(20),
    driver       VARCHAR(50),
    capacity     INTEGER,
    status       VARCHAR(20)  NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE, IN_USE, REPAIR
    CONSTRAINT pk_erp_vehicle PRIMARY KEY (vehicle_id)
);

CREATE TABLE IF NOT EXISTS erp_inventory (
    inventory_id VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    item_name    VARCHAR(200) NOT NULL,
    category     VARCHAR(100),
    quantity     INTEGER      NOT NULL DEFAULT 0,
    unit         VARCHAR(20),
    location     VARCHAR(100),
    status       VARCHAR(20)  NOT NULL DEFAULT 'NORMAL',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_inventory PRIMARY KEY (inventory_id)
);

CREATE TABLE IF NOT EXISTS erp_maintenance (
    maintenance_id VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    facility_name  VARCHAR(100),
    title          VARCHAR(200) NOT NULL,
    maintenance_date DATE        NOT NULL,
    description    TEXT,
    cost           NUMERIC(15,2),
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETE
    reg_date       TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_maintenance PRIMARY KEY (maintenance_id)
);

-- ── 소통관리 (comm) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_notice (
    notice_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title        VARCHAR(200) NOT NULL,
    content      TEXT,
    author_name  VARCHAR(50),
    publish_date DATE         NOT NULL DEFAULT CURRENT_DATE,
    category     VARCHAR(50),
    status       VARCHAR(20)  NOT NULL DEFAULT 'PUBLISHED',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_notice PRIMARY KEY (notice_id)
);

CREATE TABLE IF NOT EXISTS erp_message (
    message_id   VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    sender_name  VARCHAR(50),
    receiver_name VARCHAR(50),
    title        VARCHAR(200) NOT NULL,
    content      TEXT,
    send_date    TIMESTAMP    NOT NULL DEFAULT now(),
    read_date    TIMESTAMP,
    status       VARCHAR(20)  NOT NULL DEFAULT 'UNREAD',
    CONSTRAINT pk_erp_message PRIMARY KEY (message_id)
);

CREATE TABLE IF NOT EXISTS erp_prayer (
    prayer_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    member_name  VARCHAR(50),
    title        VARCHAR(200) NOT NULL,
    content      TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_prayer PRIMARY KEY (prayer_id)
);

CREATE TABLE IF NOT EXISTS erp_newsletter (
    newsletter_id VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title         VARCHAR(200) NOT NULL,
    content       TEXT,
    author_name   VARCHAR(50),
    publish_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    reg_date      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_newsletter PRIMARY KEY (newsletter_id)
);

-- ── 행정관리 (admin) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS erp_certificate (
    certificate_id VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    member_name    VARCHAR(50),
    cert_type      VARCHAR(50)  NOT NULL,  -- MEMBERSHIP, BAPTISM, SERVICE
    issue_date     DATE         NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ISSUED',
    req_date       TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_certificate PRIMARY KEY (certificate_id)
);

CREATE TABLE IF NOT EXISTS erp_approval (
    approval_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title          VARCHAR(200) NOT NULL,
    requester_name VARCHAR(50),
    submit_date    TIMESTAMP    NOT NULL DEFAULT now(),
    approver_name  VARCHAR(50),
    approve_date   TIMESTAMP,
    status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, REJECTED
    CONSTRAINT pk_erp_approval PRIMARY KEY (approval_id)
);

CREATE TABLE IF NOT EXISTS erp_minutes (
    minutes_id    VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title         VARCHAR(200) NOT NULL,
    meeting_date  DATE         NOT NULL,
    participants  VARCHAR(500),
    content       TEXT,
    author_name   VARCHAR(50),
    reg_date      TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_minutes PRIMARY KEY (minutes_id)
);

CREATE TABLE IF NOT EXISTS erp_archive (
    archive_id  VARCHAR(36)  NOT NULL DEFAULT gen_random_uuid()::text,
    title       VARCHAR(200) NOT NULL,
    doc_type    VARCHAR(50),
    file_path   VARCHAR(500),
    reg_by      VARCHAR(50),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    reg_date    TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT pk_erp_archive PRIMARY KEY (archive_id)
);
