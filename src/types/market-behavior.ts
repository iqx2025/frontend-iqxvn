/**
 * Market Behavior Types
 * Types for market sentiment and behavior data from Google Sheets
 */

/**
 * Market behavior data point
 */
export interface MarketBehaviorData {
  /** Date in DD/MM/YY format */
  date: string;
  /** Strong sell percentage (0-1) */
  strong_sell: number;
  /** Sell percentage (0-1) */
  sell: number;
  /** Buy percentage (0-1) */
  buy: number;
  /** Strong buy percentage (0-1) */
  strong_buy: number;
  /** VNINDEX value */
  vnindex: number;
}

/**
 * Processed data for chart display
 */
export interface MarketBehaviorChartData {
  /** Date string */
  date: string;
  /** Strong sell percentage */
  strongSell: number;
  /** Sell percentage */
  sell: number;
  /** Buy percentage */
  buy: number;
  /** Strong buy percentage */
  strongBuy: number;
  /** VNINDEX value */
  vnindex: number;
}

/**
 * Market behavior categories
 */
export const BEHAVIOR_CATEGORIES = {
  STRONG_SELL: 'Bán Mạnh',
  SELL: 'Bán',
  BUY: 'Mua',
  STRONG_BUY: 'Mua Mạnh'
} as const;

/**
 * Market behavior colors
 */
export const BEHAVIOR_COLORS = {
  STRONG_SELL: '#dc2626', // red-600
  SELL: '#fb923c',        // orange-400
  BUY: '#86efac',         // green-300
  STRONG_BUY: '#22c55e',  // green-500
  VNINDEX: '#8b5cf6'      // violet-500
} as const;
