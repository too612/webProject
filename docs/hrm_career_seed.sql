-- PostgreSQL seed: hrm_career
-- 경력 정보 (선교사 및 일부 성직자/리더)

WITH career_data AS (
  SELECT '000001' as emp_no, DATE '1990-01-01' as hire_date, DATE '2000-12-31' as retire_date, '신학대학교' as company_name, '104-010' as employment_type_code, '교수' as job_title, '신학과 교수 겸 학과장' as job_responsibility
  UNION ALL SELECT '000002' as emp_no, DATE '1994-03-01' as hire_date, DATE '2003-02-28' as retire_date, 'LG화학' as company_name, '104-010' as employment_type_code, '부장' as job_title, '마케팅 부장' as job_responsibility
  UNION ALL SELECT '000003' as emp_no, DATE '1992-09-01' as hire_date, DATE '2012-08-31' as retire_date, '감리교신학대학' as company_name, '104-010' as employment_type_code, '인사팀장' as job_title, '인사업무 담당' as job_responsibility
  UNION ALL SELECT '000098' as emp_no, DATE '2002-06-01' as hire_date, DATE '2011-05-31' as retire_date, 'OMF International Philippines' as company_name, '104-030' as employment_type_code, '선교사' as job_title, '필리핀 비나완 지역 선교활동' as job_responsibility
  UNION ALL SELECT '000098' as emp_no, DATE '2011-06-01' as hire_date, NULL::DATE as retire_date, 'OMF International Philippines' as company_name, '104-010' as employment_type_code, '센터장' as job_title, '필리핀 선교센터 총괄' as job_responsibility
  UNION ALL SELECT '000099' as emp_no, DATE '2005-08-01' as hire_date, DATE '2013-07-31' as retire_date, 'Hope For Children Cambodia' as company_name, '104-030' as employment_type_code, '선교사' as job_title, '캄보디아 프놈펜 지역 선교활동' as job_responsibility
  UNION ALL SELECT '000099' as emp_no, DATE '2013-08-01' as hire_date, NULL::DATE as retire_date, 'Hope For Children Cambodia' as company_name, '104-010' as employment_type_code, '교육담당' as job_title, '캄보디아 교육 프로그램 운영' as job_responsibility
  UNION ALL SELECT '000100' as emp_no, DATE '2008-02-01' as hire_date, DATE '2015-01-31' as retire_date, 'Korean Christian Mission Mongolia' as company_name, '104-020' as employment_type_code, '선교사' as job_title, '몽골 울란바토르 지역 선교활동' as job_responsibility
  UNION ALL SELECT '000100' as emp_no, DATE '2015-02-01' as hire_date, NULL::DATE as retire_date, 'Korean Christian Mission Mongolia' as company_name, '104-010' as employment_type_code, '센터장' as job_title, '몽골 선교센터 총괄' as job_responsibility
  UNION ALL SELECT '000101' as emp_no, DATE '2010-04-01' as hire_date, DATE '2017-03-31' as retire_date, 'Indonesian Christian Network' as company_name, '104-030' as employment_type_code, '선교사' as job_title, '인도네시아 자카르타 지역 선교활동' as job_responsibility
  UNION ALL SELECT '000101' as emp_no, DATE '2017-04-01' as hire_date, NULL::DATE as retire_date, 'Indonesian Christian Network' as company_name, '104-010' as employment_type_code, '여성사역담당' as job_title, '인도네시아 여성 선교 프로그램' as job_responsibility
  UNION ALL SELECT '000102' as emp_no, DATE '2013-09-01' as hire_date, DATE '2020-08-31' as retire_date, '한국미션협회' as company_name, '104-020' as employment_type_code, '선교사' as job_title, '미국 뉴욕 지역 선교활동' as job_responsibility
  UNION ALL SELECT '000102' as emp_no, DATE '2020-09-01' as hire_date, NULL::DATE as retire_date, '한국미션협회' as company_name, '104-010' as employment_type_code, '센터장' as job_title, '미국 선교센터 총괄' as job_responsibility
  -- 평신도 경력 추가: 000013~000027 (각 3개)
  UNION ALL SELECT '000013' as emp_no, DATE '1979-01-01' as hire_date, DATE '1990-12-31' as retire_date, 'SK텔레콤' as company_name, '104-010' as employment_type_code, '과장' as job_title, '통신망 관리 및 기술 개발' as job_responsibility
  UNION ALL SELECT '000013' as emp_no, DATE '1991-01-01' as hire_date, DATE '2000-12-31' as retire_date, '한국은행' as company_name, '104-010' as employment_type_code, '부장' as job_title, '경제정책 자문 및 금융분석' as job_responsibility
  UNION ALL SELECT '000013' as emp_no, DATE '2001-01-01' as hire_date, DATE '2018-12-31' as retire_date, '다사랑교회' as company_name, '104-010' as employment_type_code, '장로실장' as job_title, '교회행정 및 재정관리' as job_responsibility
  UNION ALL SELECT '000014' as emp_no, DATE '1982-03-01' as hire_date, DATE '1993-02-28' as retire_date, '삼성전자' as company_name, '104-010' as employment_type_code, '대리' as job_title, '제조공정 관리' as job_responsibility
  UNION ALL SELECT '000014' as emp_no, DATE '1993-03-01' as hire_date, DATE '2005-02-28' as retire_date, '현대자동차' as company_name, '104-010' as employment_type_code, '과장' as job_title, '품질관리 및 생산계획' as job_responsibility
  UNION ALL SELECT '000014' as emp_no, DATE '2005-03-01' as hire_date, DATE '2021-12-31' as retire_date, '삼성물산' as company_name, '104-010' as employment_type_code, '부장' as job_title, '건설사업 총괄 및 영업' as job_responsibility
  UNION ALL SELECT '000015' as emp_no, DATE '1976-03-01' as hire_date, DATE '1990-02-28' as retire_date, '대우증권' as company_name, '104-010' as employment_type_code, '과장' as job_title, '주식중개 및 투자자문' as job_responsibility
  UNION ALL SELECT '000015' as emp_no, DATE '1990-03-01' as hire_date, DATE '2005-02-28' as retire_date, '삼성물산' as company_name, '104-010' as employment_type_code, '부장' as job_title, '해외무역 및 사업개발' as job_responsibility
  UNION ALL SELECT '000015' as emp_no, DATE '2005-03-01' as hire_date, DATE '2024-12-31' as retire_date, '다사랑교회' as company_name, '104-010' as employment_type_code, '재정위원회위원장' as job_title, '교회재정관리 및 감시' as job_responsibility
  UNION ALL SELECT '000016' as emp_no, DATE '1980-03-01' as hire_date, DATE '1995-02-28' as retire_date, '한국전력' as company_name, '104-010' as employment_type_code, '기사' as job_title, '전력계통 설계 및 운영' as job_responsibility
  UNION ALL SELECT '000016' as emp_no, DATE '1995-03-01' as hire_date, DATE '2008-02-28' as retire_date, 'LG전자' as company_name, '104-010' as employment_type_code, '과장' as job_title, '가전제품 개발 및 기술지원' as job_responsibility
  UNION ALL SELECT '000016' as emp_no, DATE '2008-03-01' as hire_date, NULL::DATE as retire_date, '경영컨설팅사' as company_name, '104-010' as employment_type_code, '이사' as job_title, '기업경영 컨설팅' as job_responsibility
  UNION ALL SELECT '000017' as emp_no, DATE '1974-03-01' as hire_date, DATE '1987-02-28' as retire_date, '신세계백화점' as company_name, '104-010' as employment_type_code, '대리' as job_title, '매장관리 및 고객서비스' as job_responsibility
  UNION ALL SELECT '000017' as emp_no, DATE '1987-03-01' as hire_date, DATE '2000-02-28' as retire_date, '롯데마트' as company_name, '104-010' as employment_type_code, '과장' as job_title, '상품기획 및 구매' as job_responsibility
  UNION ALL SELECT '000017' as emp_no, DATE '2000-03-01' as hire_date, DATE '2024-12-31' as retire_date, '다사랑교회' as company_name, '104-010' as employment_type_code, '권사회장' as job_title, '신도관리 및 봉사활동' as job_responsibility
  UNION ALL SELECT '000018' as emp_no, DATE '1981-03-01' as hire_date, DATE '1996-02-28' as retire_date, 'LG화학' as company_name, '104-010' as employment_type_code, '기사' as job_title, '화학제품 생산관리' as job_responsibility
  UNION ALL SELECT '000018' as emp_no, DATE '1996-03-01' as hire_date, DATE '2010-02-28' as retire_date, 'SK이노베이션' as company_name, '104-010' as employment_type_code, '과장' as job_title, '에너지정책 및 사업전략' as job_responsibility
  UNION ALL SELECT '000018' as emp_no, DATE '2010-03-01' as hire_date, NULL::DATE as retire_date, '사회복지단체' as company_name, '104-010' as employment_type_code, '부원장' as job_title, '복지사업 운영 및 관리' as job_responsibility
  UNION ALL SELECT '000019' as emp_no, DATE '1974-03-01' as hire_date, DATE '1988-02-28' as retire_date, '삼성그룹' as company_name, '104-010' as employment_type_code, '주임' as job_title, '계획 및 조정업무' as job_responsibility
  UNION ALL SELECT '000019' as emp_no, DATE '1988-03-01' as hire_date, DATE '2003-02-28' as retire_date, '현대그룹' as company_name, '104-010' as employment_type_code, '과장' as job_title, '자동차 부품 개발' as job_responsibility
  UNION ALL SELECT '000019' as emp_no, DATE '2003-03-01' as hire_date, DATE '2024-12-31' as retire_date, '기독교기관' as company_name, '104-010' as employment_type_code, '실장' as job_title, '사역 관리 및 운영' as job_responsibility
  UNION ALL SELECT '000020' as emp_no, DATE '1983-03-01' as hire_date, DATE '1997-02-28' as retire_date, '농협' as company_name, '104-010' as employment_type_code, '대리' as job_title, '여신 및 신용조사' as job_responsibility
  UNION ALL SELECT '000020' as emp_no, DATE '1997-03-01' as hire_date, DATE '2012-02-28' as retire_date, '우리은행' as company_name, '104-010' as employment_type_code, '과장' as job_title, '개인금융 및 대출상품 개발' as job_responsibility
  UNION ALL SELECT '000020' as emp_no, DATE '2012-03-01' as hire_date, NULL::DATE as retire_date, '교회금융관리팀' as company_name, '104-010' as employment_type_code, '팀장' as job_title, '교회재정 및 회계관리' as job_responsibility
  UNION ALL SELECT '000021' as emp_no, DATE '1977-03-01' as hire_date, DATE '1991-02-28' as retire_date, '서울교통공사' as company_name, '104-010' as employment_type_code, '기사' as job_title, '지하철 운영 및 관리' as job_responsibility
  UNION ALL SELECT '000021' as emp_no, DATE '1991-03-01' as hire_date, DATE '2006-02-28' as retire_date, '한국철도공사' as company_name, '104-010' as employment_type_code, '과장' as job_title, '철도운영 및 안전관리' as job_responsibility
  UNION ALL SELECT '000021' as emp_no, DATE '2006-03-01' as hire_date, DATE '2024-12-31' as retire_date, '다사랑교회' as company_name, '104-010' as employment_type_code, '권사' as job_title, '봉사활동 조직 및 운영' as job_responsibility
  UNION ALL SELECT '000022' as emp_no, DATE '1985-03-01' as hire_date, DATE '1999-02-28' as retire_date, '삼성물산' as company_name, '104-010' as employment_type_code, '대리' as job_title, '의류사업 관리' as job_responsibility
  UNION ALL SELECT '000022' as emp_no, DATE '1999-03-01' as hire_date, DATE '2015-02-28' as retire_date, '한진칠성' as company_name, '104-010' as employment_type_code, '과장' as job_title, '물류및배송관리' as job_responsibility
  UNION ALL SELECT '000022' as emp_no, DATE '2015-03-01' as hire_date, NULL::DATE as retire_date, '기독여성회' as company_name, '104-010' as employment_type_code, '이사' as job_title, '여성신도 교육 및 선도' as job_responsibility
  UNION ALL SELECT '000023' as emp_no, DATE '2002-03-01' as hire_date, DATE '2012-02-28' as retire_date, 'CJ대한통운' as company_name, '104-010' as employment_type_code, '대리' as job_title, '물류센터 운영' as job_responsibility
  UNION ALL SELECT '000023' as emp_no, DATE '2012-03-01' as hire_date, DATE '2019-02-28' as retire_date, 'GS리테일' as company_name, '104-010' as employment_type_code, '과장' as job_title, '편의점 운영관리' as job_responsibility
  UNION ALL SELECT '000023' as emp_no, DATE '2019-03-01' as hire_date, NULL::DATE as retire_date, '무역회사' as company_name, '104-010' as employment_type_code, '팀장' as job_title, '해외영업 및 기획' as job_responsibility
  UNION ALL SELECT '000024' as emp_no, DATE '2004-03-01' as hire_date, DATE '2014-02-28' as retire_date, '한화테크윈' as company_name, '104-010' as employment_type_code, '대리' as job_title, '항공우주제품 개발' as job_responsibility
  UNION ALL SELECT '000024' as emp_no, DATE '2014-03-01' as hire_date, DATE '2021-02-28' as retire_date, '포스코' as company_name, '104-010' as employment_type_code, '과장' as job_title, '철강제조공정 관리' as job_responsibility
  UNION ALL SELECT '000024' as emp_no, DATE '2021-03-01' as hire_date, NULL::DATE as retire_date, '신용평가회사' as company_name, '104-010' as employment_type_code, '과장' as job_title, '신용평가 및 리스크분석' as job_responsibility
  UNION ALL SELECT '000025' as emp_no, DATE '2003-03-01' as hire_date, DATE '2013-02-28' as retire_date, '한국타이어' as company_name, '104-010' as employment_type_code, '대리' as job_title, '타이어제조공정 관리' as job_responsibility
  UNION ALL SELECT '000025' as emp_no, DATE '2013-03-01' as hire_date, DATE '2020-02-28' as retire_date, '현대중공업' as company_name, '104-010' as employment_type_code, '과장' as job_title, '조선 기자재 개발' as job_responsibility
  UNION ALL SELECT '000025' as emp_no, DATE '2020-03-01' as hire_date, NULL::DATE as retire_date, '경영진단컨설팅' as company_name, '104-010' as employment_type_code, '컨설턴트' as job_title, '제조업 혁신컨설팅' as job_responsibility
  UNION ALL SELECT '000026' as emp_no, DATE '2005-03-01' as hire_date, DATE '2015-02-28' as retire_date, 'KT' as company_name, '104-010' as employment_type_code, '기사' as job_title, '통신인프라 구축' as job_responsibility
  UNION ALL SELECT '000026' as emp_no, DATE '2015-03-01' as hire_date, DATE '2022-02-28' as retire_date, 'LG U+' as company_name, '104-010' as employment_type_code, '과장' as job_title, 'IPTV 및 방송사업' as job_responsibility
  UNION ALL SELECT '000026' as emp_no, DATE '2022-03-01' as hire_date, NULL::DATE as retire_date, '정보통신회사' as company_name, '104-010' as employment_type_code, '부장' as job_title, '5G 네트워크 기획' as job_responsibility
  UNION ALL SELECT '000027' as emp_no, DATE '2008-03-01' as hire_date, DATE '2017-02-28' as retire_date, '외교부' as company_name, '104-010' as employment_type_code, '주사' as job_title, '국제협력 및 통상' as job_responsibility
  UNION ALL SELECT '000027' as emp_no, DATE '2017-03-01' as hire_date, DATE '2023-02-28' as retire_date, '대한무역투자진흥공사' as company_name, '104-010' as employment_type_code, '과장' as job_title, '수출입 지원 및 마케팅' as job_responsibility
  UNION ALL SELECT '000027' as emp_no, DATE '2023-03-01' as hire_date, NULL::DATE as retire_date, '국제교류기금' as company_name, '104-010' as employment_type_code, '이사' as job_title, '다문화 교류사업 총괄' as job_responsibility
  UNION ALL SELECT '000098' as emp_no, DATE '2002-06-01' as hire_date, DATE '2011-05-31' as retire_date, 'OMF International Philippines' as company_name, '104-030' as employment_type_code, '선교사' as job_title, '필리핀 비나완 지역 선교활동' as job_responsibility
)
INSERT INTO hrm_career (
  career_key, person_key, employee_no,
  hire_date, retire_date, company_name,
  employment_type_code, job_title, job_responsibility,
  del_yn, reg_user, reg_dtm, reg_user_ip, upd_user, upd_dtm, upd_user_ip
)
SELECT
  encode(gen_random_bytes(40), 'hex') as career_key,
  hp.person_key,
  cd.emp_no as employee_no,
  cd.hire_date,
  cd.retire_date,
  cd.company_name,
  cd.employment_type_code,
  cd.job_title,
  cd.job_responsibility,
  'N' as del_yn,
  'SYSTEM' as reg_user,
  NOW() as reg_dtm,
  '127.0.0.1' as reg_user_ip,
  'SYSTEM' as upd_user,
  NOW() as upd_dtm,
  '127.0.0.1' as upd_user_ip
FROM career_data cd
INNER JOIN hrm_person hp ON hp.employee_no = cd.emp_no
ON CONFLICT (career_key) DO NOTHING;
