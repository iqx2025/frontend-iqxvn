"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZScoreData {
  ticker: string;
  "2024Y"?: number;
  "2023Y"?: number;
  "2022Y"?: number;
  "2021Y"?: number;
  "2020Y"?: number;
  id: number;
  updated_at: string;
}

interface ZScoreChartProps {
  ticker: string;
  className?: string;
}

// Z-Score categories (scaled to 0-10)
const getZScoreCategory = (score: number | undefined) => {
  if (!score) return { label: 'N/A', color: '#6b7280', icon: null, description: '' };
  
  if (score >= 0 && score < 3) {
    return { 
      label: 'Cần lưu ý', 
      color: '#dc2626', // red
      icon: AlertTriangle,
      description: 'Rủi ro phá sản cao'
    };
  } else if (score >= 3 && score < 6) {
    return { 
      label: 'Trung bình', 
      color: '#f59e0b', // amber
      icon: TrendingUp,
      description: 'Có dấu hiệu cảnh báo'
    };
  } else {
    return { 
      label: 'An toàn', 
      color: '#22c55e', // green
      icon: Shield,
      description: 'Tình hình tài chính tốt'
    };
  }
};

export default function ZScoreChart({ ticker, className }: ZScoreChartProps) {
  const [data, setData] = useState<ZScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZScoreData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies/${ticker}/z-score`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Z-Score data');
        }

        const zscoreData = await response.json();
        setData(zscoreData);
      } catch (err) {
        console.error('Error fetching Z-Score:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchZScoreData();
    }
  }, [ticker]);

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Biểu đồ Z-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Biểu đồ Z-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Không có dữ liệu Z-Score
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const years = ['2020', '2021', '2022', '2023', '2024'];
  const scores = years.map(year => ({
    year,
    score: data[`${year}Y` as keyof ZScoreData] as number | undefined
  })).filter(item => item.score !== undefined);

  // Get current year score (latest available)
  const currentScore = data["2024Y"] || data["2023Y"] || data["2022Y"];
  const currentCategory = getZScoreCategory(currentScore);
  const IconComponent = currentCategory.icon;

  // Use fixed scale 0-10 for consistency
  const maxScore = 10;
  const chartHeight = 250;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Biểu đồ Z-Score</CardTitle>
          {IconComponent && (
            <div className="flex items-center gap-2">
              <IconComponent 
                className="h-5 w-5" 
                style={{ color: currentCategory.color }}
              />
              <span 
                className="text-sm font-medium"
                style={{ color: currentCategory.color }}
              >
                {currentCategory.label}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {/* Horizontal Bar Chart */}
          <div className="space-y-3">
            {scores.reverse().map((item) => {
              const category = getZScoreCategory(item.score);
              const barWidth = ((item.score || 0) / maxScore) * 100;
              
              return (
                <div key={item.year} className="relative">
                  {/* Year label */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.year}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.score?.toFixed(2)}/10
                    </span>
                  </div>
                  
                  {/* Bar background */}
                  <div className="relative h-8 bg-muted rounded overflow-hidden">
                    {/* Score zones background */}
                    <div className="absolute inset-0 flex">
                      <div 
                        className="opacity-10"
                        style={{ 
                          backgroundColor: '#dc2626',
                          width: '30%' // 0-3 on 0-10 scale = 30%
                        }}
                      />
                      <div 
                        className="opacity-10"
                        style={{ 
                          backgroundColor: '#f59e0b',
                          width: '30%' // 3-6 on 0-10 scale = 30%
                        }}
                      />
                      <div 
                        className="opacity-10 flex-1"
                        style={{ 
                          backgroundColor: '#22c55e' // 6-10 on 0-10 scale = 40%
                        }}
                      />
                    </div>
                    
                    {/* Actual bar */}
                    <div
                      className="absolute inset-y-0 left-0 flex items-center justify-end px-2 text-white text-sm font-semibold transition-all duration-500"
                      style={{
                        backgroundColor: category.color,
                        width: `${barWidth}%`,
                        minWidth: '60px'
                      }}
                    >
                      {category.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }} />
                <span>Cần lưu ý (0-3)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
                <span>Trung bình (3-6)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
                <span>An toàn (6-10)</span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
