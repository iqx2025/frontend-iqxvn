"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { ApiService } from '@/services/api';
import { TechnicalAnalysis, TechnicalTimeFrame, TechnicalAnalysisProps, TechnicalGauge, MovingAverage, Oscillator } from '@/types';

const TIMEFRAME_OPTIONS: { value: TechnicalTimeFrame; label: string }[] = [
  { value: 'ONE_HOUR', label: '1H' },
  { value: 'ONE_DAY', label: '1D' },
  { value: 'ONE_WEEK', label: '1W' },
];

// Gauge component for technical analysis
const TechnicalGaugeComponent = ({
  title,
  gauge
}: {
  title: string;
  gauge: TechnicalGauge;
}) => {
  const total = Object.values(gauge.values).reduce((sum, val) => sum + val, 0);
  const buyCount = gauge.values.BUY || 0;
  const sellCount = gauge.values.SELL || 0;
  const neutralCount = gauge.values.NEUTRAL || 0;

  // Calculate percentages for segments
  const sellPercent = total > 0 ? (sellCount / total) : 0;
  const neutralPercent = total > 0 ? (neutralCount / total) : 0;

  // Calculate pointer position based on rating
  let pointerAngle = 0;
  if (gauge.rating === 'BAD' || sellCount > buyCount && sellCount > neutralCount) {
    pointerAngle = -60;
  } else if (gauge.rating === 'NEUTRAL' || neutralCount >= buyCount && neutralCount >= sellCount) {
    pointerAngle = 0;
  } else if (gauge.rating === 'GOOD' || buyCount > sellCount && buyCount > neutralCount) {
    pointerAngle = 60;
  }

  // Get rating color and text
  const getRatingDisplay = () => {
    if (buyCount > sellCount && buyCount > neutralCount) {
      return { text: 'Tốt', color: '#10b981' };
    } else if (sellCount > buyCount && sellCount > neutralCount) {
      return { text: 'Xấu', color: '#ef4444' };
    } else {
      return { text: 'Trung lập', color: '#f59e0b' };
    }
  };

  const ratingDisplay = getRatingDisplay();

  return (
    <Card>
      <div className="flex flex-col items-center space-y-4">
        {/* Title */}
        <div className="text-base sm:text-lg font-semibold text-foreground text-center">{title}</div>

        {/* Beautiful Curved Gauge */}
        <div className="w-full max-w-[240px] space-y-4">
          <div className="relative flex justify-center">
            <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
              <defs>
                {/* Beautiful gradients */}
                <linearGradient id={`sellGrad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
                </linearGradient>
                <linearGradient id={`neutralGrad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                </linearGradient>
                <linearGradient id={`buyGrad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="1" />
                </linearGradient>

                {/* Drop shadow filter */}
                <filter id={`shadow-${title.replace(/\s+/g, '')}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>

              {/* Background arc */}
              <path
                d="M 30 100 A 70 70 0 0 1 170 100"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Sell segment */}
              {sellCount > 0 && (
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke={`url(#sellGrad-${title.replace(/\s+/g, '')})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${sellPercent * 219.9} 219.9`}
                  strokeDashoffset="0"
                  filter={`url(#shadow-${title.replace(/\s+/g, '')})`}
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Neutral segment */}
              {neutralCount > 0 && (
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke={`url(#neutralGrad-${title.replace(/\s+/g, '')})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${neutralPercent * 219.9} 219.9`}
                  strokeDashoffset={`-${sellPercent * 219.9}`}
                  filter={`url(#shadow-${title.replace(/\s+/g, '')})`}
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Buy segment */}
              {buyCount > 0 && (
                <path
                  d="M 30 100 A 70 70 0 0 1 170 100"
                  fill="none"
                  stroke={`url(#buyGrad-${title.replace(/\s+/g, '')})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(1 - sellPercent - neutralPercent) * 219.9} 219.9`}
                  strokeDashoffset={`-${(sellPercent + neutralPercent) * 219.9}`}
                  filter={`url(#shadow-${title.replace(/\s+/g, '')})`}
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Elegant pointer */}
              <g transform={`translate(100, 100) rotate(${pointerAngle})`} className="transition-transform duration-500 ease-out">
                <path
                  d="M -2 0 L 0 -55 L 2 0 Z"
                  fill="hsl(var(--foreground))"
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                  filter={`url(#shadow-${title.replace(/\s+/g, '')})`}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="hsl(var(--foreground))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  filter={`url(#shadow-${title.replace(/\s+/g, '')})`}
                />
              </g>

              {/* Elegant labels */}
              <text x="30" y="115" textAnchor="middle" className="text-xs font-medium" fill="hsl(var(--muted-foreground))">Xấu</text>
              <text x="100" y="125" textAnchor="middle" className="text-xs font-medium" fill="hsl(var(--muted-foreground))">Trung lập</text>
              <text x="170" y="115" textAnchor="middle" className="text-xs font-medium" fill="hsl(var(--muted-foreground))">Tốt</text>
            </svg>
          </div>

          {/* Rating text */}
          <div className="text-center">
            <div
              className="text-lg font-bold transition-colors duration-300"
              style={{ color: ratingDisplay.color }}
            >
              {ratingDisplay.text}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="flex justify-center space-x-6 text-sm w-full">
          <div className="text-center">
            <div className="text-red-500 font-medium mb-1 text-xs">Bán</div>
            <div className="text-foreground font-bold text-xl">{sellCount}</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-500 font-medium mb-1 text-xs">Trung lập</div>
            <div className="text-foreground font-bold text-xl">{neutralCount}</div>
          </div>
          <div className="text-center">
            <div className="text-green-500 font-medium mb-1 text-xs">Mua</div>
            <div className="text-foreground font-bold text-xl">{buyCount}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Indicator table component
const IndicatorTable = ({
  title,
  indicators,
  icon
}: {
  title: string;
  indicators: MovingAverage[] | Oscillator[];
  icon: React.ReactNode;
}) => {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'BUY':
        return <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded border border-green-500/30">Mua</span>;
      case 'SELL':
        return <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-500 rounded border border-red-500/30">Bán</span>;
      case 'NEUTRAL':
        return <span className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded border border-border">Trung lập</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded border border-border">Trung lập</span>;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        {icon}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>

      {/* Table */}
      <div className="divide-y divide-border">
        <div className="grid grid-cols-3 gap-4 p-3 text-sm font-medium text-muted-foreground bg-muted/30">
          <div>Chỉ báo</div>
          <div className="text-center">Giá trị</div>
          <div className="text-center">Tín hiệu</div>
        </div>
        {indicators.map((indicator, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-3 hover:bg-muted/30 transition-colors">
            <div className="text-sm font-medium text-foreground">{indicator.name}</div>
            <div className="text-sm text-muted-foreground text-center">{indicator.value.toLocaleString('vi-VN')}</div>
            <div className="flex justify-center">{getRatingBadge(indicator.rating)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
export default function TechnicalAnalysisComponent({ ticker }: TechnicalAnalysisProps) {
  const [technicalData, setTechnicalData] = useState<TechnicalAnalysis | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TechnicalTimeFrame>('ONE_DAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicalData = async (timeFrame: TechnicalTimeFrame) => {
    setLoading(true);
    setError(null);

    try {
      const data = await ApiService.getTechnicalAnalysis(ticker, timeFrame);
      setTechnicalData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu phân tích kỹ thuật');
      console.error('Error fetching technical analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicalData(selectedTimeFrame);
  }, [ticker, selectedTimeFrame]);

  const handleTimeFrameChange = (timeFrame: TechnicalTimeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };



  if (loading) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-32">
            <BarChart3 className="h-6 w-6 animate-pulse text-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-destructive">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!technicalData) {
    return null;
  }

  return (
      <div className="space-y-6 mt-6">
        {/* Controls */}
        <div className="flex justify-end">
          <ToggleGroup
            type="single"
            value={selectedTimeFrame}
            onValueChange={(value) => value && handleTimeFrameChange(value as TechnicalTimeFrame)}
            variant="outline"
            size="sm"
            disabled={loading}
            className="h-8"
          >
            {TIMEFRAME_OPTIONS.map((option) => (
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

        {/* Summary Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TechnicalGaugeComponent
            title="Dao Động"
            gauge={technicalData.gaugeOscillator}
          />
          <TechnicalGaugeComponent
            title="Tổng Quan"
            gauge={technicalData.gaugeSummary}
          />
          <TechnicalGaugeComponent
            title="Trung Bình Động"
            gauge={technicalData.gaugeMovingAverage}
          />
        </div>

        {/* Detailed Analysis Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IndicatorTable
            title="Trung Bình Động"
            indicators={technicalData.movingAverages}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          />
          <IndicatorTable
            title="Dao Động"
            indicators={technicalData.oscillators}
            icon={<Activity className="h-5 w-5 text-blue-500" />}
          />
        </div>
      </div>
  );
}
