"use client";

import React, { useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Users, FileText } from 'lucide-react';
import StockPriceChart from '@/components/data-display/stock-price-chart';
import TechnicalAnalysisComponent from '@/components/business/technical-analysis';
import ShareholdersAnalysis from '@/components/business/shareholders-analysis';
import FinancialReport from '@/components/business/financial-report';
import ScoreContent from '../score-content';

interface StockAnalysisTabsProps {
  ticker: string;
  className?: string;
}

// Skeleton for price chart
const ChartSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Chart header skeleton */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>

    {/* Chart area skeleton */}
    <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
      <Skeleton className="h-[400px] w-full" />
    </div>

    {/* Chart controls skeleton */}
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

// Skeleton for technical analysis
const TechnicalAnalysisSkeleton = () => (
  <div className="bg-background p-6 space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>

    {/* Gauges skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Semicircle gauge skeleton */}
            <div className="relative">
              <Skeleton className="h-24 w-48" />
              <div className="absolute inset-0 flex items-end justify-center pb-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
            <div className="flex justify-center space-x-8">
              {[1, 2, 3].map((j) => (
                <div key={j} className="text-center">
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Tables skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
              <div key={j} className="grid grid-cols-3 gap-4 p-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for shareholders analysis
const ShareholdersSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex justify-between items-center p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for financial report
const FinancialReportSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Stats Overview Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
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
      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-4 space-y-3">
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
      </div>
    </div>
  </div>
);

export default function StockAnalysisTabsComponent({ ticker }: StockAnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState("chart");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
      {/* Tab Navigation */}
      <TabsList className="w-full grid grid-cols-5 gap-1 overflow-x-auto sm:overflow-visible">
        <TabsTrigger value="chart" className="flex-none whitespace-nowrap px-4 py-2">
          <TrendingUp className="h-4 w-4" />
          Biểu đồ giá
        </TabsTrigger>
        <TabsTrigger value="technical" className="flex-none whitespace-nowrap px-4 py-2">
          <BarChart3 className="h-4 w-4" />
          Phân tích kỹ thuật
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex-none whitespace-nowrap px-4 py-2">
          <FileText className="h-4 w-4" />
          Báo cáo tài chính
        </TabsTrigger>


        <TabsTrigger value="score" className="flex-none whitespace-nowrap px-4 py-2">
          <FileText className="h-4 w-4" />
          Mô hình SCORE
        </TabsTrigger>
        <TabsTrigger value="shareholders" className="flex-none whitespace-nowrap px-4 py-2">
          <Users className="h-4 w-4" />
          Cổ đông
        </TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <TabsContent value="chart" className="mt-0">
        <Suspense fallback={<ChartSkeleton />}>
          <StockPriceChart
            ticker={ticker}
            height={400}
            className="w-full"
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="technical" className="mt-0">
        <Suspense fallback={<TechnicalAnalysisSkeleton />}>
          <TechnicalAnalysisComponent
            ticker={ticker}
            className="border-0 bg-transparent"
          />
        </Suspense>
      </TabsContent>



      <TabsContent value="score" className="mt-0">
        <Suspense fallback={<TechnicalAnalysisSkeleton />}>
          <ScoreContent
            ticker={ticker}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="financial" className="mt-0">
        <Suspense fallback={<FinancialReportSkeleton />}>
          <FinancialReport
            ticker={ticker}
            className="border-0 bg-transparent"
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="shareholders" className="mt-0">
        <Suspense fallback={<ShareholdersSkeleton />}>
          <ShareholdersAnalysis
            ticker={ticker}
            className="border-0 bg-transparent"
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
