'use client';

/**
 * Valuation Table Component
 * Displays attractive valuation data in a sortable, filterable table
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  Info
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useValuationData, useValuationFilterOptions } from '@/hooks/useValuationData';
import { ValuationService } from '@/services/valuationService';
import { 
  ValuationData, 
  ValuationItem,
  ValuationSort 
} from '@/types/valuationFilter';
import { formatNumber, formatPercentage, formatPrice } from '@/utils';
import { cn } from '@/lib/utils';

interface ValuationTableProps {
  initialData?: ValuationData;
}

/**
 * Table column configuration
 */
const columns = [
  { key: 'symbol' as keyof ValuationItem, label: 'Mã CK', sortable: true, width: 'w-20' },
  { key: 'exchange' as keyof ValuationItem, label: 'Sàn', sortable: true, width: 'w-16' },
  { key: 'sector_level_2' as keyof ValuationItem, label: 'Ngành', sortable: true, width: 'w-40' },
  { key: 'close_price' as keyof ValuationItem, label: 'Giá', sortable: true, align: 'right' as const, width: 'w-24' },
  { key: 'volume' as keyof ValuationItem, label: 'KL', sortable: true, align: 'right' as const, width: 'w-24' },
  { key: 'pe_ratio' as keyof ValuationItem, label: 'P/E', sortable: true, align: 'right' as const, width: 'w-20', info: 'Tỷ lệ giá/lợi nhuận' },
  { key: 'sector_pe' as keyof ValuationItem, label: 'P/E ngành', sortable: true, align: 'right' as const, width: 'w-24' },
  { key: 'pb_ratio' as keyof ValuationItem, label: 'P/B', sortable: true, align: 'right' as const, width: 'w-20', info: 'Tỷ lệ giá/giá trị sổ sách' },
  { key: 'sector_pb' as keyof ValuationItem, label: 'P/B ngành', sortable: true, align: 'right' as const, width: 'w-24' },
  { key: 'roa_pct' as keyof ValuationItem, label: 'ROA %', sortable: true, align: 'right' as const, width: 'w-20', info: 'Tỷ suất sinh lời trên tài sản' },
  { key: 'cfo' as keyof ValuationItem, label: 'CFO', sortable: true, align: 'right' as const, width: 'w-24', info: 'Dòng tiền từ hoạt động kinh doanh' },
  { key: 'gross_margin_pct' as keyof ValuationItem, label: 'Biên LN gộp %', sortable: true, align: 'right' as const, width: 'w-28' },
  { key: 'asset_turnover_pct' as keyof ValuationItem, label: 'Vòng quay TS %', sortable: true, align: 'right' as const, width: 'w-28' },
];

