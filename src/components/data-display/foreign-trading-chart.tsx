"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, BarChart3, TableIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ApiService } from '@/services/api';
import { ForeignTradingData, ForeignTradingPeriod } from '@/types';

interface ForeignTradingChartProps {
  className?: string;
}

export default function ForeignTradingChart({ className = '' }: ForeignTradingChartProps) {
  const [data, setData] = useState<ForeignTradingData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ForeignTradingPeriod>('today');
  const [selectedTab, setSelectedTab] = useState('charts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForeignTradingData = async (period: ForeignTradingPeriod) => {
    setLoading(true);
    setError(null);
    
    try {
      const tradingData = await ApiService.getForeignTrading(period);
      setData(tradingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu giao dịch khối ngoại');
      console.error('Error fetching foreign trading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForeignTradingData(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (period: ForeignTradingPeriod) => {
    setSelectedPeriod(period);
  };

  const formatValue = (value: number): string => {
    if (!value || isNaN(value)) {
      return '0.0 tỷ';
    }
    return `${Math.abs(value).toFixed(1)} tỷ`;
  };



  const getPeriodLabel = (period: ForeignTradingPeriod): string => {
    switch (period) {
      case 'today': return 'Hôm nay';
      case 'week': return 'Tuần';
      case 'month': return 'Tháng';
      default: return 'Hôm nay';
    }
  };





  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Giao dịch khối ngoại</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top mã được khối ngoại quan tâm {getPeriodLabel(selectedPeriod).toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="flex gap-1">
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={(value) => value && handlePeriodChange(value as ForeignTradingPeriod)}
            size="sm"
          >
            <ToggleGroupItem value="today">Hôm nay</ToggleGroupItem>
            <ToggleGroupItem value="week">Tuần</ToggleGroupItem>
            <ToggleGroupItem value="month">Tháng</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Biểu đồ
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Bảng dữ liệu
              </TabsTrigger>
            </TabsList>

            {/* Symmetric Horizontal Bar Chart */}
            <TabsContent value="charts" className="space-y-6">
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-600">Top bán ròng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Top mua ròng</span>
                  </div>
                </div>

                {/* Symmetric Chart */}
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const sellItem = data?.top_sell[index];
                    const buyItem = data?.top_buy[index];

                    if (!sellItem && !buyItem) return null;

                    const maxValue = Math.max(
                      ...(data?.top_sell.slice(0, 10).map(i => Math.abs(i.net_val)) || []),
                      ...(data?.top_buy.slice(0, 10).map(i => Math.abs(i.net_val)) || [])
                    );

                    const sellWidth = sellItem ? (Math.abs(sellItem.net_val) / maxValue) * 100 : 0;
                    const buyWidth = buyItem ? (Math.abs(buyItem.net_val) / maxValue) * 100 : 0;

                    return (
                      <div key={index} className="flex items-center h-12">
                        {/* Left side - Sell (Red bars) */}
                        <div className="flex-1 flex items-center justify-end pr-2">
                          <div className="flex items-center gap-2 w-full justify-end">
                            {sellItem && (
                              <>
                                <span className="text-sm font-medium text-gray-700 min-w-[60px] text-right">
                                  {formatValue(sellItem.net_val)}
                                </span>
                                <div
                                  className="h-8 bg-red-500 rounded-l-md flex items-center justify-start pl-2"
                                  style={{ width: `${sellWidth}%`, minWidth: '60px' }}
                                >
                                  <span className="text-xs font-medium text-white">
                                    {sellItem.symbol}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Center divider */}
                        <div className="w-px h-8 bg-gray-300"></div>

                        {/* Right side - Buy (Green bars) */}
                        <div className="flex-1 flex items-center justify-start pl-2">
                          <div className="flex items-center gap-2 w-full">
                            {buyItem && (
                              <>
                                <div
                                  className="h-8 bg-green-500 rounded-r-md flex items-center justify-end pr-2"
                                  style={{ width: `${buyWidth}%`, minWidth: '60px' }}
                                >
                                  <span className="text-xs font-medium text-white">
                                    {buyItem.symbol}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                                  {formatValue(buyItem.net_val)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>



            {/* Data Table */}
            <TabsContent value="table" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sell Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h3 className="font-semibold text-red-600">Top bán ròng</h3>
                  </div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã CK</TableHead>
                          <TableHead className="text-right">Mua (tỷ)</TableHead>
                          <TableHead className="text-right">Bán (tỷ)</TableHead>
                          <TableHead className="text-right">Ròng (tỷ)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.top_sell.slice(0, 10).map((item, index) => (
                          <TableRow key={`sell-${item.symbol}-${index}`}>
                            <TableCell className="font-medium">{item.symbol}</TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatValue(item.buy_val)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatValue(item.sell_val)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-red-600">
                              -{formatValue(Math.abs(item.net_val))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Buy Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-green-600">Top mua ròng</h3>
                  </div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã CK</TableHead>
                          <TableHead className="text-right">Mua (tỷ)</TableHead>
                          <TableHead className="text-right">Bán (tỷ)</TableHead>
                          <TableHead className="text-right">Ròng (tỷ)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.top_buy.slice(0, 10).map((item, index) => (
                          <TableRow key={`buy-${item.symbol}-${index}`}>
                            <TableCell className="font-medium">{item.symbol}</TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatValue(item.buy_val)}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatValue(item.sell_val)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              +{formatValue(item.net_val)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!loading && !error && data && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Cập nhật lần cuối: {new Date(data.update_time * 1000).toLocaleString('vi-VN')} • 
              Từ {data.from_date} đến {data.to_date}
            </p>
          </div>
        )}

        {!loading && !error && (!data || (data.top_buy.length === 0 && data.top_sell.length === 0)) && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Không có dữ liệu để hiển thị</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
