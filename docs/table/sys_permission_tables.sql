-- PostgreSQL DDL: 권한/프로그램 관리 테이블
-- 목적: 프로그램, 역할, 사용자-역할 매핑, 역할-프로그램 권한을 분리 관리

CREATE TABLE IF NOT EXISTS sys_program (
    program_id varchar(50) PRIMARY KEY,
    program_name varchar(200) NOT NULL,
    category_code varchar(20) NOT NULL,
    route_path varchar(500),
    open_status_code varchar(20) NOT NULL DEFAULT 'ACTIVE',
    is_active boolean NOT NULL DEFAULT true,
    sort_order integer NOT NULL DEFAULT 0,
    parent_program_id varchar(50),
    description text,
    reg_user varchar(50),
    reg_dtm timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reg_ip inet,
    upd_user varchar(50),
    upd_dtm timestamptz,
    upd_ip inet,
    CONSTRAINT fk_sys_program_parent
        FOREIGN KEY (parent_program_id) REFERENCES sys_program(program_id)
        ON DELETE RESTRICT
);

COMMENT ON TABLE sys_program IS '프로그램/화면 관리';
COMMENT ON COLUMN sys_program.program_id IS '프로그램 식별자';
COMMENT ON COLUMN sys_program.program_name IS '프로그램명';
COMMENT ON COLUMN sys_program.category_code IS '프로그램 분류 코드';
COMMENT ON COLUMN sys_program.route_path IS '프로그램 경로';
COMMENT ON COLUMN sys_program.open_status_code IS '오픈 상태 코드';
COMMENT ON COLUMN sys_program.is_active IS '사용 여부';
COMMENT ON COLUMN sys_program.sort_order IS '정렬 순서';
COMMENT ON COLUMN sys_program.parent_program_id IS '상위 프로그램 식별자';
COMMENT ON COLUMN sys_program.description IS '프로그램 설명';
COMMENT ON COLUMN sys_program.reg_user IS '등록자';
COMMENT ON COLUMN sys_program.reg_dtm IS '등록일시';
COMMENT ON COLUMN sys_program.reg_ip IS '등록 IP';
COMMENT ON COLUMN sys_program.upd_user IS '수정자';
COMMENT ON COLUMN sys_program.upd_dtm IS '수정일시';
COMMENT ON COLUMN sys_program.upd_ip IS '수정 IP';

CREATE TABLE IF NOT EXISTS sys_role (
    role_id varchar(30) PRIMARY KEY,
    role_name varchar(100) NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    description text,
    reg_user varchar(50),
    reg_dtm timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reg_ip inet,
    upd_user varchar(50),
    upd_dtm timestamptz,
    upd_ip inet
);

COMMENT ON TABLE sys_role IS '권한 역할 관리';
COMMENT ON COLUMN sys_role.role_id IS '권한 식별자';
COMMENT ON COLUMN sys_role.role_name IS '권한명';
COMMENT ON COLUMN sys_role.sort_order IS '정렬 순서';
COMMENT ON COLUMN sys_role.is_active IS '사용 여부';
COMMENT ON COLUMN sys_role.description IS '권한 설명';
COMMENT ON COLUMN sys_role.reg_user IS '등록자';
COMMENT ON COLUMN sys_role.reg_dtm IS '등록일시';
COMMENT ON COLUMN sys_role.reg_ip IS '등록 IP';
COMMENT ON COLUMN sys_role.upd_user IS '수정자';
COMMENT ON COLUMN sys_role.upd_dtm IS '수정일시';
COMMENT ON COLUMN sys_role.upd_ip IS '수정 IP';

CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id varchar(50) NOT NULL,
    role_id varchar(30) NOT NULL,
    is_primary boolean NOT NULL DEFAULT true,
    is_active boolean NOT NULL DEFAULT true,
    reg_user varchar(50),
    reg_dtm timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reg_ip inet,
    upd_user varchar(50),
    upd_dtm timestamptz,
    upd_ip inet,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_sys_user_role_role
        FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE sys_user_role IS '사용자-권한 매핑';
COMMENT ON COLUMN sys_user_role.user_id IS '사용자 식별자';
COMMENT ON COLUMN sys_user_role.role_id IS '권한 식별자';
COMMENT ON COLUMN sys_user_role.is_primary IS '대표 권한 여부';
COMMENT ON COLUMN sys_user_role.is_active IS '사용 여부';
COMMENT ON COLUMN sys_user_role.reg_user IS '등록자';
COMMENT ON COLUMN sys_user_role.reg_dtm IS '등록일시';
COMMENT ON COLUMN sys_user_role.reg_ip IS '등록 IP';
COMMENT ON COLUMN sys_user_role.upd_user IS '수정자';
COMMENT ON COLUMN sys_user_role.upd_dtm IS '수정일시';
COMMENT ON COLUMN sys_user_role.upd_ip IS '수정 IP';

CREATE TABLE IF NOT EXISTS sys_role_program_permission (
    role_id varchar(30) NOT NULL,
    program_id varchar(50) NOT NULL,
    can_read boolean NOT NULL DEFAULT false,
    can_write boolean NOT NULL DEFAULT false,
    can_update boolean NOT NULL DEFAULT false,
    can_delete boolean NOT NULL DEFAULT false,
    is_open boolean NOT NULL DEFAULT true,
    reg_user varchar(50),
    reg_dtm timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reg_ip inet,
    upd_user varchar(50),
    upd_dtm timestamptz,
    upd_ip inet,
    PRIMARY KEY (role_id, program_id),
    CONSTRAINT fk_sys_role_program_permission_role
        FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_sys_role_program_permission_program
        FOREIGN KEY (program_id) REFERENCES sys_program(program_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE sys_role_program_permission IS '역할별 프로그램 권한 매핑';
COMMENT ON COLUMN sys_role_program_permission.role_id IS '권한 식별자';
COMMENT ON COLUMN sys_role_program_permission.program_id IS '프로그램 식별자';
COMMENT ON COLUMN sys_role_program_permission.can_read IS '읽기 권한 여부';
COMMENT ON COLUMN sys_role_program_permission.can_write IS '쓰기 권한 여부';
COMMENT ON COLUMN sys_role_program_permission.can_update IS '수정 권한 여부';
COMMENT ON COLUMN sys_role_program_permission.can_delete IS '삭제 권한 여부';
COMMENT ON COLUMN sys_role_program_permission.is_open IS '오픈 권한 여부';
COMMENT ON COLUMN sys_role_program_permission.reg_user IS '등록자';
COMMENT ON COLUMN sys_role_program_permission.reg_dtm IS '등록일시';
COMMENT ON COLUMN sys_role_program_permission.reg_ip IS '등록 IP';
COMMENT ON COLUMN sys_role_program_permission.upd_user IS '수정자';
COMMENT ON COLUMN sys_role_program_permission.upd_dtm IS '수정일시';
COMMENT ON COLUMN sys_role_program_permission.upd_ip IS '수정 IP';

CREATE INDEX IF NOT EXISTS ix_sys_program_category_active
    ON sys_program (category_code, is_active, sort_order);

CREATE INDEX IF NOT EXISTS ix_sys_role_active_sort
    ON sys_role (is_active, sort_order);

CREATE INDEX IF NOT EXISTS ix_sys_user_role_role
    ON sys_user_role (role_id, is_active);

CREATE INDEX IF NOT EXISTS ix_sys_role_program_permission_program
    ON sys_role_program_permission (program_id, can_read, can_write, can_update, can_delete);
