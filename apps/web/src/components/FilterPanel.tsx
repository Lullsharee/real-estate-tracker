'use client';

interface Props {
  prefectures: string[];
  municipalities: {municipality: string; prefecture: string}[];
  selectedPrefecture: string;
  selectedMunicipality: string;
  onPrefectureChange: (value: string) => void;
  onMunicipalityChange: (value: string) => void;
}

export function FilterPanel({
  prefectures,
  municipalities,
  selectedPrefecture,
  selectedMunicipality,
  onPrefectureChange,
  onMunicipalityChange,
}: Props) {
  const filteredMunicipalities = selectedPrefecture
    ? municipalities.filter((m) => m.prefecture === selectedPrefecture)
    : municipalities;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded">
      <div>
        <label className="block text-sm font-medium mb-1">都道府県</label>
        <select
          value={selectedPrefecture}
          onChange={(e) => {
            onPrefectureChange(e.target.value);
            onMunicipalityChange('');
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">すべて</option>
          {prefectures.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">市区町村</label>
        <select
          value={selectedMunicipality}
          onChange={(e) => onMunicipalityChange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">すべて</option>
          {filteredMunicipalities.map((m) => (
            <option key={m.municipality} value={m.municipality}>
              {m.municipality}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
