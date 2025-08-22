"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';
import type { PriceChangeBin } from '@/types/market-sentiment';
import { cn } from '@/lib/utils';

interface PriceChangeHistogramProps {
  /** Price change distribution data */
  data: PriceChangeBin[];
  /** Additional CSS classes */
  className?: string;
  /** Hide card wrapper */
  noCard?: boolean;
}

/**
 * Custom tooltip for the histogram
 */
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PriceChangeBin & { total: number } }> }) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    
    // Determine color based on range
    let color = '#eab308'; // yellow for 0%
    if (data.rangeStart && data.rangeStart > 0) color = '#22c55e'; // green for positive
    if (data.rangeEnd && data.rangeEnd < 0) color = '#ef4444'; // red for negative
    
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-1">{data.range}</p>
        <p className="text-sm text-muted-foreground">
          Số mã: <span className="font-semibold text-foreground">{data.count}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tỷ lệ: <span className="font-semibold">
            {((data.count / payload[0].payload.total) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Get color for a price change bin
 */
const getBarColor = (bin: PriceChangeBin): string => {
  if (bin.range === '0%') return '#eab308'; // yellow
  if (bin.rangeStart !== undefined && bin.rangeStart >= 0) return '#22c55e'; // green
  if (bin.rangeEnd !== undefined && bin.rangeEnd <= 0) return '#ef4444'; // red
  // Mixed range (crosses zero)
  return '#6b7280'; // gray
};

/**
 * Price Change Histogram Component
 */
export default function PriceChangeHistogram({ 
  data, 
  className,
  noCard = false 
}: PriceChangeHistogramProps) {
  // Calculate total stocks for percentage calculation
  const totalStocks = data.reduce((sum, bin) => sum + bin.count, 0);
  
  // Add total to each bin for tooltip
  const dataWithTotal = data.map(bin => ({
    ...bin,
    total: totalStocks
  }));

  // Calculate statistics
  const positiveStocks = data
    .filter(bin => bin.rangeStart !== undefined && bin.rangeStart >= 0)
    .reduce((sum, bin) => sum + bin.count, 0);
  const negativeStocks = data
    .filter(bin => bin.rangeEnd !== undefined && bin.rangeEnd <= 0 && bin.range !== '0%')
    .reduce((sum, bin) => sum + bin.count, 0);
  const unchangedStocks = data
    .find(bin => bin.range === '0%')?.count || 0;

  const chartContent = (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-muted-foreground mb-1">Tăng giá</p>
          <p className="text-lg font-bold text-green-600">{positiveStocks}</p>
          <p className="text-xs text-green-600">
            {((positiveStocks / totalStocks) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-xs text-muted-foreground mb-1">Đứng giá</p>
          <p className="text-lg font-bold text-yellow-600">{unchangedStocks}</p>
          <p className="text-xs text-yellow-600">
            {((unchangedStocks / totalStocks) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-muted-foreground mb-1">Giảm giá</p>
          <p className="text-lg font-bold text-red-600">{negativeStocks}</p>
          <p className="text-xs text-red-600">
            {((negativeStocks / totalStocks) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Histogram */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dataWithTotal}
          margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="range"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            label={{ 
              value: 'Số lượng mã', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Footer note */}
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          Tổng số mã: <span className="font-semibold">{totalStocks}</span>
        </p>
      </div>
    </div>
  );

  if (noCard) {
    return <div className={className}>{chartContent}</div>;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Phân bố biến động giá
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Phân phối mã theo mức độ thay đổi giá
        </p>
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
}
