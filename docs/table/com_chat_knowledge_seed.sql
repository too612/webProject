-- PostgreSQL DML: com_chat_knowledge 초기 시드
-- answer_template의 {{slot}} 값은 각 intent_code의 Java Provider가 기존 도메인 서비스로 채운다.
-- Provider 미구현 intent_code는 매칭되어도 폴백 처리되므로 시드를 먼저 넣어도 안전하다.

INSERT INTO com_chat_knowledge (
  intent_code, keywords, answer_template, priority, menu_path, suggestions, use_yn, sort_order
) VALUES
('WORSHIP_TIME', '예배시간,예배,새벽예배,새벽기도,새벽기도회,새벽회,주일예배,주일낮예배,주일저녁예배,수요예배,금요예배,금요심야,몇 시,몇시,시간표',
 E'다사랑교회 예배시간입니다.\n{{worship_items}}\n자세한 내용은 예배시간 페이지를 참고해 주세요.',
 0, '/worship/time', '오시는 길,담임목사 소개,공지사항', 'Y', 1),

('LOCATION', '오시는길,오시는 길,가는길,가는 길,가는 방법,어떻게 가야,위치,주소,교회 주소,지도,교통,전화번호,교회 전화,연락처',
 E'다사랑교회는 {{address}}에 있습니다.\n전화: {{phone}}\n네이버/카카오 지도에서 "다사랑교회"를 검색하시면 바로 안내됩니다.',
 10, '/about/location', '예배시간,새가족 등록,담임목사 소개', 'Y', 2),

('PASTOR', '담임목사,목사,목회자,담임,목사님',
 E'담임목사님은 {{chief_name}} 목사님이십니다.\n{{introduction}}',
 20, '/about/pastor', '교회소개,예배시간,공지사항', 'Y', 3),

('CHURCH_INTRO', '교회소개,소개,연혁,역사,비전,교회 연혁',
 E'{{history_items}}',
 30, '/about/history', '담임목사 소개,예배시간,새가족 등록', 'Y', 4),

('NOTICE', '공지,공지사항,새소식,알림,소식',
 E'최근 공지사항입니다.\n{{notice_items}}',
 40, '/news/notice', '주보,예배시간,갤러리', 'Y', 5),

('BULLETIN', '주보,주보지',
 E'최근 주보입니다.\n{{bulletin_items}}',
 50, '/news/bulletin', '공지사항,예배시간', 'Y', 6),

('GALLERY', '앨범,갤러리,사진,포토,다사랑앨범',
 E'다사랑앨범의 최근 소식입니다.\n{{gallery_items}}',
 60, '/news/gallery', '공지사항,예배시간', 'Y', 7),

('SERVICE_GROUP', '부서,모임,셀,셀그룹,사역,사역팀,섬김',
 E'{{group_items}}',
 70, '/training/servicegroup', '새가족 등록,예배시간', 'Y', 8),

('NEW_BELIEVER', '새가족,등록,환영,처음,첫 방문,처음오셨나요',
 E'새가족 여러분을 주님의 이름으로 환영합니다.\n{{nextsteps_items}}\n새가족 등록은 새가족등록 페이지에서 진행하실 수 있습니다.',
 80, '/news/nextsteps', '예배시간,오시는 길,담임목사 소개', 'Y', 9),

('COURSE', '교육,프로그램,과정,훈련,양육,제자',
 E'{{course_items}}',
 90, '/training/course', '예배시간,새가족 등록', 'Y', 10),

('COUNSEL', '상담,문의,도움,연락,전화,문의처',
 E'교회 연락처는 {{phone}}입니다.\n상담이 필요하시면 상담 문의를 남겨 주시면 담당자가 도와드리겠습니다.',
 100, '/news/qna', '오시는 길,예배시간', 'Y', 11)
ON CONFLICT (intent_code) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  answer_template = EXCLUDED.answer_template,
  priority = EXCLUDED.priority,
  menu_path = EXCLUDED.menu_path,
  suggestions = EXCLUDED.suggestions,
  use_yn = EXCLUDED.use_yn,
  sort_order = EXCLUDED.sort_order;

-- 신규 의도 (설교검색 / 셀가족 / 인사집계)
INSERT INTO com_chat_knowledge (
  intent_code, keywords, answer_template, priority, menu_path, suggestions, use_yn, sort_order
) VALUES
('SERMON_SEARCH', '설교,말씀,찾아줘,찾아주,주제,묵상,설교검색,영상',
 E'{{sermon_items}}',
 55, '/worship/sermons', '예배시간,공지사항,오시는 길', 'Y', 12),
('CELL_GROUP', '셀,셀가족,셀모임,셀그룹',
 E'{{group_items}}',
 65, '/training/cellgroup', '부서 안내,새가족 등록,예배시간', 'Y', 13),
('PERSONNEL_COUNT', '장로,권사,집사,안수집사,인원,몇명,몇 명,직분',
 E'{{personnel_items}}',
 105, '/about/people', '예배시간,오시는 길', 'Y', 14),
('CONTRIBUTION', '온라인헌금,헌금,헌금계좌,헌금방법,송금',
 E'온라인헌금 안내입니다.\n{{contribution_info}}',
 110, '/about/contribution', '예배시간,오시는 길', 'Y', 15),
('EVENT_CALENDAR', '행사달력,행사일정,교회일정,일정,행사',
 E'교회 행사 일정입니다.\n{{event_items}}',
 120, '/news/eventcalendar', '공지사항,예배시간', 'Y', 17),
('LIVE', '온라인예배,온라인 예배,라이브,실시간예배,실시간 예배',
 E'온라인 예배 안내입니다.\n{{live_items}}',
 125, '/worship/live', '예배시간,설교정보', 'Y', 18),
('CHILDREN', '주일학교,어린이예배,어린이소식,다음세대 어린이',
 E'주일학교 최근 소식입니다.\n{{children_items}}',
 130, '/nextgen/school', '예배시간,다음세대', 'Y', 19),
('YOUTH', '중고등부,청년부,청소년부,청년 소식',
 E'중고등부·청년부 최근 소식입니다.\n{{youth_items}}',
 135, '/nextgen/youth', '예배시간,다음세대', 'Y', 20)
ON CONFLICT (intent_code) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  answer_template = EXCLUDED.answer_template,
  priority = EXCLUDED.priority,
  menu_path = EXCLUDED.menu_path,
  suggestions = EXCLUDED.suggestions,
  use_yn = EXCLUDED.use_yn,
  sort_order = EXCLUDED.sort_order;

INSERT INTO com_chat_knowledge (
  intent_code, keywords, answer_template, priority, menu_path, suggestions, use_yn, sort_order
) VALUES
('FAMILY_NEWS', '경조사,결혼,장례,부고,출산,돌잔치',
 E'최근 경조사 소식입니다.\n{{family_items}}',
 140, '/community/saint/family', '공지사항,예배시간', 'Y', 21)
ON CONFLICT (intent_code) DO UPDATE SET
  keywords = EXCLUDED.keywords,
  answer_template = EXCLUDED.answer_template,
  priority = EXCLUDED.priority,
  menu_path = EXCLUDED.menu_path,
  suggestions = EXCLUDED.suggestions,
  use_yn = EXCLUDED.use_yn,
  sort_order = EXCLUDED.sort_order;
