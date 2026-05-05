import { Link } from 'react-router-dom';

const categoryCards = [
    { icon: 'forum', title: '자유게시판', desc: '자유롭게 이야기를 나눠보세요', count: '128개의 글', to: '/community/support/board' },
    { icon: 'question_answer', title: '질문 & 답변', desc: '궁금한 내용을 질문해보세요', count: '95개의 글', to: '/community/support/qna' },
    { icon: 'favorite', title: '기도 요청', desc: '함께 기도해요', count: '67개의 글', to: '/community/saint/pray' },
    { icon: 'auto_stories', title: '신앙 나눔', desc: '믿음의 이야기를 나눠요', count: '84개의 글', to: '/community/world/christian' },
    { icon: 'celebration', title: '간증 게시판', desc: '감사의 간증을 전해요', count: '52개의 글', to: '/community/group/groupa1' },
    { icon: 'photo_library', title: '사진 갤러리', desc: '소중한 순간을 공유해요', count: '145개의 글', to: '/community/facilities/calendar' },
];

const recentPosts = [
    { category: '시설', date: '2025.02.20', title: '신앙생활 중 어려움을 겪고 계신 분들을 위한 기도', excerpt: '요즘 신앙생활을 하며 어려움을 겪는 분들을 위해 함께 기도하며 마음을 나눕니다.', author: '홍길동', views: 125, comments: 6, to: '/community/support/board' },
    { category: '질문&답변', date: '2025.02.19', title: '이번 주일 예배는 저희 함께 드려요!', excerpt: '이번 주일 예배에 새로 오신 분들과 함께 드리려고 합니다. 많은 참여 부탁드립니다.', author: '김철수', views: 89, comments: 5, to: '/community/support/qna' },
    { category: '신앙나눔', date: '2025.02.18', title: '사랑의 선교 활동에 함께하실 분들을 찾습니다', excerpt: '다음 주 토요일 지역 사회 봉사활동에 함께할 분들을 모집합니다.', author: '이영희', views: 156, comments: 12, to: '/community/world/christian' },
    { category: '간증게시판', date: '2025.02.17', title: '신앙의 깊이를 높이는 영적 서적 추천', excerpt: '최근 읽은 책 중 신앙생활에 도움이 된 도서를 소개합니다.', author: '박민수', views: 203, comments: 15, to: '/community/group/groupb2' },
];

const notices = [
    { title: '2025년 상반기 커뮤니티 활동 계획 안내', date: '02.20', to: '/community/support/board', isNew: true },
    { title: '커뮤니티 이용 규칙 및 예절 안내', date: '02.15', to: '/community/support/board' },
    { title: '새로운 모임 개설 신청 접수 중', date: '02.10', to: '/community/group/manager' },
    { title: '신입 회원 환영 이벤트 안내', date: '02.05', to: '/community/group/groupa1' },
    { title: '커뮤니티 서버 관리 점검 공지', date: '01.30', to: '/community/support/board' },
];

const activities = [
    { title: '새로운 찬양곡 연습 일정', date: '02.19', to: '/community/group/groupa1', category: '[찬양팀]' },
    { title: '다음 주 야외 활동 계획', date: '02.18', to: '/community/group/groupb2', category: '[청년회]' },
    { title: '정기 모임 참석 안내', date: '02.17', to: '/community/saint/family', category: '[여성회]' },
    { title: '월례 기도회 개최', date: '02.16', to: '/community/facilities/prayer', category: '[선교팀]' },
    { title: '봄 학기 개강 예정', date: '02.15', to: '/community/saint/pray', category: '[어린이회]' },
];

const communityStats = [
    { icon: 'forum', value: '1,245', label: '전체 회원' },
    { icon: 'article', value: '571', label: '전체 게시글' },
    { icon: 'chat', value: '2,834', label: '전체 댓글' },
    { icon: 'schedule', value: '24/7', label: '운영시간' },
];

