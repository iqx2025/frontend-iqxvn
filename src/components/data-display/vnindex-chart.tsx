"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
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
import { PriceData, ChartPeriod } from '@/types';

type ChartType = 'line' | 'area';

interface VNIndexChartProps {
  height?: number;
  className?: string;
}

export default function VNIndexChart({
  height = 300,
  className = ''
}: VNIndexChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('3m');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchVNIndexData = async (period: ChartPeriod) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ApiService.getHistoricalPrices('VNINDEX', period);
      setPriceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu VNINDEX');
      console.error('Error fetching VNINDEX data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVNIndexData(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (period: ChartPeriod) => {
    setSelectedPeriod(period);
  };

  // Calculate price change
  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1]?.close : 0;
  const previousPrice = priceData.length > 1 ? priceData[0]?.close : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Chart colors based on theme and price direction
  const colors = {
    positive: {
      stroke: theme === 'dark' ? '#22c55e' : '#16a34a',
      fill: theme === 'dark' ? '#22c55e' : '#16a34a',
    },
    negative: {
      stroke: theme === 'dark' ? '#ef4444' : '#dc2626',
      fill: theme === 'dark' ? '#ef4444' : '#dc2626',
    },
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PriceData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {new Date(data.timestamp * 1000).toLocaleDateString('vi-VN')}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Mở cửa: <span className="text-foreground">{data.open.toFixed(2)}</span>
            </p>
            <p className="text-sm font-medium">
              Đóng cửa: <span className="text-foreground">{data.close.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              Cao nhất: <span className="text-green-600">{data.high.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              Thấp nhất: <span className="text-red-600">{data.low.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              Khối lượng: <span className="text-blue-600">{(data.volume / 1000000).toFixed(1)}M</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format X-axis labels
  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    switch (selectedPeriod) {
      case '1d':
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      case '3m':
      case '1y':
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      default:
        return date.toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' });
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: priceData,
      height: showVolume ? height : height,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const commonAxisProps = {
      xAxis: {
        dataKey: 'timestamp',
        axisLine: false,
        tickLine: false,
        tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
        tickFormatter: formatXAxisLabel,
      },
      yAxis: {
        axisLine: false,
        tickLine: false,
        tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
        domain: ['dataMin - 10', 'dataMax + 10'],
      },
      volumeYAxis: {
        yAxisId: 'volume',
        orientation: 'right' as const,
        axisLine: false,
        tickLine: false,
        tick: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
        tickFormatter: (value: number) => `${(value / 1000000).toFixed(0)}M`,
      },
    };

    if (chartType === 'line') {
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
              name="Giá đóng cửa"
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
            name="Giá đóng cửa"
          />
        </LineChart>
      );
    }

    if (showVolume) {
      return (
        <ComposedChart {...commonProps}>
          <defs>
            <linearGradient id="colorVNIndex" x1="0" y1="0" x2="0" y2="1">
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
            fill="url(#colorVNIndex)"
            name="Giá đóng cửa"
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
          <linearGradient id="colorVNIndex" x1="0" y1="0" x2="0" y2="1">
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
          fill="url(#colorVNIndex)"
          name="Giá đóng cửa"
        />
      </AreaChart>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">VN-Index</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">
                  {currentPrice.toFixed(2)}
                </span>
                <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={(value) => value && setChartType(value as ChartType)}
              size="sm"
            >
              <ToggleGroupItem value="area" aria-label="Area chart">
                <BarChart3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line chart">
                <TrendingUp className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Toggle
              pressed={showVolume}
              onPressedChange={setShowVolume}
              size="sm"
              aria-label="Toggle volume"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="ml-1 text-xs">Volume</span>
            </Toggle>
          </div>
        </div>

        {/* Period Selection */}
        <div className="flex gap-1">
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={(value) => value && handlePeriodChange(value as ChartPeriod)}
            size="sm"
          >
            <ToggleGroupItem value="1d">1D</ToggleGroupItem>
            <ToggleGroupItem value="3m">3M</ToggleGroupItem>
            <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
            <ToggleGroupItem value="5y">5Y</ToggleGroupItem>
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

        {!loading && !error && priceData.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && priceData.length === 0 && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Không có dữ liệu để hiển thị</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
