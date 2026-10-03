import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame, ChartTooltip, type ChartValueFormatter } from './chartFrame';
import type { ChartSeries } from './lineChart';

type BarChartProps<T extends object> = {
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
  horizontal?: boolean;
  stacked?: boolean;
  height?: number;
  className?: string;
};

export function BarChart<T extends object>({
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
  horizontal = false,
  stacked = false,
  height,
  className,
}: BarChartProps<T>) {
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
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, left: horizontal ? 0 : -18, bottom: 0 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={!horizontal} horizontal={horizontal} />
          <XAxis
            type={horizontal ? 'number' : 'category'}
            dataKey={horizontal ? undefined : categoryKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={axisFormatter}
          />
          <YAxis
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? categoryKey : undefined}
            axisLine={false}
            tickLine={false}
            width={horizontal ? 100 : 40}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={axisFormatter}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} valueFormatter={valueFormatter} />} />
          {series.length > 1 && <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />}
          {series.map((item) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.name}
              fill={item.color}
              radius={horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
              onClick={(entry) => {
                if (onDataClick && entry.payload && typeof entry.payload === 'object') {
                  onDataClick(entry.payload as T, item.dataKey);
                }
              }}
              cursor={onDataClick ? 'pointer' : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
