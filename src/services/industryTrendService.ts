/**
 * Industry Trend Service
 * Service for fetching and processing industry trend data from Google Sheets API
 */

import { BaseApiService } from './baseApiService';
import { 
  IndustryTrendItem, 
  IndustryTrendData, 
  GoogleSheetsResponse,
  IndustryTrendError 
} from '@/types/industryTrend';

const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1ekb2bYAQJZbtmqMUzsagb4uWBdtkAzTq3kuIMHQ22RI/values/BoLocXHT';
const API_KEY = 'AIzaSyB9PPBCGbWFv1TxH_8s_AsiqiChLs9MqXU';

/**
 * Industry Trend Service
 */
export class IndustryTrendService extends BaseApiService {
  /**
   * Fetches industry trend data from Google Sheets API
   */
  static async fetchIndustryTrendData(): Promise<IndustryTrendData> {
    try {
      const url = `${GOOGLE_SHEETS_API_URL}?key=${API_KEY}`;
      
      const response = await this.fetchWithErrorHandling<GoogleSheetsResponse>(url);
      
      if (!response.values || response.values.length < 2) {
        throw new Error('Invalid or empty data from Google Sheets');
      }

      const items = this.parseGoogleSheetsData(response.values);
      
      return {
        items,
        lastUpdated: new Date(),
        totalCount: items.length,
      };
    } catch (error) {
      console.error('Failed to fetch industry trend data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fetches industry trend data server-side with caching
   */
  static async fetchIndustryTrendDataServerSide(): Promise<IndustryTrendData> {
    try {
      const url = `${GOOGLE_SHEETS_API_URL}?key=${API_KEY}`;
      
      // Cache for 5 minutes (300 seconds)
      const response = await this.fetchServerSide<GoogleSheetsResponse>(url, {
        revalidate: 300,
      });
      
      if (!response.values || response.values.length < 2) {
        throw new Error('Invalid or empty data from Google Sheets');
      }

      const items = this.parseGoogleSheetsData(response.values);
      
      return {
        items,
        lastUpdated: new Date(),
        totalCount: items.length,
      };
    } catch (error) {
      console.error('Failed to fetch industry trend data (server-side):', error);
      throw this.handleError(error);
    }
  }

  /**
   * Parses Google Sheets data into typed IndustryTrendItem array
   */
  private static parseGoogleSheetsData(values: string[][]): IndustryTrendItem[] {
    // Skip header row (index 0) and process data rows
    const dataRows = values.slice(1);
    
    return dataRows.map((row) => {
      // Parse numeric values, handling comma as decimal separator
      const parseNumber = (value: string): number => {
        if (!value || value === '') return 0;
        // Replace comma with dot for decimal separator
        const normalized = value.replace(',', '.');
        const parsed = parseFloat(normalized);
        return isNaN(parsed) ? 0 : parsed;
      };

      return {
        symbol: row[0] || '',
        exchange: row[1] || '',
        sector_level_2: row[2] || '',
        close_price: parseNumber(row[3]),
        return_1d_pct: parseNumber(row[4]),
        return_1w_pct: parseNumber(row[5]),
        return_1m_pct: parseNumber(row[6]),
        volume: parseNumber(row[7]),
        avg_volume_1w: parseNumber(row[8]),
        avg_volume_1m: parseNumber(row[9]),
        rrg_phase: row[10] || '',
        beta_90d: parseNumber(row[11]),
        beta_180d: parseNumber(row[12]),
        sector_stage: row[13] || '',
      };
    }).filter(item => item.symbol); // Filter out any rows without a symbol
  }

  /**
   * Handles errors and returns a structured error response
   */
  private static handleError(error: unknown): IndustryTrendError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'FETCH_ERROR',
        details: error,
      };
    }
    
    return {
      message: 'An unknown error occurred while fetching industry trend data',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Fetches industry trend data with retry logic
   */
  static async fetchWithRetry(): Promise<IndustryTrendData> {
    return this.withRetry(
      () => this.fetchIndustryTrendData(),
      { maxAttempts: 3, baseDelay: 2000 }
    );
  }

  /**
   * Filters industry trend data based on provided filters
   */
  static filterData(
    data: IndustryTrendItem[],
    filters: {
      search?: string;
      exchange?: string;
      sector?: string;
      rrgPhase?: string;
      sectorStage?: string;
    }
  ): IndustryTrendItem[] {
    let filtered = [...data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.symbol.toLowerCase().includes(searchLower) ||
          item.sector_level_2.toLowerCase().includes(searchLower)
      );
    }

    if (filters.exchange) {
      filtered = filtered.filter(item => item.exchange === filters.exchange);
    }

    if (filters.sector) {
      filtered = filtered.filter(item => 
        item.sector_level_2.toLowerCase().includes(filters.sector!.toLowerCase())
      );
    }

    if (filters.rrgPhase) {
      filtered = filtered.filter(item => item.rrg_phase === filters.rrgPhase);
    }

    if (filters.sectorStage) {
      filtered = filtered.filter(item => item.sector_stage === filters.sectorStage);
    }

    return filtered;
  }

  /**
   * Sorts industry trend data
   */
  static sortData(
    data: IndustryTrendItem[],
    sortField: keyof IndustryTrendItem,
    sortDirection: 'asc' | 'desc'
  ): IndustryTrendItem[] {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }
}
