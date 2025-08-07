"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChartData } from '@/types/shareholders';
import { formatPercentage } from '@/utils/formatters';

interface OwnershipPieChartProps {
  data: PieChartData[];
  className?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Tỷ lệ: <span className="font-medium">{formatPercentage(data.value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

const CustomLegend = ({ payload }: LegendProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RADIAN = Math.PI / 180;
interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: LabelProps) => {
  // Check if all required properties are available
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is significant enough
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function OwnershipPieChart({ data, className }: OwnershipPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Biểu đồ cơ cấu sở hữu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Không có dữ liệu để hiển thị
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Biểu đồ cơ cấu sở hữu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tổng số loại:</span>
              <span className="ml-2 font-medium">{data.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tổng tỷ lệ:</span>
              <span className="ml-2 font-medium">
                {formatPercentage(data.reduce((sum, item) => sum + item.value, 0))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
