/**
 * Market Leader types and interfaces
 * Types for stocks that have the most impact on market indices
 */

/**
 * Represents a single market leader/influential stock
 */
export interface MarketLeaderItem {
  /** Stock ticker symbol */
  symbol: string;
  /** Impact score on the market index */
  score: number;
  /** Impact score as a percentage */
  scorePercent: number;
  /** Full company name in Vietnamese */
  companyName: string;
}

/**
 * API response structure for market leaders
 */
export interface MarketLeaderResponse {
  /** Array of market leader stocks */
  data: MarketLeaderItem[];
}

/**
 * Supported stock exchanges for market leaders
 */
export type MarketExchange = 'VNINDEX' | 'HNX' | 'UPCOM';

/**
 * Mapping of exchange names to center IDs
 */
export const EXCHANGE_CENTER_MAP: Record<MarketExchange, number> = {
  'VNINDEX': 1,
  'HNX': 2,
  'UPCOM': 9,
};
