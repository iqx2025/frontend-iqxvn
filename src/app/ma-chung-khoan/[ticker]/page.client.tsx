"use client"

import { use } from "react";
import StockBusinessProfile from "@/components/business/stock-business-profile";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { ErrorDisplayWithAction } from "@/components/feedback/error-display";
import { TickerPageProps } from "@/types/stock";
import { useTickerData } from "@/hooks/useTickerData";

/**
 * Client-side version of the ticker page
 * Use this if you need client-side features like real-time updates
 * 
 * To use this version, rename this file to page.tsx and rename
 * the current page.tsx to page.server.tsx
 */
export default function TickerPageClient({ params }: TickerPageProps) {
  const resolvedParams = use(params);
  const { ticker } = resolvedParams;

  // Use custom hook for data fetching and state management
  const { data: stockData, loading, error, refetch } = useTickerData(ticker);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <ErrorDisplayWithAction
        message={error}
        onAction={refetch}
        actionLabel="Thử lại"
      />
    );
  }

  if (!stockData) {
    return (
      <ErrorDisplayWithAction
        message="Không tìm thấy dữ liệu công ty"
        onAction={refetch}
        actionLabel="Tải lại"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Combined Stock Profile and Business Information */}
      <StockBusinessProfile
        ticker={ticker.toUpperCase()}
        summary={stockData}
        className="mb-8"
      />

      {/* Placeholder for additional sections */}
      <div className="text-center text-gray-500 py-8">
        <p>Các section khác sẽ được thêm vào đây...</p>
      </div>
    </div>
  );
}
