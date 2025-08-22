"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Activity, RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useMarketSentiment, useRealtimeSentiment } from '@/hooks/useMarketSentiment';
import SentimentGauge from './sentiment-gauge';
import MoneyFlowDistribution from './money-flow-distribution';
import MarketBreadthChart from './market-breadth-chart';
import PriceChangeHistogram from './price-change-histogram';
import MiniTrendChart from './mini-trend-chart';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MarketSentimentDashboardV2Props {
  /** Additional CSS classes */
  className?: string;
  /** Use mock data instead of real API */
  useMock?: boolean;
  /** Enable real-time updates for sentiment gauge */
  enableRealtime?: boolean;
  /** Auto-refresh interval in milliseconds (0 = disabled) */
  refreshInterval?: number;
  /** Compact mode for smaller displays */
  compact?: boolean;
}

/**
 * Section Header Component
 */
const SectionHeader = ({
  title,
  description,
  badge,
  action
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between mb-6">
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {badge}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action}
  </div>
);

/**
 * Stats Card Component
 */
const StatsCard = ({
  label,
  value,
  change,
  icon: Icon,
  trend
}: {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    down: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {change && (
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded",
                trend && trendColors[trend]
              )}>
                {change}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            trend && trendColors[trend]
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Loading skeleton for the dashboard
 */
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg border animate-pulse">
          <div className="h-3 bg-muted rounded w-1/2 mb-2" />
          <div className="h-6 bg-muted rounded w-3/4" />
        </div>
      ))}
    </div>

    {/* Main Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Thử lại
      </button>
    </CardContent>
  </Card>
);

/**
 * Redesigned Market Sentiment Dashboard Component V2
 * 
 * Features improved layout with:
 * - Clear visual hierarchy
 * - Consistent spacing and alignment
 * - Better section organization
 * - Enhanced stats display
 * - Improved responsive design
 */
export default function MarketSentimentDashboardV2({
  className,
  useMock = true,
  enableRealtime = false,
  refreshInterval = 0,
  compact = false
}: MarketSentimentDashboardV2Props) {
  const { data, loading, error, refresh, lastUpdate } = useMarketSentiment({
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không có dữ liệu</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary statistics
  const currentSentiment = enableRealtime ? realtimeSentiment : data.gauge.percent;
  const sentimentTrend = currentSentiment > 55 ? 'up' : currentSentiment < 45 ? 'down' : 'neutral';

  const totalStocks = data.distribution.reduce((sum, bin) => sum + bin.count, 0);
  const positiveStocks = data.distribution
    .filter(bin => bin.rangeStart !== undefined && bin.rangeStart > 0)
    .reduce((sum, bin) => sum + bin.count, 0);
  const negativeStocks = data.distribution
    .filter(bin => bin.rangeEnd !== undefined && bin.rangeEnd < 0)
    .reduce((sum, bin) => sum + bin.count, 0);

  const marketBreadth = ((positiveStocks - negativeStocks) / totalStocks * 100).toFixed(1);
  const totalMoneyFlow = data.moneyFlow.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tâm lý thị trường</h2>
            <p className="text-muted-foreground mt-1">
              Phân tích tâm lý và xu hướng thị trường chứng khoán Việt Nam
            </p>
          </div>
          <div className="flex items-center gap-2">
            {enableRealtime && (
              <Badge variant="outline" className="gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Trực tiếp
              </Badge>
            )}
            {refreshInterval > 0 && (
              <Badge variant="outline" className="gap-1">
                <RefreshCw className="h-3 w-3" />
                Tự động
              </Badge>
            )}
            {lastUpdate && (
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {new Date(lastUpdate).toLocaleTimeString('vi-VN')}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Tâm lý hiện tại"
            value={`${currentSentiment}%`}
            change={currentSentiment > 55 ? 'Lạc quan' : currentSentiment < 45 ? 'Bi quan' : 'Trung lập'}
            icon={sentimentTrend === 'up' ? TrendingUp : sentimentTrend === 'down' ? TrendingDown : Activity}
            trend={sentimentTrend}
          />
          <StatsCard
            label="Độ rộng thị trường"
            value={`${marketBreadth}%`}
            change={`${positiveStocks}↑ ${negativeStocks}↓`}
            trend={Number(marketBreadth) > 0 ? 'up' : Number(marketBreadth) < 0 ? 'down' : 'neutral'}
          />
          <StatsCard
            label="Tổng giao dịch"
            value={`${totalMoneyFlow.toFixed(1)}T`}
            change="VNĐ"
          />
          <StatsCard
            label="Tổng số mã"
            value={totalStocks}
            change={`${((positiveStocks / totalStocks) * 100).toFixed(0)}% tăng`}
            trend={positiveStocks > negativeStocks ? 'up' : 'down'}
          />
        </div>
      </div>

      {/* Main Content Grid - Improved Layout */}
      <div className="space-y-6">
        {/* Section 1: Overall Sentiment */}
        <div>
          <SectionHeader
            title="Tổng quan tâm lý"
            description="Chỉ số tâm lý tổng hợp và xu hướng lịch sử"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Gauge - Larger prominence */}
            <div className="lg:col-span-1">
              <SentimentGauge
                percent={currentSentiment}
                realtime={enableRealtime}
                className="h-full"
              />
            </div>

            {/* Historical Trend - 2 columns width */}
            <div className="lg:col-span-2">
              <MiniTrendChart
                height={compact ? 250 : 300}
                className="h-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 2: Money Flow & Distribution */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MoneyFlowDistribution
            data={data.moneyFlow}
            className="h-full"
          />
          <PriceChangeHistogram
            data={data.distribution}
            className="h-full"
          />
          <MarketBreadthChart
            // data={data.breadth}
            // className="w-full"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {data.timestamp && (
            <span>
              Cập nhật lần cuối: {new Date(data.timestamp).toLocaleString('vi-VN')}
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {loading ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}
        </button>
      </div>
    </div>
  );
}
