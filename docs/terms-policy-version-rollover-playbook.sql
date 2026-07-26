-- terms-policy-version-rollover-playbook.sql
-- 목적: 약관 버전 변경(롤오버) 리허설 + 재동의 대상 산출
-- 주의: 운영 반영 전 스테이징에서 먼저 검증

-- =========================================================
-- A. 신규 버전 발행 예시
-- =========================================================
-- 1) 기존 활성 버전 비활성화 (예: PRIVACY)
UPDATE public.terms_policy
SET is_active = false,
    effective_to = now(),
    updated_by = 'system',
    updated_at = now()
WHERE terms_type = 'PRIVACY'
  AND is_active = true;

-- 2) 신규 버전 활성 등록
INSERT INTO public.terms_policy (
    terms_type,
    terms_version,
    title,
    content,
    is_required,
    is_active,
    effective_from,
    created_by,
    updated_by
) VALUES (
    'PRIVACY',
    'PRIVACY-2026-08-v1',
    '개인정보 수집 및 이용 동의',
    '신규 버전 본문을 입력하세요.',
    true,
    true,
    now(),
    'system',
    'system'
)
ON CONFLICT (terms_type, terms_version) DO NOTHING;

-- =========================================================
-- B. 재동의 대상 사용자 산출
-- =========================================================
WITH latest_consent AS (
    SELECT
        c.user_seq,
        c.terms_type,
        c.terms_version,
        c.is_agreed,
        row_number() OVER (
            PARTITION BY c.user_seq, c.terms_type
            ORDER BY c.agreed_at DESC, c.consent_id DESC
        ) AS rn
    FROM public.user_terms_consents c
), active_required_policy AS (
    SELECT
        p.terms_type,
        p.terms_version
    FROM public.terms_policy p
    WHERE p.is_active = true
      AND p.is_required = true
      AND (p.effective_to IS NULL OR p.effective_to > now())
)
SELECT
    u.user_seq,
    u.user_id,
    rp.terms_type,
    rp.terms_version AS required_active_version,
    lc.terms_version AS user_latest_version,
    lc.is_agreed AS user_latest_agreed
FROM public.users u
JOIN active_required_policy rp ON true
LEFT JOIN latest_consent lc
       ON lc.user_seq = u.user_seq
      AND lc.terms_type = rp.terms_type
      AND lc.rn = 1
WHERE u.status = 'A'
  AND (
      lc.terms_version IS NULL
      OR lc.terms_version <> rp.terms_version
      OR COALESCE(lc.is_agreed, false) = false
  )
ORDER BY u.user_seq, rp.terms_type;

-- =========================================================
-- C. 롤백 예시(리허설 후 원복 필요 시 수동 조정)
-- =========================================================
-- UPDATE public.terms_policy
-- SET is_active = false, effective_to = now(), updated_by = 'system', updated_at = now()
-- WHERE terms_type = 'PRIVACY' AND terms_version = 'PRIVACY-2026-08-v1';
--
-- UPDATE public.terms_policy
-- SET is_active = true, effective_to = NULL, updated_by = 'system', updated_at = now()
-- WHERE terms_type = 'PRIVACY' AND terms_version = 'PRIVACY-2026-07-v1';
