"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FScoreData {
  id: number;
  ticker: string;
  scores: {
    [year: string]: number;
  };
  metrics: {
    roa: number;
    cfo: number;
    delta_roa: number;
    cfo_lnst: number;
    delta_long_term_debt: number;
    delta_current_ratio: number;
    shares_issued: number;
    delta_gross_margin: number;
    delta_asset_turnover: number;
  };
  criteria: {
    roa_positive: boolean;
    cfo_positive: boolean;
    delta_roa_positive: boolean;
    cfo_greater_than_ni: boolean;
    delta_debt_negative: boolean;
    delta_current_ratio_positive: boolean;
    no_new_shares: boolean;
    delta_gross_margin_positive: boolean;
    delta_asset_turnover_positive: boolean;
  };
  updated_at: string;
}

interface FScoreChartProps {
  ticker: string;
  className?: string;
}

// F-Score categories
const getFScoreCategory = (score: number) => {
  if (score >= 8) {
    return { 
      label: 'Xuất sắc', 
      color: '#16a34a', // green-600
      icon: CheckCircle2,
      description: 'Tình hình tài chính rất tốt'
    };
  } else if (score >= 7) {
    return { 
      label: 'Tốt', 
      color: '#22c55e', // green-500
      icon: TrendingUp,
      description: 'Tình hình tài chính tốt'
    };
  } else if (score >= 5) {
    return { 
      label: 'Trung bình', 
      color: '#f59e0b', // amber-500
      icon: AlertCircle,
      description: 'Tình hình tài chính ổn định'
    };
  } else if (score >= 3) {
    return { 
      label: 'Yếu', 
      color: '#fb923c', // orange-400
      icon: TrendingDown,
      description: 'Cần cải thiện tình hình tài chính'
    };
  } else {
    return { 
      label: 'Kém', 
      color: '#dc2626', // red-600
      icon: XCircle,
      description: 'Tình hình tài chính yếu kém'
    };
  }
};

// Criteria labels in Vietnamese
const criteriaLabels = {
  roa_positive: 'ROA dương',
  cfo_positive: 'Dòng tiền hoạt động dương',
  delta_roa_positive: 'ROA tăng',
  cfo_greater_than_ni: 'Dòng tiền > Lợi nhuận',
  delta_debt_negative: 'Nợ dài hạn giảm',
  delta_current_ratio_positive: 'Tỷ lệ thanh toán tăng',
  no_new_shares: 'Không phát hành cổ phiếu mới',
  delta_gross_margin_positive: 'Biên lợi nhuận gộp tăng',
  delta_asset_turnover_positive: 'Vòng quay tài sản tăng'
};

// Criteria groups
const criteriaGroups = {
  'Khả năng sinh lời': ['roa_positive', 'cfo_positive', 'delta_roa_positive', 'cfo_greater_than_ni'],
  'Đòn bẩy & Thanh khoản': ['delta_debt_negative', 'delta_current_ratio_positive', 'no_new_shares'],
  'Hiệu quả hoạt động': ['delta_gross_margin_positive', 'delta_asset_turnover_positive']
};

export default function FScoreChart({ ticker, className }: FScoreChartProps) {
  const [data, setData] = useState<FScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFScoreData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies/${ticker}/f-score`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch F-Score data');
        }

        const fscoreData = await response.json();
        setData(fscoreData);
      } catch (err) {
        console.error('Error fetching F-Score:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchFScoreData();
    }
  }, [ticker]);

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Biểu đồ F-Score</CardTitle>
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
          <CardTitle className="text-lg font-semibold">Biểu đồ F-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Không có dữ liệu F-Score
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get current score (latest year)
  const years = Object.keys(data.scores).sort();
  const currentYear = years[years.length - 1];
  const currentScore = data.scores[currentYear];
  const currentCategory = getFScoreCategory(currentScore);
  const IconComponent = currentCategory.icon;

  // Prepare historical data
  const historicalScores = years.map(year => ({
    year,
    score: data.scores[year]
  }));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Biểu đồ F-Score (Piotroski)</CardTitle>
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
          {/* Horizontal Bar Chart - Similar to Z-Score */}
          <div className="space-y-3">
            {historicalScores.reverse().map((item) => {
              const category = getFScoreCategory(item.score);
              const barWidth = (item.score / 9) * 100;
              
              return (
                <div key={item.year} className="relative">
                  {/* Year label */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.year}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.score}/9
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
                          width: `${(2 / 9) * 100}%` 
                        }}
                      />
                      <div 
                        className="opacity-10"
                        style={{ 
                          backgroundColor: '#fb923c',
                          width: `${(2 / 9) * 100}%` 
                        }}
                      />
                      <div 
                        className="opacity-10"
                        style={{ 
                          backgroundColor: '#f59e0b',
                          width: `${(2 / 9) * 100}%` 
                        }}
                      />
                      <div 
                        className="opacity-10"
                        style={{ 
                          backgroundColor: '#22c55e',
                          width: `${(1 / 9) * 100}%` 
                        }}
                      />
                      <div 
                        className="opacity-10 flex-1"
                        style={{ 
                          backgroundColor: '#16a34a'
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
                <span>Kém (0-2)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fb923c' }} />
                <span>Yếu (3-4)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
                <span>TB (5-6)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
                <span>Tốt (7)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#16a34a' }} />
                <span>Xuất sắc (8-9)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
