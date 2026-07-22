import { useEffect, useMemo, useState } from "react";
import { usePeopleContent } from "./peopleHook";
import { DEFAULT_PEOPLE_CONTENT } from "./peopleModel";
import type { LeaderCard } from "./peopleModel";

/****************************************************************************************************
 * component method (state, hook 초기화)
 ****************************************************************************************************/

export default function PeoplePage() {
  const { peopleContent, loading, error, loadPeopleContent } =
    usePeopleContent();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    loadPeopleContent();
  }, [loadPeopleContent]);

  const content = peopleContent
    ? { ...DEFAULT_PEOPLE_CONTENT, ...peopleContent }
    : DEFAULT_PEOPLE_CONTENT;
  const { pastor, leaders } = content;

  useEffect(() => {
    if (loading || error || selectedKey) {
      return;
    }

    setIsGridVisible(false);
    const timer = window.setTimeout(() => {
      setIsGridVisible(true);
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loading, error, selectedKey, leaders.length]);

  const staffCards = useMemo(() => {
    const pastorCard: LeaderCard = {
      name: pastor.name,
      role: pastor.title,
      ministry: "담임 사역",
      intro: pastor.greeting,
      biography: pastor.biography,
      imageUrl: pastor.imageUrl,
    };

    return [pastorCard, ...leaders].map((item, index) => ({
      ...item,
      key: `${item.name}-${item.role}-${index}`,
    }));
  }, [pastor, leaders]);

  const selectedPerson =
    staffCards.find((item) => item.key === selectedKey) ?? null;

  useEffect(() => {
    setImageErrorMap({});
  }, [staffCards]);

  const markImageError = (key: string) => {
    setImageErrorMap((prev) => {
      if (prev[key]) {
        return prev;
      }
      return { ...prev, [key]: true };
    });
  };

  const renderAvatar = (
    person: LeaderCard & { key: string },
    sizeClass: string,
    textClass: string,
  ) => {
    const failed = imageErrorMap[person.key];

    if (!person.imageUrl || failed) {
      return (
        <div
          className={`${sizeClass} bg-slate-200 flex items-center justify-center`}
        >
          <span className={textClass}>{person.name.charAt(0)}</span>
        </div>
      );
    }

    return (
      <img
        src={person.imageUrl}
        alt={person.name}
        className={`${sizeClass} object-contain`}
        onError={() => {
          markImageError(person.key);
        }}
      />
    );
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            {content.headline}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {content.summary}
          </p>
        </div>

        {loading && (
          <div className="text-sm text-slate-500 py-4 text-center">
            불러오는 중입니다.
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {!selectedPerson && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {staffCards.map((person, index) => (
                    <button
                      key={person.key}
                      type="button"
                      onClick={() => {
                        setSelectedKey(person.key);
                      }}
                      className={`text-left border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-all duration-500 ${isGridVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
                      style={{ transitionDelay: `${index * 120}ms` }}
                    >
                      <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                        {renderAvatar(
                          person,
                          "w-full h-full",
                          "text-4xl font-bold text-slate-400",
                        )}
                      </div>
                      <div className="min-w-0 p-4 space-y-1.5">
                        <h4 className="font-bold text-brand-dark text-base leading-tight">
                          {person.name} {person.role}
                        </h4>
                        <p className="text-sm text-gray-600 leading-snug">
                          {person.ministry}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedPerson && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(null);
                  }}
                  className="group inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span className="material-icons text-[18px] text-brand-primary transition-transform duration-200 group-hover:-translate-x-0.5">
                    arrow_back
                  </span>
                  <span>돌아가기</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-0 border border-slate-200 overflow-hidden">
                  <div className="lg:w-72 shrink-0 bg-slate-100 overflow-hidden">
                    <div className="w-full aspect-[4/5]">
                      {renderAvatar(
                        selectedPerson,
                        "w-full h-full",
                        "text-6xl font-bold text-slate-400",
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 md:p-8 space-y-5">
                    <div>
                      <span className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1 mb-2">
                        {selectedPerson.role}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
                        {selectedPerson.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedPerson.ministry}
                      </p>
                    </div>

                    <blockquote className="border-l-4 border-brand-primary pl-4 py-1 text-base text-gray-700 leading-relaxed italic">
                      {selectedPerson.intro ||
                        `${selectedPerson.name}님의 소개 문구를 준비 중입니다.`}
                    </blockquote>

                    <div className="bg-slate-50 p-5">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        사역/약력
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedPerson.biography ||
                          `${selectedPerson.ministry} 사역을 중심으로 교회를 섬기고 있습니다.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
