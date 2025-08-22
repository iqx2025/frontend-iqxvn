/**
 * Market Behavior Service
 * Service for fetching market behavior data from Google Sheets
 */

import { BaseApiService } from './baseApiService';
import { MarketBehaviorData, MarketBehaviorChartData } from '@/types/market-behavior';

/**
 * Google Sheets API configuration
 */
const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1ekb2bYAQJZbtmqMUzsagb4uWBdtkAzTq3kuIMHQ22RI';
const SHEET_RANGE = process.env.NEXT_PUBLIC_GOOGLE_SHEET_RANGE || 'HanhVi';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || 'AIzaSyB9PPBCGbWFv1TxH_8s_AsiqiChLs9MqXU';

/**
 * Service class for market behavior data operations
 */
export class MarketBehaviorService extends BaseApiService {
  /**
   * Fetches market behavior data from Google Sheets
   * @returns Promise with processed market behavior data
   */
  static async getMarketBehaviorData(): Promise<MarketBehaviorChartData[]> {
    try {
      // Use the range without specifying cell range to get all data
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
      
      // Use regular fetch to avoid BaseApiService error handling for external API
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error('Google Sheets API error:', response.status, response.statusText);
        // Return mock data if API fails
        return this.getMockData();
      }
      
      const data = await response.json() as {
        range: string;
        majorDimension: string;
        values: string[][];
      };
      
      if (!data.values || data.values.length < 2) {
        console.error('No data found in sheet');
        return this.getMockData();
      }
      
      // Skip header row and process data
      const processedData: MarketBehaviorChartData[] = data.values
        .slice(1) // Skip header
        .filter(row => row.length >= 6) // Ensure row has all required columns
        .map(row => {
          // Parse values, handling comma as decimal separator
          const parseValue = (value: string): number => {
            if (!value) return 0;
            // Replace comma with dot for decimal parsing
            const normalized = value.replace(',', '.');
            return parseFloat(normalized) || 0;
          };
          
          return {
            date: row[0],
            strongSell: parseValue(row[1]) * 100, // Convert to percentage
            sell: parseValue(row[2]) * 100,
            buy: parseValue(row[3]) * 100,
            strongBuy: parseValue(row[4]) * 100,
            vnindex: parseValue(row[5])
          };
        })
        .filter(data => data.vnindex > 0) // Filter out invalid data
        .slice(-30); // Get last 30 days
      
      return processedData;
      
    } catch (error) {
      console.error('MarketBehaviorService Error:', error);
      // Return mock data on error
      return this.getMockData();
    }
  }

  /**
   * Server-side method for fetching market behavior data (for SSR)
   * @returns Promise with processed market behavior data
   */
  static async getMarketBehaviorDataServerSide(): Promise<MarketBehaviorChartData[]> {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
      
      const response = await this.fetchServerSide<{
        range: string;
        majorDimension: string;
        values: string[][];
      }>(url, {
        revalidate: 300, // Cache for 5 minutes
      });
      
      if (!response.values || response.values.length < 2) {
        return [];
      }
      
      // Process data same as client-side
      const processedData: MarketBehaviorChartData[] = response.values
        .slice(1)
        .filter(row => row.length >= 6)
        .map(row => {
          const parseValue = (value: string): number => {
            if (!value) return 0;
            const normalized = value.replace(',', '.');
            return parseFloat(normalized) || 0;
          };
          
          return {
            date: row[0],
            strongSell: parseValue(row[1]) * 100,
            sell: parseValue(row[2]) * 100,
            buy: parseValue(row[3]) * 100,
            strongBuy: parseValue(row[4]) * 100,
            vnindex: parseValue(row[5])
          };
        })
        .filter(data => data.vnindex > 0)
        .slice(-30);
      
      return processedData;
      
    } catch (error) {
      console.error('Server-side MarketBehaviorService Error:', error);
      return this.getMockData();
    }
  }

  /**
   * Returns mock data for development/fallback
   */
  private static getMockData(): MarketBehaviorChartData[] {
    const today = new Date();
    const mockData: MarketBehaviorChartData[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
      
      // Generate realistic mock data
      const strongSell = Math.random() * 15 + 5; // 5-20%
      const sell = Math.random() * 30 + 20; // 20-50%
      const buy = Math.random() * 30 + 20; // 20-50%
      const strongBuy = 100 - strongSell - sell - buy; // Remainder to make 100%
      
      mockData.push({
        date: dateStr,
        strongSell: parseFloat(strongSell.toFixed(1)),
        sell: parseFloat(sell.toFixed(1)),
        buy: parseFloat(buy.toFixed(1)),
        strongBuy: Math.max(0, parseFloat(strongBuy.toFixed(1))),
        vnindex: 1250 + Math.random() * 50 - 25 + (i * 0.5) // Slight upward trend
      });
    }
    
    return mockData;
  }
}
