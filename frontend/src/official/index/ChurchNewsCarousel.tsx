/**
 * File Name   : ChurchNewsCarousel
 * Description : 공지사항 카드 그리드 (상당교회 교회소식 벤치마킹)
 * - 이미지(있을 경우) 상단 + 제목/날짜 하단 카드 형태
 * - PC 최대 4개 / 모바일 최대 2개 노출
 * - 3일 이내 게시글은 NEW 태그 표시
 */
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

export interface ChurchNewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
}

function isNewDate(dateStr: string): boolean {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 3 * 86400000;
}

export default function ChurchNewsCarousel({
  items,
}: Readonly<{ items: ChurchNewsItem[] }>) {
  const list = (items || []).slice(0, 4);

  return (
    <section className="bg-white py-14">
      <div className="container mx-auto space-y-8 px-6">
        <div className="relative space-y-2 text-center">
          <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
            공지사항
          </h2>
          <p className="text-base text-gray-500">
            다사랑교회의 공지사항을 전합니다.
          </p>
          <Link
            to="/news/notice"
            className="absolute right-0 top-1 text-base font-bold text-brand-primary hover:underline"
          >
            + 더보기
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {list.map(function (n) {
              return (
                <Link
                  key={n.id || n.title}
                  to={
                    n.id
                      ? "/news/notice/view?rqstNo=" + n.id
                      : "/news/notice"
                  }
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-brand-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    {n.imageUrl ? (
                      <img
                        src={n.imageUrl}
                        alt={n.title}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    {isNewDate(n.date) && (
                      <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-brand-dark group-hover:text-brand-primary">
                      {n.title}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">{n.date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
