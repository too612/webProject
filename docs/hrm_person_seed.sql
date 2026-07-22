-- PostgreSQL seed: hrm_person
-- hrm_person.sql 의 샘플 데이터 전용 파일

-- 1) 목회자 12명: 원로목사 1, 담임목사 1, 부목사 2, 강도사 3, 전도사 5
WITH clergy_seed AS (
  SELECT * FROM (VALUES
    ('000001','박영수','Youngsoo Park',NULL,'D000000','다사랑교회','102-010','104-010','101-010',DATE '1965-01-12','M',DATE '2000-01-01',NULL::DATE,NULL::DATE,'원로목사', '{"tags":["pastor","senior"]}'::jsonb),
    ('000002','김민수','Minsu Kim',NULL,'D000000','다사랑교회','102-020','104-010','101-010',DATE '1972-03-12','M',DATE '2003-03-01',NULL::DATE,NULL::DATE,'담임목사', '{"tags":["pastor","lead"]}'::jsonb),
    ('000003','박성훈','Sunghoon Park',NULL,'D000001','경영지원부','102-030','104-010','101-010',DATE '1978-11-02','M',DATE '2012-09-01',NULL::DATE,NULL::DATE,'부목사', '{"tags":["pastor","support"]}'::jsonb),
    ('000004','최도윤','Doyoon Choi',NULL,'D000002','성도모임부','102-030','104-010','101-010',DATE '1980-05-30','M',DATE '2014-06-01',NULL::DATE,NULL::DATE,'부목사', '{"tags":["pastor","fellowship"]}'::jsonb),
    ('000005','정현우','Hyunwoo Jung',NULL,'D000003','재정팀','102-040','104-010','101-010',DATE '1982-01-09','M',DATE '2016-01-02',NULL::DATE,NULL::DATE,'강도사', '{"tags":["pastor","finance"]}'::jsonb),
    ('000006','한지은','Jieun Han',NULL,'D000004','전도팀','102-040','104-010','101-010',DATE '1984-09-17','F',DATE '2018-03-01',NULL::DATE,NULL::DATE,'강도사', '{"tags":["pastor","evangelism"]}'::jsonb),
    ('000007','오하나','Hana Oh',NULL,'D000007','새가족팀','102-040','104-010','101-010',DATE '1983-06-05','F',DATE '2019-04-01',NULL::DATE,NULL::DATE,'강도사', '{"tags":["pastor","newcomer"]}'::jsonb),
    ('000008','윤서연','Seoyeon Yoon',NULL,'D000005','차량팀','102-050','104-010','101-010',DATE '1986-12-25','F',DATE '2020-07-01',NULL::DATE,NULL::DATE,'전도사', '{"tags":["pastor","vehicle"]}'::jsonb),
    ('000009','강수진','Sujin Kang',NULL,'D000006','봉사팀','102-050','104-010','101-010',DATE '1987-04-11','F',DATE '2020-08-01',NULL::DATE,NULL::DATE,'전도사', '{"tags":["pastor","service"]}'::jsonb),
    ('000010','신가영','Gayoung Shin',NULL,'D000008','찬양팀','102-050','104-010','101-010',DATE '1988-10-28','F',DATE '2021-01-01',NULL::DATE,NULL::DATE,'전도사', '{"tags":["pastor","praise"]}'::jsonb),
    ('000011','이다희','Dahui Lee',NULL,'D000005','차량팀','102-050','104-010','101-010',DATE '1990-02-14','F',DATE '2021-09-01',NULL::DATE,NULL::DATE,'전도사', '{"tags":["pastor","vehicle"]}'::jsonb),
    ('000012','김예린','Yerin Kim',NULL,'D000008','찬양팀','102-050','104-010','101-010',DATE '1991-07-07','F',DATE '2022-02-01',NULL::DATE,NULL::DATE,'전도사', '{"tags":["pastor","praise"]}'::jsonb)
  ) AS t(employee_no, name_ko, name_en, name_hanja, dept_cd, dept_name, grade_code, employment_type_code, service_status_code, birth_date, gender_code, hire_date, retire_date, promotion_date, role_name, ai_payload)
)
INSERT INTO hrm_person (
  employee_no, name_ko, name_en, name_hanja, dept_cd, grade_code, position_code, employment_type_code, service_status_code,
  rrn_hash_sha256, postal_code, address_line1, address_line2, birth_date, gender_code, hire_date, retire_date, promotion_date,
  photo_url, profile_photo_url, reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip, ai_profile, extra_attributes
)
SELECT
  s.employee_no,
  s.name_ko,
  s.name_en,
  s.name_hanja,
  s.dept_cd,
  s.grade_code,
  NULL,
  s.employment_type_code,
  s.service_status_code,
  encode(digest(s.employee_no || s.name_ko, 'sha256'), 'hex'),
  NULL,
  NULL,
  NULL,
  s.birth_date,
  s.gender_code,
  s.hire_date,
  s.retire_date,
  s.promotion_date,
  'data/humen/' || s.employee_no || '.png',
  'data/humen/' || s.employee_no || '_profile.png',
  'SYSTEM', NOW(), '127.0.0.1'::inet, 'SYSTEM', NOW(), '127.0.0.1'::inet,
  jsonb_build_object('summary', s.role_name || ' 샘플', 'role', s.role_name, 'dept_cd', s.dept_cd, 'dept_name', s.dept_name) || s.ai_payload,
  jsonb_build_object('dept_cd', s.dept_cd, 'dept_name', s.dept_name, 'role', s.role_name)
