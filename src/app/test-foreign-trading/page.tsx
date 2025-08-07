"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, BarChart3, TableIcon } from 'lucide-react';

import { ForeignTradingData, ForeignTradingPeriod } from '@/types';

// Mock data for testing
const mockData: ForeignTradingData = {
  top_buy: [
    { symbol: 'VIC', buy_qtty: 1500000, buy_val: 150.5, sell_qtty: 800000, sell_val: 80.2, net_val: 70.3 },
    { symbol: 'VCB', buy_qtty: 2000000, buy_val: 200.8, sell_qtty: 1200000, sell_val: 120.4, net_val: 80.4 },
    { symbol: 'HPG', buy_qtty: 1800000, buy_val: 90.6, sell_qtty: 600000, sell_val: 30.2, net_val: 60.4 },
    { symbol: 'VHM', buy_qtty: 1200000, buy_val: 120.3, sell_qtty: 700000, sell_val: 70.1, net_val: 50.2 },
    { symbol: 'TCB', buy_qtty: 1600000, buy_val: 80.4, sell_qtty: 400000, sell_val: 20.1, net_val: 60.3 },
    { symbol: 'MSN', buy_qtty: 900000, buy_val: 90.2, sell_qtty: 500000, sell_val: 50.1, net_val: 40.1 },
    { symbol: 'VRE', buy_qtty: 800000, buy_val: 40.3, sell_qtty: 200000, sell_val: 10.1, net_val: 30.2 },
    { symbol: 'GAS', buy_qtty: 700000, buy_val: 70.5, sell_qtty: 400000, sell_val: 40.2, net_val: 30.3 },
    { symbol: 'CTG', buy_qtty: 1100000, buy_val: 55.4, sell_qtty: 600000, sell_val: 30.1, net_val: 25.3 },
    { symbol: 'BID', buy_qtty: 950000, buy_val: 47.8, sell_qtty: 450000, sell_val: 22.5, net_val: 25.3 }
  ],
  top_sell: [
    { symbol: 'VNM', buy_qtty: 500000, buy_val: 50.2, sell_qtty: 1500000, sell_val: 150.6, net_val: -100.4 },
    { symbol: 'SAB', buy_qtty: 300000, buy_val: 30.1, sell_qtty: 1200000, sell_val: 120.5, net_val: -90.4 },
    { symbol: 'MWG', buy_qtty: 400000, buy_val: 20.3, sell_qtty: 1000000, sell_val: 100.8, net_val: -80.5 },
    { symbol: 'FPT', buy_qtty: 600000, buy_val: 60.2, sell_qtty: 1300000, sell_val: 130.7, net_val: -70.5 },
    { symbol: 'VJC', buy_qtty: 200000, buy_val: 20.1, sell_qtty: 800000, sell_val: 80.6, net_val: -60.5 },
    { symbol: 'PLX', buy_qtty: 350000, buy_val: 35.2, sell_qtty: 900000, sell_val: 90.7, net_val: -55.5 },
    { symbol: 'POW', buy_qtty: 250000, buy_val: 25.3, sell_qtty: 750000, sell_val: 75.8, net_val: -50.5 },
    { symbol: 'SSI', buy_qtty: 300000, buy_val: 15.4, sell_qtty: 600000, sell_val: 60.9, net_val: -45.5 },
    { symbol: 'HDB', buy_qtty: 400000, buy_val: 40.5, sell_qtty: 850000, sell_val: 85.0, net_val: -44.5 },
    { symbol: 'TPB', buy_qtty: 150000, buy_val: 15.6, sell_qtty: 550000, sell_val: 55.1, net_val: -39.5 }
  ],
  update_time: Date.now() / 1000,
  from_date: '2025-01-06',
  to_date: '2025-01-06'
};

export default function ForeignTradingTest() {
  const [data, setData] = useState<ForeignTradingData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ForeignTradingPeriod>('today');
  const [selectedTab, setSelectedTab] = useState('charts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Foreign Trading Chart</h1>
      
      <Card className="w-full">
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
              onValueChange={(value) => value && setSelectedPeriod(value as ForeignTradingPeriod)}
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

          {!loading && data && (
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

          {!loading && data && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Cập nhật lần cuối: {new Date(data.update_time * 1000).toLocaleString('vi-VN')} • 
                Từ {data.from_date} đến {data.to_date}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
