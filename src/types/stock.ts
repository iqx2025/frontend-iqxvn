/**
 * Stock market and forecast-related TypeScript types and interfaces
 */

export type TrendDirection = "up" | "down";

export type StatusType = "positive" | "negative" | "neutral";

export type ImpactType = "high" | "medium" | "low";

/**
 * Represents a company/stock in the stock market
 * Contains all essential information about a publicly traded company
 */
export interface Company {
  /** Unique identifier for the company */
  id: number;
  /** Stock ticker symbol (e.g., VIC, VCB) */
  ticker: string;
  /** Company name in Vietnamese */
  nameVi: string;
  /** Company name in English */
  nameEn: string;
  /** Stock exchange where the company is listed (HOSE, HNX, UPCOM) */
  stockExchange: string;
  /** Current closing price */
  priceClose: number;
  /** Net change in price from previous session */
  netChange: number;
  /** Percentage change in price from previous session */
  pctChange: number;
  /** Trading volume (as string to handle large numbers) */
  volume: string;
  /** Market capitalization (as string to handle large numbers) */
  marketCap: string;
  /** Price-to-Earnings ratio */
  peRatio: number;
  /** Price-to-Book ratio */
  pbRatio: number;
  /** Industry group slug identifier */
  bcIndustryGroupSlug: string;
  /** Economic sector slug identifier */
  bcEconomicSectorSlug: string;
  /** Economic sector name in Vietnamese */
  bcEconomicSectorName: string;
  /** Company logo/image URL */
  imageUrl: string;
}

/**
 * Market statistics and overview data
 * Provides aggregate information about the stock market
 */
export interface MarketStats {
  /** Total number of listed companies */
  totalCompanies: string;
  /** Total number of industries */
  totalIndustries: number;
  /** Total number of economic sectors */
  totalSectors: number;
  /** Breakdown by stock exchanges */
  exchanges: Array<{
    /** Exchange name (HOSE, HNX, UPCOM) */
    exchange: string;
    /** Number of companies listed on this exchange */
    count: string;
  }>;
  /** Top industries by number of companies */
  topIndustries: Array<{
    /** Industry slug identifier */
    slug: string;
    /** Industry name */
    name: string;
    /** Number of companies in this industry */
    count: string;
  }>;
  /** Top economic sectors by number of companies */
  topSectors: Array<{
    /** Sector slug identifier */
    slug: string;
    /** Sector name */
    name: string;
    /** Number of companies in this sector */
    count: string;
  }>;
}

/**
 * Top performing companies in different categories
 * Used for displaying leaderboards and rankings
 */
export interface TopList {
  /** Top gaining companies by percentage change */
  gainers: Company[];
  /** Top losing companies by percentage change */
  losers: Company[];
  /** Top companies by trading volume */
  volume: Company[];
  /** Top companies by market capitalization */
  marketCap: Company[];
}

/**
 * Filter options for stock search and filtering
 */
export interface StockFilters {
  /** Search term for company name or ticker */
  searchTerm: string;
  /** Selected stock exchange filter */
  selectedExchange: string;
  /** Selected economic sector filter */
  selectedSector: string;
}

/**
 * Pagination configuration for stock listings
 */
export interface PaginationConfig {
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
}

/**
 * Tab types for stock market views
 */
export type StockTabType = 'all' | 'gainers' | 'losers' | 'volume';

/**
 * API response wrapper for stock-related endpoints
 */
export interface StockApiResponse<T> {
  /** Whether the API call was successful */
  success: boolean;
  /** The response data */
  data: T;
  /** Error or success message */
  message?: string;
}

/**
 * Configuration for API retry logic
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Base delay between retries in milliseconds */
  baseDelay: number;
  /** Current retry attempt number */
  currentAttempt: number;
}

/**
 * Stock market data loading states
 */
export interface StockDataState {
  /** Whether data is currently being loaded */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current retry attempt */
  retryCount: number;
}

/**
 * Sector information for filtering
 */
export interface SectorInfo {
  /** Sector slug identifier */
  slug: string;
  /** Sector display name */
  name: string;
}

// Stock-related types
export interface StockSummary {
  id: number;
  ticker: string;
  nameVi: string;
  nameEn: string;
  name: string;
  industryActivity: string;
  bcIndustryGroupId: number;
  bcIndustryGroupSlug: string;
  bcIndustryGroupCode: string;
  bcIndustryGroupType: string;
  bcEconomicSectorId: number;
  bcEconomicSectorSlug: string;
  bcEconomicSectorName: string;
  website: string;
  mainService: string;
  businessLine: string;
  businessStrategy: string;
  businessRisk: string;
  businessOverall: string;
  detailInfo: string;
  marketCap: number;
  outstandingSharesValue: number;
  analysisUpdated: string;
  stockExchange: string;
  noOfRecommendations: number;
  priceClose: number;
  isInWatchlist: boolean;
  netChange: number;
  pctChange: number;
  priceReferrance: number;
  priceOpen: number;
  priceFloor: number;
  priceLow: number;
  priceHigh: number;
  priceCeiling: number;
  priceTimeStamp: string;
  priceType: number;
  volume10dAvg: number;
  volume: number;
  peRatio: number;
  pbRatio: number;
  epsRatio: number;
  evEbitdaRatio: number;
  bookValue: number;
  freeFloatRate: number;
  valuationPoint: number;
  growthPoint: number;
  passPerformancePoint: number;
  financialHealthPoint: number;
  dividendPoint: number;
  imageUrl: string;
  beta5y: number;
  pricePctChg7d: number;
  pricePctChg30d: number;
  pricePctChgYtd: number;
  pricePctChg1y: number;
  pricePctChg3y: number;
  pricePctChg5y: number;
  companyQuality: number;
  overallRiskLevel: string;
  qualityValuation: string;
  taSignal1d: string;
  watchlistCount: number;
  roe: number;
  roa: number;
  revenue5yGrowth: number;
  netIncome5yGrowth: number;
  revenueLtmGrowth: number;
  netIncomeLtmGrowth: number;
  revenueGrowthQoq: number;
  netIncomeGrowthQoq: number;
  type: string;
  country: string;
}

