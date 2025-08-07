/**
 * Custom hooks for search functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { Company } from '@/types/stock';
import { StockService, StockServiceError } from '@/services/stockService';

/**
 * Hook for real-time search with debouncing
 */
export function useSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const searchResults = await StockService.searchCompanies(searchQuery, 10);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        const errorMessage = error instanceof StockServiceError 
          ? error.message 
          : 'Lỗi khi tìm kiếm';
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
  };
}

/**
 * Hook for advanced filtering and search
 */
export function useAdvancedSearch() {
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    sector: '',
    exchange: '',
    sortBy: '',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  
  const [results, setResults] = useState<Company[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perform search with filters
  const search = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await StockService.fetchCompaniesWithFilters({
        ...filters,
        page,
        limit: pagination.limit,
      });

      setResults(response.companies);
      setPagination(prev => ({
        ...prev,
        page: response.page,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      console.error('Advanced search error:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Lỗi khi tìm kiếm nâng cao';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      industry: '',
      sector: '',
      exchange: '',
      sortBy: '',
      sortOrder: 'desc',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setResults([]);
    setError(null);
  }, []);

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    search(page);
  }, [search]);

  return {
    filters,
    updateFilters,
    clearFilters,
    results,
    pagination,
    loading,
    error,
    search,
    goToPage,
  };
}

/**
 * Hook for quick search suggestions
 */
export function useSearchSuggestions(limit: number = 5) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const results = await StockService.searchCompanies(searchQuery, limit);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Debounced suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 200); // Faster debounce for suggestions

    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions]);

  const clearSuggestions = useCallback(() => {
    setQuery('');
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions,
  };
}

/**
 * Hook for search by category (industry, sector, exchange)
 */
export function useCategorySearch() {
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByIndustry = useCallback(async (industrySlug: string, page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const companies = await StockService.fetchCompaniesByIndustry(industrySlug, page, limit);
      setResults(companies);
    } catch (error) {
      console.error('Industry search error:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Lỗi khi tìm kiếm theo ngành';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBySector = useCallback(async (sectorSlug: string, page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const companies = await StockService.fetchCompaniesBySector(sectorSlug, page, limit);
      setResults(companies);
    } catch (error) {
      console.error('Sector search error:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Lỗi khi tìm kiếm theo lĩnh vực';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByExchange = useCallback(async (exchange: string, page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const companies = await StockService.fetchCompaniesByExchange(exchange, page, limit);
      setResults(companies);
    } catch (error) {
      console.error('Exchange search error:', error);
      const errorMessage = error instanceof StockServiceError 
        ? error.message 
        : 'Lỗi khi tìm kiếm theo sàn giao dịch';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchByIndustry,
    searchBySector,
    searchByExchange,
    clearResults,
  };
}
