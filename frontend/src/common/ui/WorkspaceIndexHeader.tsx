import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type WorkspaceIndexAccent = 'blue' | 'teal' | 'emerald' | 'indigo';

type WorkspaceIndexHeaderProps = Readonly<{
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  accent?: WorkspaceIndexAccent;
  actions?: ReactNode;
}>;

const accentClasses: Record<WorkspaceIndexAccent, { iconBackground: string; text: string }> = {
  blue: { iconBackground: 'bg-blue-50', text: 'text-blue-700' },
  teal: { iconBackground: 'bg-teal-50', text: 'text-teal-700' },
  emerald: { iconBackground: 'bg-emerald-50', text: 'text-emerald-700' },
  indigo: { iconBackground: 'bg-indigo-50', text: 'text-indigo-700' },
};

export function WorkspaceIndexHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  accent = 'indigo',
  actions,
}: WorkspaceIndexHeaderProps) {
  const accentClass = accentClasses[accent];

  return (
    <header data-workspace-index-header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClass.iconBackground} ${accentClass.text}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`mb-1 text-xs font-semibold tracking-wide ${accentClass.text}`}>{eyebrow}</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
