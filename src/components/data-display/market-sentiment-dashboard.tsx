"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Activity } from 'lucide-react';
import { useMarketSentiment, useRealtimeSentiment } from '@/hooks/useMarketSentiment';
import SentimentGauge from './sentiment-gauge';
import MoneyFlowDistribution from './money-flow-distribution';
import MarketBreadthChart from './market-breadth-chart';
import PriceChangeHistogram from './price-change-histogram';
import MiniTrendChart from './mini-trend-chart';
import { cn } from '@/lib/utils';

interface MarketSentimentDashboardProps {
  /** Additional CSS classes */
  className?: string;
  /** Use mock data instead of real API */
  useMock?: boolean;
  /** Enable real-time updates for sentiment gauge */
  enableRealtime?: boolean;
  /** Auto-refresh interval in milliseconds (0 = disabled) */
  refreshInterval?: number;
}

/**
 * Loading skeleton for the dashboard
 */
const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Sentiment Gauge Skeleton */}
    <Card className="animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="h-48 bg-muted rounded" />
      </div>
    </Card>

    {/* Money Flow Skeleton */}
    <Card className="animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="h-48 bg-muted rounded" />
      </div>
    </Card>

    {/* Market Breadth Skeleton */}
    <Card className="animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="h-48 bg-muted rounded" />
      </div>
    </Card>

    {/* Price Change Skeleton */}
    <Card className="animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />
        <div className="h-48 bg-muted rounded" />
      </div>
    </Card>

    {/* Trend Chart Skeleton */}
    <Card className="col-span-full animate-pulse">
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-1/4 mb-4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </Card>
  </div>
);

/**
 * Error state component
 */
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Card className="col-span-full">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Thử lại
      </button>
    </CardContent>
  </Card>
);

/**
 * Market Sentiment Dashboard Component
 * 
 * A comprehensive dashboard displaying market sentiment metrics including:
 * - Sentiment gauge (speedometer style)
 * - Money flow distribution
 * - Market breadth by sector
 * - Price change distribution histogram
 * - Historical sentiment trend
 */
export default function MarketSentimentDashboard({
  className,
  useMock = true,
  enableRealtime = false,
  refreshInterval = 0
}: MarketSentimentDashboardProps) {
  const { data, loading, error, refresh } = useMarketSentiment({
    useMock,
    refreshInterval
  });

  // Real-time sentiment value for gauge
  const realtimeSentiment = useRealtimeSentiment(
    data?.gauge.percent || 50,
    enableRealtime ? 5000 : 0
  );

  // Handle loading state
  if (loading && !data) {
    return (
      <div className={cn("w-full", className)}>
        <DashboardSkeleton />
      </div>
    );
  }

  // Handle error state
  if (error && !data) {
    return (
      <div className={cn("w-full", className)}>
        <ErrorState error={error} onRetry={refresh} />
      </div>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <div className={cn("w-full", className)}>
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không có dữ liệu</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tâm lý thị trường</h2>
          <p className="text-sm text-muted-foreground">
            Phân tích tâm lý và xu hướng thị trường chứng khoán
          </p>
        </div>
        {data.timestamp && (
          <div className="text-sm text-muted-foreground">
            Cập nhật: {new Date(data.timestamp).toLocaleString('vi-VN')}
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Gauge - Takes up left column on large screens */}
        <div className="lg:row-span-2">
          <SentimentGauge 
            percent={enableRealtime ? realtimeSentiment : data.gauge.percent}
            realtime={enableRealtime}
          />
        </div>

        {/* Money Flow Distribution - Top right */}
        <MoneyFlowDistribution data={data.moneyFlow} />

        {/* Market Breadth - Bottom right */}
        <MarketBreadthChart />

        {/* Price Change Distribution - Spans full width on mobile, half on desktop */}
        <div className="lg:col-span-1">
          <PriceChangeHistogram data={data.distribution} />
        </div>
      </div>

      {/* Historical Trend - Full width */}
      <MiniTrendChart 
        height={300}
      />

      {/* Refresh Button (if not auto-refreshing) */}
      {refreshInterval === 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={refresh}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Đang cập nhật...
              </span>
            ) : (
              'Làm mới dữ liệu'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
