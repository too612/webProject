import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityApi, type CommunityIndexData } from '../../api/communityApi';

const categoryCards = [
    { icon: 'favorite', title: '기도 요청', desc: '함께 기도해요', count: '67개의 글', to: '/community/saint/pray' },
    { icon: 'auto_stories', title: '신앙 나눔', desc: '믿음의 이야기를 나눠요', count: '84개의 글', to: '/community/world/christian' },
    { icon: 'celebration', title: '간증 게시판', desc: '감사의 간증을 전해요', count: '52개의 글', to: '/community/group/groupa1' },
    { icon: 'photo_library', title: '사진 갤러리', desc: '소중한 순간을 공유해요', count: '145개의 글', to: '/community/facilities/calendar' },
];

const emptyIndexData: CommunityIndexData = {
    recentPosts: [],
    notices: [],
    activities: [],
    stats: {
        totalMembers: 0,
        totalPosts: 0,
    },
};

export default function CommunityIndexPage() {
    const [indexData, setIndexData] = useState<CommunityIndexData>(emptyIndexData);

    useEffect(() => {
        communityApi.getIndexData()
            .then((data) => setIndexData(data))
            .catch(() => {
                setIndexData(emptyIndexData);
            });
    }, []);

    const communityStats = [
        { icon: 'forum', value: String(indexData.stats.totalMembers), label: '전체 회원' },
        { icon: 'article', value: String(indexData.stats.totalPosts), label: '전체 게시글' },
    ];

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
                        <Link to="/community/world/christian" className="text-sm text-brand-primary flex items-center gap-1 hover:underline">
                            전체보기 <i className="material-icons text-sm">arrow_forward</i>
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {(indexData.recentPosts.length > 0
                            ? indexData.recentPosts
                            : [{ id: '', category: '안내', title: '등록된 게시글이 없습니다.', author: '-', date: '-', views: 0 }]
                        ).map((post) => (
                            <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={post.title}>
                                <div className="flex items-center justify-between">
                                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-medium px-2.5 py-0.5 rounded-full">{post.category}</span>
                                    <span className="text-xs text-gray-400">{post.date}</span>
                                </div>
                                <h3 className="font-semibold text-brand-dark text-sm">
                                    <Link to="/community/world/christian" className="hover:text-brand-primary">{post.title}</Link>
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                    <span className="flex items-center gap-1"><i className="material-icons text-sm">person</i>{post.author}</span>
                                    <span className="flex items-center gap-3">
                                        <span className="flex items-center gap-0.5"><i className="material-icons text-sm">visibility</i>{post.views}</span>
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
                                <Link to="/community/group/manager" className="text-xs text-brand-primary hover:underline">더보기</Link>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {(indexData.notices.length > 0
                                    ? indexData.notices
                                    : [{ id: '', title: '등록된 공지사항이 없습니다.', date: '-' }]
                                ).map((item) => (
                                    <li key={item.title} className="flex items-center justify-between px-5 py-3">
                                        <Link to="/community/group/manager" className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-primary min-w-0 truncate">
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
                                {(indexData.activities.length > 0
                                    ? indexData.activities
                                    : [{ id: '', category: '안내', title: '등록된 활동 소식이 없습니다.', date: '-' }]
                                ).map((item) => (
                                    <li key={item.title} className="flex items-center justify-between px-5 py-3">
                                        <Link to="/community/group/groupa1" className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-brand-primary min-w-0 truncate">
                                            <span className="shrink-0 text-xs text-brand-primary font-medium">[{item.category}]</span>
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
                                <div className="bg-white flex flex-col items-center justify-center gap-1 p-5">
                                    <i className="material-icons text-brand-primary">schedule</i>
                                    <strong className="font-bold text-brand-dark">24/7</strong>
                                    <span className="text-xs text-gray-500">운영시간</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