FROM clergy_seed s
ON CONFLICT (employee_no) DO NOTHING;

-- 2) 부서장/리더 15명: 은퇴장로 2, 장로 2, 은퇴권사 3, 권사 3, 안수집사 5
WITH lay_head_seed AS (
  SELECT * FROM (VALUES
    ('000013','이정호','Jungho Lee',NULL,'D000009','남A1','103-010','104-020','101-020',DATE '1959-01-04','M',DATE '2018-01-01',DATE '2024-12-31',NULL::DATE,'은퇴장로', '{"tags":["elder-retired"]}'::jsonb),
    ('000014','김성호','Sungho Kim',NULL,'D000010','남A2','103-020','104-020','101-010',DATE '1964-03-21','M',DATE '2019-01-01',NULL::DATE,NULL::DATE,'장로', '{"tags":["elder"]}'::jsonb),
    ('000015','박영호','Youngho Park',NULL,'D000011','남A3','103-010','104-020','101-020',DATE '1958-05-11','M',DATE '2017-01-01',DATE '2024-12-31',NULL::DATE,'은퇴장로', '{"tags":["elder-retired"]}'::jsonb),
    ('000016','최영호','Youngho Choi',NULL,'D000012','남A4','103-020','104-020','101-010',DATE '1962-07-19','M',DATE '2019-02-01',NULL::DATE,NULL::DATE,'장로', '{"tags":["elder"]}'::jsonb),
    ('000017','정순자','Soonja Jeong',NULL,'D000013','여A1','103-040','104-020','101-020',DATE '1957-02-02','F',DATE '2016-03-01',DATE '2024-12-31',NULL::DATE,'은퇴권사', '{"tags":["deaconess-retired"]}'::jsonb),
    ('000018','한명자','Myeongja Han',NULL,'D000014','여A2','103-050','104-020','101-010',DATE '1963-08-10','F',DATE '2018-03-01',NULL::DATE,NULL::DATE,'권사', '{"tags":["deaconess"]}'::jsonb),
    ('000019','박복순','Boksun Park',NULL,'D000015','여A3','103-040','104-020','101-020',DATE '1956-11-14','F',DATE '2015-03-01',DATE '2024-12-31',NULL::DATE,'은퇴권사', '{"tags":["deaconess-retired"]}'::jsonb),
    ('000020','이순희','Sunhee Lee',NULL,'D000016','여A4','103-050','104-020','101-010',DATE '1965-09-09','F',DATE '2018-04-01',NULL::DATE,NULL::DATE,'권사', '{"tags":["deaconess"]}'::jsonb),
    ('000021','윤은자','Eunja Yoon',NULL,'D000017','여A5','103-040','104-020','101-020',DATE '1959-06-17','F',DATE '2014-02-01',DATE '2024-12-31',NULL::DATE,'은퇴권사', '{"tags":["deaconess-retired"]}'::jsonb),
    ('000022','김미영','Miyoung Kim',NULL,'D000018','여A6','103-050','104-020','101-010',DATE '1967-12-03','F',DATE '2019-03-01',NULL::DATE,NULL::DATE,'권사', '{"tags":["deaconess"]}'::jsonb),
    ('000023','장민석','Minseok Jang',NULL,'D000019','청A1','103-060','104-030','101-010',DATE '1984-03-16','M',DATE '2020-01-01',NULL::DATE,NULL::DATE,'안수집사', '{"tags":["ordained-deacon"]}'::jsonb),
    ('000024','유재호','Jaeho Yu',NULL,'D000020','청A2','103-060','104-030','101-010',DATE '1986-04-23','M',DATE '2020-01-01',NULL::DATE,NULL::DATE,'안수집사', '{"tags":["ordained-deacon"]}'::jsonb),
    ('000025','강철수','Cheolsu Kang',NULL,'D000019','청A1','103-060','104-030','101-010',DATE '1985-05-30','M',DATE '2020-02-01',NULL::DATE,NULL::DATE,'안수집사', '{"tags":["ordained-deacon"]}'::jsonb),
    ('000026','오세훈','Sehoon Oh',NULL,'D000020','청A2','103-060','104-030','101-010',DATE '1987-06-14','M',DATE '2020-02-01',NULL::DATE,NULL::DATE,'안수집사', '{"tags":["ordained-deacon"]}'::jsonb),
    ('000027','홍길동','Gildong Hong',NULL,'D000019','청A1','103-060','104-030','101-010',DATE '1988-07-07','M',DATE '2020-02-01',NULL::DATE,NULL::DATE,'안수집사', '{"tags":["ordained-deacon"]}'::jsonb)
  ) AS t(employee_no, name_ko, name_en, name_hanja, dept_cd, dept_name, position_code, employment_type_code, service_status_code, birth_date, gender_code, hire_date, retire_date, promotion_date, role_name, ai_payload)
)
INSERT INTO hrm_person (
  employee_no, name_ko, name_en, name_hanja, dept_cd, grade_code, position_code, employment_type_code, service_status_code,
  rrn_hash_sha256, postal_code, address_line1, address_line2, birth_date, gender_code, hire_date, retire_date, promotion_date,
  photo_url, profile_photo_url, reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip, ai_profile, extra_attributes
)
SELECT
  s.employee_no,
  s.name_ko,
  s.name_en,
  s.name_hanja,
  s.dept_cd,
  NULL,
  s.position_code,
  s.employment_type_code,
  s.service_status_code,
  encode(digest(s.employee_no || s.name_ko, 'sha256'), 'hex'),
  NULL,
  NULL,
  NULL,
  s.birth_date,
  s.gender_code,
  s.hire_date,
  s.retire_date,
  s.promotion_date,
  'data/humen/' || s.employee_no || '.png',
  'data/humen/' || s.employee_no || '_profile.png',
  'SYSTEM', NOW(), '127.0.0.1'::inet, 'SYSTEM', NOW(), '127.0.0.1'::inet,
  jsonb_build_object('summary', s.role_name || ' 샘플', 'role', s.role_name, 'dept_cd', s.dept_cd, 'dept_name', s.dept_name) || s.ai_payload,
  jsonb_build_object('dept_cd', s.dept_cd, 'dept_name', s.dept_name, 'role', s.role_name)
