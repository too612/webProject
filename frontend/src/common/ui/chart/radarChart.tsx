import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartFrame, ChartTooltip, type ChartValueFormatter } from './chartFrame';
import type { ChartSeries } from './lineChart';

type RadarChartProps<T extends object> = {
  title: string;
  description?: string;
  data: T[];
  categoryKey: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  loading?: boolean;
  error?: string | null;
  valueFormatter?: ChartValueFormatter;
  onDataClick?: (datum: T, dataKey: string) => void;
  height?: number;
  className?: string;
};

export function RadarChart<T extends object>({
  title,
  description,
  data,
  categoryKey,
  series,
  loading,
  error,
  valueFormatter,
  onDataClick,
  height,
  className,
}: RadarChartProps<T>) {
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
        <RechartsRadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey={categoryKey} tick={{ fill: '#64748b', fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
          <Tooltip content={(props) => <ChartTooltip {...props} valueFormatter={valueFormatter} />} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
          {series.map((item) => (
            <Radar
              key={item.dataKey}
              name={item.name}
              dataKey={item.dataKey}
              stroke={item.color}
              fill={item.color}
              fillOpacity={0.12}
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
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
