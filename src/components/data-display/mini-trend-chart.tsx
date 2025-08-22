"use client";

import React, { useEffect, useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ComposedChart,
  Bar,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { MarketBehaviorService } from '@/services/marketBehaviorService';
import { MarketBehaviorChartData, BEHAVIOR_COLORS, BEHAVIOR_CATEGORIES } from '@/types/market-behavior';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface MiniTrendChartProps {
  /** Additional CSS classes */
  className?: string;
  /** Hide card wrapper */
  noCard?: boolean;
  /** Chart height */
  height?: number;
}

/**
 * Custom tooltip for the market behavior chart
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="text-sm font-semibold mb-2">{label}</p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">VN-Index:</span>
            <span className="text-sm font-bold" style={{ color: BEHAVIOR_COLORS.VNINDEX }}>
              {data.vnindex?.toLocaleString('vi-VN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="border-t pt-1 mt-1 space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BEHAVIOR_COLORS.STRONG_BUY }} />
                {BEHAVIOR_CATEGORIES.STRONG_BUY}:
              </span>
              <span className="text-xs font-semibold">
                {data.strongBuy?.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BEHAVIOR_COLORS.BUY }} />
                {BEHAVIOR_CATEGORIES.BUY}:
              </span>
              <span className="text-xs font-semibold">
                {data.buy?.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BEHAVIOR_COLORS.SELL }} />
                {BEHAVIOR_CATEGORIES.SELL}:
              </span>
              <span className="text-xs font-semibold">
                {data.sell?.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BEHAVIOR_COLORS.STRONG_SELL }} />
                {BEHAVIOR_CATEGORIES.STRONG_SELL}:
              </span>
              <span className="text-xs font-semibold">
                {data.strongSell?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Market Behavior Trend Chart Component
 * Displays market sentiment as 100% stacked bar chart with VNINDEX overlay
 */
export default function MiniTrendChart({ 
  className,
  noCard = false,
  height = 300
}: MiniTrendChartProps) {
  const [data, setData] = useState<MarketBehaviorChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const behaviorData = await MarketBehaviorService.getMarketBehaviorData();
      setData(behaviorData);
    } catch (err) {
      console.error('Failed to fetch market behavior data:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchData();
  };

  // Calculate VNINDEX trend
  const firstVnindex = data[0]?.vnindex || 0;
  const lastVnindex = data[data.length - 1]?.vnindex || 0;
  const vnindexChange = lastVnindex - firstVnindex;
  const vnindexChangePercent = firstVnindex !== 0 ? ((vnindexChange / firstVnindex) * 100).toFixed(2) : '0.00';
  const isPositive = vnindexChange > 0;

  // Get min and max for VNINDEX scale
  const vnindexValues = data.map(d => d.vnindex).filter(v => v > 0);
  const minVnindex = vnindexValues.length > 0 ? Math.min(...vnindexValues) : 1000;
  const maxVnindex = vnindexValues.length > 0 ? Math.max(...vnindexValues) : 1500;
  const vnindexPadding = (maxVnindex - minVnindex) * 0.1;

  const chartContent = (
    <div className="w-full">
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-3">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
            Thử lại
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
        </div>
      ) : (
        <>
          {/* Trend Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">VN-Index:</span>
                <span className="text-sm font-bold" style={{ color: BEHAVIOR_COLORS.VNINDEX }}>
                  {lastVnindex.toLocaleString('vi-VN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-semibold flex items-center gap-1",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    !isPositive && "rotate-180"
                  )} />
                  {isPositive ? '+' : ''}{vnindexChangePercent}%
                </span>
              </div>
            </div>
            <Button
              onClick={handleRetry}
              disabled={isRetrying || loading}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <RefreshCw className={cn("h-3 w-3", (isRetrying || loading) && "animate-spin")} />
            </Button>
          </div>

          {/* Composed Chart with Stacked Bars and Line */}
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 60, left: 0, bottom: 40 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
              />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="left"
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
                label={{ 
                  value: 'Tỷ lệ %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 10 }
                }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[minVnindex - vnindexPadding, maxVnindex + vnindexPadding]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.toFixed(0)}
                label={{ 
                  value: 'VN-Index', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { fontSize: 10, fill: BEHAVIOR_COLORS.VNINDEX }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="rect"
              />
              
              {/* Stacked Bars */}
              <Bar 
                yAxisId="left"
                dataKey="strongSell" 
                stackId="behavior"
                fill={BEHAVIOR_COLORS.STRONG_SELL}
                name={BEHAVIOR_CATEGORIES.STRONG_SELL}
              />
              <Bar 
                yAxisId="left"
                dataKey="sell" 
                stackId="behavior"
                fill={BEHAVIOR_COLORS.SELL}
                name={BEHAVIOR_CATEGORIES.SELL}
              />
              <Bar 
                yAxisId="left"
                dataKey="buy" 
                stackId="behavior"
                fill={BEHAVIOR_COLORS.BUY}
                name={BEHAVIOR_CATEGORIES.BUY}
              />
              <Bar 
                yAxisId="left"
                dataKey="strongBuy" 
                stackId="behavior"
                fill={BEHAVIOR_COLORS.STRONG_BUY}
                name={BEHAVIOR_CATEGORIES.STRONG_BUY}
              />
              
              {/* VNINDEX Line */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="vnindex" 
                stroke={BEHAVIOR_COLORS.VNINDEX}
                strokeWidth={2}
                dot={false}
                name="VN-Index"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend Info */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Dữ liệu {data.length} ngày gần nhất</span>
            </div>
            <div className="text-right text-muted-foreground">
              Nguồn: CafeF
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (noCard) {
    return <div className={className}>{chartContent}</div>;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hành vi thị trường
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Phân bổ hành vi mua bán và diễn biến VN-Index
        </p>
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
}
