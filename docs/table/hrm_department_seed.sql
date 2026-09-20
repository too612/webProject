-- PostgreSQL seed: hrm_department
-- hrm_department.sql 의 샘플 데이터 전용 파일

-- 샘플 데이터: 2026 조직 체계
WITH reorg_seed AS (
  INSERT INTO hrm_org_reorg (
    reorg_dt,
    conf_yn,
    use_yn,
    reorg_title,
    remark,
    reg_user,
    reg_dtm,
    reg_ip,
    upd_user,
    upd_dtm,
    upd_ip
  )
  VALUES (
    DATE '2026-07-11',
    'Y',
    'Y',
    '2026-07 다사랑교회 조직체계',
    '샘플 조직개편 헤더',
    'SYSTEM',
    NOW(),
    '127.0.0.1',
    'SYSTEM',
    NOW(),
    '127.0.0.1'
  )
  ON CONFLICT (reorg_dt) DO UPDATE
    SET conf_yn = EXCLUDED.conf_yn,
        use_yn = EXCLUDED.use_yn,
        reorg_title = EXCLUDED.reorg_title,
        remark = EXCLUDED.remark,
        upd_user = EXCLUDED.upd_user,
        upd_dtm = EXCLUDED.upd_dtm,
        upd_ip = EXCLUDED.upd_ip
  RETURNING reorg_key
),
top_dept AS (
  INSERT INTO hrm_org_dept (
    dept_key,
    reorg_key,
    dept_cd,
    dept_nm,
    eng_dept_nm,
    parent_dept_key,
    dept_level,
    change_type_cd,
    chef_emp_no,
    dept_sys_cd,
    use_yn,
    remark,
    reg_user,
    reg_dtm,
    reg_ip,
    upd_user,
    upd_dtm,
    upd_ip,
    ai_profile,
    extra_attributes
  )
  SELECT
    encode(gen_random_bytes(40), 'hex'),
    r.reorg_key,
    'D000000',
    '다사랑교회',
    'Dasarang Church',
    NULL,
    1,
    'NEW',
    '000002',
    'D000000',
    'Y',
    '최상위 조직',
    'SYSTEM',
    NOW(),
    '127.0.0.1',
    'SYSTEM',
    NOW(),
    '127.0.0.1',
    jsonb_build_object('summary', '교회 최상위 조직'),
    jsonb_build_object('dept_cd', 'D000000', 'dept_name', '다사랑교회', 'dept_sys_cd', 'D000000')
  FROM reorg_seed r
  ON CONFLICT (dept_cd) DO UPDATE
    SET dept_nm = EXCLUDED.dept_nm,
        eng_dept_nm = EXCLUDED.eng_dept_nm,
        parent_dept_key = EXCLUDED.parent_dept_key,
        dept_level = EXCLUDED.dept_level,
        change_type_cd = EXCLUDED.change_type_cd,
        chef_emp_no = EXCLUDED.chef_emp_no,
        dept_sys_cd = EXCLUDED.dept_sys_cd,
        use_yn = EXCLUDED.use_yn,
        remark = EXCLUDED.remark,
        upd_user = EXCLUDED.upd_user,
        upd_dtm = EXCLUDED.upd_dtm,
        upd_ip = EXCLUDED.upd_ip,
        ai_profile = EXCLUDED.ai_profile,
        extra_attributes = EXCLUDED.extra_attributes
  RETURNING dept_cd, dept_key, reorg_key
),
level2_dept AS (
  INSERT INTO hrm_org_dept (
    dept_key,
    reorg_key,
    dept_cd,
    dept_nm,
    eng_dept_nm,
    parent_dept_key,
    dept_level,
    change_type_cd,
    chef_emp_no,
    dept_sys_cd,
    use_yn,
    remark,
    reg_user,
    reg_dtm,
    reg_ip,
    upd_user,
    upd_dtm,
    upd_ip,
    ai_profile,
    extra_attributes
  )
  SELECT
    encode(gen_random_bytes(40), 'hex'),
    r.reorg_key,
    d.dept_cd,
    d.dept_nm,
    d.eng_dept_nm,
    t.dept_key,
    d.dept_level,
    d.change_type_cd,
    d.chef_emp_no,
    d.dept_sys_cd,
    d.use_yn,
    d.remark,
    'SYSTEM',
    NOW(),
    '127.0.0.1',
    'SYSTEM',
    NOW(),
    '127.0.0.1',
    d.ai_profile,
    d.extra_attributes
  FROM reorg_seed r
  CROSS JOIN top_dept t
  JOIN (VALUES
    ('D000001', '경영지원부', 'Management Support Dept', 2, 'NEW', '000003', 'D000001', 'Y', '교회 운영 지원', jsonb_build_object('summary', '경영지원부'), jsonb_build_object('dept_type', 'support')),
    ('D000002', '성도모임부', 'Member Fellowship Dept', 2, 'NEW', '000004', 'D000002', 'Y', '성도 그룹 관리', jsonb_build_object('summary', '성도모임부'), jsonb_build_object('dept_type', 'fellowship'))
  ) AS d(dept_cd, dept_nm, eng_dept_nm, dept_level, change_type_cd, chef_emp_no, dept_sys_cd, use_yn, remark, ai_profile, extra_attributes)
    ON TRUE
  ON CONFLICT (dept_cd) DO UPDATE
    SET dept_nm = EXCLUDED.dept_nm,
        eng_dept_nm = EXCLUDED.eng_dept_nm,
        parent_dept_key = EXCLUDED.parent_dept_key,
        dept_level = EXCLUDED.dept_level,
        change_type_cd = EXCLUDED.change_type_cd,
        chef_emp_no = EXCLUDED.chef_emp_no,
        dept_sys_cd = EXCLUDED.dept_sys_cd,
        use_yn = EXCLUDED.use_yn,
        remark = EXCLUDED.remark,
        upd_user = EXCLUDED.upd_user,
        upd_dtm = EXCLUDED.upd_dtm,
        upd_ip = EXCLUDED.upd_ip,
        ai_profile = EXCLUDED.ai_profile,
        extra_attributes = EXCLUDED.extra_attributes
  RETURNING dept_cd, dept_key, reorg_key
)
INSERT INTO hrm_org_dept (
  dept_key,
  reorg_key,
  dept_cd,
  dept_nm,
  eng_dept_nm,
  parent_dept_key,
  dept_level,
  change_type_cd,
  chef_emp_no,
  dept_sys_cd,
  use_yn,
  remark,
  reg_user,
  reg_dtm,
  reg_ip,
  upd_user,
  upd_dtm,
  upd_ip,
  ai_profile,
  extra_attributes
)
SELECT
  encode(gen_random_bytes(40), 'hex'),
  r.reorg_key,
  d.dept_cd,
  d.dept_nm,
  d.eng_dept_nm,
  p.dept_key,
  d.dept_level,
  d.change_type_cd,
  d.chef_emp_no,
  d.dept_sys_cd,
  d.use_yn,
  d.remark,
  'SYSTEM',
  NOW(),
  '127.0.0.1',
  'SYSTEM',
  NOW(),
  '127.0.0.1',
  d.ai_profile,
  d.extra_attributes
