"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

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

interface FScoreDetailsProps {
  ticker: string;
  className?: string;
}

// Short labels for radar chart
const radarLabels: { [key: string]: string } = {
  roa_positive: 'ROA dương',
  cfo_positive: 'Dòng tiền dương',
  delta_roa_positive: 'ROA tăng',
  cfo_greater_than_ni: 'CF > LNST',
  delta_debt_negative: 'Nợ giảm',
  delta_current_ratio_positive: 'Thanh khoản tăng',
  no_new_shares: 'Không phát hành CP',
  delta_gross_margin_positive: 'Biên LN tăng',
  delta_asset_turnover_positive: 'Vòng quay tăng'
};

// Metric formatting helper
const formatMetric = (value: number, type: string): string => {
  if (type === 'percent') {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (type === 'currency') {
    return `${value.toFixed(2)}`;
  }
  if (type === 'number') {
    return value.toFixed(0);
  }
  return value.toFixed(2);
};

export default function FScoreDetails({ ticker, className }: FScoreDetailsProps) {
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
      <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ Radar F-Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết chỉ số F-Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Không có dữ liệu F-Score
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = Object.entries(data.criteria).map(([key, value]) => ({
    criteria: radarLabels[key] || key,
    score: value ? 1 : 0,
    fullMark: 1
  }));

  // Metrics data structure
  const metricsData = [
    {
      category: 'A. KHẢ NĂNG SINH LỜI',
      items: [
        {
          label: 'Tỷ suất lợi nhuận trên tổng tài sản (%)',
          value: formatMetric(data.metrics.roa, 'percent'),
          positive: data.criteria.roa_positive
        },
        {
          label: 'Dòng tiền từ hoạt động kinh doanh (Tỷ VND)',
          value: formatMetric(data.metrics.cfo, 'currency'),
          positive: data.criteria.cfo_positive
        },
        {
          label: 'Tăng trưởng ROA so với năm trước (%)',
          value: formatMetric(data.metrics.delta_roa, 'percent'),
          positive: data.criteria.delta_roa_positive
        },
        {
          label: 'So sánh dòng tiền kinh doanh với LNST (Tỷ VND)',
          value: formatMetric(data.metrics.cfo_lnst, 'currency'),
          positive: data.criteria.cfo_greater_than_ni
        }
      ]
    },
    {
      category: 'B. ĐÒN BẨY VÀ THANH KHOẢN',
      items: [
        {
          label: 'Nợ dài hạn so với năm trước (Tỷ VND)',
          value: formatMetric(data.metrics.delta_long_term_debt, 'currency'),
          positive: data.criteria.delta_debt_negative
        },
        {
          label: 'Biến động hệ số thanh toán ngắn hạn (%)',
          value: formatMetric(data.metrics.delta_current_ratio, 'percent'),
          positive: data.criteria.delta_current_ratio_positive
        },
        {
          label: 'Số lượng CP phát hành thêm (Tr)',
          value: formatMetric(data.metrics.shares_issued, 'number'),
          positive: data.criteria.no_new_shares
        }
      ]
    },
    {
      category: 'C. HIỆU QUẢ HOẠT ĐỘNG',
      items: [
        {
          label: 'Tăng trưởng biên lợi nhuận gộp',
          value: formatMetric(data.metrics.delta_gross_margin, 'percent'),
          positive: data.criteria.delta_gross_margin_positive
        },
        {
          label: 'Tăng trưởng vòng quay tài sản',
          value: formatMetric(data.metrics.delta_asset_turnover, 'percent'),
          positive: data.criteria.delta_asset_turnover_positive
        }
      ]
    }
  ];

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      {/* Radar Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Biểu đồ Radar F-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid 
                gridType="polygon"
                radialLines={true}
                strokeDasharray="3 3"
              />
              <PolarAngleAxis 
                dataKey="criteria"
                tick={{ fontSize: 10 }}
                className="text-xs"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tickCount={2}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="F-Score"
                dataKey="score"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Các tiêu chí đạt được: {Object.values(data.criteria).filter(v => v).length}/9
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Detail Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Chi tiết chỉ số F-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metricsData.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {item.positive ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className={cn(
                        "text-sm font-medium ml-2",
                        item.positive ? "text-green-600" : "text-red-600"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
