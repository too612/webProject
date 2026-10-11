-- PostgreSQL DDL: sys_scheduler (DB 기반 스케줄러)
-- 실행 가능한 작업은 애플리케이션에 SchedulerJob 빈으로 등록된 job_code만 허용한다(리플렉션 실행 금지).
-- DB는 cron/zone/사용 여부/일시중지/실행 이력/동시 실행 잠금(lease)을 관리한다.

-- 스케줄 작업 정의
CREATE TABLE IF NOT EXISTS sys_scheduler_job (
  job_code              VARCHAR(50)   PRIMARY KEY,
  job_name              VARCHAR(100)  NOT NULL,
  description           VARCHAR(500),
  cron_expression       VARCHAR(100)  NOT NULL,              -- Spring 6필드 cron (초 분 시 일 월 요일)
  zone_id               VARCHAR(50)   NOT NULL DEFAULT 'Asia/Seoul',
  business_code         VARCHAR(50),                        -- 업무 보류(sys_scheduler_business_hold) 연결 코드
  is_enabled            BOOLEAN       NOT NULL DEFAULT FALSE,
  run_on_startup        BOOLEAN       NOT NULL DEFAULT FALSE,   -- 기동 시 1회 실행
  catchup_enabled       BOOLEAN       NOT NULL DEFAULT FALSE,   -- 기동 시 놓친 실행이 있으면 1회 보정 실행
  lock_timeout_seconds  INTEGER       NOT NULL DEFAULT 3600,    -- 동시 실행 잠금 lease. 실행 중 lease/3 간격 heartbeat로 갱신, 비정상 종료 시 자동 만료

  lock_owner            VARCHAR(150),
  locked_at             TIMESTAMPTZ,
  lock_until            TIMESTAMPTZ,

  last_started_at       TIMESTAMPTZ,
  last_finished_at      TIMESTAMPTZ,
  last_success_at       TIMESTAMPTZ,
  last_status           VARCHAR(20),
  last_message          VARCHAR(4000),

  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  is_deleted            BOOLEAN       NOT NULL DEFAULT FALSE,
  reg_user              VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  upd_user              VARCHAR(50),
  upd_dtm               TIMESTAMPTZ,

  CONSTRAINT ck_sys_scheduler_job_code
    CHECK (job_code ~ '^[A-Z][A-Z0-9_]{1,49}$'),
  CONSTRAINT ck_sys_scheduler_job_business_code
    CHECK (business_code IS NULL OR business_code ~ '^[A-Z][A-Z0-9_]{1,49}$'),
  CONSTRAINT ck_sys_scheduler_job_lock_timeout
    CHECK (lock_timeout_seconds BETWEEN 60 AND 86400),
  CONSTRAINT ck_sys_scheduler_job_last_status
    CHECK (last_status IS NULL OR last_status IN ('RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED'))
);

COMMENT ON TABLE sys_scheduler_job IS 'DB 기반 스케줄 작업 정의 (job_code는 SchedulerJob 구현체 코드와 일치해야 실행됨)';

-- 이전 버전 스키마 적용 환경 보정
ALTER TABLE sys_scheduler_job ADD COLUMN IF NOT EXISTS business_code VARCHAR(50);

-- 작업(스케줄) 일시중지 기간 (job_code NULL이면 전체 작업 일시중지). 자동 실행만 막고 수동 즉시 반영은 막지 않는다.
CREATE TABLE IF NOT EXISTS sys_scheduler_pause (
  pause_id              BIGSERIAL     PRIMARY KEY,
  job_code              VARCHAR(50),
  pause_start_at        TIMESTAMPTZ   NOT NULL,
  pause_end_at          TIMESTAMPTZ   NOT NULL,
  reason                VARCHAR(500),

  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  is_deleted            BOOLEAN       NOT NULL DEFAULT FALSE,
  reg_user              VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  upd_user              VARCHAR(50),
  upd_dtm               TIMESTAMPTZ,

  CONSTRAINT fk_sys_scheduler_pause_job
    FOREIGN KEY (job_code) REFERENCES sys_scheduler_job (job_code),
  CONSTRAINT ck_sys_scheduler_pause_range
    CHECK (pause_end_at > pause_start_at)
);

CREATE INDEX IF NOT EXISTS ix_sys_scheduler_pause_job_range
  ON sys_scheduler_pause (job_code, pause_start_at, pause_end_at)
  WHERE is_active = TRUE AND is_deleted = FALSE;

-- 업무 보류 기간: 해당 업무의 자동 실행과 수동 즉시 반영을 모두 막는다. 작업 사용 여부(is_enabled)와 독립적이다.
CREATE TABLE IF NOT EXISTS sys_scheduler_business_hold (
  hold_id               BIGSERIAL     PRIMARY KEY,
  business_code         VARCHAR(50)   NOT NULL,              -- 예: HRM_ASSIGNMENT
  hold_start_at         TIMESTAMPTZ   NOT NULL,
  hold_end_at           TIMESTAMPTZ   NOT NULL,
  reason                VARCHAR(500),

  is_active             BOOLEAN       NOT NULL DEFAULT TRUE,
  is_deleted            BOOLEAN       NOT NULL DEFAULT FALSE,
  reg_user              VARCHAR(50)   NOT NULL DEFAULT 'SYSTEM',
  reg_dtm               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  upd_user              VARCHAR(50),
  upd_dtm               TIMESTAMPTZ,

  CONSTRAINT ck_sys_scheduler_business_hold_code
    CHECK (business_code ~ '^[A-Z][A-Z0-9_]{1,49}$'),
  CONSTRAINT ck_sys_scheduler_business_hold_range
    CHECK (hold_end_at > hold_start_at)
);

COMMENT ON TABLE sys_scheduler_business_hold IS '업무 보류 기간 (자동 스케줄 + 수동 즉시 반영 모두 차단)';

CREATE INDEX IF NOT EXISTS ix_sys_scheduler_business_hold_range
  ON sys_scheduler_business_hold (business_code, hold_start_at, hold_end_at)
  WHERE is_active = TRUE AND is_deleted = FALSE;

-- 실행 이력
CREATE TABLE IF NOT EXISTS sys_scheduler_history (
  history_id            BIGSERIAL     PRIMARY KEY,
  job_code              VARCHAR(50)   NOT NULL,
  trigger_type          VARCHAR(20)   NOT NULL,
  status                VARCHAR(20)   NOT NULL,
  scheduled_at          TIMESTAMPTZ,
  started_at            TIMESTAMPTZ   NOT NULL,
  finished_at           TIMESTAMPTZ,
  duration_ms           BIGINT,
  processed_count       INTEGER,
  message               VARCHAR(4000),
  error_message         VARCHAR(4000),
  instance_id           VARCHAR(150)  NOT NULL,
  reg_dtm               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_sys_scheduler_history_job
    FOREIGN KEY (job_code) REFERENCES sys_scheduler_job (job_code),
  CONSTRAINT ck_sys_scheduler_history_trigger
    CHECK (trigger_type IN ('SCHEDULED', 'STARTUP', 'CATCHUP', 'MANUAL')),
  CONSTRAINT ck_sys_scheduler_history_status
    CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED'))
);

CREATE INDEX IF NOT EXISTS ix_sys_scheduler_history_job_started
  ON sys_scheduler_history (job_code, started_at DESC);