FROM reorg_seed r
JOIN (VALUES
  ('D000003', '재정팀', 'Finance Team', 'D000001', 3, 'NEW', '000005', 'D000003', 'Y', '재정관리', jsonb_build_object('summary', '재정팀'), jsonb_build_object('team', 'finance')),
  ('D000004', '전도팀', 'Evangelism Team', 'D000001', 3, 'NEW', '000006', 'D000004', 'Y', '전도사역', jsonb_build_object('summary', '전도팀'), jsonb_build_object('team', 'evangelism')),
  ('D000005', '차량팀', 'Vehicle Team', 'D000001', 3, 'NEW', '000008', 'D000005', 'Y', '차량운행', jsonb_build_object('summary', '차량팀'), jsonb_build_object('team', 'vehicle')),
  ('D000006', '봉사팀', 'Service Team', 'D000001', 3, 'NEW', '000009', 'D000006', 'Y', '봉사 및 지원', jsonb_build_object('summary', '봉사팀'), jsonb_build_object('team', 'service')),
  ('D000007', '새가족팀', 'Newcomer Team', 'D000001', 3, 'NEW', '000007', 'D000007', 'Y', '새가족 관리', jsonb_build_object('summary', '새가족팀'), jsonb_build_object('team', 'newcomer')),
  ('D000008', '찬양팀', 'Praise Team', 'D000001', 3, 'NEW', '000010', 'D000008', 'Y', '찬양사역', jsonb_build_object('summary', '찬양팀'), jsonb_build_object('team', 'praise')),
  ('D000009', '남A1', 'Male A1', 'D000002', 3, 'NEW', '000013', 'D000009', 'Y', '남성 1그룹', jsonb_build_object('summary', '남A1'), jsonb_build_object('group', 'male')),
  ('D000010', '남A2', 'Male A2', 'D000002', 3, 'NEW', '000014', 'D000010', 'Y', '남성 2그룹', jsonb_build_object('summary', '남A2'), jsonb_build_object('group', 'male')),
  ('D000011', '남A3', 'Male A3', 'D000002', 3, 'NEW', '000015', 'D000011', 'Y', '남성 3그룹', jsonb_build_object('summary', '남A3'), jsonb_build_object('group', 'male')),
  ('D000012', '남A4', 'Male A4', 'D000002', 3, 'NEW', '000016', 'D000012', 'Y', '남성 4그룹', jsonb_build_object('summary', '남A4'), jsonb_build_object('group', 'male')),
  ('D000013', '여A1', 'Female A1', 'D000002', 3, 'NEW', '000017', 'D000013', 'Y', '여성 1그룹', jsonb_build_object('summary', '여A1'), jsonb_build_object('group', 'female')),
  ('D000014', '여A2', 'Female A2', 'D000002', 3, 'NEW', '000018', 'D000014', 'Y', '여성 2그룹', jsonb_build_object('summary', '여A2'), jsonb_build_object('group', 'female')),
  ('D000015', '여A3', 'Female A3', 'D000002', 3, 'NEW', '000019', 'D000015', 'Y', '여성 3그룹', jsonb_build_object('summary', '여A3'), jsonb_build_object('group', 'female')),
  ('D000016', '여A4', 'Female A4', 'D000002', 3, 'NEW', '000020', 'D000016', 'Y', '여성 4그룹', jsonb_build_object('summary', '여A4'), jsonb_build_object('group', 'female')),
  ('D000017', '여A5', 'Female A5', 'D000002', 3, 'NEW', '000021', 'D000017', 'Y', '여성 5그룹', jsonb_build_object('summary', '여A5'), jsonb_build_object('group', 'female')),
  ('D000018', '여A6', 'Female A6', 'D000002', 3, 'NEW', '000022', 'D000018', 'Y', '여성 6그룹', jsonb_build_object('summary', '여A6'), jsonb_build_object('group', 'female')),
  ('D000019', '청A1', 'Youth A1', 'D000002', 3, 'NEW', '000023', 'D000019', 'Y', '청년 1그룹', jsonb_build_object('summary', '청A1'), jsonb_build_object('group', 'youth')),
  ('D000020', '청A2', 'Youth A2', 'D000002', 3, 'NEW', '000024', 'D000020', 'Y', '청년 2그룹', jsonb_build_object('summary', '청A2'), jsonb_build_object('group', 'youth'))
) AS d(dept_cd, dept_nm, eng_dept_nm, parent_dept_cd, dept_level, change_type_cd, chef_emp_no, dept_sys_cd, use_yn, remark, ai_profile, extra_attributes)
  ON TRUE
LEFT JOIN level2_dept p ON p.dept_cd = d.parent_dept_cd
ON CONFLICT (dept_cd) DO UPDATE
  SET dept_nm = EXCLUDED.dept_nm,
      eng_dept_nm = EXCLUDED.eng_dept_nm,
      parent_dept_key = EXCLUDED.parent_dept_key,
      dept_level = EXCLUDED.dept_level,
      change_type_cd = EXCLUDED.change_type_cd,
      chef_emp_no = EXCLUDED.chef_emp_no,
      dept_sys_cd = EXCLUDED.dept_sys_cd,
      use_yn = EXCLUDED.use_yn,
      remark = EXCLUDED.remark,
      upd_user = EXCLUDED.upd_user,
      upd_dtm = EXCLUDED.upd_dtm,
      upd_ip = EXCLUDED.upd_ip,
      ai_profile = EXCLUDED.ai_profile,
      extra_attributes = EXCLUDED.extra_attributes;
