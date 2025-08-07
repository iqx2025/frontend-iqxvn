/**
 * Custom hooks for stock market data fetching and state management
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Company,
  MarketStats,
  TopList
} from '@/types';
import { StockService, StockServiceError } from '@/services';
import { useApiState } from './useApiState';

/**
 * Hook for managing stock market data with loading states and error handling
 */
export function useStockData(companiesLimit: number = 100, topListsLimit: number = 10) {
  const [stockDataState, stockDataActions, executeStockDataOperation] = useApiState<{
    companies: Company[];
    marketStats: MarketStats | null;
    topLists: TopList | null;
  }>({
    initialData: {
      companies: [],
      marketStats: null,
      topLists: null,
    },
  });

  /**
   * Fetch all stock data
   */
  const fetchData = useCallback(async () => {
    await executeStockDataOperation(async () => {
      const result = await StockService.fetchAllStockData(companiesLimit, topListsLimit);
      return result;
    });
  }, [companiesLimit, topListsLimit, executeStockDataOperation]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data
    companies: stockDataState.data?.companies || [],
    marketStats: stockDataState.data?.marketStats || null,
    topLists: stockDataState.data?.topLists || null,

    // State
    loading: stockDataState.loading,
    error: stockDataState.error,
    retryCount: stockDataState.retryCount,

    // Actions
    retry: stockDataActions.retry,
    refresh: fetchData,
    clearError: stockDataActions.clearError,
  };
}

/**
 * Hook specifically for market statistics
 */
export function useMarketStats() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await StockService.fetchMarketStats();
      setMarketStats(stats);
    } catch (error) {
      console.error('Error fetching market stats:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Failed to fetch market statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketStats();
  }, [fetchMarketStats]);

  return {
    marketStats,
    loading,
    error,
    refresh: fetchMarketStats,
  };
}

/**
 * Hook for fetching companies list
 */
export function useCompanies(limit: number = 100) {
  const [companiesState, companiesActions, executeCompaniesOperation] = useApiState<Company[]>({
    initialData: [],
  });

  const fetchCompanies = useCallback(async () => {
    await executeCompaniesOperation(async () => {
      return await StockService.fetchCompanies(limit);
    });
  }, [limit, executeCompaniesOperation]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies: companiesState.data || [],
    loading: companiesState.loading,
    error: companiesState.error,
    refresh: fetchCompanies,
    retry: companiesActions.retry,
    clearError: companiesActions.clearError,
  };
}

/**
 * Hook for fetching top lists (gainers, losers, volume, market cap)
 */
export function useTopLists(limit: number = 10) {
  const [topLists, setTopLists] = useState<TopList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const lists = await StockService.fetchTopLists(limit);
      setTopLists(lists);
    } catch (error) {
      console.error('Error fetching top lists:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Failed to fetch top lists';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopLists();
  }, [fetchTopLists]);

  return {
    topLists,
    loading,
    error,
    refresh: fetchTopLists,
  };
}
