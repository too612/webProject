import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOfficialIndexData } from './officialIndexHook';

const QUICK_MENUS = [
    { to: '/worship/sermons', icon: 'live_tv', label: '주일설교' },
    { to: '/news/registration', icon: 'person_add', label: '새가족등록' },
    { to: '/support/bulletin', icon: 'menu_book', label: '주보' },
    { to: '#', icon: 'volunteer_activism', label: '온라인헌금' },
    { to: '/worship/time', icon: 'calendar_today', label: '예배시간' },
    { to: '/about/location', icon: 'place', label: '오시는 길' },
];

const WORSHIP_SCHEDULE = [
    { icon: 'wb_sunny', title: '주일 1부 예배', time: '오전 9:00' },
    { icon: 'wb_twilight', title: '주일 2부 예배', time: '오전 11:00' },
    { icon: 'nights_stay', title: '수요 예배', time: '오후 7:30' },
    { icon: 'brightness_3', title: '금요 예배', time: '오후 8:00' },
];

const COMMUNITY_STORIES = [
    { title: '청년부 겨울수련회 후기', date: '2026-02-18' },
    { title: '장년부 기도회 안내', date: '2026-02-14' },
    { title: '유아부 특별 프로그램', date: '2026-02-12' },
    { title: '선교팀 활동 보고', date: '2026-02-08' },
    { title: '찬양팀 연습 일정', date: '2026-02-03' },
];

const HERO_SLIDES = [
    { image: '/img/church-bg.svg', alt: '다사랑교회 배너 1' },
    { image: '/img/gallery1.svg', alt: '다사랑교회 배너 2' },
    { image: '/img/gallery2.svg', alt: '다사랑교회 배너 3' },
    { image: '/img/gallery3.svg', alt: '다사랑교회 배너 4' },
];

const EVENT_GALLERY_IMAGES = ['/img/gallery1.svg', '/img/gallery2.svg', '/img/gallery3.svg', '/img/church-bg.svg'];

type EventGallerySlide = {
    id: string;
    title: string;
    date: string;
    image: string;
    target: string;
};

const MOCK_EVENT_GALLERY_SLIDES: EventGallerySlide[] = [
    {
        id: 'mock-1',
        title: '부활절 감사예배 및 성도 교제 시간',
        date: '2026-04-20',
        image: '/img/gallery1.svg',
        target: '/news/event',
    },
    {
        id: 'mock-2',
        title: '청년부 봄 수련회 현장 스케치',
        date: '2026-03-24',
        image: '/img/gallery2.svg',
        target: '/news/event',
    },
    {
        id: 'mock-3',
        title: '다음세대 연합 찬양집회',
        date: '2026-03-10',
        image: '/img/gallery3.svg',
        target: '/news/event',
    },
    {
        id: 'mock-4',
        title: '전교인 체육대회 준비 모임',
        date: '2026-02-27',
        image: '/img/church-bg.svg',
        target: '/news/event',
    },
];

type SectionHeadingProps = {
    icon: string;
    title: string;
    description?: string;
};

