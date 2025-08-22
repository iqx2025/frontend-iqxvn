/**
 * Industry Trend Types
 * Type definitions for industry trend filter data from Google Sheets
 */

/**
 * Represents a single row of industry trend data
 */
export interface IndustryTrendItem {
  symbol: string;
  exchange: 'HOSE' | 'HNX' | 'UPCOM' | string;
  sector_level_2: string;
  close_price: number;
  return_1d_pct: number;
  return_1w_pct: number;
  return_1m_pct: number;
  volume: number;
  avg_volume_1w: number;
  avg_volume_1m: number;
  rrg_phase: 'Tăng giá' | 'Tích lũy' | 'Giảm giá' | 'Phân phối' | string;
  beta_90d: number;
  beta_180d: number;
  sector_stage: 'Tăng giá' | 'Tích lũy' | 'Giảm giá' | 'Phân phối' | string;
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
 * Parsed industry trend data response
 */
export interface IndustryTrendData {
  items: IndustryTrendItem[];
  lastUpdated: Date;
  totalCount: number;
}

/**
 * Filter options for industry trend data
 */
export interface IndustryTrendFilters {
  search?: string;
  exchange?: string;
  sector?: string;
  rrgPhase?: string;
  sectorStage?: string;
  minVolume?: number;
  maxVolume?: number;
}

/**
 * Sort configuration for industry trend table
 */
export interface IndustryTrendSort {
  field: keyof IndustryTrendItem;
  direction: 'asc' | 'desc';
}

/**
 * API service error response
 */
export interface IndustryTrendError {
  message: string;
  code?: string;
  details?: unknown;
}
