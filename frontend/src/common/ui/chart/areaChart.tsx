import { useId } from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame, ChartTooltip, type ChartValueFormatter } from './chartFrame';
import type { ChartSeries } from './lineChart';

type AreaChartProps<T extends object> = {
  title: string;
  description?: string;
  data: T[];
  categoryKey: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  loading?: boolean;
  error?: string | null;
  valueFormatter?: ChartValueFormatter;
  axisFormatter?: (value: number | string) => string;
  onDataClick?: (datum: T, dataKey: string) => void;
  height?: number;
  className?: string;
};

export function AreaChart<T extends object>({
  title,
  description,
  data,
  categoryKey,
  series,
  loading,
  error,
  valueFormatter,
  axisFormatter,
  onDataClick,
  height,
  className,
}: AreaChartProps<T>) {
  const gradientIdPrefix = useId().replace(/:/g, '');

  return (
    <ChartFrame
      title={title}
      description={description}
      loading={loading}
      error={error}
      empty={!data.length || !series.length}
      height={height}
      className={className}
    >
      <ResponsiveContainer>
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {series.map((item) => (
              <linearGradient key={item.dataKey} id={`${gradientIdPrefix}-area-${String(item.dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.22} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={axisFormatter} />
          <Tooltip content={(props) => <ChartTooltip {...props} valueFormatter={valueFormatter} />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
          {series.map((item) => (
            <Area
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name}
              stroke={item.color}
              strokeWidth={2}
              fill={`url(#${gradientIdPrefix}-area-${String(item.dataKey)})`}
              activeDot={(point) => (
                <circle
                  cx={point.cx}
                  cy={point.cy}
                  r={5}
                  fill="#fff"
                  stroke={item.color}
                  strokeWidth={2}
                  onClick={() => {
                    if (onDataClick && point.payload && typeof point.payload === 'object') {
                      onDataClick(point.payload as T, item.dataKey);
                    }
                  }}
                />
              )}
              cursor={onDataClick ? 'pointer' : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
