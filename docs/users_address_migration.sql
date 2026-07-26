-- users 테이블 주소 컬럼 추가
-- IF NOT EXISTS로 재실행 시에도 실패하지 않도록 구성

ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255);

COMMENT ON COLUMN users.postal_code IS '우편번호';
COMMENT ON COLUMN users.address_line1 IS '기본 주소';
COMMENT ON COLUMN users.address_line2 IS '상세 주소';
