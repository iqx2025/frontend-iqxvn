'use client';

import MarketLeaders from "@/components/business/market-leaders";
import VNIndexChart from "@/components/data-display/vnindex-chart";
import ForeignTradingChart from "@/components/data-display/foreign-trading-chart";
import { MarketSentimentDashboardV2 } from "@/components/data-display";
import SentimentGaugeVNINDEX from "@/components/data-display/sentiment-gauge-vn-index";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Chỉ số thị trường
          </h2>
          <p className="text-muted-foreground">
            Theo dõi diễn biến chỉ số VN-Index theo thời gian thực
          </p>
        </div>
        <VNIndexChart height={350} />
      </section>



      <section>
        <SentimentGaugeVNINDEX />
      </section>


      {/* Market Leaders Section */}
      <section>

        <div className="grid lg:grid-cols-2 gap-8">
          <MarketLeaders />

          <ForeignTradingChart />
        </div>
      </section>



      <section>
        <MarketSentimentDashboardV2
          useMock={true}
          enableRealtime={false}
          refreshInterval={0}
        />
      </section>

    </div>
  );
}