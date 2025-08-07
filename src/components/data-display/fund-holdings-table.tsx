"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';
import { FundHolding } from '@/types/shareholders';
import {
  formatNumber,
  formatCurrency,
  formatPercentage
} from '@/utils/formatters';

interface FundHoldingsTableProps {
  data: FundHolding[];
  className?: string;
}

export default function FundHoldingsTable({ data, className }: FundHoldingsTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quỹ đầu tư nắm giữ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Không có dữ liệu quỹ đầu tư
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quỹ đầu tư nắm giữ ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead className="w-[60px]">Logo</TableHead>
                <TableHead className="min-w-[200px]">Tên quỹ</TableHead>
                <TableHead className="text-center">Mã quỹ</TableHead>
                <TableHead className="text-center">Số cổ phiếu</TableHead>
                <TableHead className="text-center">Giá trị (VND)</TableHead>
                <TableHead className="text-center">% Danh mục</TableHead>
                <TableHead className="text-center">Cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((fund, index) => (
                <TableRow key={fund.fundId} className="hover:bg-muted/30">
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <Image
                        src={fund.imageUrl}
                        alt={fund.issuer}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-xs font-medium">${fund.issuer.charAt(0)}</span>`;
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm truncate">
                        {fund.fundName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fund.issuer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {fund.fundCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {formatNumber(fund.sharesHeld)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {formatCurrency(fund.sharesHeldValueVnd)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={fund.pctPortfolio > 1 ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {formatPercentage(fund.pctPortfolio)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {fund.fillingDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Tổng quỹ</div>
              <div className="font-medium text-lg">{data.length}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Tổng cổ phiếu</div>
              <div className="font-medium text-lg">
                {formatNumber(data.reduce((sum, f) => sum + f.sharesHeld, 0))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Tổng giá trị</div>
              <div className="font-medium text-lg">
                {formatCurrency(data.reduce((sum, f) => sum + f.sharesHeldValueVnd, 0))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">TB % danh mục</div>
              <div className="font-medium text-lg">
                {formatPercentage(data.reduce((sum, f) => sum + f.pctPortfolio, 0) / data.length)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
