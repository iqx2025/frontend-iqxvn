/**
 * useValuationData Hook
 * Custom hook for fetching and managing valuation filter data
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ValuationService } from '@/services/valuationService';
import { 
  ValuationItem, 
  ValuationData,
  ValuationFilters,
  ValuationSort
} from '@/types/valuationFilter';

interface UseValuationDataReturn {
  data: ValuationItem[];
  loading: boolean;
  error: string | null;
  filters: ValuationFilters;
  sort: ValuationSort;
  totalCount: number;
  lastUpdated: Date | null;
  statistics: ReturnType<typeof ValuationService.calculateStatistics> | null;
  setFilters: (filters: ValuationFilters) => void;
  setSort: (sort: ValuationSort) => void;
  refresh: () => void;
  clearFilters: () => void;
}

/**
 * Custom hook for valuation data management
 */
export function useValuationData(
  initialData?: ValuationData
): UseValuationDataReturn {
  const [rawData, setRawData] = useState<ValuationItem[]>(
    initialData?.items || []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData?.lastUpdated || null
  );
  
  const [filters, setFilters] = useState<ValuationFilters>({});
  const [sort, setSort] = useState<ValuationSort>({
    field: 'pe_ratio',
    direction: 'asc'
  });

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ValuationService.fetchWithRetry();
      setRawData(response.items);
      setLastUpdated(response.lastUpdated);
    } catch (err) {
      console.error('Failed to fetch valuation data:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Không thể tải dữ liệu định giá'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch if no initial data provided
  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [initialData, fetchData]);

  // Apply filters and sorting to data
  const processedData = useMemo(() => {
    let result = [...rawData];
    
    // Apply filters
    result = ValuationService.filterData(result, filters);
    
    // Apply sorting
    result = ValuationService.sortData(result, sort.field, sort.direction);
    
    return result;
  }, [rawData, filters, sort]);

  // Calculate statistics for current filtered data
  const statistics = useMemo(() => {
    if (processedData.length === 0) return null;
    return ValuationService.calculateStatistics(processedData);
  }, [processedData]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: processedData,
    loading,
    error,
    filters,
    sort,
    totalCount: processedData.length,
    lastUpdated,
    statistics,
    setFilters,
    setSort,
    refresh,
    clearFilters,
  };
}

/**
 * Hook for getting unique filter options from data
 */
export function useValuationFilterOptions(data: ValuationItem[]) {
  return useMemo(() => {
    const exchanges = Array.from(new Set(data.map(item => item.exchange))).sort();
    const sectors = ValuationService.getUniqueSectors(data);
    
    // Calculate min/max values for numeric filters
    const peValues = data.map(item => item.pe_ratio).filter(v => v > 0);
    const pbValues = data.map(item => item.pb_ratio).filter(v => v > 0);
    const roaValues = data.map(item => item.roa_pct).filter(v => v > 0);
    
    return {
      exchanges,
      sectors,
      ranges: {
        pe: {
          min: Math.min(...peValues),
          max: Math.max(...peValues),
        },
        pb: {
          min: Math.min(...pbValues),
          max: Math.max(...pbValues),
        },
        roa: {
          min: Math.min(...roaValues),
          max: Math.max(...roaValues),
        },
      },
    };
  }, [data]);
}

/**
 * Hook for valuation comparison calculations
 */
export function useValuationComparison(item: ValuationItem) {
  return useMemo(() => {
    return ValuationService.calculateValuationComparison(item);
  }, [item]);
}
