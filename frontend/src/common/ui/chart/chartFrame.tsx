import type { ReactNode } from 'react';

export type ChartValueFormatter = (value: number | string, name: string) => string;

type ChartFrameProps = {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
  height?: number;
};

export function ChartFrame({
  title,
  description,
  loading = false,
  error,
  empty = false,
  emptyMessage = '표시할 데이터가 없습니다.',
  children,
  className = '',
  height = 280,
}: ChartFrameProps) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </header>
      {error ? (
        <div className="flex items-center justify-center rounded-xl bg-red-50 px-4 text-sm text-red-700" style={{ height }}>
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400" style={{ height }}>
          데이터를 불러오는 중입니다.
        </div>
      ) : empty ? (
        <div className="flex items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400" style={{ height }}>
          {emptyMessage}
        </div>
      ) : (
        <div style={{ width: '100%', height }}>
          {children}
        </div>
      )}
    </section>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  detailFormatter,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ color?: string; name?: unknown; value?: unknown; payload?: unknown }>;
  label?: unknown;
  valueFormatter?: ChartValueFormatter;
  detailFormatter?: (datum: unknown) => string | undefined;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-36 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      {label !== undefined && <p className="mb-1.5 text-xs font-semibold text-slate-700">{String(label)}</p>}
      <div className="space-y-1">
        {payload.map((item, index) => {
          if (typeof item.value !== 'number' && typeof item.value !== 'string') return null;
          const name = item.name === undefined ? '' : String(item.name);
          const detail = item.payload && typeof item.payload === 'object'
            ? detailFormatter?.(item.payload)
            : undefined;
          return (
            <div key={`${name}-${index}`} className="text-xs">
              <div className="flex items-center justify-between gap-5">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <i className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {name}
                </span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {valueFormatter ? valueFormatter(item.value, name) : String(item.value)}
                </span>
              </div>
              {detail && <p className="mt-1 text-right text-[11px] text-slate-400">{detail}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
