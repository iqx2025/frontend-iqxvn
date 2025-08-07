/**
 * Custom hooks for stock filtering and pagination
 */

import { useState, useEffect, useMemo } from 'react';
import { Company, StockTabType, SectorInfo } from '@/types/stock';

/**
 * Hook for managing stock filters and search
 */
export function useStockFilters(companies: Company[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExchange, setSelectedExchange] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // Get unique exchanges from companies
  const exchanges = useMemo(() => {
    const uniqueExchanges = [...new Set(companies.map(c => c.stockExchange))];
    return uniqueExchanges.filter(Boolean);
  }, [companies]);

  // Get unique sectors from companies
  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(companies.map(c => ({
      slug: c.bcEconomicSectorSlug,
      name: c.bcEconomicSectorName
    })))];
    return uniqueSectors.filter(s => s.slug && s.name) as SectorInfo[];
  }, [companies]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = companies;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(company =>
        (company.ticker && company.ticker.toLowerCase().includes(searchLower)) ||
        (company.nameVi && company.nameVi.toLowerCase().includes(searchLower)) ||
        (company.nameEn && company.nameEn.toLowerCase().includes(searchLower))
      );
    }

    // Exchange filter
    if (selectedExchange !== 'all') {
      filtered = filtered.filter(company => company.stockExchange === selectedExchange);
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(company => company.bcEconomicSectorSlug === selectedSector);
    }

    setFilteredCompanies(filtered);
  }, [searchTerm, selectedExchange, selectedSector, companies]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedExchange('all');
    setSelectedSector('all');
  };

  return {
    // Filter values
    searchTerm,
    selectedExchange,
    selectedSector,
    
    // Filter setters
    setSearchTerm,
    setSelectedExchange,
    setSelectedSector,
    
    // Filtered data
    filteredCompanies,
    
    // Filter options
    exchanges,
    sectors,
    
    // Actions
    resetFilters,
  };
}

/**
 * Hook for managing pagination
 */
export function usePagination(totalItems: number, itemsPerPage: number = 20) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Reset to first page when total items change
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  // Navigation functions
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return {
    // Current state
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    
    // Computed values
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setCurrentPage,
  };
}

/**
 * Hook for managing stock tabs and display data
 */
export function useStockTabs(
  filteredCompanies: Company[],
  topLists: { gainers: Company[]; losers: Company[]; volume: Company[]; marketCap: Company[] } | null,
  currentPage: number,
  itemsPerPage: number
) {
  const [activeTab, setActiveTab] = useState<StockTabType>('all');

  // Get paginated companies for 'all' tab
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  // Get display data based on active tab
  const displayData = useMemo(() => {
    switch (activeTab) {
      case 'gainers':
        return topLists?.gainers || [];
      case 'losers':
        return topLists?.losers || [];
      case 'volume':
        return topLists?.volume || [];
      default:
        return paginatedCompanies;
    }
  }, [activeTab, topLists, paginatedCompanies]);

  // Reset to 'all' tab when filters change
  const resetToAllTab = () => setActiveTab('all');

  return {
    activeTab,
    setActiveTab,
    displayData,
    resetToAllTab,
  };
}

/**
 * Combined hook that manages all stock filtering, pagination, and tabs
 */
export function useStockManagement(
  companies: Company[],
  topLists: { gainers: Company[]; losers: Company[]; volume: Company[]; marketCap: Company[] } | null,
  itemsPerPage: number = 20
) {
  const filters = useStockFilters(companies);
  const pagination = usePagination(filters.filteredCompanies.length, itemsPerPage);
  const tabs = useStockTabs(filters.filteredCompanies, topLists, pagination.currentPage, itemsPerPage);

  return {
    // Filters
    ...filters,
    
    // Pagination
    ...pagination,
    
    // Tabs
    ...tabs,
  };
}
