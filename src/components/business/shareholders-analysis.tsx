"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  PieChart,
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShareholdersData } from '@/hooks/useShareholdersData';
import { ShareholdersService } from '@/services/shareholdersService';
import OwnershipPieChart from '@/components/data-display/ownership-pie-chart';
import ShareholdersTable from '@/components/data-display/shareholders-table';
import FundHoldingsTable from '@/components/data-display/fund-holdings-table';
import type { OwnershipBreakdown, ShareholderDetail, FundHolding } from '@/types/shareholders';
import { formatNumber, formatPercentage } from '@/utils/formatters';

interface ShareholdersAnalysisProps {
  ticker: string;
  className?: string;
}

// Statistics Overview Component
const StatsOverview: React.FC<{
  shareholderDetails: ShareholderDetail[],
  fundHoldings: FundHolding[]
}> = ({ shareholderDetails, fundHoldings }) => {
  const stats = ShareholdersService.calculateOwnershipStats(shareholderDetails);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng cổ đông</p>
            <p className="text-xl font-bold">{stats.totalShareholders}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tỷ lệ nắm giữ</p>
            <p className="text-xl font-bold">{formatPercentage(stats.totalPercentage)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quỹ đầu tư</p>
            <p className="text-xl font-bold">{fundHoldings.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thay đổi (+)</p>
            <p className="text-xl font-bold text-green-600">{stats.positiveChanges}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Compact Ownership Breakdown
const CompactOwnershipBreakdown: React.FC<{ data: OwnershipBreakdown[] }> = ({ data }) => (
  <Card className="h-fit">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        Cơ cấu sở hữu
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
            <span className="font-medium text-sm">{item.investorType}</span>
            <Badge variant="default" className="font-semibold">
              {item.pctOfSharesOutHeldTier}%
            </Badge>
          </div>
          {item.children && item.children.filter(child => child.pctOfSharesOutHeldTier > 0).map((child, childIndex) => (
            <div key={childIndex} className="flex justify-between items-center pl-6 pr-3 py-2 text-sm border-l-2 border-muted ml-3">
              <span className="text-muted-foreground">{child.investorType}</span>
              <span className="font-medium">{child.pctOfSharesOutHeldTier}%</span>
            </div>
          ))}
        </div>
      ))}
    </CardContent>
  </Card>
);

// Top Shareholders Compact View
const TopShareholdersCompact: React.FC<{ data: ShareholderDetail[] }> = ({ data }) => {
  const topShareholders = data.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Top cổ đông
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topShareholders.map((shareholder, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">#{index + 1}</span>
                <span className="font-medium text-sm truncate">{shareholder.investorFullName}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatNumber(shareholder.sharesHeld)} CP</span>
                <Badge variant="outline" className="text-xs">{shareholder.countryOfInvestor}</Badge>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="font-semibold mb-1">
                {formatPercentage(shareholder.pctOfSharesOutHeld)}
              </Badge>
              {shareholder.changeValue !== 0 && (
                <div className={cn(
                  "flex items-center justify-end gap-1 text-xs",
                  shareholder.changeValue > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {shareholder.changeValue > 0 ?
                    <TrendingUp className="h-3 w-3" /> :
                    <TrendingDown className="h-3 w-3" />
                  }
                  <span>{formatNumber(Math.abs(shareholder.changeValue))}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const ShareholdersSkeleton = () => (
  <div className="p-6">
    {/* Stats Overview Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Tabs Skeleton */}
    <div className="space-y-4">
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="ml-6 space-y-1">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex justify-between items-center p-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Fund Holdings Highlight Component
const FundHoldingsHighlight: React.FC<{ data: FundHolding[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Quỹ đầu tư nắm giữ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có quỹ đầu tư nào nắm giữ</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Quỹ đầu tư nắm giữ ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((fund) => (
          <div key={fund.fundId} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <Image
                src={fund.imageUrl}
                alt={fund.issuer}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-white text-xs font-bold">${fund.issuer.charAt(0)}</span>`;
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{fund.fundName}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">{fund.fundCode}</Badge>
                <span>•</span>
                <span>{fund.issuer}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{formatNumber(fund.sharesHeld)}</div>
              <div className="text-xs text-muted-foreground">
                {formatPercentage(fund.pctPortfolio)} danh mục
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function ShareholdersAnalysis({ ticker, className }: ShareholdersAnalysisProps) {
  const { data, loading, error } = useShareholdersData(ticker);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return <ShareholdersSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{error || 'Không có dữ liệu cổ đông'}</p>
      </div>
    );
  }

  // Transform data for pie chart
  const pieChartData = ShareholdersService.transformToPieChartData(data.ownershipBreakdown);

  return (
    <div className={cn("space-y-6 mt-6", className)}>
      {/* Statistics Overview */}
      <StatsOverview
        shareholderDetails={data.shareholderDetails}
        fundHoldings={data.fundHoldings}
      />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="shareholders" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Cổ đông
          </TabsTrigger>
          <TabsTrigger value="funds" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Quỹ đầu tư
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <OwnershipPieChart data={pieChartData} />

            {/* Compact Ownership Breakdown */}
            <CompactOwnershipBreakdown data={data.ownershipBreakdown} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Top Shareholders */}
            <TopShareholdersCompact data={data.shareholderDetails} />

            {/* Fund Holdings Highlight */}
            <FundHoldingsHighlight data={data.fundHoldings} />
          </div>
        </TabsContent>

        {/* Shareholders Tab */}
        <TabsContent value="shareholders" className="mt-6">
          <ShareholdersTable data={data.shareholderDetails} />
        </TabsContent>

        {/* Funds Tab */}
        <TabsContent value="funds" className="mt-6">
          <FundHoldingsTable data={data.fundHoldings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
