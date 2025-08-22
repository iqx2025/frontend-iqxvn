/**
 * Financial Data Service
 * Handles API calls to VietCap financial endpoints with proper error handling and data transformation
 */

import { BaseApiService, ApiServiceError } from './baseApiService';
import {
  VietCapApiResponse,
  FinancialMetricsData,
  FinancialStatementData,
  FinancialReportData,
  ProcessedFinancialSection,
  ProcessedFinancialItem,
  FinancialStatementSection,
  FinancialMetricItem,
  FinancialStatementRecord
} from '@/types/financial';

/**
 * Financial Data Service class
 */
export class FinancialService extends BaseApiService {
  
  /**
   * Fetches financial metrics metadata for a company
   */
  static async getFinancialMetrics(ticker: string): Promise<FinancialMetricsData> {
    // Use internal API route instead of direct VietCap API call
    const url = this.getInternalApiUrl(`/vietcap/financial/${ticker.toUpperCase()}/metrics`);
    
    try {
      const response = await this.withRetry(async () => {
        const data = await this.fetchWithErrorHandling<VietCapApiResponse<FinancialMetricsData>>(url);
        return data;
      });

      if (!response.successful) {
        throw new ApiServiceError(`VietCap API error: ${response.msg}`, response.status);
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw new ApiServiceError(
        `Failed to fetch financial metrics for ${ticker}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Fetches financial statement data for a specific section
   */
  static async getFinancialStatement(
    ticker: string, 
    section: FinancialStatementSection
  ): Promise<FinancialStatementData> {
    // Use internal API route instead of direct VietCap API call
    const url = this.getInternalApiUrl(`/vietcap/financial/${ticker.toUpperCase()}/statement?section=${section}`);
    
    try {
      const response = await this.withRetry(async () => {
        const data = await this.fetchWithErrorHandling<VietCapApiResponse<FinancialStatementData>>(url);
        return data;
      });

      if (!response.successful) {
        throw new ApiServiceError(`VietCap API error: ${response.msg}`, response.status);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${section} for ${ticker}:`, error);
      throw new ApiServiceError(
        `Failed to fetch ${section} for ${ticker}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Fetches all financial data for a company
   */
  static async getAllFinancialData(ticker: string): Promise<FinancialReportData> {
    try {
      // Fetch all data in parallel
      const [metrics, incomeStatement, balanceSheet, cashFlow, notes] = await Promise.all([
        this.getFinancialMetrics(ticker),
        this.getFinancialStatement(ticker, 'INCOME_STATEMENT'),
        this.getFinancialStatement(ticker, 'BALANCE_SHEET'),
        this.getFinancialStatement(ticker, 'CASH_FLOW'),
        this.getFinancialStatement(ticker, 'NOTE')
      ]);

      // Process the data (default to annual view)
      const processedData: FinancialReportData = {
        ticker,
        lastUpdated: new Date().toISOString(),
        sections: {
          incomeStatement: this.processFinancialSection(
            'INCOME_STATEMENT',
            'Báo cáo kết quả kinh doanh',
            metrics.INCOME_STATEMENT,
            incomeStatement,
            'annual'
          ),
          balanceSheet: this.processFinancialSection(
            'BALANCE_SHEET',
            'Bảng cân đối kế toán',
            metrics.BALANCE_SHEET,
            balanceSheet,
            'annual'
          ),
          cashFlow: this.processFinancialSection(
            'CASH_FLOW',
            'Báo cáo lưu chuyển tiền tệ',
            metrics.CASH_FLOW,
            cashFlow,
            'annual'
          ),
          notes: this.processFinancialSection(
            'NOTE',
            'Thuyết minh báo cáo tài chính',
            metrics.NOTE,
            notes,
            'annual'
          )
        },
        metrics
      };

      return processedData;
    } catch (error) {
      console.error(`Error fetching all financial data for ${ticker}:`, error);
      throw new ApiServiceError(
        `Failed to fetch financial data for ${ticker}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Processes raw financial data into display format
   */
  private static processFinancialSection(
    sectionName: string,
    sectionTitle: string,
    metricItems: FinancialMetricItem[],
    statementData: FinancialStatementData,
    periodType: 'annual' | 'quarterly' = 'annual'
  ): ProcessedFinancialSection {
    let dataToProcess: FinancialStatementRecord[];
    let periods: string[];
    let availableYears: number[];
    let availableQuarters: { year: number; quarter: number; period: string }[] = [];

    if (periodType === 'annual') {
      // Get the latest 5 years of annual data
      dataToProcess = statementData.years
        .filter(record => record.lengthReport === 5) // Annual reports
        .sort((a, b) => b.yearReport - a.yearReport)
        .slice(0, 5)
        .reverse(); // Show oldest to newest

      periods = dataToProcess.map(record => record.yearReport.toString());
      availableYears = [...new Set(statementData.years
        .filter(record => record.lengthReport === 5)
        .map(record => record.yearReport)
      )].sort((a, b) => b - a);
    } else {
      // Get the latest 8 quarters of quarterly data
      const quarterlyData = statementData.quarters
        .filter(record => record.lengthReport >= 1 && record.lengthReport <= 4) // Quarterly reports
        .sort((a, b) => {
          if (a.yearReport !== b.yearReport) {
            return b.yearReport - a.yearReport;
          }
          return b.lengthReport - a.lengthReport;
        })
        .slice(0, 8)
        .reverse(); // Show oldest to newest

      dataToProcess = quarterlyData;
      periods = quarterlyData.map(record => `Q${record.lengthReport}/${record.yearReport}`);

      availableYears = [...new Set(statementData.quarters
        .filter(record => record.lengthReport >= 1 && record.lengthReport <= 4)
        .map(record => record.yearReport)
      )].sort((a, b) => b - a);

      availableQuarters = statementData.quarters
        .filter(record => record.lengthReport >= 1 && record.lengthReport <= 4)
        .map(record => ({
          year: record.yearReport,
          quarter: record.lengthReport,
          period: `Q${record.lengthReport}/${record.yearReport}`
        }))
        .sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.quarter - a.quarter;
        });
    }

    // Process each metric item
    const items: ProcessedFinancialItem[] = metricItems
      .filter(item => item.field) // Only items with field codes
      .map(item => {
        const values: { [period: string]: number | null } = {};

        // Extract values for each period
        dataToProcess.forEach((record, index) => {
          const period = periods[index];
          const value = item.field ? record[item.field] : null;
          values[period] = typeof value === 'number' ? value : null;
        });

        // Calculate latest value and changes
        const latestValue = periods.length > 0 ? values[periods[periods.length - 1]] || null : null;
        const previousValue = periods.length > 1 ? values[periods[periods.length - 2]] || null : null;

        let change: number | null = null;
        let changePercent: number | null = null;

        if (latestValue !== null && previousValue !== null) {
          change = latestValue - previousValue;
          changePercent = previousValue !== 0 ? (change / Math.abs(previousValue)) * 100 : null;
        }

        // Check if this item has children
        const hasChildren = metricItems.some(otherItem => otherItem.parent === item.name);

        return {
          field: item.field || '',
          name: item.name,
          titleVi: item.titleVi,
          titleEn: item.titleEn,
          level: item.level,
          parent: item.parent,
          values,
          latestValue,
          previousValue,
          change,
          changePercent,
          hasChildren,
          isExpanded: false
        };
      })
      .filter(item => {
        // Filter out items with no data
        return Object.values(item.values).some(value => value !== null && value !== 0);
      });

    return {
      sectionName,
      sectionTitle,
      items,
      periods,
      periodType,
      availableYears,
      availableQuarters
    };
  }

  /**
   * Validates ticker format
   */
  static validateTicker(ticker: string): boolean {
    if (!ticker || typeof ticker !== 'string') {
      return false;
    }
    
    // Vietnamese stock ticker format: 3-4 uppercase letters
    const tickerRegex = /^[A-Z]{3,4}$/;
    return tickerRegex.test(ticker.trim());
  }

  /**
   * Gets available years for a ticker
   */
  static async getAvailableYears(ticker: string): Promise<number[]> {
    try {
      const incomeStatement = await this.getFinancialStatement(ticker, 'INCOME_STATEMENT');
      
      const years = incomeStatement.years
        .filter(record => record.lengthReport === 5) // Annual reports only
        .map(record => record.yearReport)
        .sort((a, b) => b - a); // Newest first

      return [...new Set(years)]; // Remove duplicates
    } catch (error) {
      console.error(`Error getting available years for ${ticker}:`, error);
      return [];
    }
  }

  /**
   * Gets financial data for a specific section and period type
   */
  static async getFinancialSectionData(
    ticker: string,
    section: FinancialStatementSection,
    periodType: 'annual' | 'quarterly' = 'annual'
  ): Promise<ProcessedFinancialSection> {
    try {
      const [metrics, statementData] = await Promise.all([
        this.getFinancialMetrics(ticker),
        this.getFinancialStatement(ticker, section)
      ]);

      const sectionTitles = {
        'INCOME_STATEMENT': 'Báo cáo kết quả kinh doanh',
        'BALANCE_SHEET': 'Bảng cân đối kế toán',
        'CASH_FLOW': 'Báo cáo lưu chuyển tiền tệ',
        'NOTE': 'Thuyết minh báo cáo tài chính'
      };

      return this.processFinancialSection(
        section,
        sectionTitles[section],
        metrics[section],
        statementData,
        periodType
      );
    } catch (error) {
      console.error(`Error fetching ${section} data for ${ticker}:`, error);
      throw error;
    }
  }

  /**
   * Gets the latest financial data update date
   */
  static async getLastUpdateDate(ticker: string): Promise<Date | null> {
    try {
      const incomeStatement = await this.getFinancialStatement(ticker, 'INCOME_STATEMENT');

      if (incomeStatement.years.length === 0) {
        return null;
      }

      // Find the most recent update date
      const latestUpdate = incomeStatement.years
        .map(record => new Date(record.updateDate))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return latestUpdate;
    } catch (error) {
      console.error(`Error getting last update date for ${ticker}:`, error);
      return null;
    }
  }
}
