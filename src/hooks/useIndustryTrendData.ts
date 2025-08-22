/**
 * useIndustryTrendData Hook
 * Custom hook for fetching and managing industry trend data
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { IndustryTrendService } from '@/services/industryTrendService';
import { 
  IndustryTrendItem, 
  IndustryTrendData,
  IndustryTrendFilters,
  IndustryTrendSort
} from '@/types/industryTrend';

interface UseIndustryTrendDataReturn {
  data: IndustryTrendItem[];
  loading: boolean;
  error: string | null;
  filters: IndustryTrendFilters;
  sort: IndustryTrendSort;
  totalCount: number;
  lastUpdated: Date | null;
  setFilters: (filters: IndustryTrendFilters) => void;
  setSort: (sort: IndustryTrendSort) => void;
  refresh: () => void;
  clearFilters: () => void;
}

/**
 * Custom hook for industry trend data management
 */
export function useIndustryTrendData(
  initialData?: IndustryTrendData
): UseIndustryTrendDataReturn {
  const [rawData, setRawData] = useState<IndustryTrendItem[]>(
    initialData?.items || []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData?.lastUpdated || null
  );
  
  const [filters, setFilters] = useState<IndustryTrendFilters>({});
  const [sort, setSort] = useState<IndustryTrendSort>({
    field: 'volume',
    direction: 'desc'
  });

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await IndustryTrendService.fetchWithRetry();
      setRawData(response.items);
      setLastUpdated(response.lastUpdated);
    } catch (err) {
      console.error('Failed to fetch industry trend data:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Không thể tải dữ liệu xu hướng ngành'
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
    result = IndustryTrendService.filterData(result, filters);
    
    // Apply sorting
    result = IndustryTrendService.sortData(result, sort.field, sort.direction);
    
    return result;
  }, [rawData, filters, sort]);

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
    setFilters,
    setSort,
    refresh,
    clearFilters,
  };
}

/**
 * Hook for getting unique filter options from data
 */
export function useIndustryTrendFilterOptions(data: IndustryTrendItem[]) {
  return useMemo(() => {
    const exchanges = Array.from(new Set(data.map(item => item.exchange))).sort();
    const sectors = Array.from(new Set(data.map(item => item.sector_level_2))).sort();
    const rrgPhases = Array.from(new Set(data.map(item => item.rrg_phase))).filter(Boolean).sort();
    const sectorStages = Array.from(new Set(data.map(item => item.sector_stage))).filter(Boolean).sort();
    
    return {
      exchanges,
      sectors,
      rrgPhases,
      sectorStages,
    };
  }, [data]);
}
