import { Link } from 'react-router-dom';

export default function OfficialIndexPage() {
    return (
        <>
            {/* Main Visual Section */}
            <section className="relative bg-brand-dark text-white overflow-hidden min-h-[420px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/90 to-brand-primary/70" />
                <div className="relative z-10 container mx-auto px-6 py-16">
                    <p className="text-sm tracking-widest text-white/70 uppercase mb-2">WELCOME TO</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">다사랑교회</h1>
                    <p className="text-white/80 max-w-xl leading-relaxed mb-6">
                        두날개로 날아오르는 건강한 교회입니다.<br />
                        교회의 머리이신 예수 그리스도와 같은 말, 같은 마음, 같은 뜻으로 하나되는 교회입니다.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/worship/sermons" className="bg-white text-brand-primary font-semibold px-5 py-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors text-sm">주일설교 듣기</Link>
                        <Link to="/news/registration" className="border border-white/60 text-white px-5 py-2.5 rounded-full hover:bg-white hover:text-brand-primary transition-colors text-sm">새가족 등록</Link>
                    </div>
                </div>
            </section>

            {/* Quick Menu Section */}
            <section className="bg-white border-b border-gray-100 py-6">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {[
                            { to: '/worship/sermons', icon: 'live_tv', label: '주일설교' },
                            { to: '/news/registration', icon: 'person_add', label: '새가족등록' },
                            { to: '/news/bulletin', icon: 'menu_book', label: '주보' },
                            { to: '#', icon: 'volunteer_activism', label: '온라인헌금' },
                            { to: '/worship/time', icon: 'calendar_today', label: '예배시간' },
                            { to: '/support/location', icon: 'place', label: '오시는길' },
                        ].map((item) => (
                            <Link to={item.to} key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-panel hover:bg-brand-primary/5 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <i className="material-icons text-brand-primary group-hover:text-white">{item.icon}</i>
                                </div>
                                <span className="text-xs text-gray-600 font-medium text-center">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-10 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-3">
                            <div className="flex items-center gap-2 text-brand-primary">
                                <i className="material-icons">waving_hand</i>
                                <h3 className="font-bold text-brand-dark">환영인사</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                다사랑교회는 두날개로 날아오르는 건강한 교회입니다.
                                교회는 예수 그리스도를 나의 주, 나의 하나님으로 고백하는 성도들의 모임입니다.
                            </p>
                            <Link to="/about/pastor" className="text-sm text-brand-primary hover:underline inline-flex items-center gap-1">
                                자세히 보기 <i className="material-icons text-sm">arrow_forward</i>
                            </Link>
                        </div>
                        <div className="bg-brand-primary text-white rounded-panel shadow-panel p-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <i className="material-icons">church</i>
                                <h3 className="font-bold">교회 소개</h3>
                            </div>
                            <p className="text-sm text-white/85 leading-relaxed">
                                세상에서 가장 건강한 교회, 세상에서 가장 아름답고 행복한 교회에 오신 여러분을 환영합니다.
                            </p>
                            <Link to="/about/vision" className="text-sm text-white/90 hover:text-white hover:underline inline-flex items-center gap-1">
                                자세히 보기 <i className="material-icons text-sm">arrow_forward</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-10 bg-white">
                <div className="container mx-auto px-6 space-y-5">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-brand-dark">
                        <i className="material-icons text-brand-primary">photo_library</i>
                        다사랑 갤러리
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { img: '/img/gallery1.svg', alt: '두날개 필리핀선교센터', title: '두날개 필리핀선교센터 선교 보고', date: '2024.11.03', fallback: '선교 보고' },
                            { img: '/img/gallery2.svg', alt: '두날개프로세스', title: '2024 제10기 두날개프로세스 5단계 집중훈련', date: '2024.11.03', fallback: '훈련 스케치' },
                            { img: '/img/gallery3.svg', alt: '국제컨퍼런스', title: '2024 두날개 국제컨퍼런스의 은혜', date: '2024.11.03', fallback: '컨퍼런스' },
                            { img: '/img/gallery4.svg', alt: '세계비전', title: '세계비전 두날개프로세스 제10기 1단계 집중훈련', date: '2024.11.03', fallback: '세계비전' },
                        ].map((item) => (
                            <div className="bg-white rounded-panel shadow-card border border-gray-100 overflow-hidden" key={item.title}>
                                <div className="relative bg-gray-100 aspect-video">
                                    <img
                                        src={item.img}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const el = e.currentTarget;
                                            el.style.display = 'none';
                                            const placeholder = el.nextElementSibling as HTMLElement;
                                            if (placeholder) placeholder.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 flex-col items-center justify-center gap-1 text-gray-400 text-xs bg-gray-100">
                                        <i className="material-icons text-2xl">image</i>
                                        <span>{item.fallback}</span>
                                    </div>
                                </div>
                                <div className="p-3 space-y-1">
                                    <h4 className="text-xs font-semibold text-brand-dark line-clamp-2">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Worship Time Section */}
            <section className="py-10 bg-brand-primary/5">
                <div className="container mx-auto px-6 space-y-5">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-brand-dark">
                        <i className="material-icons text-brand-primary">schedule</i>
                        예배 시간 안내
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: 'wb_sunny', title: '주일 1부 예배', time: '오전 9:00' },
                            { icon: 'wb_twilight', title: '주일 2부 예배', time: '오전 11:00' },
                            { icon: 'nights_stay', title: '수요 예배', time: '오후 7:30' },
                            { icon: 'brightness_3', title: '금요 예배', time: '오후 8:00' },
                        ].map((w) => (
                            <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 text-center space-y-2" key={w.title}>
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto">
                                    <i className="material-icons text-brand-primary">{w.icon}</i>
                                </div>
                                <h4 className="font-semibold text-brand-dark text-sm">{w.title}</h4>
                                <p className="text-brand-primary font-medium text-sm">{w.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="py-10 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                                <i className="material-icons text-brand-primary text-base">campaign</i>
                                공지사항
                            </h3>
                            <ul className="divide-y divide-gray-100">
                                {[
                                    { title: '두날개 국제컨퍼런스 안내', date: '2026-02-20' },
                                    { title: '2026년 양육 프로세스 일정 안내', date: '2026-02-15' },
                                    { title: '새가족반 개강 안내', date: '2026-02-10' },
                                    { title: '주차장 이용 안내', date: '2026-02-05' },
                                    { title: '교회 방역 안내', date: '2026-02-01' },
                                ].map((n) => (
                                    <li className="py-2.5 flex items-center justify-between gap-4" key={n.title}>
                                        <Link to="/news/announcement" className="text-sm text-gray-700 hover:text-brand-primary truncate">{n.title}</Link>
                                        <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 font-bold text-brand-dark">
                                <i className="material-icons text-brand-primary text-base">groups</i>
                                공동체 이야기
                            </h3>
                            <ul className="divide-y divide-gray-100">
                                {[
                                    { title: '청년부 겨울수련회 후기', date: '2026-02-18' },
                                    { title: '장년부 기도회 안내', date: '2026-02-14' },
                                    { title: '유아부 특별 프로그램', date: '2026-02-12' },
                                    { title: '선교팀 활동 보고', date: '2026-02-08' },
                                    { title: '찬양팀 연습 일정', date: '2026-02-03' },
                                ].map((n) => (
                                    <li className="py-2.5 flex items-center justify-between gap-4" key={n.title}>
                                        <Link to="/news/announcement" className="text-sm text-gray-700 hover:text-brand-primary truncate">{n.title}</Link>
                                        <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
