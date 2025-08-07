/**
 * Financial Data Hook
 * Custom React hook for fetching and managing financial data state
 */

import { useState, useEffect, useCallback } from 'react';
import { FinancialReportData, UseFinancialDataReturn, FinancialPeriodType, ProcessedFinancialSection, FinancialStatementSection } from '@/types/financial';
import { FinancialService } from '@/services/financialService';

/**
 * Custom hook for fetching financial data
 */
export const useFinancialData = (ticker: string): UseFinancialDataReturn => {
  const [data, setData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Fetches financial data for the given ticker
   */
  const fetchData = useCallback(async () => {
    if (!ticker) {
      setError('Ticker is required');
      setLoading(false);
      return;
    }

    // Validate ticker format
    if (!FinancialService.validateTicker(ticker)) {
      setError('Invalid ticker format. Please use 3-4 uppercase letters (e.g., VCB, FPT)');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching financial data for ${ticker}...`);
      
      const financialData = await FinancialService.getAllFinancialData(ticker);
      
      setData(financialData);
      setLastUpdated(new Date());
      
      console.log(`Successfully fetched financial data for ${ticker}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu tài chính';
      setError(errorMessage);
      setData(null);
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  /**
   * Refetch function for manual data refresh
   */
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  /**
   * Effect to fetch data when ticker changes
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Effect to cleanup when component unmounts
   */
  useEffect(() => {
    return () => {
      // Cleanup function
      setData(null);
      setError(null);
      setLoading(false);
      setLastUpdated(null);
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated
  };
};

/**
 * Hook for fetching available years for a ticker
 */
export const useAvailableYears = (ticker: string) => {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = useCallback(async () => {
    if (!ticker || !FinancialService.validateTicker(ticker)) {
      setYears([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const availableYears = await FinancialService.getAvailableYears(ticker);
      setYears(availableYears);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách năm';
      setError(errorMessage);
      setYears([]);
      console.error('Error fetching available years:', err);
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return {
    years,
    loading,
    error,
    refetch: fetchYears
  };
};

/**
 * Hook for getting last update date
 */
export const useLastUpdateDate = (ticker: string) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastUpdate = useCallback(async () => {
    if (!ticker || !FinancialService.validateTicker(ticker)) {
      setLastUpdate(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updateDate = await FinancialService.getLastUpdateDate(ticker);
      setLastUpdate(updateDate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải ngày cập nhật';
      setError(errorMessage);
      setLastUpdate(null);
      console.error('Error fetching last update date:', err);
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    fetchLastUpdate();
  }, [fetchLastUpdate]);

  return {
    lastUpdate,
    loading,
    error,
    refetch: fetchLastUpdate
  };
};

/**
 * Hook with caching support
 */
export const useFinancialDataWithCache = (ticker: string, cacheTimeMs: number = 5 * 60 * 1000) => {
  const [cache, setCache] = useState<Map<string, { data: FinancialReportData; timestamp: number }>>(new Map());
  
  const baseHook = useFinancialData(ticker);

  // Check cache first
  useEffect(() => {
    const cacheKey = ticker.toUpperCase();
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTimeMs) {
      // Use cached data
      console.log(`Using cached financial data for ${ticker}`);
      // Note: This would require modifying the base hook to accept initial data
      // For now, we'll just use the base hook as-is
    }
  }, [ticker, cache, cacheTimeMs]);

  // Update cache when new data is fetched
  useEffect(() => {
    if (baseHook.data && !baseHook.loading && !baseHook.error) {
      const cacheKey = ticker.toUpperCase();
      setCache(prev => new Map(prev).set(cacheKey, {
        data: baseHook.data!,
        timestamp: Date.now()
      }));
    }
  }, [baseHook.data, baseHook.loading, baseHook.error, ticker]);

  return baseHook;
};

/**
 * Hook for fetching financial section data with period type support
 */
export const useFinancialSectionData = (
  ticker: string,
  section: FinancialStatementSection,
  periodType: FinancialPeriodType = 'annual'
) => {
  const [data, setData] = useState<ProcessedFinancialSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ticker || !FinancialService.validateTicker(ticker)) {
      setError('Invalid ticker format');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const sectionData = await FinancialService.getFinancialSectionData(ticker, section, periodType);
      setData(sectionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu tài chính';
      setError(errorMessage);
      setData(null);
      console.error('Error fetching financial section data:', err);
    } finally {
      setLoading(false);
    }
  }, [ticker, section, periodType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export default useFinancialData;
