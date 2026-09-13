import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../common/ui";
import type { ReactNode } from "react";
import type { LeaderCard } from "./peopleModel";

type PeopleCard = LeaderCard & { key: string };

type PeoplePageWriteProps = Readonly<{
  person: PeopleCard;
  onBack: () => void;
}>;

export default function PeoplePageWrite({
  person,
  onBack,
}: PeoplePageWriteProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-5">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-[18px] w-[18px] text-brand-primary" />
        <span>돌아가기</span>
      </Button>

      <div className="grid grid-cols-[minmax(96px,1fr)_minmax(20ch,1fr)] md:grid-cols-[18rem_minmax(20ch,1fr)] items-start gap-0 border border-slate-200 overflow-hidden">
        <div className="w-full self-start bg-slate-100 overflow-hidden">
          <div className="w-full aspect-[4/5]">
            {!person.imageUrl || imageError ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-bold text-slate-400">
                  {person.name.charAt(0)}
                </span>
              </div>
            ) : (
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>

        <div className="min-w-0 p-4 md:p-8 space-y-6">
          <div>
            <span className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold px-3 py-1 mb-2">
              {person.role}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
              {person.name}
            </h3>
            <p className="text-sm text-gray-500 mt-2">{person.ministry}</p>
          </div>

          <DetailSection title="학력사항" titleBorder>
            <div>
              {person.educations.length > 0 ? (
                person.educations.map((education, index) => (
                  <p
                    key={`${education.schoolName}-${index}`}
                    className="py-2 text-sm font-normal text-slate-800"
                  >
                    - {education.schoolName} 졸업
                  </p>
                ))
              ) : (
                <EmptyDetail text="등록된 학력사항이 없습니다." />
              )}
            </div>
          </DetailSection>

          <DetailSection title="경력사항" titleBorder>
            <div>
              {person.careers.length > 0 ? (
                person.careers.map((career, index) => (
                  <div
                    key={`${career.companyName}-${career.hireDate}-${index}`}
                    className="py-2 space-y-1"
                  >
                    <p className="text-sm font-normal text-slate-800">
                      - {career.retireDate ? "前)" : "現)"} {career.companyName}{" "}
                      {career.jobTitle || ""}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyDetail text="등록된 경력사항이 없습니다." />
              )}
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
  titleBorder = false,
}: Readonly<{
  title: string;
  children: ReactNode;
  titleBorder?: boolean;
}>) {
  return (
    <section className="space-y-3">
      <h4
        className={`text-base font-bold text-brand-dark ${titleBorder ? "border-b-2 border-slate-300 pb-3" : ""}`}
      >
        {title}
      </h4>
      {children}
    </section>
  );
}

function EmptyDetail({ text }: Readonly<{ text: string }>) {
  return <p className="text-sm text-slate-500 py-3">{text}</p>;
}
