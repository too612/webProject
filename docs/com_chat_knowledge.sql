-- PostgreSQL DDL: com_chat_knowledge
-- 챗봇 지식 베이스 테이블 (키워드 → 의도/답변 템플릿)

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS com_chat_knowledge (
  knowledge_id      BIGSERIAL PRIMARY KEY,

  intent_code       VARCHAR(40)  NOT NULL,  -- Provider 키 (예: WORSHIP_TIME, LOCATION)
  keywords          TEXT         NOT NULL,  -- 콤마 구분 매칭 키워드/문구
  answer_template   TEXT         NOT NULL,  -- {{slot}} 치환 답변 템플릿
  priority          INTEGER      NOT NULL DEFAULT 0,  -- 낮을수록 우선 매칭
  menu_path         VARCHAR(200),           -- 관련 메뉴 링크 (선택)
  suggestions       TEXT,                   -- 추천 질문 (콤마 구분, 폴백/버튼형 UX용)
  remark            TEXT,
  use_yn            CHAR(1)      NOT NULL DEFAULT 'Y',
  sort_order        INTEGER      NOT NULL DEFAULT 0,

  reg_user          VARCHAR(50)  NOT NULL DEFAULT 'SYSTEM',
  reg_dtm           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  reg_ip            INET,
  upd_user          VARCHAR(50),
  upd_dtm           TIMESTAMPTZ,
  upd_ip            INET,

  CONSTRAINT ck_com_chat_knowledge_use_yn
    CHECK (use_yn IN ('Y', 'N')),
  CONSTRAINT ck_com_chat_knowledge_priority
    CHECK (priority >= 0),
  CONSTRAINT ck_com_chat_knowledge_sort_order
    CHECK (sort_order >= 0),
  CONSTRAINT uq_com_chat_knowledge_intent_code
    UNIQUE (intent_code)
);

CREATE INDEX IF NOT EXISTS ix_com_chat_knowledge_use_yn
  ON com_chat_knowledge (use_yn, priority, sort_order);

-- 키워드 ILIKE 매칭용 trigram 인덱스 (소규모 데이터라 선택 사항)
CREATE INDEX IF NOT EXISTS ix_com_chat_knowledge_keywords_trgm
  ON com_chat_knowledge USING gin (keywords gin_trgm_ops);

COMMENT ON TABLE com_chat_knowledge
  IS '챗봇 지식 베이스 테이블';
COMMENT ON COLUMN com_chat_knowledge.knowledge_id
  IS '지식 내부키';
COMMENT ON COLUMN com_chat_knowledge.intent_code
  IS '의도코드(Java Provider 키와 연결)';
COMMENT ON COLUMN com_chat_knowledge.keywords
  IS '매칭 키워드/문구(콤마 구분)';
COMMENT ON COLUMN com_chat_knowledge.answer_template
  IS '답변 템플릿({{slot}} 치환)';
COMMENT ON COLUMN com_chat_knowledge.priority
  IS '매칭 우선순위(낮을수록 우선)';
COMMENT ON COLUMN com_chat_knowledge.menu_path
  IS '관련 메뉴 링크(선택)';
COMMENT ON COLUMN com_chat_knowledge.suggestions
  IS '추천 질문(콤마 구분)';
COMMENT ON COLUMN com_chat_knowledge.remark
  IS '비고';
COMMENT ON COLUMN com_chat_knowledge.use_yn
  IS '사용여부(Y/N)';
COMMENT ON COLUMN com_chat_knowledge.sort_order
  IS '정렬순서';
COMMENT ON COLUMN com_chat_knowledge.reg_user
  IS '등록자';
COMMENT ON COLUMN com_chat_knowledge.reg_dtm
  IS '등록일시';
COMMENT ON COLUMN com_chat_knowledge.reg_ip
  IS '등록IP';
COMMENT ON COLUMN com_chat_knowledge.upd_user
  IS '수정자';
COMMENT ON COLUMN com_chat_knowledge.upd_dtm
  IS '수정일시';
COMMENT ON COLUMN com_chat_knowledge.upd_ip
  IS '수정IP';

-- 샘플 데이터는 별도 파일 [docs/com_chat_knowledge_seed.sql]로 분리