FROM lay_head_seed s
ON CONFLICT (employee_no) DO NOTHING;

-- 3) 집사 50명
WITH deacon_seed AS (
  SELECT
    lpad((27 + gs)::text, 6, '0') AS employee_no,
    (ARRAY[
      '김도현','이주원','박민수','최서준','정우진','강민호','조현우','윤지훈','장도윤','임성민',
      '한수진','오지영','서미경','신혜진','권은정','황유진','안소영','송미란','류은지','전하나',
      '고민재','문지후','남시우','백준호','양태윤','유민석','노현준','하정우','곽진우','변도훈',
      '진미숙','채은영','표선영','주혜란','우명희','구서연','민지수','탁은경','견하영','사정민',
      '여준혁','추도현','편지훈','제민우','도서진','마예린','반수아','왕지민','성다은','기하율'
    ])[gs] AS name_ko,
    NULL::text AS name_en,
    NULL::text AS name_hanja,
    '103-070'::text AS position_code,
    CASE WHEN gs % 3 = 0 THEN '104-010' WHEN gs % 3 = 1 THEN '104-020' ELSE '104-030' END AS employment_type_code,
    '101-010'::text AS service_status_code,
    DATE '1970-01-01' + (gs * 11) AS birth_date,
    CASE ((gs - 1) % 12) + 1
      WHEN 1 THEN 'M'
      WHEN 2 THEN 'M'
      WHEN 3 THEN 'M'
      WHEN 4 THEN 'M'
      WHEN 5 THEN 'F'
      WHEN 6 THEN 'F'
      WHEN 7 THEN 'F'
      WHEN 8 THEN 'F'
      WHEN 9 THEN 'F'
      WHEN 10 THEN 'F'
      WHEN 11 THEN 'M'
      ELSE 'F'
    END AS gender_code,
    DATE '2010-01-01' + (gs * 5) AS hire_date,
    NULL::date AS retire_date,
    NULL::date AS promotion_date,
    CASE ((gs - 1) % 12) + 1
      WHEN 1 THEN 'D000009'
      WHEN 2 THEN 'D000010'
      WHEN 3 THEN 'D000011'
      WHEN 4 THEN 'D000012'
      WHEN 5 THEN 'D000013'
      WHEN 6 THEN 'D000014'
      WHEN 7 THEN 'D000015'
      WHEN 8 THEN 'D000016'
      WHEN 9 THEN 'D000017'
      WHEN 10 THEN 'D000018'
      WHEN 11 THEN 'D000019'
      ELSE 'D000020'
    END AS dept_cd,
    '집사'::text AS role_name
  FROM generate_series(1, 50) gs
)
INSERT INTO hrm_person (
  employee_no, name_ko, name_en, name_hanja, dept_cd, grade_code, position_code, employment_type_code, service_status_code,
  rrn_hash_sha256, postal_code, address_line1, address_line2, birth_date, gender_code, hire_date, retire_date, promotion_date,
  photo_url, profile_photo_url, reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip, ai_profile, extra_attributes
)
SELECT
  s.employee_no,
  s.name_ko,
  s.name_en,
  s.name_hanja,
  s.dept_cd,
  NULL,
  s.position_code,
  s.employment_type_code,
  s.service_status_code,
  encode(digest(s.employee_no || s.name_ko, 'sha256'), 'hex'),
  NULL,
  NULL,
  NULL,
  s.birth_date,
  s.gender_code,
  s.hire_date,
  s.retire_date,
  s.promotion_date,
  'data/humen/' || s.employee_no || '.png',
  'data/humen/' || s.employee_no || '_profile.png',
  'SYSTEM', NOW(), '127.0.0.1'::inet, 'SYSTEM', NOW(), '127.0.0.1'::inet,
  jsonb_build_object('summary', s.role_name || ' 샘플', 'role', s.role_name, 'dept_cd', s.dept_cd) ,
  jsonb_build_object(
    'dept_cd', s.dept_cd,
    'dept_name', CASE s.dept_cd
      WHEN 'D000009' THEN '남A1'
      WHEN 'D000010' THEN '남A2'
      WHEN 'D000011' THEN '남A3'
      WHEN 'D000012' THEN '남A4'
      WHEN 'D000013' THEN '여A1'
      WHEN 'D000014' THEN '여A2'
      WHEN 'D000015' THEN '여A3'
      WHEN 'D000016' THEN '여A4'
      WHEN 'D000017' THEN '여A5'
      WHEN 'D000018' THEN '여A6'
      WHEN 'D000019' THEN '청A1'
      ELSE '청A2'
    END,
    'role', s.role_name
  )
