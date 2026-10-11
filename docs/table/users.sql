-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_seq bigserial NOT NULL, -- 사용자 시퀀스 (PK)
	user_id varchar(20) NOT NULL, -- 사용자 ID (로그인용)
	"password" varchar(255) NOT NULL, -- 비밀번호 (BCrypt 암호화)
	user_name varchar(50) NOT NULL, -- 사용자 이름
	email varchar(100) NOT NULL, -- 이메일
	phone varchar(13) NULL, -- 휴대폰 번호
	birth_date date NULL, -- 생년월일
	gender bpchar(1) NULL, -- 성별 (M: 남성, F: 여성)
	status bpchar(1) DEFAULT 'A'::bpchar NOT NULL, -- 계정 상태 (A: 활성, I: 비활성, D: 삭제)
	agree_terms bool DEFAULT false NOT NULL, -- 이용약관 동의 여부
	agree_privacy bool DEFAULT false NOT NULL, -- 개인정보 수집 및 이용 동의 여부
	agree_marketing bool DEFAULT false NULL, -- 마케팅 정보 수신 동의 여부
	ins_dt timestamp DEFAULT now() NOT NULL, -- 가입일시
	upt_dt timestamp DEFAULT now() NOT NULL, -- 수정일시
	last_login_dt timestamp NULL, -- 마지막 로그인 일시
	login_fail_cnt int4 DEFAULT 0 NULL, -- 로그인 실패 횟수 (5회 실패시 계정 잠금)
	lock_expire_dt timestamp NULL, -- 계정 잠금 해제 일시
	postal_code varchar(10) NULL, -- 우편번호
	address_line1 varchar(255) NULL, -- 기본 주소
	address_line2 varchar(255) NULL, -- 상세 주소
	CONSTRAINT chk_gender CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))),
	CONSTRAINT chk_status CHECK ((status = ANY (ARRAY['A'::bpchar, 'I'::bpchar, 'D'::bpchar]))),
	CONSTRAINT chk_users_postal_code_format CHECK (((postal_code IS NULL) OR ((postal_code)::text ~ '^[0-9]{5,10}$'::text))),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (user_seq),
	CONSTRAINT users_user_id_key UNIQUE (user_id)
);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_status ON public.users USING btree (status);
CREATE INDEX idx_users_user_id ON public.users USING btree (user_id);
COMMENT ON TABLE public.users IS '사용자 정보 테이블';

-- Column comments

COMMENT ON COLUMN public.users.user_seq IS '사용자 시퀀스 (PK)';
COMMENT ON COLUMN public.users.user_id IS '사용자 ID (로그인용)';
COMMENT ON COLUMN public.users."password" IS '비밀번호 (BCrypt 암호화)';
COMMENT ON COLUMN public.users.user_name IS '사용자 이름';
COMMENT ON COLUMN public.users.email IS '이메일';
COMMENT ON COLUMN public.users.phone IS '휴대폰 번호';
COMMENT ON COLUMN public.users.birth_date IS '생년월일';
COMMENT ON COLUMN public.users.gender IS '성별 (M: 남성, F: 여성)';
COMMENT ON COLUMN public.users.status IS '계정 상태 (A: 활성, I: 비활성, D: 삭제)';
COMMENT ON COLUMN public.users.agree_terms IS '이용약관 동의 여부';
COMMENT ON COLUMN public.users.agree_privacy IS '개인정보 수집 및 이용 동의 여부';
COMMENT ON COLUMN public.users.agree_marketing IS '마케팅 정보 수신 동의 여부';
COMMENT ON COLUMN public.users.ins_dt IS '가입일시';
COMMENT ON COLUMN public.users.upt_dt IS '수정일시';
COMMENT ON COLUMN public.users.last_login_dt IS '마지막 로그인 일시';
COMMENT ON COLUMN public.users.login_fail_cnt IS '로그인 실패 횟수 (5회 실패시 계정 잠금)';
COMMENT ON COLUMN public.users.lock_expire_dt IS '계정 잠금 해제 일시';
COMMENT ON COLUMN public.users.postal_code IS '우편번호';
COMMENT ON COLUMN public.users.address_line1 IS '기본 주소';
COMMENT ON COLUMN public.users.address_line2 IS '상세 주소';

-- Permissions

ALTER TABLE public.users OWNER TO "DEV";
GRANT ALL ON TABLE public.users TO "DEV";