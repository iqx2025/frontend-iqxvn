"use client";

import { useState, useEffect } from 'react';
import type { MarketSentimentPayload } from '@/types/market-sentiment';
import { getMockMarketSentiment } from '@/services/mock/marketSentiment';

/**
 * Hook configuration options
 */
interface UseMarketSentimentOptions {
  /** Use mock data instead of real API */
  useMock?: boolean;
  /** Auto-refresh interval in milliseconds (0 = disabled) */
  refreshInterval?: number;
  /** Initial data */
  initialData?: MarketSentimentPayload | null;
}

/**
 * Hook return type
 */
interface UseMarketSentimentReturn {
  /** Market sentiment data */
  data: MarketSentimentPayload | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Manually refresh data */
  refresh: () => Promise<void>;
  /** Last update timestamp */
  lastUpdate: Date | null;
}

/**
 * Custom hook for fetching market sentiment data
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refresh } = useMarketSentiment({ useMock: true });
 * ```
 */
export function useMarketSentiment({
  useMock = true,
  refreshInterval = 0,
  initialData = null
}: UseMarketSentimentOptions = {}): UseMarketSentimentReturn {
  const [data, setData] = useState<MarketSentimentPayload | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  /**
   * Fetch market sentiment data
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let result: MarketSentimentPayload;

      if (useMock) {
        // Use mock data
        result = await getMockMarketSentiment();
      } else {
        // TODO: Replace with real API call when backend is ready
        // const response = await ApiService.getMarketSentiment();
        // result = response.data;
        
        // For now, fall back to mock
        console.warn('Real API not yet implemented, using mock data');
        result = await getMockMarketSentiment();
      }

      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu tâm lý thị trường';
      setError(errorMessage);
      console.error('Error fetching market sentiment:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manual refresh function
   */
  const refresh = async () => {
    await fetchData();
  };

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Set up auto-refresh if enabled
   */
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval, useMock]);

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdate
  };
}

/**
 * Hook for real-time sentiment value updates
 * Used specifically for the gauge component
 */
export function useRealtimeSentiment(
  initialValue: number,
  updateInterval: number = 5000
): number {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (updateInterval <= 0) return;

    const interval = setInterval(() => {
      // Simulate small real-time changes
      setValue(prev => {
        const change = (Math.random() - 0.5) * 2;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, Math.round(newValue)));
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return value;
}
