-- terms-consent-regression-check.sql
-- 목적: 약관 동의 데이터 품질 점검 및 필수약관 누락 탐지

-- 1) 특정 사용자 가입 결과 점검 (user_id 바꿔서 실행)
SELECT
    u.user_seq,
    u.user_id,
    u.user_name,
    u.email,
    u.postal_code,
    u.address_line1,
    u.address_line2,
    u.agree_terms,
    u.agree_privacy,
    u.agree_marketing,
    u.ins_dt
FROM public.users u
WHERE u.user_id = :user_id;

-- 2) 해당 사용자의 약관 동의 이력 최신순 확인
SELECT
    c.consent_id,
    c.user_seq,
    c.terms_type,
    c.terms_version,
    c.is_required,
    c.is_agreed,
    c.consent_source,
    c.consent_ip,
    CASE WHEN c.user_agent IS NULL THEN 0 ELSE length(c.user_agent) END AS user_agent_len,
    c.agreed_at,
    c.revoked_at
FROM public.user_terms_consents c
WHERE c.user_seq = (
    SELECT user_seq
    FROM public.users
    WHERE user_id = :user_id
)
ORDER BY c.agreed_at DESC, c.consent_id DESC;

-- 3) 필수약관 누락 사용자 탐지 (운영 점검용)
WITH latest_consent AS (
    SELECT
        c.user_seq,
        c.terms_type,
        c.is_agreed,
        row_number() OVER (
            PARTITION BY c.user_seq, c.terms_type
            ORDER BY c.agreed_at DESC, c.consent_id DESC
        ) AS rn
    FROM public.user_terms_consents c
), active_required_policy AS (
    SELECT terms_type
    FROM public.terms_policy
    WHERE is_active = true
      AND is_required = true
      AND (effective_to IS NULL OR effective_to > now())
)
SELECT
    u.user_seq,
    u.user_id,
    p.terms_type AS missing_terms_type
FROM public.users u
CROSS JOIN active_required_policy p
LEFT JOIN latest_consent lc
       ON lc.user_seq = u.user_seq
      AND lc.terms_type = p.terms_type
      AND lc.rn = 1
WHERE u.status != 'D'
  AND COALESCE(lc.is_agreed, false) = false
ORDER BY u.user_seq, p.terms_type;

-- 4) 약관 이력은 있는데 활성버전과 불일치하는 사용자 탐지
WITH latest_consent AS (
    SELECT
        c.user_seq,
        c.terms_type,
        c.terms_version,
        row_number() OVER (
            PARTITION BY c.user_seq, c.terms_type
            ORDER BY c.agreed_at DESC, c.consent_id DESC
        ) AS rn
    FROM public.user_terms_consents c
), active_policy AS (
    SELECT
        p.terms_type,
        p.terms_version,
        p.is_required
    FROM public.terms_policy p
    WHERE p.is_active = true
      AND (p.effective_to IS NULL OR p.effective_to > now())
)
SELECT
    u.user_seq,
    u.user_id,
    ap.terms_type,
    ap.terms_version AS active_version,
    lc.terms_version AS user_latest_version,
    ap.is_required
FROM public.users u
JOIN active_policy ap ON true
LEFT JOIN latest_consent lc
       ON lc.user_seq = u.user_seq
      AND lc.terms_type = ap.terms_type
      AND lc.rn = 1
WHERE u.status != 'D'
  AND (lc.terms_version IS NULL OR lc.terms_version <> ap.terms_version)
ORDER BY u.user_seq, ap.terms_type;
