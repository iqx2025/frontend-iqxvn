/**
 * Valuation Filter Types
 * Type definitions for attractive valuation filter data from Google Sheets
 */

/**
 * Represents a single row of valuation data
 */
export interface ValuationItem {
  symbol: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM' | string;
  sector_level_2: string;
  close_price: number;
  volume: number;
  pe_ratio: number;
  sector_pe: number;
  pb_ratio: number;
  sector_pb: number;
  roa_pct: number;
  cfo: number;
  delta_roa_pct: number;
  cfo_ln_profit: number;
  gross_margin_pct: number;
  asset_turnover_pct: number;
}

/**
 * Google Sheets API response structure
 */
export interface GoogleSheetsResponse {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: string[][];
}

/**
 * Parsed valuation data response
 */
export interface ValuationData {
  items: ValuationItem[];
  lastUpdated: Date;
  totalCount: number;
}

/**
 * Filter options for valuation data
 */
export interface ValuationFilters {
  search?: string;
  exchange?: string;
  sector?: string;
  minPE?: number;
  maxPE?: number;
  minPB?: number;
  maxPB?: number;
  minROA?: number;
  maxROA?: number;
  undervaluedOnly?: boolean; // PE < sector PE and PB < sector PB
}

/**
 * Sort configuration for valuation table
 */
export interface ValuationSort {
  field: keyof ValuationItem;
  direction: 'asc' | 'desc';
}

/**
 * API service error response
 */
export interface ValuationError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Valuation metrics comparison
 */
export interface ValuationComparison {
  isUndervaluedPE: boolean;
  isUndervaluedPB: boolean;
  peRatio: number; // Company PE / Sector PE
  pbRatio: number; // Company PB / Sector PB
}
