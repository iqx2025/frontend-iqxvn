"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Calendar,
  CalendarDays,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessedFinancialItem, FinancialPeriodType, FinancialTableProps } from '@/types/financial';
import {
  formatFinancialAmount,
  formatYoYChange,
  getFinancialChangeColor,
  getFinancialChangeBadgeVariant
} from '@/utils/formatters';

interface ExpandedRows {
  [key: string]: boolean;
}

const FinancialTable: React.FC<FinancialTableProps> = ({
  section,
  title,
  className,
  periodType = 'annual',
  onPeriodTypeChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
  const [showOnlyWithData, setShowOnlyWithData] = useState(true);
  const [localPeriodType, setLocalPeriodType] = useState<FinancialPeriodType>(periodType);

  // Handle period type change
  const handlePeriodTypeChange = (newType: FinancialPeriodType) => {
    setLocalPeriodType(newType);
    if (onPeriodTypeChange) {
      onPeriodTypeChange(newType);
    }
  };

  // Filter and organize items based on search, data availability, and hierarchy
  const { filteredItems, hierarchicalItems } = useMemo(() => {
    const filtered = section.items.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.titleVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      const hasData = showOnlyWithData ?
        Object.values(item.values).some(value => value !== null && value !== 0) : true;

      return matchesSearch && hasData;
    });

    // Create hierarchical structure recursively
    const buildHierarchy = (items: ProcessedFinancialItem[], parentName: string | null = null): (ProcessedFinancialItem & { children?: ProcessedFinancialItem[] })[] => {
      return items
        .filter(item => item.parent === parentName)
        .map(item => {
          const children = buildHierarchy(items, item.name);
          return {
            ...item,
            hasChildren: children.length > 0,
            children
          };
        });
    };

    const hierarchical = buildHierarchy(filtered);

    return { filteredItems: filtered, hierarchicalItems: hierarchical };
  }, [section.items, searchTerm, showOnlyWithData]);

  // Group items by level for hierarchical display (currently unused but kept for future enhancement)
  // const groupedItems = filteredItems.reduce((acc, item) => {
  //   if (!acc[item.level]) {
  //     acc[item.level] = [];
  //   }
  //   acc[item.level].push(item);
  //   return acc;
  // }, {} as { [level: number]: ProcessedFinancialItem[] });

  const toggleRowExpansion = (itemName: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const renderTableRow = (
    item: ProcessedFinancialItem & { children?: ProcessedFinancialItem[] },
    index: number,
    depth = 0
  ): React.ReactNode[] => {
    const isExpanded = expandedRows[item.name];
    const hasChildren = item.hasChildren || (item.children && item.children.length > 0);
    const change = formatYoYChange(item.latestValue, item.previousValue);

    const rows: React.ReactNode[] = [];

    // Main row
    rows.push(
      <TableRow
        key={`${item.name}-${index}-${depth}`}
        className={cn(
          "hover:bg-muted/50",
          depth > 0 && "bg-muted/20"
        )}
      >
        {/* Item Name with Hierarchy */}
        <TableCell className="font-medium">
          <div
            className={cn(
              "flex items-center gap-2",
              depth > 0 && `ml-${depth * 6}`
            )}
            style={{ marginLeft: depth > 0 ? `${depth * 24}px` : '0' }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => toggleRowExpansion(item.name)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className={cn(
                "text-sm truncate",
                depth > 0 ? "font-normal text-muted-foreground" : "font-medium"
              )}>
                {item.titleVi}
              </div>
              <div className="text-xs text-muted-foreground truncate">{item.titleEn}</div>
              {item.field && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  {item.field}
                </div>
              )}
            </div>
          </div>
        </TableCell>

        {/* Period Values */}
        {section.periods.map(period => {
          const value = item.values[period];
          const isNegative = value !== null && value < 0;

          return (
            <TableCell key={period} className="text-right">
              <div className={cn(
                "font-mono text-sm",
                isNegative && "text-red-600 dark:text-red-400"
              )}>
                {value !== null ?
                  formatFinancialAmount(value) :
                  <span className="text-muted-foreground">-</span>
                }
              </div>
              {value !== null && Math.abs(value) > 0 && (
                <div className="text-xs text-muted-foreground">
                  {formatFinancialAmount(value, { compact: false, showUnit: false })} VND
                </div>
              )}
            </TableCell>
          );
        })}

        {/* Change */}
        <TableCell className="text-right">
          {change.absolute !== 'N/A' && item.latestValue !== null && item.previousValue !== null ? (
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-1">
                {change.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : change.isNegative ? (
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                ) : null}
                <Badge
                  variant={getFinancialChangeBadgeVariant(item.change)}
                  className="text-xs"
                >
                  {change.percentage}
                </Badge>
              </div>
              <div className={cn(
                "text-xs font-mono",
                getFinancialChangeColor(item.change)
              )}>
                {change.absolute}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.previousValue !== null && (
                  `Từ ${formatFinancialAmount(item.previousValue)}`
                )}
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">N/A</span>
          )}
        </TableCell>
      </TableRow>
    );

    // Child rows (if expanded)
    if (isExpanded && item.children && item.children.length > 0) {
      item.children.forEach((child, childIndex) => {
        rows.push(...renderTableRow(child, childIndex, depth + 1));
      });
    }

    return rows;
  };

  if (!section.items || section.items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Không có dữ liệu cho phần này</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-48"
                />
              </div>
              <Button
                variant={showOnlyWithData ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyWithData(!showOnlyWithData)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Có dữ liệu
              </Button>
            </div>
          </div>

          {/* Period Type Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Chế độ xem:</span>
            <ToggleGroup
              type="single"
              value={localPeriodType}
              onValueChange={(value) => value && handlePeriodTypeChange(value as FinancialPeriodType)}
              className="bg-muted p-1 rounded-lg"
            >
              <ToggleGroupItem value="annual" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Theo năm
              </ToggleGroupItem>
              <ToggleGroupItem value="quarterly" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Theo quý
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Period Info */}
            <div className="text-sm text-muted-foreground">
              {section.periodType === 'annual' ? (
                `${section.periods.length} năm gần nhất`
              ) : (
                `${section.periods.length} quý gần nhất`
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-2">
                    <span>Chỉ tiêu</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                {section.periods.map(period => (
                  <TableHead key={period} className="text-right w-[120px]">
                    <div className="space-y-1">
                      <div className="font-medium">{period}</div>
                      <div className="text-xs text-muted-foreground">
                        {section.periodType === 'annual' ? 'Năm' : 'Quý'}
                      </div>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-right w-[140px]">
                  <div className="space-y-1">
                    <div className="font-medium">Thay đổi</div>
                    <div className="text-xs text-muted-foreground">
                      {section.periodType === 'annual' ? 'YoY' : 'QoQ'}
                    </div>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hierarchicalItems.length > 0 ? (
                hierarchicalItems.map((item, index) => renderTableRow(item, index, 0)).flat()
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={section.periods.length + 2}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        {filteredItems.length > 0 && (
          <div className="mt-4 space-y-4">
            {/* Data Summary */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tổng chỉ tiêu:</span>
                  <span className="ml-2 font-medium">{filteredItems.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Có dữ liệu:</span>
                  <span className="ml-2 font-medium">
                    {filteredItems.filter(item =>
                      Object.values(item.values).some(v => v !== null && v !== 0)
                    ).length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tăng trưởng:</span>
                  <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                    {filteredItems.filter(item => item.change && item.change > 0).length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Giảm:</span>
                  <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                    {filteredItems.filter(item => item.change && item.change < 0).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Period Information */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Kỳ báo cáo:</span>
                  <div className="mt-1">
                    {section.periodType === 'annual' ? (
                      <span className="text-blue-900 dark:text-blue-100">
                        {section.periods.length} năm ({section.periods[0]} - {section.periods[section.periods.length - 1]})
                      </span>
                    ) : (
                      <span className="text-blue-900 dark:text-blue-100">
                        {section.periods.length} quý ({section.periods[0]} - {section.periods[section.periods.length - 1]})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Năm có sẵn:</span>
                  <div className="mt-1 text-blue-900 dark:text-blue-100">
                    {section.availableYears.slice(0, 5).join(', ')}
                    {section.availableYears.length > 5 && '...'}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Loại dữ liệu:</span>
                  <div className="mt-1 text-blue-900 dark:text-blue-100">
                    {section.periodType === 'annual' ? 'Báo cáo năm' : 'Báo cáo quý'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTable;
