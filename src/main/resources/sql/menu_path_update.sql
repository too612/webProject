-- ============================================================
-- 메뉴 경로(path) 도메인 prefix 추가 UPDATE 스크립트
-- 실행 대상: sys_menu_mgt 테이블
-- 목적: React Router URL과 DB 경로 일치시키기
--   - Community (M_GEN): /group/, /facilities/, /saint/, /world/ → /community/*
--   - ERP (M_SYS): /humen/, /sermon/ 등 → /erp/*
--   - System (M_ADM): /user/, /config/ 등 → /system/*
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Community (M_GEN) 경로 수정
-- ============================================================
UPDATE sys_menu_mgt SET path = '/community/group/manager'    WHERE menu_id = 'M_GEN_01';
UPDATE sys_menu_mgt SET path = '/community/group/manager'    WHERE menu_id = 'M_GEN_01_01';
UPDATE sys_menu_mgt SET path = '/community/group/groupa1'    WHERE menu_id = 'M_GEN_01_02';
UPDATE sys_menu_mgt SET path = '/community/group/groupb2'    WHERE menu_id = 'M_GEN_01_03';
UPDATE sys_menu_mgt SET path = '/community/facilities/calendar' WHERE menu_id = 'M_GEN_02';
UPDATE sys_menu_mgt SET path = '/community/facilities/calendar' WHERE menu_id = 'M_GEN_02_01';
UPDATE sys_menu_mgt SET path = '/community/facilities/dining' WHERE menu_id = 'M_GEN_02_02';
UPDATE sys_menu_mgt SET path = '/community/facilities/prayer' WHERE menu_id = 'M_GEN_02_03';
UPDATE sys_menu_mgt SET path = '/community/saint/family'     WHERE menu_id = 'M_GEN_03';
UPDATE sys_menu_mgt SET path = '/community/saint/family'     WHERE menu_id = 'M_GEN_03_01';
UPDATE sys_menu_mgt SET path = '/community/saint/pray'       WHERE menu_id = 'M_GEN_03_02';
UPDATE sys_menu_mgt SET path = '/community/saint/sales'      WHERE menu_id = 'M_GEN_03_03';
UPDATE sys_menu_mgt SET path = '/community/saint/job'        WHERE menu_id = 'M_GEN_03_04';
UPDATE sys_menu_mgt SET path = '/community/world/christian'  WHERE menu_id = 'M_GEN_04';
UPDATE sys_menu_mgt SET path = '/community/world/christian'  WHERE menu_id = 'M_GEN_04_01';
UPDATE sys_menu_mgt SET path = '/community/world/economic'   WHERE menu_id = 'M_GEN_04_02';
UPDATE sys_menu_mgt SET path = '/community/world/health'     WHERE menu_id = 'M_GEN_04_03';

-- ============================================================
-- 2. ERP (M_SYS) 경로 수정
-- ============================================================
UPDATE sys_menu_mgt SET path = '/erp/humen/manager'         WHERE menu_id = 'M_SYS_01';
UPDATE sys_menu_mgt SET path = '/erp/humen/manager'         WHERE menu_id = 'M_SYS_01_01';
UPDATE sys_menu_mgt SET path = '/erp/humen/newcomer'        WHERE menu_id = 'M_SYS_01_02';
UPDATE sys_menu_mgt SET path = '/erp/humen/change'          WHERE menu_id = 'M_SYS_01_03';
UPDATE sys_menu_mgt SET path = '/erp/humen/district'        WHERE menu_id = 'M_SYS_01_04';
UPDATE sys_menu_mgt SET path = '/erp/sermon/manager'        WHERE menu_id = 'M_SYS_02';
UPDATE sys_menu_mgt SET path = '/erp/sermon/write'          WHERE menu_id = 'M_SYS_02_01';
UPDATE sys_menu_mgt SET path = '/erp/sermon/order'          WHERE menu_id = 'M_SYS_02_02';
UPDATE sys_menu_mgt SET path = '/erp/sermon/attendance'     WHERE menu_id = 'M_SYS_02_03';
UPDATE sys_menu_mgt SET path = '/erp/sermon/archive'        WHERE menu_id = 'M_SYS_02_04';
UPDATE sys_menu_mgt SET path = '/erp/account/manager'       WHERE menu_id = 'M_SYS_03';
UPDATE sys_menu_mgt SET path = '/erp/account/manager'       WHERE menu_id = 'M_SYS_03_01';
UPDATE sys_menu_mgt SET path = '/erp/account/input'         WHERE menu_id = 'M_SYS_03_02';
UPDATE sys_menu_mgt SET path = '/erp/account/budget'        WHERE menu_id = 'M_SYS_03_03';
UPDATE sys_menu_mgt SET path = '/erp/account/expense'       WHERE menu_id = 'M_SYS_03_04';
UPDATE sys_menu_mgt SET path = '/erp/account/report'        WHERE menu_id = 'M_SYS_03_05';
UPDATE sys_menu_mgt SET path = '/erp/training/course'       WHERE menu_id = 'M_SYS_04';
UPDATE sys_menu_mgt SET path = '/erp/training/course'       WHERE menu_id = 'M_SYS_04_01';
UPDATE sys_menu_mgt SET path = '/erp/training/student'      WHERE menu_id = 'M_SYS_04_02';
UPDATE sys_menu_mgt SET path = '/erp/training/attendance'   WHERE menu_id = 'M_SYS_04_03';
UPDATE sys_menu_mgt SET path = '/erp/training/complete'     WHERE menu_id = 'M_SYS_04_04';
UPDATE sys_menu_mgt SET path = '/erp/ministry/department'   WHERE menu_id = 'M_SYS_05';
UPDATE sys_menu_mgt SET path = '/erp/ministry/department'   WHERE menu_id = 'M_SYS_05_01';
UPDATE sys_menu_mgt SET path = '/erp/ministry/volunteer'    WHERE menu_id = 'M_SYS_05_02';
UPDATE sys_menu_mgt SET path = '/erp/ministry/schedule'     WHERE menu_id = 'M_SYS_05_03';
UPDATE sys_menu_mgt SET path = '/erp/ministry/report'       WHERE menu_id = 'M_SYS_05_04';
UPDATE sys_menu_mgt SET path = '/erp/event/calendar'        WHERE menu_id = 'M_SYS_06';
UPDATE sys_menu_mgt SET path = '/erp/event/calendar'        WHERE menu_id = 'M_SYS_06_01';
UPDATE sys_menu_mgt SET path = '/erp/event/apply'           WHERE menu_id = 'M_SYS_06_02';
UPDATE sys_menu_mgt SET path = '/erp/event/participant'     WHERE menu_id = 'M_SYS_06_03';
UPDATE sys_menu_mgt SET path = '/erp/event/result'          WHERE menu_id = 'M_SYS_06_04';
UPDATE sys_menu_mgt SET path = '/erp/facility/reservation'  WHERE menu_id = 'M_SYS_07';
UPDATE sys_menu_mgt SET path = '/erp/facility/reservation'  WHERE menu_id = 'M_SYS_07_01';
UPDATE sys_menu_mgt SET path = '/erp/facility/vehicle'      WHERE menu_id = 'M_SYS_07_02';
UPDATE sys_menu_mgt SET path = '/erp/facility/inventory'    WHERE menu_id = 'M_SYS_07_03';
UPDATE sys_menu_mgt SET path = '/erp/facility/maintenance'  WHERE menu_id = 'M_SYS_07_04';
UPDATE sys_menu_mgt SET path = '/erp/comm/notice'           WHERE menu_id = 'M_SYS_08';
UPDATE sys_menu_mgt SET path = '/erp/comm/notice'           WHERE menu_id = 'M_SYS_08_01';
UPDATE sys_menu_mgt SET path = '/erp/comm/message'          WHERE menu_id = 'M_SYS_08_02';
UPDATE sys_menu_mgt SET path = '/erp/comm/prayer'           WHERE menu_id = 'M_SYS_08_03';
UPDATE sys_menu_mgt SET path = '/erp/comm/newsletter'       WHERE menu_id = 'M_SYS_08_04';
UPDATE sys_menu_mgt SET path = '/erp/admin/document'        WHERE menu_id = 'M_SYS_09';
UPDATE sys_menu_mgt SET path = '/erp/admin/certificate'     WHERE menu_id = 'M_SYS_09_01';
UPDATE sys_menu_mgt SET path = '/erp/admin/approval'        WHERE menu_id = 'M_SYS_09_02';
UPDATE sys_menu_mgt SET path = '/erp/admin/minutes'         WHERE menu_id = 'M_SYS_09_03';
UPDATE sys_menu_mgt SET path = '/erp/admin/archive'         WHERE menu_id = 'M_SYS_09_04';
UPDATE sys_menu_mgt SET path = '/erp/stats/dashboard'       WHERE menu_id = 'M_SYS_10';
UPDATE sys_menu_mgt SET path = '/erp/stats/dashboard'       WHERE menu_id = 'M_SYS_10_01';
UPDATE sys_menu_mgt SET path = '/erp/stats/attendance'      WHERE menu_id = 'M_SYS_10_02';
UPDATE sys_menu_mgt SET path = '/erp/stats/offering'        WHERE menu_id = 'M_SYS_10_03';
UPDATE sys_menu_mgt SET path = '/erp/stats/ministry'        WHERE menu_id = 'M_SYS_10_04';

-- ============================================================
-- 3. System (M_ADM) 경로 수정
-- ============================================================
UPDATE sys_menu_mgt SET path = '/system/user/manager'       WHERE menu_id = 'M_ADM_01';
UPDATE sys_menu_mgt SET path = '/system/user/manager'       WHERE menu_id = 'M_ADM_01_01';
UPDATE sys_menu_mgt SET path = '/system/user/role'          WHERE menu_id = 'M_ADM_01_02';
UPDATE sys_menu_mgt SET path = '/system/config/code'        WHERE menu_id = 'M_ADM_02';
UPDATE sys_menu_mgt SET path = '/system/config/code'        WHERE menu_id = 'M_ADM_02_01';
UPDATE sys_menu_mgt SET path = '/system/config/menu'        WHERE menu_id = 'M_ADM_02_02';
UPDATE sys_menu_mgt SET path = '/system/log/system'         WHERE menu_id = 'M_ADM_03';
UPDATE sys_menu_mgt SET path = '/system/log/system'         WHERE menu_id = 'M_ADM_03_01';
UPDATE sys_menu_mgt SET path = '/system/log/audit'          WHERE menu_id = 'M_ADM_03_02';
UPDATE sys_menu_mgt SET path = '/system/backup/policy'      WHERE menu_id = 'M_ADM_04';
UPDATE sys_menu_mgt SET path = '/system/backup/policy'      WHERE menu_id = 'M_ADM_04_01';
UPDATE sys_menu_mgt SET path = '/system/backup/history'     WHERE menu_id = 'M_ADM_04_02';

COMMIT;
