-- Apply after com_code has been created and parent code 105 has been seeded.
INSERT INTO com_code (
    code, code_name, parent_code, category_code, remark, use_yn, sort_order,
    reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip
) VALUES (
    '105-060', '퇴직', '105', '100', NULL, 'Y', 60,
    'SYSTEM', NOW(), '127.0.0.1', 'SYSTEM', NOW(), '127.0.0.1'
)
ON CONFLICT (code) DO NOTHING;
