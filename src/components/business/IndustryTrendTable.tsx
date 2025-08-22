'use client';

/**
 * Industry Trend Table Component
 * Displays industry trend data in a sortable, filterable table
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Search
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
import { useIndustryTrendData } from '@/hooks/useIndustryTrendData';
import { 
  IndustryTrendData, 
  IndustryTrendItem,
  IndustryTrendSort 
} from '@/types/industryTrend';
import { formatNumber, formatPercentage, formatPrice } from '@/utils';
import { cn } from '@/lib/utils';

interface IndustryTrendTableProps {
  initialData?: IndustryTrendData;
}

/**
 * Table column configuration
 */
const columns = [
  { key: 'symbol' as keyof IndustryTrendItem, label: 'Mã CK', sortable: true },
  { key: 'exchange' as keyof IndustryTrendItem, label: 'Sàn', sortable: true },
  { key: 'sector_level_2' as keyof IndustryTrendItem, label: 'Ngành', sortable: true },
  { key: 'close_price' as keyof IndustryTrendItem, label: 'Giá đóng cửa', sortable: true, align: 'right' as const },
  { key: 'return_1d_pct' as keyof IndustryTrendItem, label: '% 1D', sortable: true, align: 'right' as const },
  { key: 'return_1w_pct' as keyof IndustryTrendItem, label: '% 1W', sortable: true, align: 'right' as const },
  { key: 'return_1m_pct' as keyof IndustryTrendItem, label: '% 1M', sortable: true, align: 'right' as const },
  { key: 'volume' as keyof IndustryTrendItem, label: 'Khối lượng', sortable: true, align: 'right' as const },
  { key: 'avg_volume_1w' as keyof IndustryTrendItem, label: 'KL TB 1W', sortable: true, align: 'right' as const },
  { key: 'avg_volume_1m' as keyof IndustryTrendItem, label: 'KL TB 1M', sortable: true, align: 'right' as const },
  { key: 'rrg_phase' as keyof IndustryTrendItem, label: 'Pha RRG', sortable: true },
  { key: 'beta_90d' as keyof IndustryTrendItem, label: 'Beta 90D', sortable: true, align: 'right' as const },
  { key: 'beta_180d' as keyof IndustryTrendItem, label: 'Beta 180D', sortable: true, align: 'right' as const },
  { key: 'sector_stage' as keyof IndustryTrendItem, label: 'Giai đoạn ngành', sortable: true },
];

export function IndustryTrendTable({ initialData }: IndustryTrendTableProps) {
  const {
    data,
    loading,
    error,
    filters,
    sort,
    totalCount,
    lastUpdated,
    setFilters,
    setSort,
    refresh,
  } = useIndustryTrendData(initialData);

  const [searchTerm, setSearchTerm] = useState('');

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  // Handle sort
  const handleSort = (field: keyof IndustryTrendItem) => {
    const newDirection = 
      sort.field === field && sort.direction === 'desc' 
        ? 'asc' 
        : 'desc';
    
    setSort({ field, direction: newDirection });
  };

  // Get sort icon
  const getSortIcon = (field: keyof IndustryTrendItem) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sort.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  // Get badge variant for RRG phase and sector stage
  const getPhaseBadgeVariant = (phase: string) => {
    switch (phase) {
      case 'Tăng giá':
        return 'success';
      case 'Tích lũy':
        return 'warning';
      case 'Giảm giá':
        return 'destructive';
      case 'Phân phối':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Format cell value
  const formatCellValue = (key: keyof IndustryTrendItem, value: any, item?: IndustryTrendItem) => {
    switch (key) {
      case 'symbol':
        // Make symbol clickable with link to stock detail page
        return (
          <Link 
            href={`/ma-chung-khoan/${value.toLowerCase()}`}
            className="font-semibold text-primary hover:underline"
          >
            {value}
          </Link>
        );
      case 'close_price':
        return formatPrice(value);
      case 'return_1d_pct':
      case 'return_1w_pct':
      case 'return_1m_pct':
        return (
          <span className={cn(
            'font-medium',
            value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : ''
          )}>
            {value > 0 ? '+' : ''}{formatPercentage(value * 100)}
          </span>
        );
      case 'volume':
      case 'avg_volume_1w':
      case 'avg_volume_1m':
        return formatNumber(value);
      case 'beta_90d':
      case 'beta_180d':
        return value?.toFixed(2) || '0.00';
      case 'exchange':
        return <Badge variant="outline">{value}</Badge>;
      case 'rrg_phase':
      case 'sector_stage':
        return value ? (
          <Badge variant={getPhaseBadgeVariant(value) as any}>
            {value}
          </Badge>
        ) : '-';
      default:
        return value || '-';
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
              <CardTitle>Bộ lọc xu hướng ngành</CardTitle>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground mt-1">
                  Cập nhật: {new Date(lastUpdated).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã CK hoặc ngành..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Button variant="outline" onClick={refresh} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(
                        col.align === 'right' && 'text-right',
                        col.sortable && 'cursor-pointer select-none hover:bg-muted/50'
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className={cn(
                        'flex items-center gap-1',
                        col.align === 'right' && 'justify-end'
                      )}>
                        {col.label}
                        {col.sortable && getSortIcon(col.key)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {filters.search
                          ? 'Không tìm thấy kết quả phù hợp'
                          : 'Không có dữ liệu'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  data.map((item, index) => (
                    <TableRow key={`${item.symbol}-${index}`} className="hover:bg-muted/50">
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            col.align === 'right' && 'text-right font-mono',
                            col.key === 'symbol' && 'font-sans' // Remove mono font for symbol column
                          )}
                        >
                          {formatCellValue(col.key, item[col.key], item)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          {!loading && data.length > 0 && (
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              Hiển thị {data.length} / {totalCount} kết quả
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
