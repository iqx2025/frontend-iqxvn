/**
 * Market Leader Service
 * Service for fetching stocks with the most impact on market indices
 */

import { BaseApiService } from './baseApiService';
import { 
  MarketLeaderItem, 
  MarketLeaderResponse, 
  MarketExchange, 
  EXCHANGE_CENTER_MAP 
} from '@/types/market-leader';

/**
 * Service class for market leader data operations
 */
export class MarketLeaderService extends BaseApiService {
  /**
   * Fetches market leader stocks for a specific exchange
   * @param exchange - The stock exchange (VNINDEX, HNX, or UPCOM)
   * @param take - Number of stocks to fetch (default: 10)
   * @returns Promise with market leader data
   */
  static async getMarketLeaders(
    exchange: MarketExchange = 'VNINDEX',
    take: number = 10
  ): Promise<MarketLeaderItem[]> {
    try {
      // Get the center ID for the exchange
      const centerId = EXCHANGE_CENTER_MAP[exchange];
      
      // Build the API URL with query parameters
      const url = this.getInternalApiUrl(
        `/market-leaders?centerId=${centerId}&take=${take}`
      );
      
      // Fetch data with retry logic
      const response = await this.withRetry(
        () => this.fetchWithErrorHandling<{
          success: boolean;
          data: MarketLeaderItem[];
          exchange: string;
          timestamp: string;
        }>(url),
        {
          maxAttempts: 3,
          baseDelay: 1000
        }
      );
      
      // Check if the response was successful
      if (!response.success) {
        throw new Error('Failed to fetch market leaders');
      }
      
      return response.data || [];
      
    } catch (error) {
      console.error('MarketLeaderService Error:', error);
      throw error;
    }
  }

  /**
   * Fetches market leaders for all exchanges
   * @param take - Number of stocks to fetch per exchange
   * @returns Promise with market leader data for all exchanges
   */
  static async getAllMarketLeaders(take: number = 10): Promise<{
    VNINDEX: MarketLeaderItem[];
    HNX: MarketLeaderItem[];
    UPCOM: MarketLeaderItem[];
  }> {
    try {
      // Fetch data for all exchanges in parallel
      const [vnindex, hnx, upcom] = await Promise.all([
        this.getMarketLeaders('VNINDEX', take),
        this.getMarketLeaders('HNX', take),
        this.getMarketLeaders('UPCOM', take)
      ]);
      
      return {
        VNINDEX: vnindex,
        HNX: hnx,
        UPCOM: upcom
      };
      
    } catch (error) {
      console.error('Failed to fetch all market leaders:', error);
      // Return empty arrays on error
      return {
        VNINDEX: [],
        HNX: [],
        UPCOM: []
      };
    }
  }

  /**
   * Server-side method for fetching market leaders (for SSR)
   * @param exchange - The stock exchange
   * @param take - Number of stocks to fetch
   * @returns Promise with market leader data
   */
  static async getMarketLeadersServerSide(
    exchange: MarketExchange = 'VNINDEX',
    take: number = 10
  ): Promise<MarketLeaderItem[]> {
    try {
      const centerId = EXCHANGE_CENTER_MAP[exchange];
      const apiUrl = `https://msh-appdata.cafef.vn/rest-api/api/v1/MarketLeaderGroup?centerId=${centerId}&take=${take}`;
      
      const response = await this.fetchServerSide<MarketLeaderResponse>(apiUrl, {
        revalidate: 60, // Cache for 60 seconds
        headers: {
          'Accept': 'application/json',
        }
      });
      
      return response.data || [];
      
    } catch (error) {
      console.error('Server-side MarketLeaderService Error:', error);
      return [];
    }
  }
}
