import { Link } from 'react-router-dom';

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  summary: string;
};

type OfficialEventPageProps = {
  title: string;
  events: EventItem[];
};

export default function OfficialEventPage({ title, events }: OfficialEventPageProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
          <div className="text-sm text-gray-400 mt-0.5">예정 행사 {events.length}건</div>
        </div>
      </div>
      {events.map((event) => (
        <article key={event.id} className="bg-gray-50 rounded-lg p-5">
          <h4 className="font-semibold text-brand-dark">{event.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{event.summary}</p>
          <p className="mt-2 text-xs text-gray-400">{event.date} | {event.location}</p>
        </article>
      ))}
      <div className="flex gap-4 flex-wrap mt-2">
        <Link className="text-brand-primary hover:underline text-sm" to="/news/announcement">공지사항</Link>
        <Link className="text-brand-primary hover:underline text-sm" to="/news/bulletin">교회 소식</Link>
      </div>
    </section>
  );
}
