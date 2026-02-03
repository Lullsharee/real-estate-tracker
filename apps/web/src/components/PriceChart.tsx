'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {type PropertyStats} from '@/hooks/useStats';

interface Props {
  data: PropertyStats[];
  loading: boolean;
}

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}億`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
  return value.toString();
}

function formatTooltip(v: number | undefined): string {
  return v !== undefined ? formatYAxis(v) : '';
}

export function PriceChart({data, loading}: Props) {
  if (loading) return <div className="p-4">読み込み中...</div>;
  if (data.length === 0) return <div className="p-4">データがありません</div>;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line type="monotone" dataKey="averagePrice" name="平均価格" stroke="#8884d8" />
          <Line type="monotone" dataKey="medianPrice" name="中央値" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TsuboPriceChart({data, loading}: Props) {
  if (loading) return <div className="p-4">読み込み中...</div>;
  if (data.length === 0) return <div className="p-4">データがありません</div>;

  const latestPeriod = data[data.length - 1]?.period;
  const latestData = data.filter((d) => d.period === latestPeriod);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={latestData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="municipality" angle={-45} textAnchor="end" height={80} />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Bar dataKey="averagePricePerTsubo" name="坪単価(平均)" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
