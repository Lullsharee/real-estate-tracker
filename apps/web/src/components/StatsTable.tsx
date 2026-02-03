'use client';

import {type PropertyStats} from '@/hooks/useStats';

interface Props {
  data: PropertyStats[];
  loading: boolean;
}

function formatPrice(price: number): string {
  if (price >= 100000000) return `${(price / 100000000).toFixed(1)}億`;
  if (price >= 10000) return `${(price / 10000).toFixed(0)}万`;
  return price.toLocaleString();
}

export function StatsTable({data, loading}: Props) {
  if (loading) return <div className="p-4">読み込み中...</div>;
  if (data.length === 0) return <div className="p-4">データがありません</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">期間</th>
            <th className="border p-2 text-left">都道府県</th>
            <th className="border p-2 text-left">市区町村</th>
            <th className="border p-2 text-right">平均価格</th>
            <th className="border p-2 text-right">中央値</th>
            <th className="border p-2 text-right">坪単価(平均)</th>
            <th className="border p-2 text-right">件数</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border p-2">{row.period}</td>
              <td className="border p-2">{row.prefecture}</td>
              <td className="border p-2">{row.municipality}</td>
              <td className="border p-2 text-right">{formatPrice(row.averagePrice)}</td>
              <td className="border p-2 text-right">{formatPrice(row.medianPrice)}</td>
              <td className="border p-2 text-right">{formatPrice(row.averagePricePerTsubo)}</td>
              <td className="border p-2 text-right">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
