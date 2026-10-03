import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartFrame, ChartTooltip, type ChartValueFormatter } from './chartFrame';

type DonutChartProps<T extends object> = {
  title: string;
  description?: string;
  data: T[];
  nameKey: Extract<keyof T, string>;
  valueKey: Extract<keyof T, string>;
  colors: string[];
  loading?: boolean;
  error?: string | null;
  valueFormatter?: ChartValueFormatter;
  detailFormatter?: (datum: T) => string | undefined;
  onDataClick?: (datum: T) => void;
  height?: number;
  className?: string;
};

export function DonutChart<T extends object>({
  title,
  description,
  data,
  nameKey,
  valueKey,
  colors,
  loading,
  error,
  valueFormatter,
  detailFormatter,
  onDataClick,
  height,
  className,
}: DonutChartProps<T>) {
  return (
    <ChartFrame
      title={title}
      description={description}
      loading={loading}
      error={error}
      empty={!data.length}
      height={height}
      className={className}
    >
      <ResponsiveContainer>
        <RechartsPieChart>
          <Tooltip
            content={(props) => (
              <ChartTooltip
                {...props}
                valueFormatter={valueFormatter}
                detailFormatter={(datum) => detailFormatter?.(datum as T)}
              />
            )}
          />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={3}
            stroke="none"
            onClick={(sector) => {
              if (onDataClick && sector.payload && typeof sector.payload === 'object') {
                onDataClick(sector.payload as T);
              }
            }}
            cursor={onDataClick ? 'pointer' : undefined}
          >
            {data.map((item, index) => (
              <Cell
                key={`${String(item[nameKey])}-${index}`}
                fill={colors.length ? colors[index % colors.length] : '#6366f1'}
              />
            ))}
          </Pie>
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