export default function CommunityIndexPage() {
    return (
        <div className="space-y-0">
            {/* Hero */}
            <section className="relative bg-brand-dark text-white py-20 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                        <i className="material-icons text-3xl">groups</i>
                    </div>
                    <h1 className="text-3xl font-bold">커뮤니티</h1>
                    <p className="text-white/80">함께 나누고 성장하는 우리들의 공간</p>
                </div>
            </section>

            {/* 카테고리 */}
            <section className="py-10 bg-gray-50">
                <div className="container mx-auto px-4 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-brand-dark">커뮤니티 카테고리</h2>
                        <p className="text-sm text-gray-500">원하는 주제로 소통해보세요</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {categoryCards.map((card) => (
                            <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-card transition-shadow" key={card.title}>
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <i className="material-icons text-brand-primary">{card.icon}</i>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-brand-dark text-sm">{card.title}</h3>
                                    <p className="text-xs text-gray-500">{card.desc}</p>
                                    <span className="text-xs text-brand-primary font-medium">{card.count}</span>
                                </div>
                                <Link to={card.to} className="text-xs text-brand-primary font-medium flex items-center gap-1 hover:underline">
                                    바로가기 <i className="material-icons text-sm">arrow_forward</i>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 최근 게시글 */}
            <section className="py-10">
                <div className="container mx-auto px-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-brand-dark">최근 게시글</h2>
                        <Link to="/community/support/board" className="text-sm text-brand-primary flex items-center gap-1 hover:underline">
                            전체보기 <i className="material-icons text-sm">arrow_forward</i>
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {recentPosts.map((post) => (
                            <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={post.title}>
                                <div className="flex items-center justify-between">
                                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-2.5 py-0.5 rounded-full">{post.category}</span>
                                    <span className="text-xs text-gray-400">{post.date}</span>
                                </div>
                                <h3 className="font-semibold text-brand-dark text-sm">
                                    <Link to={post.to} className="hover:text-brand-primary">{post.title}</Link>
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                    <span className="flex items-center gap-1"><i className="material-icons text-sm">person</i>{post.author}</span>
                                    <span className="flex items-center gap-3">
                                        <span className="flex items-center gap-0.5"><i className="material-icons text-sm">visibility</i>{post.views}</span>
                                        <span className="flex items-center gap-0.5"><i className="material-icons text-sm">comment</i>{post.comments}</span>
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* 공지 + 활동 + 현황 */}
            <section className="py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid sm:grid-cols-3 gap-5">
                        {/* 공지사항 */}
                        <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-brand-dark flex items-center gap-1"><i className="material-icons text-base">campaign</i>공지사항</h3>
                                <Link to="/community/support/board" className="text-xs text-brand-primary hover:underline">더보기</Link>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {notices.map((item) => (
                                    <li key={item.title} className="flex items-center justify-between px-5 py-3">
                                        <Link to={item.to} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-primary min-w-0 truncate">
                                            {item.isNew && <span className="shrink-0 bg-brand-primary text-white text-[10px] px-1.5 py-0.5 rounded">New</span>}
                                            <span className="truncate">{item.title}</span>
                                        </Link>
                                        <span className="shrink-0 text-xs text-gray-400 ml-2">{item.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 활동 소식 */}
                        <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-brand-dark flex items-center gap-1"><i className="material-icons text-base">event_note</i>활동 소식</h3>
                                <Link to="/community/group/groupa1" className="text-xs text-brand-primary hover:underline">더보기</Link>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {activities.map((item) => (
                                    <li key={item.title} className="flex items-center justify-between px-5 py-3">
                                        <Link to={item.to} className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-primary min-w-0 truncate">
                                            <span className="shrink-0 text-xs text-brand-primary font-medium">{item.category}</span>
                                            <span className="truncate">{item.title}</span>
                                        </Link>
                                        <span className="shrink-0 text-xs text-gray-400 ml-2">{item.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 커뮤니티 현황 */}
                        <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-brand-dark flex items-center gap-1"><i className="material-icons text-base">bar_chart</i>커뮤니티 현황</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-gray-100">
                                {communityStats.map((s) => (
                                    <div key={s.label} className="bg-white flex flex-col items-center justify-center gap-1 p-5">
                                        <i className="material-icons text-brand-primary">{s.icon}</i>
                                        <strong className="font-bold text-brand-dark">{s.value}</strong>
                                        <span className="text-xs text-gray-500">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
