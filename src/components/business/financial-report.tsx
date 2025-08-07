"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  FileBarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinancialData } from '@/hooks/useFinancialData';
import { FinancialReportProps, FinancialReportData } from '@/types/financial';
import { formatFinancialAmount, formatFinancialDate, getFinancialChangeColor } from '@/utils/formatters';
import FinancialTableWithPeriodToggle from '@/components/data-display/financial-table-with-period-toggle';

// Statistics Overview Component
const FinancialStatsOverview: React.FC<{
  data: FinancialReportData;
}> = ({ data }) => {
  if (!data?.sections) return null;

  // Extract key metrics from income statement
  const incomeStatement = data.sections.incomeStatement;
  
  // Find key metrics
  const netIncome = incomeStatement.items.find(item => item.field === 'isa20');
  const totalRevenue = incomeStatement.items.find(item => item.field === 'isb38');
  const netInterestIncome = incomeStatement.items.find(item => item.field === 'isb27');
  const eps = incomeStatement.items.find(item => item.field === 'isa23');

  const stats = [
    {
      title: 'Lợi nhuận sau thuế',
      value: netIncome?.latestValue,
      change: netIncome?.change,
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Tổng thu nhập hoạt động',
      value: totalRevenue?.latestValue,
      change: totalRevenue?.change,
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'Thu nhập lãi thuần',
      value: netInterestIncome?.latestValue,
      change: netInterestIncome?.change,
      icon: PieChart,
      color: 'purple'
    },
    {
      title: 'EPS (VND)',
      value: eps?.latestValue,
      change: eps?.change,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const changeColor = getFinancialChangeColor(stat.change);
        
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                stat.color === 'blue' && "bg-blue-100 dark:bg-blue-900/20",
                stat.color === 'green' && "bg-green-100 dark:bg-green-900/20",
                stat.color === 'purple' && "bg-purple-100 dark:bg-purple-900/20",
                stat.color === 'orange' && "bg-orange-100 dark:bg-orange-900/20"
              )}>
                <IconComponent className={cn(
                  "h-5 w-5",
                  stat.color === 'blue' && "text-blue-600 dark:text-blue-400",
                  stat.color === 'green' && "text-green-600 dark:text-green-400",
                  stat.color === 'purple' && "text-purple-600 dark:text-purple-400",
                  stat.color === 'orange' && "text-orange-600 dark:text-orange-400"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                <p className="text-lg font-bold truncate">
                  {stat.value !== null ? formatFinancialAmount(stat.value) : 'N/A'}
                </p>
                {stat.change !== null && stat.change !== undefined && stat.change !== 0 && (
                  <div className={cn("flex items-center gap-1 text-xs", changeColor)}>
                    {stat.change > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{formatFinancialAmount(Math.abs(stat.change))}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Loading Skeleton
const FinancialReportSkeleton = () => (
  <div className="p-6">
    {/* Stats Overview Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Tabs Skeleton */}
    <div className="space-y-4">
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>

      {/* Content Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-7 gap-4 p-3 bg-muted/30 rounded">
              <Skeleton className="h-4 w-32" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
              <Skeleton className="h-4 w-20" />
            </div>
            {/* Table rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-7 gap-4 p-3 border-b">
                <Skeleton className="h-4 w-40" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-4 w-16" />
                ))}
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function FinancialReport({ ticker, className }: FinancialReportProps) {
  const { data, loading, error, refetch } = useFinancialData(ticker);
  const [activeTab, setActiveTab] = useState("income-statement");

  if (loading) {
    return <FinancialReportSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{error || 'Không có dữ liệu báo cáo tài chính'}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 mt-6", className)}>
      {/* Statistics Overview */}
      <FinancialStatsOverview data={data} />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income-statement" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">KQKD</span>
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">CĐKT</span>
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">LCTT</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileBarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Thuyết minh</span>
          </TabsTrigger>
        </TabsList>

        {/* Income Statement Tab */}
        <TabsContent value="income-statement" className="mt-6">
          <FinancialTableWithPeriodToggle
            ticker={ticker}
            section="INCOME_STATEMENT"
            title="Báo cáo kết quả kinh doanh"
          />
        </TabsContent>

        {/* Balance Sheet Tab */}
        <TabsContent value="balance-sheet" className="mt-6">
          <FinancialTableWithPeriodToggle
            ticker={ticker}
            section="BALANCE_SHEET"
            title="Bảng cân đối kế toán"
          />
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cash-flow" className="mt-6">
          <FinancialTableWithPeriodToggle
            ticker={ticker}
            section="CASH_FLOW"
            title="Báo cáo lưu chuyển tiền tệ"
          />
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <FinancialTableWithPeriodToggle
            ticker={ticker}
            section="NOTE"
            title="Thuyết minh báo cáo tài chính"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