export function ValuationTable({ initialData }: ValuationTableProps) {
  const {
    data,
    loading,
    error,
    filters,
    sort,
    totalCount,
    lastUpdated,
    statistics,
    setFilters,
    setSort,
    refresh,
    clearFilters,
  } = useValuationData(initialData);

  const filterOptions = useValuationFilterOptions(data);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };


  // Handle sort
  const handleSort = (field: keyof ValuationItem) => {
    const newDirection = 
      sort.field === field && sort.direction === 'desc' 
        ? 'asc' 
        : 'desc';
    
    setSort({ field, direction: newDirection });
  };

  // Get sort icon
  const getSortIcon = (field: keyof ValuationItem) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sort.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  // Format cell value with comparison indicators
  const formatCellValue = (key: keyof ValuationItem, value: unknown, item: ValuationItem) => {
    const comparison = ValuationService.calculateValuationComparison(item);
    
    switch (key) {
      case 'symbol':
        return (
          <Link 
            href={`/ma-chung-khoan/${String(value).toLowerCase()}`}
            className="font-semibold text-primary hover:underline"
          >
            {String(value)}
          </Link>
        );
      
      case 'exchange':
        return <Badge variant="outline">{String(value)}</Badge>;
      
      case 'close_price':
        return formatPrice(Number(value));
      
      case 'volume':
        return formatNumber(Number(value));
      
      case 'pe_ratio':
        return (
          <div className="flex items-center gap-1">
            <span className={cn(
              comparison.isUndervaluedPE && 'text-green-500 font-medium'
            )}>
              {Number(value).toFixed(2)}
            </span>
            {comparison.isUndervaluedPE && (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
          </div>
        );
      
      case 'pb_ratio':
        return (
          <div className="flex items-center gap-1">
            <span className={cn(
              comparison.isUndervaluedPB && 'text-green-500 font-medium'
            )}>
              {Number(value).toFixed(2)}
            </span>
            {comparison.isUndervaluedPB && (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
          </div>
        );
      
      case 'sector_pe':
      case 'sector_pb':
        return Number(value).toFixed(2);
      
      case 'roa_pct':
      case 'gross_margin_pct':
      case 'asset_turnover_pct': {
        const numValue = Number(value);
        return (
          <span className={cn(
            'font-medium',
            numValue > 0 ? 'text-green-500' : numValue < 0 ? 'text-red-500' : ''
          )}>
            {formatPercentage(numValue * 100)}
          </span>
        );
      }
      
      case 'cfo': {
        const numValue = Number(value);
        const billion = numValue / 1000000000;
        const million = numValue / 1000000;
        if (Math.abs(billion) >= 1) {
          return (
            <span className={cn(
              'font-medium',
              numValue > 0 ? 'text-green-500' : numValue < 0 ? 'text-red-500' : ''
            )}>
              {billion.toFixed(1)}B
            </span>
          );
        }
        return (
          <span className={cn(
            'font-medium',
            numValue > 0 ? 'text-green-500' : numValue < 0 ? 'text-red-500' : ''
          )}>
            {million.toFixed(0)}M
          </span>
        );
      }
      
      case 'delta_roa_pct':
      case 'cfo_ln_profit':
        return Number(value).toFixed(2);
      
      default:
        return String(value || '-');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Bộ lọc định giá hấp dẫn</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    Cập nhật: {new Date(lastUpdated).toLocaleString('vi-VN')}
                  </p>
                )}
                {statistics && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Tổng: {statistics.totalStocks}</span>
                    <span>•</span>
                    <span className="text-green-500">
                      Hấp dẫn: {statistics.undervaluedCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã CK hoặc ngành..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>

              {/* Exchange Filter */}
              <Select
                value={filters.exchange || 'all'}
                onValueChange={(value) => 
                  setFilters({ ...filters, exchange: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Tất cả sàn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sàn</SelectItem>
                  {filterOptions.exchanges.map(exchange => (
                    <SelectItem key={exchange} value={exchange}>
                      {exchange}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(searchTerm || filters.exchange) && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    clearFilters();
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Xóa lọc
                </Button>
              )}

              {/* Refresh Button */}
              <Button 
                onClick={refresh} 
                variant="outline"
                size="icon"
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        column.align === 'right' && 'text-right',
                        column.width,
                        column.sortable && 'cursor-pointer hover:bg-muted/50'
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className={cn(
                        "flex items-center gap-1",
                        column.align === 'right' && 'justify-end'
                      )}>
                        <span>{column.label}</span>
                        {column.info && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{column.info}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      Không có dữ liệu phù hợp với bộ lọc
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.symbol} className="hover:bg-muted/50">
                      {columns.map((column) => (
                        <TableCell 
                          key={column.key}
                          className={cn(
                            column.align === 'right' && 'text-right',
                            column.width
                          )}
                        >
                          {formatCellValue(column.key, item[column.key], item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Statistics */}
          {statistics && data.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">P/E trung bình</p>
                <p className="text-lg font-semibold">{statistics.avgPE.toFixed(2)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">P/B trung bình</p>
                <p className="text-lg font-semibold">{statistics.avgPB.toFixed(2)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">ROA trung bình</p>
                <p className="text-lg font-semibold">{formatPercentage(statistics.avgROA * 100)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Tỷ lệ hấp dẫn</p>
                <p className="text-lg font-semibold text-green-500">
                  {formatPercentage((statistics.undervaluedCount / statistics.totalStocks) * 100)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
