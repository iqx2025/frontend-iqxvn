
import ForecastOverview from "@/components/business/forecast";
import VNIndexChart from "@/components/data-display/vnindex-chart";
import ForeignTradingChart from "@/components/data-display/foreign-trading-chart";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* VN-Index Chart Section */}
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

      {/* Foreign Trading Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Biểu đồ thị trường
          </h2>
          <p className="text-muted-foreground">
            Theo dõi hoạt động giao dịch của khối ngoại trên thị trường chứng khoán
          </p>
        </div>
        <ForeignTradingChart />
      </section>

      {/* Forecast Section */}
      <section>
        <ForecastOverview />
      </section>
    </div>
  );
}