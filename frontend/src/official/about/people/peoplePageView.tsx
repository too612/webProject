import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "../../../common/ui";
import { useMenu } from "../../../common/menu/menuHook";
import { getCurrentMenuPageContent } from "../../../common/menu/menuModel";
import { usePeopleContent } from "./peopleHook";
import { DEFAULT_PEOPLE_CONTENT } from "./peopleModel";
import PeoplePageWrite from "./peoplePageWrite";
import type { LeaderCard } from "./peopleModel";

type PeopleCard = LeaderCard & { key: string };

type PeoplePageViewProps = Readonly<{
  people: PeopleCard[];
  onSelect: (key: string) => void;
}>;

function PeopleListView({ people, onSelect }: PeoplePageViewProps) {
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    setImageErrorMap({});
    setIsGridVisible(false);
    const timer = window.setTimeout(() => setIsGridVisible(true), 60);
    return () => window.clearTimeout(timer);
  }, [people]);

  const renderAvatar = (person: PeopleCard) => {
    if (!person.imageUrl || imageErrorMap[person.key]) {
      return (
        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-slate-400">
            {person.name.charAt(0)}
          </span>
        </div>
      );
    }

    return (
      <img
        src={person.imageUrl}
        alt={person.name}
        className="w-full h-full object-contain"
        onError={() =>
          setImageErrorMap((prev) => ({ ...prev, [person.key]: true }))
        }
      />
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {people.map((person, index) => (
        <button
          key={person.key}
          type="button"
          onClick={() => onSelect(person.key)}
          className={`text-left border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-all duration-500 ${isGridVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
          style={{ transitionDelay: `${index * 120}ms` }}
        >
          <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden">
            {renderAvatar(person)}
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
  );
}

export default function PeoplePageView() {
  const { currentMenu, loading: menuLoading } = useMenu();
  const { peopleContent, loading, error, loadPeopleContent } =
    usePeopleContent();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    loadPeopleContent();
  }, [loadPeopleContent]);

  const content = peopleContent
    ? { ...DEFAULT_PEOPLE_CONTENT, ...peopleContent }
    : DEFAULT_PEOPLE_CONTENT;
  const { pastor, leaders } = content;
  const pageContent = getCurrentMenuPageContent(currentMenu, menuLoading);

  const staffCards = useMemo(() => {
    const pastorCard: LeaderCard = {
      name: pastor.name,
      role: pastor.title,
      ministry: "담임 사역",
      intro: pastor.greeting,
      imageUrl: pastor.imageUrl,
      educations: pastor.educations,
      careers: pastor.careers,
    };

    return [pastorCard, ...leaders].map((item, index) => ({
      ...item,
      key: `${item.employeeNo || item.name}-${item.role}-${index}`,
    }));
  }, [pastor, leaders]);

  const selectedPerson =
    staffCards.find((item) => item.key === selectedKey) ?? null;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <PageTitle
          title={pageContent.headline}
          description={pageContent.summary}
        />

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
            {selectedPerson ? (
              <PeoplePageWrite
                person={selectedPerson}
                onBack={() => setSelectedKey(null)}
              />
            ) : (
              <PeopleListView people={staffCards} onSelect={setSelectedKey} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
