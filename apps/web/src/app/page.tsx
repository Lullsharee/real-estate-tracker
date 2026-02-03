'use client';

import {useState} from 'react';
import {useStats, useHistory, usePrefectures, useMunicipalities} from '@/hooks/useStats';
import {StatsTable} from '@/components/StatsTable';
import {PriceChart, TsuboPriceChart} from '@/components/PriceChart';
import {PriceMap} from '@/components/PriceMap';
import {FilterPanel} from '@/components/FilterPanel';
import {postApi} from '@/lib/api';

export default function Home() {
  const [prefecture, setPrefecture] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [collecting, setCollecting] = useState(false);
  const [tab, setTab] = useState<'table' | 'chart' | 'map'>('table');

  const prefectures = usePrefectures();
  const municipalities = useMunicipalities(prefecture);
  const {data: stats, loading: statsLoading} = useStats(prefecture, municipality);
  const {data: history, loading: historyLoading} = useHistory(prefecture, municipality);

  const handleCollect = async () => {
    setCollecting(true);
    try {
      await postApi('/api/collect');
      window.location.reload();
    } finally {
      setCollecting(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">不動産価格トラッカー</h1>
        <p className="text-gray-600">東京・神奈川・埼玉の不動産取引価格を可視化</p>
        <p className="text-xs text-gray-500 mt-1">出典: 国土交通省ウェブサイト</p>
      </header>

      <div className="mb-4 flex justify-between items-center">
        <FilterPanel
          prefectures={prefectures}
          municipalities={municipalities}
          selectedPrefecture={prefecture}
          selectedMunicipality={municipality}
          onPrefectureChange={setPrefecture}
          onMunicipalityChange={setMunicipality}
        />
        <button
          onClick={handleCollect}
          disabled={collecting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {collecting ? '収集中...' : 'データ収集'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex border-b">
          {(['table', 'chart', 'map'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 ${tab === t ? 'border-b-2 border-blue-600 font-medium' : ''}`}
            >
              {t === 'table' ? 'テーブル' : t === 'chart' ? 'グラフ' : '地図'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'table' && <StatsTable data={stats} loading={statsLoading} />}

      {tab === 'chart' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-2">価格推移</h2>
            <PriceChart data={history} loading={historyLoading} />
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">市区町村別坪単価</h2>
            <TsuboPriceChart data={stats} loading={statsLoading} />
          </div>
        </div>
      )}

      {tab === 'map' && <PriceMap data={stats} loading={statsLoading} />}
    </main>
  );
}
