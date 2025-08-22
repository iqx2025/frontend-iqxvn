/**
 * Valuation Service
 * Service for fetching and processing attractive valuation data from Google Sheets API
 */

import { BaseApiService } from './baseApiService';
import { 
  ValuationItem, 
  ValuationData, 
  GoogleSheetsResponse,
  ValuationError,
  ValuationComparison 
} from '@/types/valuationFilter';

const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1ekb2bYAQJZbtmqMUzsagb4uWBdtkAzTq3kuIMHQ22RI/values/BoLocDGHD';
const API_KEY = 'AIzaSyB9PPBCGbWFv1TxH_8s_AsiqiChLs9MqXU';

/**
 * Valuation Service
 */
export class ValuationService extends BaseApiService {
  /**
   * Fetches valuation data from Google Sheets API
   */
  static async fetchValuationData(): Promise<ValuationData> {
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
      console.error('Failed to fetch valuation data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fetches valuation data server-side with caching
   */
  static async fetchValuationDataServerSide(): Promise<ValuationData> {
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
      console.error('Failed to fetch valuation data (server-side):', error);
      throw this.handleError(error);
    }
  }

  /**
   * Parses Google Sheets data into typed ValuationItem array
   */
  private static parseGoogleSheetsData(values: string[][]): ValuationItem[] {
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
        volume: parseNumber(row[4]),
        pe_ratio: parseNumber(row[5]),
        sector_pe: parseNumber(row[6]),
        pb_ratio: parseNumber(row[7]),
        sector_pb: parseNumber(row[8]),
        roa_pct: parseNumber(row[9]),
        cfo: parseNumber(row[10]),
        delta_roa_pct: parseNumber(row[11]),
        cfo_ln_profit: parseNumber(row[12]),
        gross_margin_pct: parseNumber(row[13]),
        asset_turnover_pct: parseNumber(row[14]),
      };
    }).filter(item => item.symbol); // Filter out any rows without a symbol
  }

  /**
   * Calculates valuation comparison metrics
   */
  static calculateValuationComparison(item: ValuationItem): ValuationComparison {
    const isUndervaluedPE = item.pe_ratio > 0 && item.sector_pe > 0 && item.pe_ratio < item.sector_pe;
    const isUndervaluedPB = item.pb_ratio > 0 && item.sector_pb > 0 && item.pb_ratio < item.sector_pb;
    const peRatio = item.sector_pe > 0 ? item.pe_ratio / item.sector_pe : 0;
    const pbRatio = item.sector_pb > 0 ? item.pb_ratio / item.sector_pb : 0;

    return {
      isUndervaluedPE,
      isUndervaluedPB,
      peRatio,
      pbRatio,
    };
  }

  /**
   * Filters valuation data based on provided filters
   */
  static filterData(
    data: ValuationItem[],
    filters: {
      search?: string;
      exchange?: string;
      sector?: string;
      minPE?: number;
      maxPE?: number;
      minPB?: number;
      maxPB?: number;
      minROA?: number;
      maxROA?: number;
      undervaluedOnly?: boolean;
    }
  ): ValuationItem[] {
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

    if (filters.minPE !== undefined) {
      filtered = filtered.filter(item => item.pe_ratio >= filters.minPE!);
    }

    if (filters.maxPE !== undefined) {
      filtered = filtered.filter(item => item.pe_ratio <= filters.maxPE!);
    }

    if (filters.minPB !== undefined) {
      filtered = filtered.filter(item => item.pb_ratio >= filters.minPB!);
    }

    if (filters.maxPB !== undefined) {
      filtered = filtered.filter(item => item.pb_ratio <= filters.maxPB!);
    }

    if (filters.minROA !== undefined) {
      filtered = filtered.filter(item => item.roa_pct >= filters.minROA!);
    }

    if (filters.maxROA !== undefined) {
      filtered = filtered.filter(item => item.roa_pct <= filters.maxROA!);
    }

    if (filters.undervaluedOnly) {
      filtered = filtered.filter(item => {
        const comparison = this.calculateValuationComparison(item);
        return comparison.isUndervaluedPE && comparison.isUndervaluedPB;
      });
    }

    return filtered;
  }

  /**
   * Sorts valuation data
   */
  static sortData(
    data: ValuationItem[],
    sortField: keyof ValuationItem,
    sortDirection: 'asc' | 'desc'
  ): ValuationItem[] {
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

  /**
   * Handles errors and returns a structured error response
   */
  private static handleError(error: unknown): ValuationError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'FETCH_ERROR',
        details: error,
      };
    }
    
    return {
      message: 'An unknown error occurred while fetching valuation data',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Fetches valuation data with retry logic
   */
  static async fetchWithRetry(): Promise<ValuationData> {
    return this.withRetry(
      () => this.fetchValuationData(),
      { maxAttempts: 3, baseDelay: 2000 }
    );
  }

  /**
   * Gets unique sectors from the data
   */
  static getUniqueSectors(data: ValuationItem[]): string[] {
    const sectors = new Set(data.map(item => item.sector_level_2).filter(Boolean));
    return Array.from(sectors).sort();
  }

  /**
   * Calculates aggregate statistics for the dataset
   */
  static calculateStatistics(data: ValuationItem[]) {
    const validPE = data.filter(item => item.pe_ratio > 0).map(item => item.pe_ratio);
    const validPB = data.filter(item => item.pb_ratio > 0).map(item => item.pb_ratio);
    const validROA = data.filter(item => item.roa_pct > 0).map(item => item.roa_pct);

    const average = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const median = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    return {
      avgPE: average(validPE),
      medianPE: median(validPE),
      avgPB: average(validPB),
      medianPB: median(validPB),
      avgROA: average(validROA),
      medianROA: median(validROA),
      totalStocks: data.length,
      undervaluedCount: data.filter(item => {
        const comp = this.calculateValuationComparison(item);
        return comp.isUndervaluedPE && comp.isUndervaluedPB;
      }).length,
    };
  }
}
