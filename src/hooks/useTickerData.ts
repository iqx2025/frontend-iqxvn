import { useEffect, useCallback } from "react";
import { StockSummary } from "@/types";
import { ApiService, TransformationService } from "@/services";
import { useApiState, useMultiApiState } from './useApiState';

interface UseTickerDataReturn {
  data: StockSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  retry: () => void;
}

/**
 * Custom hook for fetching and managing ticker data
 * @param ticker - Stock ticker symbol
 * @returns Object containing data, loading state, error, and utility functions
 */
export function useTickerData(ticker: string): UseTickerDataReturn {
  const [tickerState, tickerActions, executeTickerOperation] = useApiState<StockSummary>({
    initialData: null,
  });

  const fetchData = useCallback(async () => {
    if (!ticker) {
      throw new Error("Ticker không hợp lệ");
    }

    await executeTickerOperation(async () => {
      const apiData = await ApiService.getCompanyData(ticker);

      // Validate data before transformation
      if (!TransformationService.validateCompanyData(apiData)) {
        throw new Error('Dữ liệu từ API không hợp lệ');
      }

      const transformedData = TransformationService.transformApiDataToStockSummary(apiData);
      return transformedData;
    });
  }, [ticker, executeTickerOperation]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (ticker) {
      fetchData();
    }
  }, [fetchData, ticker]);

  return {
    data: tickerState.data,
    loading: tickerState.loading,
    error: tickerState.error,
    refetch,
    clearError: tickerActions.clearError,
    retry: tickerActions.retry,
  };
}

/**
 * Hook for managing multiple ticker data
 * @param tickers - Array of ticker symbols
 * @returns Object containing data map, loading states, and utility functions
 */
export function useMultipleTickerData(tickers: string[]) {
  const [states, actions, executeOperation] = useMultiApiState<Record<string, StockSummary>>(
    tickers,
    { initialData: null }
  );

  const fetchTickerData = useCallback(async (ticker: string) => {
    await executeOperation(ticker, async () => {
      const apiData = await ApiService.getCompanyData(ticker);
      return TransformationService.transformApiDataToStockSummary(apiData);
    });
  }, [executeOperation]);

  const refetchAll = useCallback(async () => {
    await Promise.all(tickers.map(ticker => fetchTickerData(ticker)));
  }, [tickers, fetchTickerData]);

  useEffect(() => {
    tickers.forEach(ticker => {
      fetchTickerData(ticker);
    });
  }, [tickers, fetchTickerData]);

  // Transform states to match the expected return format
  const dataMap = tickers.reduce((acc, ticker) => {
    if (states[ticker]?.data) {
      acc[ticker] = states[ticker].data;
    }
    return acc;
  }, {} as Record<string, StockSummary>);

  const loadingMap = tickers.reduce((acc, ticker) => {
    acc[ticker] = states[ticker]?.loading || false;
    return acc;
  }, {} as Record<string, boolean>);

  const errorMap = tickers.reduce((acc, ticker) => {
    acc[ticker] = states[ticker]?.error || '';
    return acc;
  }, {} as Record<string, string>);

  return {
    dataMap,
    loadingMap,
    errorMap,
    refetchAll,
    refetchTicker: fetchTickerData,
    actions, // Expose individual actions for each ticker
  };
}
