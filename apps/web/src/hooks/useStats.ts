'use client';

import {useState, useEffect} from 'react';
import {fetchApi} from '@/lib/api';

export interface PropertyStats {
  id: string;
  period: string;
  prefecture: string;
  municipality: string;
  districtName: string;
  averagePrice: number;
  medianPrice: number;
  averagePricePerTsubo: number;
  medianPricePerTsubo: number;
  count: number;
}

export function useStats(prefecture?: string, municipality?: string) {
  const [data, setData] = useState<PropertyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (prefecture) params.set('prefecture', prefecture);
    if (municipality) params.set('municipality', municipality);
    const query = params.toString() ? `?${params}` : '';

    fetchApi<PropertyStats[]>(`/api/stats${query}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [prefecture, municipality]);

  return {data, loading};
}

export function useHistory(prefecture?: string, municipality?: string) {
  const [data, setData] = useState<PropertyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (prefecture) params.set('prefecture', prefecture);
    if (municipality) params.set('municipality', municipality);
    const query = params.toString() ? `?${params}` : '';

    fetchApi<PropertyStats[]>(`/api/stats/history${query}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [prefecture, municipality]);

  return {data, loading};
}

export function usePrefectures() {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    fetchApi<string[]>('/api/prefectures').then(setData);
  }, []);

  return data;
}

export function useMunicipalities(prefecture?: string) {
  const [data, setData] = useState<{municipality: string; prefecture: string}[]>([]);

  useEffect(() => {
    const query = prefecture ? `?prefecture=${prefecture}` : '';
    fetchApi<{municipality: string; prefecture: string}[]>(`/api/municipalities${query}`).then(
      setData
    );
  }, [prefecture]);

  return data;
}
