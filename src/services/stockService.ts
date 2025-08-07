/**
 * Stock Market API Service
 * Handles all API calls related to stock market data with proper error handling and retry logic
 */

import {
  Company,
  MarketStats,
  TopList,
  StockApiResponse
} from '@/types';
import { safeGet } from '@/utils';
import { BaseApiService, ApiServiceError } from './baseApiService';

/**
 * Custom error class for stock service errors
 */
export class StockServiceError extends ApiServiceError {
  constructor(
    message: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message, statusCode, originalError);
    this.name = 'StockServiceError';
  }
}

/**
 * Stock Service class containing all stock-related API methods
 */
export class StockService extends BaseApiService {
  /**
   * Fetches the list of companies with optional limit
   */
  static async fetchCompanies(limit: number = 100): Promise<Company[]> {
    return this.withRetry(async () => {
      const response = await this.fetchWithErrorHandling<StockApiResponse<{ data?: Company[] } | Company[]>>(
        this.getApiUrl(`/api/companies?limit=${limit}`)
      );

      this.validateResponse(response);

      // Handle different response structures safely
      const companiesArray = safeGet(response, 'data.data', null) || safeGet(response, 'data', []);

      if (!Array.isArray(companiesArray)) {
        throw new StockServiceError('Invalid companies data format');
      }

      return companiesArray as Company[];
    });
  }

  /**
   * Fetches market statistics and overview data
   */
  static async fetchMarketStats(): Promise<MarketStats | null> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<MarketStats>>(
          this.getApiUrl('/api/companies/stats')
        );

        this.validateResponse(response);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch market stats:', error);
        return null; // Market stats are optional, don't fail the entire page
      }
    });
  }

  /**
   * Fetches top gaining companies
   */
  static async fetchTopGainers(limit: number = 10): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/top-gainers?limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch top gainers:', error);
        return [];
      }
    });
  }

  /**
   * Fetches top losing companies
   */
  static async fetchTopLosers(limit: number = 10): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/top-losers?limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch top losers:', error);
        return [];
      }
    });
  }

  /**
   * Fetches companies with highest trading volume
   */
  static async fetchTopVolume(limit: number = 10): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/top-volume?limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch top volume:', error);
        return [];
      }
    });
  }

  /**
   * Fetches companies with highest market capitalization
   */
  static async fetchTopMarketCap(limit: number = 10): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/top-market-cap?limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch top market cap:', error);
        return [];
      }
    });
  }

  /**
   * Fetches all top lists in parallel for better performance
   */
  static async fetchTopLists(limit: number = 10): Promise<TopList> {
    const [gainers, losers, volume, marketCap] = await Promise.all([
      this.fetchTopGainers(limit),
      this.fetchTopLosers(limit),
      this.fetchTopVolume(limit),
      this.fetchTopMarketCap(limit),
    ]);

    return {
      gainers,
      losers,
      volume,
      marketCap,
    };
  }

  /**
   * Searches for companies using the dedicated search endpoint
   */
  static async searchCompanies(query: string, limit: number = 10): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/search?q=${encodeURIComponent(query)}&limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to search companies:', error);
        return [];
      }
    });
  }

  /**
   * Fetches companies with advanced filtering options
   */
  static async fetchCompaniesWithFilters(options: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
    sector?: string;
    exchange?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ companies: Company[]; total: number; page: number; totalPages: number }> {
    return this.withRetry(async () => {
      const params = new URLSearchParams();

      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.search) params.append('search', options.search);
      if (options.industry) params.append('industry', options.industry);
      if (options.sector) params.append('sector', options.sector);
      if (options.exchange) params.append('exchange', options.exchange);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const response = await this.fetchWithErrorHandling<StockApiResponse<{
        data: Company[];
        total: number;
        page: number;
        totalPages: number;
      }>>(
        this.getApiUrl(`/api/companies?${params.toString()}`)
      );

      this.validateResponse(response);

      return {
        companies: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
      };
    });
  }

  /**
   * Fetches companies by industry
   */
  static async fetchCompaniesByIndustry(industrySlug: string, page: number = 1, limit: number = 20): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/industry/${industrySlug}?page=${page}&limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn(`Failed to fetch companies by industry ${industrySlug}:`, error);
        return [];
      }
    });
  }

  /**
   * Fetches companies by sector
   */
  static async fetchCompaniesBySector(sectorSlug: string, page: number = 1, limit: number = 20): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/sector/${sectorSlug}?page=${page}&limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn(`Failed to fetch companies by sector ${sectorSlug}:`, error);
        return [];
      }
    });
  }

  /**
   * Fetches companies by exchange
   */
  static async fetchCompaniesByExchange(exchange: string, page: number = 1, limit: number = 20): Promise<Company[]> {
    return this.withRetry(async () => {
      try {
        const response = await this.fetchWithErrorHandling<StockApiResponse<Company[]>>(
          this.getApiUrl(`/api/companies/exchange/${exchange}?page=${page}&limit=${limit}`)
        );

        this.validateResponse(response);
        return response.data || [];
      } catch (error) {
        console.warn(`Failed to fetch companies by exchange ${exchange}:`, error);
        return [];
      }
    });
  }

  /**
   * Fetches all stock market data in parallel
   * This is the main method used by the stock market page
   */
  static async fetchAllStockData(companiesLimit: number = 100, topListsLimit: number = 10) {
    const [companies, marketStats, topLists] = await Promise.all([
      this.fetchCompanies(companiesLimit),
      this.fetchMarketStats(),
      this.fetchTopLists(topListsLimit),
    ]);

    return {
      companies,
      marketStats,
      topLists,
    };
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use StockService.fetchAllStockData instead
 */
export const fetchStockData = StockService.fetchAllStockData;
