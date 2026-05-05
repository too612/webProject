import OfficialEventPage from '../shared/OfficialEventPage';

const events = [
  { id: 1, title: '가정의 달 특별예배', date: '2026-05-05 11:00', location: '본당', summary: '가정의 달을 맞아 특별 찬양과 간증 순서가 준비됩니다.' },
  { id: 2, title: '청년부 연합 수련회', date: '2026-05-18 09:00', location: '수양관', summary: '청년부 연합 수련회 참가 신청을 받습니다.' },
  { id: 3, title: '전교인 체육대회', date: '2026-05-25 10:00', location: '시민운동장', summary: '부서별 팀 편성으로 체육대회를 진행합니다.' },
];

export default function EventPage() {
  return <OfficialEventPage title="행사 소식" events={events} />;
}
