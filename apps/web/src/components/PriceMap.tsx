'use client';

import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {type PropertyStats} from '@/hooks/useStats';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  {ssr: false}
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  {ssr: false}
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((m) => m.CircleMarker),
  {ssr: false}
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  {ssr: false}
);

interface Props {
  data: PropertyStats[];
  loading: boolean;
}

/** 市区町村の概算座標 */
const CITY_COORDS: Record<string, [number, number]> = {
  千代田区: [35.694, 139.753],
  中央区: [35.671, 139.772],
  港区: [35.658, 139.751],
  新宿区: [35.694, 139.703],
  渋谷区: [35.664, 139.698],
  品川区: [35.609, 139.730],
  目黒区: [35.641, 139.698],
  世田谷区: [35.646, 139.653],
  大田区: [35.561, 139.716],
  杉並区: [35.699, 139.636],
  横浜市: [35.444, 139.638],
  川崎市: [35.531, 139.703],
  さいたま市: [35.861, 139.645],
};

function getColor(price: number): string {
  if (price >= 2000000) return '#d73027';
  if (price >= 1500000) return '#fc8d59';
  if (price >= 1000000) return '#fee08b';
  if (price >= 500000) return '#d9ef8b';
  return '#91cf60';
}

function formatPrice(price: number): string {
  return `${(price / 10000).toFixed(0)}万円/坪`;
}

export function PriceMap({data, loading}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return <div className="h-96 bg-gray-100 flex items-center justify-center">読み込み中...</div>;
  if (data.length === 0) return <div className="h-96 bg-gray-100 flex items-center justify-center">データがありません</div>;

  // 最新期間のデータ
  const latestPeriod = [...new Set(data.map((d) => d.period))].sort().pop();
  const latestData = data.filter((d) => d.period === latestPeriod);

  return (
    <div className="h-96">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <MapContainer
        center={[35.68, 139.69]}
        zoom={10}
        style={{height: '100%', width: '100%'}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {latestData.map((stat) => {
          const coords = CITY_COORDS[stat.municipality];
          if (!coords) return null;
          return (
            <CircleMarker
              key={stat.id}
              center={coords}
              radius={Math.min(20, Math.max(8, stat.count / 10))}
              fillColor={getColor(stat.averagePricePerTsubo)}
              color="#333"
              weight={1}
              fillOpacity={0.7}
            >
              <Popup>
                <div>
                  <strong>{stat.municipality}</strong>
                  <br />
                  坪単価: {formatPrice(stat.averagePricePerTsubo)}
                  <br />
                  件数: {stat.count}件
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