function SectionHeading({ icon, title, description }: SectionHeadingProps) {
    return (
        <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-xl font-bold text-brand-dark">
                <i className="material-icons text-brand-primary">{icon}</i>
                {title}
            </h2>
            {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
    );
}

export default function OfficialIndexPage() {
    const { indexData, loading, error, loadIndexData } = useOfficialIndexData();
    const [currentSlide, setCurrentSlide] = useState(0);
    const dragStartXRef = useRef<number | null>(null);
    const hasSwipedRef = useRef(false);

    const hasRealEventData = indexData.recentAnnouncements.length > 0;
    const eventSlides: EventGallerySlide[] = hasRealEventData
        ? indexData.recentAnnouncements.map((item, idx) => ({
            id: item.id,
            title: item.title,
            date: item.date,
            image: EVENT_GALLERY_IMAGES[idx % EVENT_GALLERY_IMAGES.length],
            target: `/support/announcement/view?rqstNo=${item.id}`,
        }))
        : MOCK_EVENT_GALLERY_SLIDES;

    useEffect(() => {
        loadIndexData();
    }, [loadIndexData]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };

    const goNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    };

    const resetDrag = () => {
        dragStartXRef.current = null;
        hasSwipedRef.current = false;
    };

    const handleSwipeMove = (currentX: number) => {
        if (dragStartXRef.current === null || hasSwipedRef.current) return;

        const diffX = currentX - dragStartXRef.current;
        const threshold = 40;
        if (Math.abs(diffX) < threshold) return;

        if (diffX > 0) {
            goPrevSlide();
        } else {
            goNextSlide();
        }

        hasSwipedRef.current = true;
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        dragStartXRef.current = event.clientX;
        hasSwipedRef.current = false;
    };

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (dragStartXRef.current === null) return;
        if ((event.buttons & 1) !== 1) {
            resetDrag();
            return;
        }
        handleSwipeMove(event.clientX);
    };

    const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        dragStartXRef.current = event.touches[0]?.clientX ?? null;
        hasSwipedRef.current = false;
    };

    const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        const currentX = event.touches[0]?.clientX;
        if (currentX === undefined) return;
        handleSwipeMove(currentX);
    };

    return (
        <>
            {/* Main Visual Section */}
            <section className="relative overflow-hidden min-h-[260px] md:min-h-[320px] lg:min-h-[360px] bg-[#0f1c3f]">
                <div
                    className="relative h-[260px] md:h-[320px] lg:h-[360px] w-full select-none"
                    style={{ touchAction: 'pan-y' }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={resetDrag}
                    onMouseLeave={resetDrag}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={resetDrag}
                    onTouchCancel={resetDrag}
                >
                    {HERO_SLIDES.map((slide, index) => (
                        <div
                            key={slide.image}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                            aria-hidden={index !== currentSlide}
                        >
                            <img src={slide.image} alt={slide.alt} draggable={false} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={goPrevSlide}
                        aria-label="이전 배너"
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition-colors hover:bg-black/55"
                    >
                        <i className="material-icons text-lg">chevron_left</i>
                    </button>
                    <button
                        type="button"
                        onClick={goNextSlide}
                        aria-label="다음 배너"
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white transition-colors hover:bg-black/55"
                    >
                        <i className="material-icons text-lg">chevron_right</i>
                    </button>

                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {HERO_SLIDES.map((slide, index) => (
                            <button
                                key={slide.image + index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`${index + 1}번 배너로 이동`}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Menu Section */}
            <section className="bg-white py-8 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {QUICK_MENUS.map((item) => (
                            <Link
                                to={item.to}
                                key={item.label}
                                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-brand-primary/30 hover:bg-brand-primary/[0.03] transition-colors group"
                            >
                                <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors shrink-0">
                                    <i className="material-icons text-brand-primary group-hover:text-white">{item.icon}</i>
                                </div>
                                <span className="text-sm text-gray-700 font-semibold">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-14 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-white rounded-2xl shadow-panel border border-gray-100 p-7 space-y-3">
                            <div className="flex items-center gap-2 text-brand-primary">
                                <i className="material-icons">waving_hand</i>
                                <h3 className="font-bold text-brand-dark text-lg">환영인사</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                다사랑교회는 두날개로 날아오르는 건강한 교회입니다.
                                교회는 예수 그리스도를 나의 주, 나의 하나님으로 고백하는 성도들의 모임입니다.
                            </p>
                            <Link to="/about/pastor" className="text-sm text-brand-primary hover:underline inline-flex items-center gap-1 font-medium">
                                자세히 보기 <i className="material-icons text-sm">arrow_forward</i>
                            </Link>
                        </div>
                        <div className="bg-brand-primary text-white rounded-2xl shadow-panel p-7 space-y-3">
                            <div className="flex items-center gap-2">
                                <i className="material-icons">church</i>
                                <h3 className="font-bold text-lg">교회 소개</h3>
                            </div>
                            <p className="text-sm text-white/85 leading-relaxed">
                                세상에서 가장 건강한 교회, 세상에서 가장 아름답고 행복한 교회에 오신 여러분을 환영합니다.
                            </p>
                            <Link to="/about/vision" className="text-sm text-white/90 hover:text-white hover:underline inline-flex items-center gap-1 font-medium">
                                자세히 보기 <i className="material-icons text-sm">arrow_forward</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Church Event Gallery Section */}
            <section className="py-14 bg-white">
                <div className="container mx-auto px-6 space-y-6">
                    <SectionHeading
                        icon="photo_library"
                        title="교회행사사진"
                        description="최근 행사 스케치를 카드형으로 빠르게 확인해 보세요."
                    />

                    {!hasRealEventData && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            실제 데이터가 없어 임시 샘플 이미지와 문구로 미리보기를 표시 중입니다.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {eventSlides.map((slide, index) => (
                            <Link
                                key={`${slide.id}-card-${index}`}
                                to={slide.target}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title || '교회 행사 사진'}
                                    className="aspect-video w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="space-y-1.5 p-4">
                                    <p className="text-xs font-medium text-brand-primary">최근 행사 스케치</p>
                                    <h3 className="text-sm font-semibold text-brand-dark line-clamp-2">{slide.title}</h3>
                                    <p className="text-xs text-gray-400">{slide.date || '게시물 상세에서 일정을 확인하세요.'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-14 bg-white">
                <div className="container mx-auto px-6 space-y-6">
                    <SectionHeading
                        icon="live_tv"
                        title="최근 설교"
                        description="최신 설교 콘텐츠를 빠르게 확인하세요."
                    />
                    {(loading || error) && (
                        <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                            {error ?? '메인 화면 정보를 불러오는 중입니다.'}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(indexData.recentSermons.length > 0
                            ? indexData.recentSermons
                            : [{ id: '', title: '설교 준비 중', date: '' }]
                        ).map((item, idx) => (
                            <Link
                                to={item.id ? `/worship/sermons/view?rqstNo=${item.id}` : '/worship/sermons'}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-primary/30 hover:shadow-md transition-all"
                                key={item.id || idx}
                            >
                                <div className="relative bg-slate-100 aspect-video flex items-center justify-center">
                                    <i className="material-icons text-4xl text-slate-300 group-hover:text-brand-primary/70 transition-colors">video_library</i>
                                </div>
                                <div className="p-4 space-y-1.5">
                                    <h4 className="text-sm font-semibold text-brand-dark line-clamp-2">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Worship Time Section */}
            <section className="py-14 bg-brand-primary/[0.05]">
                <div className="container mx-auto px-6 space-y-6">
                    <SectionHeading
                        icon="schedule"
                        title="예배 시간 안내"
                        description="처음 오시는 분도 쉽게 확인할 수 있도록 안내합니다."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {WORSHIP_SCHEDULE.map((w) => (
                            <div className="bg-white rounded-2xl shadow-panel border border-gray-100 p-5 text-center space-y-2" key={w.title}>
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
            <section className="py-14 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3 bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                                <i className="material-icons text-brand-primary text-base">campaign</i>
                                공지사항
                            </h3>
                            <ul className="divide-y divide-gray-100">
                                {(indexData.recentAnnouncements.length > 0
                                    ? indexData.recentAnnouncements
                                    : [{ id: '', title: '등록된 공지사항이 없습니다.', date: '' }]
                                ).map((n, idx) => (
                                    <li className="py-2.5 flex items-center justify-between gap-4" key={n.id || idx}>
                                        <Link to="/support/announcement" className="text-sm text-gray-700 hover:text-brand-primary truncate">{n.title}</Link>
                                        <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3 bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                                <i className="material-icons text-brand-primary text-base">groups</i>
                                공동체 이야기
                            </h3>
                            <ul className="divide-y divide-gray-100">
                                {COMMUNITY_STORIES.map((n) => (
                                    <li className="py-2.5 flex items-center justify-between gap-4" key={n.title}>
                                        <Link to="/support/announcement" className="text-sm text-gray-700 hover:text-brand-primary truncate">{n.title}</Link>
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
