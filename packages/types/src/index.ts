export interface MLITProperty {
  type: string;
  region: string;
  municipalityCode: string;
  prefecture: string;
  municipality: string;
  districtName: string;
  nearestStation?: string;
  timeToNearestStation?: string;
  tradePrice: number;
  pricePerUnit?: number;
  floorPlan?: string;
  area: number;
  unitPrice?: number;
  buildingYear?: string;
  structure?: string;
  period: string;
  tradePricePerTsubo?: number;
}

export interface PropertyStats {
  period: string;
  prefecture: string;
  municipality: string;
  districtName?: string;
  averagePrice: number;
  medianPrice: number;
  averagePricePerTsubo: number;
  medianPricePerTsubo: number;
  count: number;
}

export interface PriceHistory {
  period: string;
  averagePrice: number;
  medianPrice: number;
  averagePricePerTsubo: number;
  medianPricePerTsubo: number;
}

// API Response Types
export interface HealthResponse {
  status: 'ok';
}

export interface CollectResponse {
  success: boolean;
  collected: number;
}

export interface PropertiesResponse {
  data: MLITProperty[];
  total: number;
  limit: number;
  offset: number;
}

export interface MunicipalityItem {
  municipality: string;
  prefecture: string;
}
