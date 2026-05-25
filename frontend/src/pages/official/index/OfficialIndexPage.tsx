import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { officialApi, type OfficialIndexData } from '../../../api/officialApi';

export default function OfficialIndexPage() {
    const [indexData, setIndexData] = useState<OfficialIndexData>({
        recentSermons: [],
        recentAnnouncements: [],
    });

    useEffect(() => {
        officialApi.getIndexData()
            .then((data) => setIndexData(data))
            .catch(() => {/* 오류 시 빈 목록 유지 */});
    }, []);

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
                            { to: '/support/location', icon: 'place', label: '오시는 길' },
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
                        <i className="material-icons text-brand-primary">live_tv</i>
                        최근 설교
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(indexData.recentSermons.length > 0
                            ? indexData.recentSermons
                            : [{ id: '', title: '설교 준비 중', date: '' }]
                        ).map((item, idx) => (
                            <Link
                                to={item.id ? `/worship/sermons?id=${item.id}` : '/worship/sermons'}
                                className="bg-white rounded-panel shadow-card border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                key={item.id || idx}
                            >
                                <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                                    <i className="material-icons text-4xl text-gray-300">video_library</i>
                                </div>
                                <div className="p-3 space-y-1">
                                    <h4 className="text-xs font-semibold text-brand-dark line-clamp-2">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.date}</p>
                                </div>
                            </Link>
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
                                {(indexData.recentAnnouncements.length > 0
                                    ? indexData.recentAnnouncements
                                    : [{ id: '', title: '등록된 공지사항이 없습니다.', date: '' }]
                                ).map((n, idx) => (
                                    <li className="py-2.5 flex items-center justify-between gap-4" key={n.id || idx}>
                                        <Link to={`/news/announcement`} className="text-sm text-gray-700 hover:text-brand-primary truncate">{n.title}</Link>
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
