"use client";

import React, { useState, useEffect } from 'react';


import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from 'recharts';
import { ApiService } from '@/services/api';
import { PriceData, ChartPeriod, StockPriceChartProps } from '@/types';

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: '1d', label: '1 Ngày' },
  { value: '1m', label: '1 Tháng' },
  { value: '3m', label: '3 Tháng' },
  { value: '1y', label: '1 Năm' },
  { value: '5y', label: '5 Năm' },
  { value: 'all', label: 'Tất cả' },
];

type ChartType = 'area' | 'line' | 'candlestick';

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Vùng' },
  { value: 'line', label: 'Đường' },
  { value: 'candlestick', label: 'Nến' },
];

export default function StockPriceChart({
  ticker,
  height = 400,
  className = ''
}: StockPriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('1d');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchPriceData = async (period: ChartPeriod) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ApiService.getHistoricalPrices(ticker, period);
      setPriceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu biểu đồ');
      console.error('Error fetching price data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData(selectedPeriod);
  }, [ticker, selectedPeriod, fetchPriceData]);

  const handlePeriodChange = (period: ChartPeriod) => {
    setSelectedPeriod(period);
  };



  // Calculate price change and statistics
  const priceChange = priceData.length > 1
    ? priceData[priceData.length - 1].close - priceData[0].close
    : 0;


  const isPositive = priceChange >= 0;

  // Get theme-aware colors
  const getChartColors = () => {
    const isDark = theme === 'dark';
    return {
      positive: {
        stroke: isDark ? "#4ade80" : "#22c55e", // green-400 : green-500
        fill: isDark ? "#4ade80" : "#22c55e"
      },
      negative: {
        stroke: isDark ? "#f87171" : "#ef4444", // red-400 : red-500
        fill: isDark ? "#f87171" : "#ef4444"
      },
      high: isDark ? "#34d399" : "#10b981", // emerald-400 : emerald-500
      low: isDark ? "#fb7185" : "#f43f5e", // rose-400 : rose-500
      close: isDark ? "#60a5fa" : "#3b82f6" // blue-400 : blue-500
    };
  };

  const colors = getChartColors();

  // Calculate additional statistics
  const stats = priceData.length > 0 ? {
    currentPrice: priceData[priceData.length - 1]?.close || 0,
    highestPrice: Math.max(...priceData.map(d => d.high)),
    lowestPrice: Math.min(...priceData.map(d => d.low)),
    averageVolume: priceData.reduce((sum, d) => sum + d.volume, 0) / priceData.length,
    totalVolume: priceData.reduce((sum, d) => sum + d.volume, 0),
  } : null;

  // Format data for chart
  const chartData = priceData.map((item) => {
    const date = new Date(item.timestamp * 1000);

    // Format display based on selected period
    let displayDate: string;
    let displayTime: string;

    if (selectedPeriod === '1d') {
      // For intraday data, show time
      displayDate = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      displayTime = date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // For daily+ data, show date
      displayDate = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
      displayTime = date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    return {
      ...item,
      displayDate,
      displayTime,
    };
  });

  // Custom tooltip
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: PriceData & {
        displayDate: string;
        displayTime: string;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-popover-foreground">{data.displayTime}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Mở cửa:</span>{' '}
              <span className="font-medium text-popover-foreground">{data.open.toLocaleString('vi-VN')}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Cao nhất:</span>{' '}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{data.high.toLocaleString('vi-VN')}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Thấp nhất:</span>{' '}
              <span className="font-medium text-rose-600 dark:text-rose-400">{data.low.toLocaleString('vi-VN')}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Đóng cửa:</span>{' '}
              <span className="font-medium text-popover-foreground">{data.close.toLocaleString('vi-VN')}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Khối lượng:</span>{' '}
              <span className="font-medium text-popover-foreground">{data.volume.toLocaleString('vi-VN')}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: showVolume ? 60 : 5 }
    };

    const commonAxisProps = {
      xAxis: {
        dataKey: "displayDate",
        tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
        tickLine: false,
        axisLine: false
      },
      yAxis: {
        tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
        tickLine: false,
        axisLine: false,
        tickFormatter: (value: number) => value.toLocaleString('vi-VN')
      },
      volumeYAxis: {
        yAxisId: "volume",
        orientation: "right" as const,
        tick: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
        tickLine: false,
        axisLine: false,
        tickFormatter: (value: number) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value.toString();
        }
      }
    };

    switch (chartType) {
      case 'line':
        if (showVolume) {
          return (
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
              <XAxis {...commonAxisProps.xAxis} />
              <YAxis {...commonAxisProps.yAxis} />
              <YAxis {...commonAxisProps.volumeYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="close"
                stroke={isPositive ? colors.positive.stroke : colors.negative.stroke}
                strokeWidth={2}
                dot={false}
              />
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
                name="Khối lượng"
              />
            </ComposedChart>
          );
        }
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="close"
              stroke={isPositive ? colors.positive.stroke : colors.negative.stroke}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );

      case 'candlestick':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            {showVolume && <YAxis {...commonAxisProps.volumeYAxis} />}
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="high"
              stroke={colors.high}
              strokeWidth={1}
              dot={false}
              name="Cao nhất"
            />
            <Line
              type="monotone"
              dataKey="low"
              stroke={colors.low}
              strokeWidth={1}
              dot={false}
              name="Thấp nhất"
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={colors.close}
              strokeWidth={2}
              dot={false}
              name="Đóng cửa"
            />
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
                name="Khối lượng"
              />
            )}
          </ComposedChart>
        );

      case 'area':
      default:
        if (showVolume) {
          return (
            <ComposedChart {...commonProps}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? colors.positive.fill : colors.negative.fill}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? colors.positive.fill : colors.negative.fill}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
              <XAxis {...commonAxisProps.xAxis} />
              <YAxis {...commonAxisProps.yAxis} />
              <YAxis {...commonAxisProps.volumeYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? colors.positive.stroke : colors.negative.stroke}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="hsl(var(--muted))"
                opacity={0.3}
                name="Khối lượng"
              />
            </ComposedChart>
          );
        }
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? colors.positive.fill : colors.negative.fill}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? colors.positive.fill : colors.negative.fill}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
            <XAxis {...commonAxisProps.xAxis} />
            <YAxis {...commonAxisProps.yAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke={isPositive ? colors.positive.stroke : colors.negative.stroke}
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className={cn("space-y-6 mt-6", className)}>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Period Selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Thời gian:</span>
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={(value) => value && handlePeriodChange(value as ChartPeriod)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="h-8"
          >
            {PERIOD_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="text-xs min-w-[50px] h-7"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Chart Type Selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Loại:</span>
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(value) => value && setChartType(value as ChartType)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="h-8"
          >
            {CHART_TYPE_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="text-xs min-w-[50px] h-7"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Volume Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Khối lượng:</span>
          <Toggle
            pressed={showVolume}
            onPressedChange={setShowVolume}
            disabled={loading}
            variant="outline"
            size="sm"
            className="h-8 text-xs min-w-[60px]"
          >
            {showVolume ? 'Bật' : 'Tắt'}
          </Toggle>
        </div>
      </div>

      {/* Price Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hiện tại</p>
              <p className="text-xl font-bold">{stats.currentPrice.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cao</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.highestPrice.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thấp</p>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{stats.lowestPrice.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">KL TB</p>
              <p className="text-xl font-bold">{Math.round(stats.averageVolume).toLocaleString('vi-VN')}</p>
            </div>
          </div>
        </div>
      )}
      {/* Chart Card */}
      <Card>
        <CardContent className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && priceData.length > 0 && (
            <ResponsiveContainer width="100%" height={height}>
              {renderChart()}
            </ResponsiveContainer>
          )}

          {!loading && !error && priceData.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Không có dữ liệu biểu đồ</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
