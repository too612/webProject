    -- PostgreSQL seed: hrm_assignment
    -- 발령 정보 (성직자/리더 및 선교사)

    WITH assignment_data AS (
    SELECT '000001' as emp_no, DATE '2000-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000000' as dept_cd, '104-010' as employment_type_code, '102-010' as grade_code, NULL as position_code, NULL as job_title_code, '원로목사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000002' as emp_no, DATE '2003-03-01' as assignment_date, '105-010' as assignment_type_code, 'D000000' as dept_cd, '104-010' as employment_type_code, '102-020' as grade_code, NULL as position_code, NULL as job_title_code, '담임목사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000003' as emp_no, DATE '2012-09-01' as assignment_date, '105-010' as assignment_type_code, 'D000001' as dept_cd, '104-010' as employment_type_code, '102-030' as grade_code, NULL as position_code, NULL as job_title_code, '부목사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000004' as emp_no, DATE '2014-06-01' as assignment_date, '105-010' as assignment_type_code, 'D000002' as dept_cd, '104-010' as employment_type_code, '102-030' as grade_code, NULL as position_code, NULL as job_title_code, '부목사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000004' as emp_no, DATE '2015-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000002' as dept_cd, '104-010' as employment_type_code, '102-030' as grade_code, NULL as position_code, '106-010' as job_title_code, '부서장 겸임' as assignment_content, NULL::DATE as assignment_end_date, 'Y' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000005' as emp_no, DATE '2016-01-02' as assignment_date, '105-010' as assignment_type_code, 'D000003' as dept_cd, '104-010' as employment_type_code, '102-040' as grade_code, NULL as position_code, NULL as job_title_code, '강도사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000006' as emp_no, DATE '2018-03-01' as assignment_date, '105-010' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-040' as grade_code, NULL as position_code, NULL as job_title_code, '강도사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000007' as emp_no, DATE '2019-04-01' as assignment_date, '105-010' as assignment_type_code, 'D000007' as dept_cd, '104-010' as employment_type_code, '102-040' as grade_code, NULL as position_code, NULL as job_title_code, '강도사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000014' as emp_no, DATE '2019-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000010' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, '103-020' as position_code, NULL as job_title_code, '장로 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000018' as emp_no, DATE '2018-03-01' as assignment_date, '105-010' as assignment_type_code, 'D000014' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, '103-050' as position_code, NULL as job_title_code, '권사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000023' as emp_no, DATE '2020-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000019' as dept_cd, '104-030' as employment_type_code, NULL as grade_code, '103-060' as position_code, NULL as job_title_code, '안수집사 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000098' as emp_no, DATE '2011-03-01' as assignment_date, '105-030' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-060' as grade_code, NULL as position_code, NULL as job_title_code, '필리핀 선교 파견' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, 'PH' as dispatch_country_code
    UNION ALL SELECT '000099' as emp_no, DATE '2013-08-01' as assignment_date, '105-030' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-060' as grade_code, NULL as position_code, NULL as job_title_code, '캄보디아 선교 파견' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, 'KH' as dispatch_country_code
    UNION ALL SELECT '000100' as emp_no, DATE '2015-02-01' as assignment_date, '105-030' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-060' as grade_code, NULL as position_code, NULL as job_title_code, '몽골 선교 파견' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, 'MN' as dispatch_country_code
    UNION ALL SELECT '000101' as emp_no, DATE '2017-04-01' as assignment_date, '105-030' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-060' as grade_code, NULL as position_code, NULL as job_title_code, '인도네시아 선교 파견' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, 'ID' as dispatch_country_code
    UNION ALL SELECT '000102' as emp_no, DATE '2020-03-01' as assignment_date, '105-030' as assignment_type_code, 'D000004' as dept_cd, '104-010' as employment_type_code, '102-060' as grade_code, NULL as position_code, NULL as job_title_code, '미국 선교 파견' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, 'US' as dispatch_country_code
    UNION ALL SELECT '000013' as emp_no, DATE '2018-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000009' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, '103-010' as position_code, NULL as job_title_code, '은퇴장로 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000013' as emp_no, DATE '2024-12-31' as assignment_date, '105-020' as assignment_type_code, 'D000009' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, NULL as position_code, NULL as job_title_code, '면직 처리' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000015' as emp_no, DATE '2017-01-01' as assignment_date, '105-010' as assignment_type_code, 'D000011' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, '103-010' as position_code, NULL as job_title_code, '은퇴장로 임명' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    UNION ALL SELECT '000015' as emp_no, DATE '2024-12-31' as assignment_date, '105-020' as assignment_type_code, 'D000011' as dept_cd, '104-020' as employment_type_code, NULL as grade_code, NULL as position_code, NULL as job_title_code, '면직 처리' as assignment_content, NULL::DATE as assignment_end_date, 'N' as concurrent_assignment_yn, NULL as dispatch_country_code
    )
    INSERT INTO hrm_assignment (
    assignment_key, person_key, employee_no,
    assignment_date, assignment_type_code, dept_cd,
    employment_type_code, grade_code, position_code, job_title_code,
    assignment_content, assignment_end_date, concurrent_assignment_yn,
    dispatch_country_code, del_yn, reg_user, reg_dtm, reg_user_ip, upd_user, upd_dtm, upd_user_ip
    )
    SELECT
    encode(gen_random_bytes(40), 'hex') as assignment_key,
    hp.person_key,
    ad.emp_no as employee_no,
    ad.assignment_date,
    ad.assignment_type_code,
    ad.dept_cd,
    ad.employment_type_code,
    ad.grade_code,
    ad.position_code,
    ad.job_title_code,
    ad.assignment_content,
    ad.assignment_end_date,
    ad.concurrent_assignment_yn,
    ad.dispatch_country_code,
    'N' as del_yn,
    'SYSTEM' as reg_user,
    NOW() as reg_dtm,
    '127.0.0.1' as reg_user_ip,
    'SYSTEM' as upd_user,
    NOW() as upd_dtm,
    '127.0.0.1' as upd_user_ip
    FROM assignment_data ad
    INNER JOIN hrm_person hp ON hp.employee_no = ad.emp_no
    ON CONFLICT (assignment_key) DO NOTHING;
