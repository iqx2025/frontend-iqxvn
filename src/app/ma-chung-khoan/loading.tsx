/**
 * Loading UI for the stock market page
 * Follows Next.js 14+ App Router conventions
 */

import { Card, CardContent } from '@/components/ui/card';
import { MarketOverview } from '@/components/data-display/market-overview';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mã chứng khoán
        </h1>
        <p className="text-muted-foreground">
          Tìm kiếm và theo dõi mã chứng khoán Việt Nam
        </p>
      </div>

      {/* Loading State */}
      <div className="space-y-6">
        {/* Market Overview Loading */}
        <MarketOverview stats={null} loading={true} />

        {/* Filters Loading */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Tabs Loading */}
        <div className="flex gap-2 border-b">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-10 bg-muted rounded-t-md animate-pulse"></div>
          ))}
        </div>

        {/* Table Loading */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
