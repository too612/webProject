-- PostgreSQL DML: sys_scheduler 초기 시드
-- sys_scheduler.sql 실행 후 적용한다.
-- HRM_ASSIGNMENT_SYNC: 발령 반영 동기화. 매 30분(00분/30분, 자정 00:00:00 포함) Asia/Seoul 기준 실행.

INSERT INTO sys_scheduler_job (
  job_code, job_name, description, cron_expression, zone_id, business_code,
  is_enabled, run_on_startup, catchup_enabled, lock_timeout_seconds
) VALUES (
  'HRM_ASSIGNMENT_SYNC', '인사발령 반영 동기화',
  '발령일이 도래한 인사발령을 인사 마스터에 반영한다. 자정 및 매 30분 실행, 기동 시 누락분 1회 보정.',
  '0 0/30 * * * *', 'Asia/Seoul', 'HRM_ASSIGNMENT',
  TRUE, FALSE, TRUE, 1800
)
ON CONFLICT (job_code) DO NOTHING;

-- 이전 seed 적용 환경 보정: 업무 보류 코드 연결
UPDATE sys_scheduler_job
   SET business_code = 'HRM_ASSIGNMENT'
 WHERE job_code = 'HRM_ASSIGNMENT_SYNC'
   AND business_code IS NULL;

-- 일시중지 예시 (필요 시 주석 해제)
-- INSERT INTO sys_scheduler_pause (job_code, pause_start_at, pause_end_at, reason)
-- VALUES ('HRM_ASSIGNMENT_SYNC', '2026-12-31 22:00:00+09', '2027-01-01 02:00:00+09', '연말 인사 마감 점검');

-- 업무 보류 예시 (자동 + 수동 반영 모두 차단, 필요 시 주석 해제)
-- INSERT INTO sys_scheduler_business_hold (business_code, hold_start_at, hold_end_at, reason)
-- VALUES ('HRM_ASSIGNMENT', '2026-12-31 22:00:00+09', '2027-01-01 02:00:00+09', '연말 인사 확정 전 발령 반영 보류');
