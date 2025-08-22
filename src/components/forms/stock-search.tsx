'use client';

/**
 * Advanced Stock Search Component
 * Provides real-time search with suggestions and filtering
 */

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchSuggestions } from '@/hooks';
import { Company } from '@/types';
import {
  formatPrice,
  formatPercentage,
  getPriceChangeBadgeVariant,
} from '@/utils';

interface StockSearchProps {
  onCompanySelect?: (company: Company) => void;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function StockSearch({ 
  onCompanySelect, 
  onSearchChange,
  placeholder = "Tìm kiếm mã chứng khoán, tên công ty...",
  className = ""
}: StockSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions,
  } = useSearchSuggestions(8);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);
    onSearchChange?.(value);
  };

  // Handle company selection
  const handleCompanySelect = (company: Company) => {
    setQuery(company.ticker);
    setIsOpen(false);
    setSelectedIndex(-1);
    onCompanySelect?.(company);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleCompanySelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    clearSuggestions();
    onSearchChange?.('');
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when there are results
  useEffect(() => {
    if (suggestions.length > 0 && query.trim()) {
      setIsOpen(true);
    } else if (!query.trim()) {
      setIsOpen(false);
    }
  }, [suggestions, query]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && query.trim()) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto border">
          <CardContent className="p-0 !shadow-none">
            {loading && (
              <div className="p-4 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Đang tìm kiếm...
                </div>
              </div>
            )}

            {!loading && suggestions.length === 0 && query.trim() && (
              <div className="p-4 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                  <p>Không tìm thấy kết quả cho &quot;{query}&quot;</p>
                  <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
                </div>
              </div>
            )}

            {!loading && suggestions.length > 0 && (
              <div className="py-2">
                {suggestions.map((company, index) => (
                  <div
                    key={company.id}
                    className={`px-4 py-3 cursor-pointer border-b border-border/50 last:border-b-0 ${
                      index === selectedIndex 
                        ? 'bg-muted' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Company Logo */}
                        {company.imageUrl && (
                          <div className="flex-shrink-0">
                            <Image
                              src={company.imageUrl}
                              alt={company.ticker}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover border border-border/20"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {company.ticker}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {company.stockExchange}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {company.nameVi}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {company.bcEconomicSectorName}
                          </p>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="font-mono font-semibold">
                          {formatPrice(company.priceClose)}
                        </div>
                        <Badge
                          variant={getPriceChangeBadgeVariant(company.pctChange)}
                          className="text-xs"
                        >
                          <span className="flex items-center gap-1">
                            {company.pctChange > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : company.pctChange < 0 ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : null}
                            {company.pctChange > 0 ? '+' : ''}{formatPercentage(company.pctChange)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Simple search input component for basic search functionality
 */
interface SimpleStockSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleStockSearch({ 
  value, 
  onChange, 
  placeholder = "Tìm kiếm...",
  className = ""
}: SimpleStockSearchProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
