import { BaseApiService, ApiServiceError } from './baseApiService';
import {
  PriceData,
  SimplizeApiResponse,
  TechnicalAnalysisResponse,
  TechnicalTimeFrame,
  ForeignTradingResponse,
  ForeignTradingData,
  ForeignTradingPeriod
} from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface CompanyData {
  id: number;
  ticker: string;
  nameVi: string;
  nameEn: string;
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
  marketCap: string;
  outstandingSharesValue: string;
  analysisUpdated: string;
  stockExchange: string;
  priceClose: number;
  netChange: number;
  pctChange: number;
  priceReference: number;
  priceOpen: number;
  priceFloor: number;
  priceLow: number;
  priceHigh: number;
  priceCeiling: number;
  priceTimestamp: string;
  priceType: number;
  volume10dAvg: string;
  volume: string;
  peRatio: number;
  pbRatio: number;
  epsRatio: number;
  bookValue: number;
  freeFloatRate: number;
  valuationPoint: number;
  growthPoint: number;
  passPerformancePoint: number;
  financialHealthPoint: number;
  dividendPoint: number;
  imageUrl: string;
  dividendYieldCurrent: number;
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
  createdAt: string;
  updatedAt: string;
  isInWatchlist?: boolean;
}

export class ApiService extends BaseApiService {

  static async getCompanyData(ticker: string): Promise<CompanyData> {
    // Use internal Next.js API route to avoid CORS issues
    const response = await this.fetchWithErrorHandling<ApiResponse<CompanyData>>(
      this.getInternalApiUrl(`/companies/${ticker.toLowerCase()}`)
    );

    if (!response.success) {
      throw new ApiServiceError(response.message || 'Failed to fetch company data');
    }

    return response.data;
  }

  static async getCompanyList(): Promise<CompanyData[]> {
    const response = await this.fetchWithErrorHandling<ApiResponse<CompanyData[]>>(
      this.getApiUrl('/api/companies')
    );

    if (!response.success) {
      throw new ApiServiceError(response.message || 'Failed to fetch company list');
    }

    return response.data;
  }

  /**
   * Fetch historical price data from Simplize API
   * @param ticker - Stock ticker symbol
   * @param period - Time period (1m, 1d, 3m, 1y, 5y, all)
   * @returns Promise<PriceData[]> - Array of price data points
   */
  static async getHistoricalPrices(ticker: string, period: string = '1d'): Promise<PriceData[]> {
    try {
      const response = await this.fetchWithErrorHandling<SimplizeApiResponse>(
        `https://api2.simplize.vn/api/historical/prices/chart?ticker=${ticker.toUpperCase()}&period=${period}`
      );

      if (response.status !== 200) {
        throw new ApiServiceError(response.message || 'Failed to fetch price data');
      }

      // Transform the raw data to our format
      return response.data.map((item: number[]) => ({
        timestamp: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        date: new Date(item[0] * 1000).toISOString().split('T')[0], // Convert timestamp to date string
      }));
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Failed to fetch historical price data'
      );
    }
  }

  /**
   * Fetch technical analysis data from VietCap API
   * @param ticker - Stock ticker symbol
   * @param timeFrame - Time frame for analysis (ONE_HOUR, ONE_DAY, ONE_WEEK)
   * @returns Promise<TechnicalAnalysis> - Technical analysis data
   */
  static async getTechnicalAnalysis(ticker: string, timeFrame: TechnicalTimeFrame = 'ONE_DAY') {
    try {
      const response = await this.fetchWithErrorHandling<TechnicalAnalysisResponse>(
        `https://iq.vietcap.com.vn/api/iq-insight-service/v1/company/${ticker.toUpperCase()}/technical/${timeFrame}`
      );

      if (!response.successful) {
        throw new ApiServiceError(response.msg || 'Failed to fetch technical analysis data');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching technical analysis:', error);
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Failed to fetch technical analysis data'
      );
    }
  }

  /**
   * Fetch foreign trading data from 24hmoney API
   * @param period - Time period (today, week, month)
   * @returns Promise<ForeignTradingData> - Foreign trading data
   */
  static async getForeignTrading(period: ForeignTradingPeriod = 'today'): Promise<ForeignTradingData> {
    try {
      const response = await this.fetchWithErrorHandling<ForeignTradingResponse>(
        `https://api-finance-t19.24hmoney.vn/v2/web/indices/foreign-trading-top-stock-by-time?code=10&type=${period}`
      );

      if (response.status !== 200) {
        throw new ApiServiceError(response.message || 'Failed to fetch foreign trading data');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching foreign trading data:', error);
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Failed to fetch foreign trading data'
      );
    }
  }
}

// Utility functions for data transformation
export const transformCompanyData = (data: CompanyData) => {
  return {
    ...data,
    // Format market cap to number
    marketCapValue: parseFloat(data.marketCap),
    // Format outstanding shares to number
    outstandingSharesNumber: parseFloat(data.outstandingSharesValue),
    // Format volume to number
    volumeNumber: parseFloat(data.volume),
    volume10dAvgNumber: parseFloat(data.volume10dAvg),
    // Format analysis date
    analysisUpdatedFormatted: new Date(data.analysisUpdated).toLocaleDateString('vi-VN'),
    // Add computed fields
    isInWatchlist: false, // This would come from user's watchlist
  };
};
