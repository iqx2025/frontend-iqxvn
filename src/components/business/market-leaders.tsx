'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { MarketLeaderService } from '@/services/marketLeaderService';
import { MarketLeaderItem, MarketExchange } from '@/types/market-leader';
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

/**
 * Market Leaders Component
 * Displays stocks with the most impact on market indices
 */
export default function MarketLeaders() {
  const [selectedExchange, setSelectedExchange] = useState<MarketExchange>('VNINDEX');
  const [leaders, setLeaders] = useState<MarketLeaderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchMarketLeaders = async (exchange: MarketExchange) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await MarketLeaderService.getMarketLeaders(exchange, 10);
      setLeaders(data);
    } catch (err) {
      console.error('Failed to fetch market leaders:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      setLeaders([]);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchMarketLeaders(selectedExchange);
  }, [selectedExchange]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchMarketLeaders(selectedExchange);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{data.symbol}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[200px]">
            {data.companyName}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className="text-muted-foreground">Điểm ảnh hưởng: </span>
              <span className={cn(
                "font-semibold",
                data.score >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {data.score >= 0 ? '+' : ''}{data.score.toFixed(2)}
              </span>
            </p>
            <p className="text-xs">
              <span className="text-muted-foreground">Phần trăm: </span>
              <span className={cn(
                "font-semibold",
                data.score >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {data.score >= 0 ? '+' : ''}{(data.scorePercent * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );

  const renderError = () => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="text-lg font-semibold text-destructive">
              Lỗi khi tải dữ liệu
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error}
            </p>
          </div>
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
      </CardContent>
    </Card>
  );

  const renderChart = () => {
    if (leaders.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Không có dữ liệu cổ phiếu ảnh hưởng</p>
        </div>
      );
    }

    // Sort data by score for better visualization
    const sortedData = [...leaders].sort((a, b) => b.score - a.score);
    
    // Calculate domain for x-axis
    const maxScore = Math.max(...sortedData.map(d => Math.abs(d.score)));
    const xDomain = [-Math.ceil(maxScore * 1.2), Math.ceil(maxScore * 1.2)];

    return (
      <ResponsiveContainer width="100%" height={550}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 0,
            right: 40,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            domain={xDomain}
            tickFormatter={(tick) => `${tick.toFixed(1)}`}
          />
          <YAxis 
            type="category" 
            dataKey="symbol" 
            width={45}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={2} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score >= 0 ? '#10b981' : '#ef4444'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (error) {
    return renderError();
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-semibold">
                Top cổ phiếu ảnh hưởng
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Các mã có tác động lớn nhất đến chỉ số thị trường
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Exchange selector buttons */}
            <div className="flex rounded-lg border bg-muted p-1">
              <Button
                variant={selectedExchange === 'VNINDEX' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedExchange('VNINDEX')}
                className="h-7 px-3 text-xs"
              >
                VN-Index
              </Button>
              <Button
                variant={selectedExchange === 'HNX' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedExchange('HNX')}
                className="h-7 px-3 text-xs"
              >
                HNX
              </Button>
              <Button
                variant={selectedExchange === 'UPCOM' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedExchange('UPCOM')}
                className="h-7 px-3 text-xs"
              >
                UPCOM
              </Button>
            </div>
            
            {/* Refresh button */}
            <Button
              onClick={handleRetry}
              disabled={isRetrying || loading}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <RefreshCw className={cn("h-4 w-4", (isRetrying || loading) && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
}
