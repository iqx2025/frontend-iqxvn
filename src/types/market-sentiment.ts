/**
 * Market Sentiment Dashboard Type Definitions
 */

/**
 * Sentiment gauge data for the speedometer-style indicator
 */
export interface SentimentGaugeData {
  /** Current sentiment percentage (0-100) */
  percent: number;
  /** Timestamp of last update */
  updatedAt: string;
  /** Sentiment classification */
  label?: 'Excessively Pessimistic' | 'Pessimistic' | 'Neutral' | 'Optimistic' | 'Overly Optimistic';
}

/**
 * Money flow distribution item
 */
export interface MoneyFlowItem {
  /** Category label */
  label: 'Tăng' | 'Giảm' | 'Không đổi';
  /** Trading value in trillion VND */
  value: number;
  /** Color code for display */
  color?: string;
}

/**
 * Market breadth sector item
 */
export interface SectorBreadthItem {
  /** Sector name */
  sector: string;
  /** Percentage change */
  pct: number;
  /** Number of stocks in sector */
  count?: number;
}

/**
 * Price change distribution bin
 */
export interface PriceChangeBin {
  /** Range label (e.g., "-7% to -5%") */
  range: string;
  /** Number of stocks in this range */
  count: number;
  /** Start value of range */
  rangeStart?: number;
  /** End value of range */
  rangeEnd?: number;
}

/**
 * Historical sentiment point for trend chart
 */
export interface SentimentHistoryPoint {
  /** Date/time of data point */
  date: string;
  /** Sentiment value (0-100) */
  value: number;
  /** Optional volume traded */
  volume?: number;
}

/**
 * Complete market sentiment payload
 */
export interface MarketSentimentPayload {
  /** Sentiment gauge data */
  gauge: SentimentGaugeData;
  /** Money flow distribution */
  moneyFlow: MoneyFlowItem[];
  /** Market breadth by sector */
  breadth: SectorBreadthItem[];
  /** Price change distribution */
  distribution: PriceChangeBin[];
  /** Historical sentiment trend */
  history: SentimentHistoryPoint[];
  /** Last update timestamp */
  timestamp?: string;
}

/**
 * Market sentiment API response
 */
export interface MarketSentimentResponse {
  success: boolean;
  data?: MarketSentimentPayload;
  error?: string;
}

/**
 * Sentiment zone configuration
 */
export interface SentimentZone {
  label: string;
  min: number;
  max: number;
  color: string;
  darkColor?: string;
}

/**
 * Default sentiment zones for gauge
 */
export const SENTIMENT_ZONES: SentimentZone[] = [
  {
    label: 'Quá bi quan',
    min: 0,
    max: 30,
    color: '#ef4444', // red-500
    darkColor: '#dc2626' // red-600
  },
  {
    label: 'Bi quan',
    min: 30,
    max: 45,
    color: '#f97316', // orange-500
    darkColor: '#ea580c' // orange-600
  },
  {
    label: 'Trung lập',
    min: 45,
    max: 55,
    color: '#eab308', // yellow-500
    darkColor: '#ca8a04' // yellow-600
  },
  {
    label: 'Lạc quan',
    min: 55,
    max: 70,
    color: '#84cc16', // lime-500
    darkColor: '#65a30d' // lime-600
  },
  {
    label: 'Quá lạc quan',
    min: 70,
    max: 100,
    color: '#22c55e', // green-500
    darkColor: '#16a34a' // green-600
  }
];

/**
 * Get sentiment label based on percentage
 */
export function getSentimentLabel(percent: number): string {
  const zone = SENTIMENT_ZONES.find(z => percent >= z.min && percent < z.max);
  return zone?.label || 'Không xác định';
}

/**
 * Get sentiment color based on percentage
 */
export function getSentimentColor(percent: number, isDark: boolean = false): string {
  const zone = SENTIMENT_ZONES.find(z => percent >= z.min && percent < z.max);
  return isDark ? (zone?.darkColor || zone?.color || '#6b7280') : (zone?.color || '#6b7280');
}
