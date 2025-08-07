import { CompanyData } from "./api";
import { TransformationService } from "./transformationService";
import { StockSummary } from "@/types";
import { BaseApiService, ApiServiceError } from "./baseApiService";

/**
 * Server-side API service for data fetching in async components
 * This service is designed to work in server components with proper error handling
 */
export class ServerApiService extends BaseApiService {
  /**
   * Fetch company data on the server side
   * @param ticker - Stock ticker symbol
   * @returns Promise<StockSummary> - Transformed stock data
   */
  static async getCompanyData(ticker: string): Promise<StockSummary> {
    try {
      const apiResponse = await this.fetchServerSide<{ success: boolean; data: CompanyData; message?: string }>(
        this.getApiUrl(`/api/companies/${ticker.toLowerCase()}`),
        { revalidate: 300 }
      );

      if (!apiResponse.success) {
        throw new ApiServiceError(apiResponse.message || 'Failed to fetch company data');
      }

      // Validate data before transformation
      if (!TransformationService.validateCompanyData(apiResponse.data)) {
        throw new ApiServiceError('Dữ liệu từ API không hợp lệ');
      }

      const transformedData = TransformationService.transformApiDataToStockSummary(apiResponse.data);
      return transformedData;
    } catch (error) {
      throw new ApiServiceError(
        error instanceof Error
          ? error.message
          : 'Không thể tải dữ liệu công ty'
      );
    }
  }

  /**
   * Fetch multiple company data (for future use)
   * @param tickers - Array of ticker symbols
   * @returns Promise<StockSummary[]> - Array of transformed stock data
   */
  static async getMultipleCompanyData(tickers: string[]): Promise<StockSummary[]> {
    try {
      const promises = tickers.map(ticker => this.getCompanyData(ticker));
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<StockSummary> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);
    } catch (error) {
      console.error('Server: Error fetching multiple company data:', error);
      throw new Error('Không thể tải dữ liệu nhiều công ty');
    }
  }

  /**
   * Check if ticker exists (lightweight check)
   * @param ticker - Stock ticker symbol
   * @returns Promise<boolean> - Whether ticker exists
   */
  static async tickerExists(ticker: string): Promise<boolean> {
    try {
      await this.getCompanyData(ticker);
      return true;
    } catch {
      return false;
    }
  }
}
