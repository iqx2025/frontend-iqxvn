"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MoneyFlowItem } from '@/types/market-sentiment';
import { cn } from '@/lib/utils';

interface MoneyFlowDistributionProps {
  /** Money flow data */
  data: MoneyFlowItem[];
  /** Additional CSS classes */
  className?: string;
  /** Hide card wrapper */
  noCard?: boolean;
}

/**
 * Custom tooltip for the money flow chart
 */
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: MoneyFlowItem & { percentage: string } }> }) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    const Icon = data.label === 'Tăng' ? TrendingUp : 
                 data.label === 'Giảm' ? TrendingDown : Minus;
    
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4" style={{ color: data.color }} />
          <span className="font-medium">{data.label}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Giá trị: <span className="font-semibold text-foreground">{data.value} nghìn tỷ VNĐ</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Money Flow Distribution Component
 */
export default function MoneyFlowDistribution({ 
  data, 
  className,
  noCard = false 
}: MoneyFlowDistributionProps) {
  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const chartContent = (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {dataWithPercentage.map((item, index) => {
          const Icon = item.label === 'Tăng' ? TrendingUp : 
                       item.label === 'Giảm' ? TrendingDown : Minus;
          return (
            <div 
              key={index}
              className="flex flex-col items-center p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon className="h-3 w-3" style={{ color: item.color }} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: item.color }}>
                {item.value} tỷ
              </span>
              <span className="text-xs text-muted-foreground">
                {item.percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dataWithPercentage}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="label"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            label={{ 
              value: 'Nghìn tỷ VNĐ', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Total Value */}
      <div className="mt-3 pt-3 border-t text-center">
        <span className="text-sm text-muted-foreground">Tổng giá trị giao dịch: </span>
        <span className="text-lg font-bold text-foreground">{total.toFixed(1)} nghìn tỷ VNĐ</span>
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
          Phân bổ dòng tiền
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Giá trị giao dịch theo xu hướng giá
        </p>
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
}
