'use client';

import MarketSentimentDashboardV2 from '@/components/data-display/market-sentiment-dashboard-v2';

export default function SentimentDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">

      <MarketSentimentDashboardV2
        useMock={true}
        enableRealtime={false}
        refreshInterval={0}
      />
    </div>
  );
}