export interface StockBusinessProfileProps {
  ticker: string;
  summary: StockSummary;
  className?: string;
}

// Page-specific types
export interface TickerPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export interface LoadingSkeletonProps {
  className?: string;
}

export interface ErrorDisplayProps {
  message: string;
  className?: string;
}

/**
 * Historical price data point from Simplize API
 */
export interface PriceData {
  /** Unix timestamp */
  timestamp: number;
  /** Opening price */
  open: number;
  /** Highest price */
  high: number;
  /** Lowest price */
  low: number;
  /** Closing price */
  close: number;
  /** Trading volume */
  volume: number;
  /** Date string for display (YYYY-MM-DD) */
  date: string;
}

/**
 * Response structure from Simplize API
 */
export interface SimplizeApiResponse {
  /** HTTP status code */
  status: number;
  /** Response message */
  message: string;
  /** Array of price data arrays [timestamp, open, high, low, close, volume] */
  data: number[][];
}

/**
 * Time period options for price charts
 */
export type ChartPeriod = '1m' | '1d' | '3m' | '1y' | '5y' | 'all';

/**
 * Props for the stock price chart component
 */
export interface StockPriceChartProps {
  /** Stock ticker symbol */
  ticker: string;
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Technical analysis rating types
 */
export type TechnicalRating = 'BUY' | 'SELL' | 'NEUTRAL';

/**
 * Technical analysis timeframe
 */
export type TechnicalTimeFrame = 'ONE_HOUR' | 'ONE_DAY' | 'ONE_WEEK';

/**
 * Foreign trading period types
 */
export type ForeignTradingPeriod = 'today' | 'week' | 'month';

/**
 * Foreign trading item data
 */
export interface ForeignTradingItem {
  /** Stock symbol */
  symbol: string;
  /** Buy quantity */
  buy_qtty: number;
  /** Buy value in billion VND */
  buy_val: number;
  /** Sell quantity */
  sell_qtty: number;
  /** Sell value in billion VND */
  sell_val: number;
  /** Net value in billion VND (positive = net buy, negative = net sell) */
  net_val: number;
}

/**
 * Foreign trading data structure
 */
export interface ForeignTradingData {
  /** Top stocks bought by foreign investors */
  top_buy: ForeignTradingItem[];
  /** Top stocks sold by foreign investors */
  top_sell: ForeignTradingItem[];
  /** Update timestamp */
  update_time: number;
  /** From date */
  from_date: string;
  /** To date */
  to_date: string;
}

/**
 * Foreign trading API response
 */
export interface ForeignTradingResponse {
  /** Response message */
  message: string;
  /** HTTP status code */
  status: number;
  /** Trading data */
  data: ForeignTradingData;
  /** Execution time in milliseconds */
  execute_time_ms: number;
}

/**
 * Moving average indicator
 */
export interface MovingAverage {
  name: string;
  value: number;
  rating: TechnicalRating;
}

/**
 * Oscillator indicator
 */
export interface Oscillator {
  name: string;
  value: number;
  rating: TechnicalRating;
}

/**
 * Gauge data for technical analysis
 */
export interface TechnicalGauge {
  rating: 'GOOD' | 'BAD' | 'NEUTRAL';
  values: {
    BUY: number;
    SELL: number;
    NEUTRAL: number;
  };
}

/**
 * Pivot point data
 */
export interface PivotPoint {
  pivotPoint: number;
  resistance1: number;
  resistance2: number;
  resistance3: number;
  support1: number;
  support2: number;
  support3: number;
  fibResistance1: number;
  fibResistance2: number;
  fibResistance3: number;
  fibSupport1: number;
  fibSupport2: number;
  fibSupport3: number;
}

/**
 * Technical analysis data
 */
export interface TechnicalAnalysis {
  timeFrame: TechnicalTimeFrame;
  movingAverages: MovingAverage[];
  gaugeMovingAverage: TechnicalGauge;
  oscillators: Oscillator[];
  gaugeOscillator: TechnicalGauge;
  pivot: PivotPoint;
  gaugeSummary: TechnicalGauge;
  price: number | null;
  matchTime: string | null;
}

/**
 * Technical analysis API response
 */
export interface TechnicalAnalysisResponse {
  serverDateTime: string;
  status: number;
  code: number;
  msg: string;
  exception: string | null;
  successful: boolean;
  data: TechnicalAnalysis;
}

/**
 * Props for technical analysis component
 */
export interface TechnicalAnalysisProps {
  ticker: string;
  className?: string;
}
