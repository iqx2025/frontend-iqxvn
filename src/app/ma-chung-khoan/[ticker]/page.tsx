import StockBusinessProfile from "@/components/business/stock-business-profile";
import StockAnalysisTabsComponent from "@/components/business/stock-analysis-tabs";
import NewsSection from "@/components/business/news-section";
import ZScoreChart from "@/components/business/z-score-chart";
import FScoreChart from "@/components/business/f-score-chart";
import FScoreDetails from "@/components/business/f-score-details";
import { ErrorDisplay } from "@/components/feedback/error-display";
import { TickerPageProps } from "@/types/stock";
import { ServerApiService } from "@/services/serverApiService";
import { notFound } from "next/navigation";

export default async function TickerPage({ params }: TickerPageProps) {
  const { ticker } = await params;

  try {
    // Fetch data on the server side using await
    const stockData = await ServerApiService.getCompanyData(ticker);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Combined Stock Profile and Business Information */}
        <StockBusinessProfile
          ticker={ticker.toUpperCase()}
          summary={stockData}
          className="mb-8"
        />

        {/* Financial Health Scores Section */}
        <section className="mb-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Biểu đồ Z-Score */}
            <ZScoreChart ticker={ticker.toUpperCase()} />
            
            {/* Biểu đồ F-Score */}
            <FScoreChart ticker={ticker.toUpperCase()} />
          </div>
        </section>

        {/* F-Score Details Section */}
        <section className="mb-8">
          <FScoreDetails ticker={ticker.toUpperCase()} />
        </section>

        {/* Stock Analysis Tabs */}
        <StockAnalysisTabsComponent
          ticker={ticker.toUpperCase()}
          className="mb-8"
        />


        {/* News Section */}
        <NewsSection
          ticker={ticker.toUpperCase()}
          className="mb-8"
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading ticker page:', error);

    // Check if it's a 404 error (ticker not found)
    if (error instanceof Error && error.message.includes('404')) {
      notFound();
    }

    // For other errors, show error display
    return (
      <ErrorDisplay
        message={error instanceof Error ? error.message : 'Không thể tải dữ liệu công ty'}
      />
    );
  }

}
