"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ShareholderDetail } from '@/types/shareholders';
import { 
  formatNumber, 
  formatCurrency, 
  formatPercentage,
  getChangeColor,
  formatCountryName 
} from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ShareholdersTableProps {
  data: ShareholderDetail[];
  className?: string;
}

const getChangeIcon = (changeValue: number) => {
  if (changeValue > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (changeValue < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-gray-500" />;
};

export default function ShareholdersTable({ data, className }: ShareholdersTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'percentage' | 'shares' | 'value' | 'change'>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Danh sách cổ đông
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Không có dữ liệu cổ đông
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'percentage':
        aValue = a.pctOfSharesOutHeld;
        bValue = b.pctOfSharesOutHeld;
        break;
      case 'shares':
        aValue = a.sharesHeld;
        bValue = b.sharesHeld;
        break;
      case 'value':
        aValue = a.currentValue;
        bValue = b.currentValue;
        break;
      case 'change':
        aValue = Math.abs(a.changeValue);
        bValue = Math.abs(b.changeValue);
        break;
      default:
        aValue = a.pctOfSharesOutHeld;
        bValue = b.pctOfSharesOutHeld;
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const displayData = showAll ? sortedData : sortedData.slice(0, 20);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ 
    children, 
    sortKey, 
    className: buttonClassName 
  }: { 
    children: React.ReactNode; 
    sortKey: typeof sortBy;
    className?: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(sortKey)}
      className={cn("h-auto p-1 font-medium", buttonClassName)}
    >
      {children}
      {sortBy === sortKey && (
        sortOrder === 'desc' ? 
          <ChevronDown className="ml-1 h-3 w-3" /> : 
          <ChevronUp className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Danh sách cổ đông ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead className="min-w-[250px]">Tên cổ đông</TableHead>
                <TableHead className="text-center">
                  <SortButton sortKey="percentage">Tỷ lệ (%)</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton sortKey="shares">Số cổ phiếu</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton sortKey="value">Giá trị (VND)</SortButton>
                </TableHead>
                <TableHead className="text-center">
                  <SortButton sortKey="change">Thay đổi</SortButton>
                </TableHead>
                <TableHead className="text-center">Quốc gia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((shareholder, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {shareholder.investorFullName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-medium">
                      {formatPercentage(shareholder.pctOfSharesOutHeld)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {formatNumber(shareholder.sharesHeld)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {formatCurrency(shareholder.currentValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    {shareholder.changeValue !== 0 ? (
                      <div className={cn(
                        "flex items-center justify-center gap-1",
                        getChangeColor(shareholder.changeValue)
                      )}>
                        {getChangeIcon(shareholder.changeValue)}
                        <span className="text-xs font-medium">
                          {formatNumber(Math.abs(shareholder.changeValue))}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Minus className="h-3 w-3 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {formatCountryName(shareholder.countryOfInvestor)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length > 20 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ẩn bớt
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Xem tất cả ({data.length})
                </>
              )}
            </Button>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Tổng cổ đông</div>
              <div className="font-medium text-lg">{data.length}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Tổng tỷ lệ</div>
              <div className="font-medium text-lg">
                {formatPercentage(data.reduce((sum, s) => sum + s.pctOfSharesOutHeld, 0))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Tăng</div>
              <div className="font-medium text-lg text-green-600">
                {data.filter(s => s.changeValue > 0).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Giảm</div>
              <div className="font-medium text-lg text-red-600">
                {data.filter(s => s.changeValue < 0).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