FROM deacon_seed s
ON CONFLICT (employee_no) DO NOTHING;

-- 4) 성도 20명
WITH saint_seed AS (
  SELECT
    lpad((77 + gs)::text, 6, '0') AS employee_no,
    (ARRAY[
      '김하준','이서율','박지안','최도경','정시온','강예준','조하람','윤서후','장유찬','임가온',
      '한지원','오다인','서채원','신유나','권하린','황세아','안나윤','송주아','류소민','전예나'
    ])[gs] AS name_ko,
    NULL::text AS name_en,
    NULL::text AS name_hanja,
    '103-080'::text AS position_code,
    '104-030'::text AS employment_type_code,
    '101-010'::text AS service_status_code,
    DATE '1992-01-01' + (gs * 17) AS birth_date,
    CASE WHEN gs % 2 = 0 THEN 'F' ELSE 'M' END AS gender_code,
    DATE '2018-01-01' + (gs * 3) AS hire_date,
    NULL::date AS retire_date,
    NULL::date AS promotion_date,
    CASE WHEN gs % 2 = 0 THEN 'D000019' ELSE 'D000020' END AS dept_cd,
    '성도'::text AS role_name
  FROM generate_series(1, 20) gs
)
INSERT INTO hrm_person (
  employee_no, name_ko, name_en, name_hanja, dept_cd, grade_code, position_code, employment_type_code, service_status_code,
  rrn_hash_sha256, postal_code, address_line1, address_line2, birth_date, gender_code, hire_date, retire_date, promotion_date,
  photo_url, profile_photo_url, reg_user, reg_dtm, reg_ip, upd_user, upd_dtm, upd_ip, ai_profile, extra_attributes
)
SELECT
  s.employee_no,
  s.name_ko,
  s.name_en,
  s.name_hanja,
  s.dept_cd,
  NULL,
  s.position_code,
  s.employment_type_code,
  s.service_status_code,
  encode(digest(s.employee_no || s.name_ko, 'sha256'), 'hex'),
  NULL,
  NULL,
  NULL,
  s.birth_date,
  s.gender_code,
  s.hire_date,
  s.retire_date,
  s.promotion_date,
  'data/humen/' || s.employee_no || '.png',
  'data/humen/' || s.employee_no || '_profile.png',
  'SYSTEM', NOW(), '127.0.0.1'::inet, 'SYSTEM', NOW(), '127.0.0.1'::inet,
  jsonb_build_object('summary', s.role_name || ' 샘플', 'role', s.role_name, 'dept_cd', s.dept_cd),
  jsonb_build_object('dept_cd', s.dept_cd, 'dept_name', CASE WHEN s.dept_cd = 'D000019' THEN '청A1' ELSE '청A2' END, 'role', s.role_name)
FROM saint_seed s
ON CONFLICT (employee_no) DO NOTHING;
