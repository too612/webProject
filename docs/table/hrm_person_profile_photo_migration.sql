-- hrm_person.profile_photo_url 이전: 정적 경로(data/humen/<사번>_profile.png) -> 프로필 저장 체계(/data/profile/<UUID>.png)
-- 파일은 data/profile 아래에 UUID 파일명으로 옮겨졌고, 기존 정적 위치(data/humen)는 제거되었다.
-- data/humen/00000NN_profile.png(7자리) 파일은 사번 0000NN(6자리)의 사진으로 매핑했다.
-- 레거시 photo_url의 data/humen 경로도 함께 비운다. 재실행해도 안전하다(정적 경로를 가리키는 행만 갱신).

BEGIN;

WITH profile_map(employee_no, profile_photo_url) AS (
  VALUES
  ('000001', '/data/profile/ca629bc2-8f31-4aa8-954a-81095611fc33.png'),
  ('000002', '/data/profile/3443d3b0-a9b2-4397-919e-f67ab893cda6.png'),
  ('000003', '/data/profile/8de330c7-150d-4771-a7e0-5c0a217d2551.png'),
  ('000004', '/data/profile/30e83b6c-0067-4105-aa53-66487dd700e0.png'),
  ('000005', '/data/profile/fc567282-f27d-4ec4-bb21-c9701b3f2e5c.png'),
  ('000006', '/data/profile/d2a70719-c234-45b3-8e61-fe3115765f86.png'),
  ('000007', '/data/profile/065a82d9-4e0f-4a69-8743-8641b048c791.png'),
  ('000008', '/data/profile/348ead7f-0ce0-429d-9e6c-2d32466105fe.png'),
  ('000009', '/data/profile/76a6615a-7459-4abf-b297-fb3854052fbc.png'),
  ('000010', '/data/profile/4fb458ce-a88f-410e-91ff-9320abcc0794.png'),
  ('000011', '/data/profile/00ec5a60-d4a8-432d-bcea-53e6bff74c79.png'),
  ('000012', '/data/profile/01c02c02-9d1a-4b27-a07b-815c540c15c9.png'),
  ('000013', '/data/profile/57c11eaf-fd83-4374-9837-451366b755e1.png'),
  ('000014', '/data/profile/58e3d53e-f365-4eb7-88da-202c53352e22.png'),
  ('000015', '/data/profile/11812264-7a8c-4ff6-a4e6-95e9ca18d501.png'),
  ('000016', '/data/profile/bd2df968-c791-47aa-8295-eaa44fa6ee38.png'),
  ('000017', '/data/profile/8c228764-1522-44b1-abe9-05c70ed05194.png'),
  ('000018', '/data/profile/ab917d0d-bed7-4746-b060-173086b9f67e.png'),
  ('000019', '/data/profile/42a5a366-3389-49ab-b034-aae13e623723.png'),
  ('000020', '/data/profile/ecae46da-8ed2-4aa6-8e56-b3ebc56ad644.png')
)
UPDATE hrm_person hp
   SET profile_photo_url = m.profile_photo_url,
       upd_user = 'SYSTEM',
       upd_dtm = NOW()
  FROM profile_map m
 WHERE hp.employee_no = m.employee_no
   AND (hp.profile_photo_url IS NULL OR hp.profile_photo_url LIKE '%data/humen/%');

-- 대응 파일이 없는 정적 경로는 깨진 이미지 대신 사진 없음으로 처리한다.
UPDATE hrm_person
   SET profile_photo_url = NULL,
       upd_user = 'SYSTEM',
       upd_dtm = NOW()
 WHERE profile_photo_url LIKE '%data/humen/%';

-- 제거된 정적 위치를 가리키는 레거시 photo_url을 정리한다.
UPDATE hrm_person
   SET photo_url = NULL,
       upd_user = 'SYSTEM',
       upd_dtm = NOW()
 WHERE photo_url LIKE '%data/humen/%';

COMMIT;