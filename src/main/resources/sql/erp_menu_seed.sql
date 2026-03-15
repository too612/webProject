

--sys_menu_mgt 테이블 컬럼명
menu_id menu_nm up_menu_id path order_no level

-- 실제 db
M_ADM	시스템관리		/system	1	0
M_ADM_01	사용자/권한관리	M_ADM	/user/manager	1	1
M_ADM_01_01	사용자계정관리	M_ADM_01	/user/manager	1	2
M_ADM_01_02	권한역할관리	M_ADM_01	/user/role	2	2
M_ADM_02	운영설정관리	M_ADM	/config/code	2	1
M_ADM_02_01	공통코드관리	M_ADM_02	/config/code	1	2
M_ADM_02_02	메뉴권한관리	M_ADM_02	/config/menu	2	2
M_ADM_03	로그/감사관리	M_ADM	/log/system	3	1
M_ADM_03_01	시스템로그조회	M_ADM_03	/log/system	1	2
M_ADM_03_02	감사추적관리	M_ADM_03	/log/audit	2	2
M_ADM_04	백업/복구관리	M_ADM	/backup/policy	4	1
M_ADM_04_01	백업정책관리	M_ADM_04	/backup/policy	1	2
M_ADM_04_02	복구이력관리	M_ADM_04	/backup/history	2	2
M_COM	공통			1	0
M_COM_01	회원관리	M_COM		1	1
M_COM_01_01	로그인	M_COM_01	/user/login	1	2
M_COM_01_02	회원가입	M_COM_01	/user/register	2	2
M_GEN	커뮤니티메인			1	0
M_GEN_01	셀모임관리	M_GEN	/group/manager	1	1
M_GEN_01_01	셀모임통합현황	M_GEN_01	/group/manager	1	2
M_GEN_01_02	청년셀1팀	M_GEN_01	/group/groupa1	2	2
M_GEN_01_03	장년부2팀	M_GEN_01	/group/groupb2	3	2
M_GEN_02	교회관리	M_GEN	/facilities/calendar	2	1
M_GEN_02_01	연간일정관리	M_GEN_02	/facilities/calendar	1	2
M_GEN_02_02	식당봉사일정	M_GEN_02	/facilities/dining	2	2
M_GEN_02_03	전도일정	M_GEN_02	/facilities/prayer	3	2
M_GEN_03	성도소식	M_GEN	/saint/family	3	1
M_GEN_03_01	경조사	M_GEN_03	/saint/family	1	2
M_GEN_03_02	기도제목	M_GEN_03	/saint/pray	2	2
M_GEN_03_03	알뜰시장	M_GEN_03	/saint/sales	3	2
M_GEN_03_04	일자리채용	M_GEN_03	/saint/job	4	2
M_GEN_04	일반뉴스	M_GEN	/world/christian	4	1
M_GEN_04_01	기독교	M_GEN_04	/world/christian	1	2
M_GEN_04_02	경제	M_GEN_04	/world/economic	2	2
M_GEN_04_03	건강	M_GEN_04	/world/health	3	2
M_MAIN	메인			1	0
M_MAIN_01	교회소개	M_MAIN	/company/ceo	1	1
M_MAIN_01_01	목회자소개	M_MAIN_01	/about/pastor	1	2
M_MAIN_01_02	비전	M_MAIN_01	/about/vision	2	2
M_MAIN_01_03	연혁	M_MAIN_01	/about/history	3	2
M_MAIN_01_04	신앙고백	M_MAIN_01	/about/beliefs	4	2
M_MAIN_02	예배보기	M_MAIN	/worship/time	2	1
M_MAIN_02_01	예배시간	M_MAIN_02	/worship/time	1	2
M_MAIN_02_02	온라인예배	M_MAIN_02	/worship/live	2	2
M_MAIN_02_03	설교정보	M_MAIN_02	/worship/sermons	3	2
M_MAIN_03	모임	M_MAIN	/ministries/children	3	1
M_MAIN_03_01	주일학교	M_MAIN_03	/ministries/children	1	2
M_MAIN_03_02	청년부	M_MAIN_03	/ministries/youth	2	2
M_MAIN_03_03	선교부	M_MAIN_03	/ministries/mission	3	2
M_MAIN_04	소식	M_MAIN	/news/announcement	4	1
M_MAIN_04_01	공지사항	M_MAIN_04	/news/announcement	1	2
M_MAIN_04_02	행사	M_MAIN_04	/news/event	2	2
M_MAIN_04_03	주보	M_MAIN_04	/news/bulletin	3	2
M_MAIN_04_04	새가족 등록	M_MAIN_04	/news/registration	4	2
M_MAIN_05	문의사항	M_MAIN	/support/location	5	1
M_MAIN_05_01	오시는길	M_MAIN_05	/support/location	1	2
M_MAIN_05_02	Q&A	M_MAIN_05	/support/qna	2	2
M_MAIN_05_03	FAQ	M_MAIN_05	/support/faq	3	2
M_SYS	ERP		/erp	1	0
M_SYS_01	성도관리	M_SYS	/humen/manager	1	1
M_SYS_01_01	성도정보조회및관리	M_SYS_01	/humen/manager	1	2
M_SYS_01_02	새가족관리	M_SYS_01	/humen/newcomer	2	2
M_SYS_01_03	교적변동관리	M_SYS_01	/humen/change	3	2
M_SYS_01_04	가정/구역관리	M_SYS_01	/humen/district	4	2
M_SYS_02	예배관리	M_SYS	/sermon/manager	2	1
M_SYS_02_01	설교본문관리	M_SYS_02	/sermon/write	1	2
M_SYS_02_02	예배순서관리	M_SYS_02	/sermon/order	2	2
M_SYS_02_03	예배출석현황	M_SYS_02	/sermon/attendance	3	2
M_SYS_02_04	설교아카이브	M_SYS_02	/sermon/archive	4	2
M_SYS_03	재정관리	M_SYS	/account/manager	3	1
M_SYS_03_01	헌금내역조회	M_SYS_03	/account/manager	1	2
M_SYS_03_02	헌금입력/수정	M_SYS_03	/account/input	2	2
M_SYS_03_03	예산관리	M_SYS_03	/account/budget	3	2
M_SYS_03_04	지출결의관리	M_SYS_03	/account/expense	4	2
M_SYS_03_05	결산리포트	M_SYS_03	/account/report	5	2
M_SYS_04	교육관리	M_SYS	/training/course	4	1
M_SYS_04_01	교육과정관리	M_SYS_04	/training/course	1	2
M_SYS_04_02	수강생관리	M_SYS_04	/training/student	2	2
M_SYS_04_03	출결관리	M_SYS_04	/training/attendance	3	2
M_SYS_04_04	수료관리	M_SYS_04	/training/complete	4	2
M_SYS_05	조직관리	M_SYS	/ministry/department	5	1
M_SYS_05_01	부서관리	M_SYS_05	/ministry/department	1	2
M_SYS_05_02	봉사자배치	M_SYS_05	/ministry/volunteer	2	2
M_SYS_05_03	사역일정관리	M_SYS_05	/ministry/schedule	3	2
M_SYS_05_04	사역보고	M_SYS_05	/ministry/report	4	2
M_SYS_06	일정관리	M_SYS	/event/calendar	6	1
M_SYS_06_01	연간일정관리	M_SYS_06	/event/calendar	1	2
M_SYS_06_02	행사등록/신청	M_SYS_06	/event/apply	2	2
M_SYS_06_03	참가자관리	M_SYS_06	/event/participant	3	2
M_SYS_06_04	행사결과보고	M_SYS_06	/event/result	4	2
M_SYS_07	자원관리	M_SYS	/facility/reservation	7	1
M_SYS_07_01	시설예약관리	M_SYS_07	/facility/reservation	1	2
M_SYS_07_02	차량운행관리	M_SYS_07	/facility/vehicle	2	2
M_SYS_07_03	비품관리	M_SYS_07	/facility/inventory	3	2
M_SYS_07_04	유지보수이력	M_SYS_07	/facility/maintenance	4	2
M_SYS_08	커뮤니케이션	M_SYS	/comm/notice	8	1
M_SYS_08_01	공지관리	M_SYS_08	/comm/notice	1	2
M_SYS_08_02	문자/알림톡발송	M_SYS_08	/comm/message	2	2
M_SYS_08_03	기도제목관리	M_SYS_08	/comm/prayer	3	2
M_SYS_08_04	소식지관리	M_SYS_08	/comm/newsletter	4	2
M_SYS_09	행정관리	M_SYS	/admin/document	9	1
M_SYS_09_01	증명서발급	M_SYS_09	/admin/certificate	1	2
M_SYS_09_02	결재문서관리	M_SYS_09	/admin/approval	2	2
M_SYS_09_03	회의록관리	M_SYS_09	/admin/minutes	3	2
M_SYS_09_04	첨부문서함	M_SYS_09	/admin/archive	4	2
M_SYS_10	통게관리	M_SYS	/stats/dashboard	10	1
M_SYS_10_01	주간현황대시보드	M_SYS_10	/stats/dashboard	1	2
M_SYS_10_02	출석통계	M_SYS_10	/stats/attendance	2	2
M_SYS_10_03	헌금통계	M_SYS_10	/stats/offering	3	2
M_SYS_10_04	사역성과통계	M_SYS_10	/stats/ministry	4	2