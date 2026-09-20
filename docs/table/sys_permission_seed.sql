-- PostgreSQL seed: 기본 권한/프로그램 데이터
-- 목적: 구조 검증과 초기 운영 테스트를 위한 기본 샘플 데이터

-- 1. 기본 역할 등록
INSERT INTO sys_role (role_id, role_name, sort_order, is_active, description, reg_user, reg_ip)
VALUES
    ('ADMIN', '관리자', 1, true, '전체 시스템 접근 권한', 'system', '127.0.0.1'),
    ('USER', '일반사용자', 2, true, '기본 조회 권한', 'system', '127.0.0.1')
ON CONFLICT (role_id) DO NOTHING;

-- 2. 총무 관련 역할 등록
INSERT INTO sys_role (role_id, role_name, sort_order, is_active, description, reg_user, reg_ip)
VALUES
    ('GA_APPROVER', '총무담당자(결재용)', 10, true, '총무 관련 화면의 수정 권한', 'system', '127.0.0.1')
ON CONFLICT (role_id) DO NOTHING;

-- 3. 기본 프로그램 등록
-- 참고: category_code는 기존 com_code 체계와 연결 가능하도록 사용
INSERT INTO sys_program (
    program_id,
    program_name,
    category_code,
    route_path,
    open_status_code,
    is_active,
    sort_order,
    description,
    reg_user,
    reg_ip
)
VALUES
    ('PROGRAM_HOME', '홈', '010001', '/home', 'ACTIVE', true, 1, '홈 화면', 'system', '127.0.0.1'),
    ('PROGRAM_USER', '사용자관리', '010002', '/system/user', 'ACTIVE', true, 2, '사용자 관리 화면', 'system', '127.0.0.1'),
    ('PROGRAM_ROLE', '권한관리', '010003', '/system/role', 'ACTIVE', true, 3, '권한 관리 화면', 'system', '127.0.0.1'),
    ('PROGRAM_REPORT', '보고서', '010004', '/report', 'DEVELOPMENT', true, 4, '보고서 화면', 'system', '127.0.0.1')
ON CONFLICT (program_id) DO NOTHING;

-- 4. 역할별 프로그램 권한 부여
-- 관리자: 전 기능 CRUD 허용
INSERT INTO sys_role_program_permission (
    role_id,
    program_id,
    can_read,
    can_write,
    can_update,
    can_delete,
    is_open,
    reg_user,
    reg_ip
)
SELECT 'ADMIN', program_id, true, true, true, true, true, 'system', '127.0.0.1'
FROM sys_program
ON CONFLICT (role_id, program_id) DO NOTHING;

-- 일반사용자: 조회만 가능
INSERT INTO sys_role_program_permission (
    role_id,
    program_id,
    can_read,
    can_write,
    can_update,
    can_delete,
    is_open,
    reg_user,
    reg_ip
)
SELECT 'USER', program_id, true, false, false, false, true, 'system', '127.0.0.1'
FROM sys_program
ON CONFLICT (role_id, program_id) DO NOTHING;

-- 5. 총무 관련 권한 부여
-- 총무담당자: 조회/수정 가능, 삭제는 불가
INSERT INTO sys_role_program_permission (
    role_id,
    program_id,
    can_read,
    can_write,
    can_update,
    can_delete,
    is_open,
    reg_user,
    reg_ip
)
SELECT 'GA_APPROVER', program_id, true, true, true, false, true, 'system', '127.0.0.1'
FROM sys_program
ON CONFLICT (role_id, program_id) DO NOTHING;

-- 6. 예시 사용자-권한 매핑
-- 실제 데이터는 이후 별도 정리 예정
INSERT INTO sys_user_role (user_id, role_id, is_primary, is_active, reg_user, reg_ip)
VALUES
    ('admin', 'ADMIN', true, true, 'system', '127.0.0.1'),
    ('user01', 'USER', true, true, 'system', '127.0.0.1')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 7. 총무 관련 사용자-권한 매핑
INSERT INTO sys_user_role (user_id, role_id, is_primary, is_active, reg_user, reg_ip)
VALUES
    ('too512', 'GA_APPROVER', true, true, 'system', '127.0.0.1')
ON CONFLICT (user_id, role_id) DO NOTHING;
