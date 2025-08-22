/**
 * Attractive Valuation Filter Page
 * Server-side rendered page for displaying stock valuation data
 */

import { Metadata } from 'next';
import { ValuationService } from '@/services/valuationService';
import { ValuationTable } from '@/components/business/ValuationTable';
import { ValuationData } from '@/types/valuationFilter';

export const metadata: Metadata = {
  title: 'Bộ lọc định giá hấp dẫn | IQX Vietnam Stock Express',
  description: 'Phân tích định giá cổ phiếu với các chỉ số P/E, P/B, ROA, dòng tiền hoạt động và so sánh với ngành',
  keywords: 'định giá cổ phiếu, P/E, P/B, ROA, CFO, phân tích cơ bản, chứng khoán Việt Nam, IQX',
  openGraph: {
    title: 'Bộ lọc định giá hấp dẫn - IQX',
    description: 'Công cụ tìm kiếm cổ phiếu định giá hấp dẫn trên thị trường chứng khoán Việt Nam',
    type: 'website',
  },
};

/**
 * Attractive Valuation Filter Page Component
 */
export default async function ValuationFilterPage() {
  let initialData: ValuationData | undefined;
  let error: string | null = null;

  try {
    // Fetch initial data server-side for SSR
    initialData = await ValuationService.fetchValuationDataServerSide();
  } catch (err) {
    console.error('Failed to fetch initial valuation data:', err);
    error = err instanceof Error ? err.message : 'Không thể tải dữ liệu ban đầu';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bộ lọc định giá hấp dẫn
        </h1>
        <p className="text-muted-foreground">
          Tìm kiếm cổ phiếu có định giá hấp dẫn dựa trên các chỉ số P/E, P/B, ROA, 
          dòng tiền hoạt động và so sánh với trung bình ngành
        </p>
      </div>

      {/* Error State */}
      {error && !initialData ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <h3 className="font-semibold mb-1">Lỗi tải dữ liệu</h3>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">
            Vui lòng tải lại trang hoặc thử lại sau.
          </p>
        </div>
      ) : (
        /* Valuation Table */
        <ValuationTable initialData={initialData} />
      )}

      {/* Metric Explanation Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* P/E Ratio Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">P/E</span> - Tỷ lệ giá/lợi nhuận
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Đo lường giá cổ phiếu so với lợi nhuận mỗi cổ phần
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">P/E thấp:</span> Có thể định giá thấp</li>
            <li><span className="font-medium">P/E = 15-20:</span> Mức trung bình</li>
            <li><span className="font-medium text-red-500">P/E cao:</span> Kỳ vọng tăng trưởng cao</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> So sánh với P/E ngành để đánh giá chính xác
            </li>
          </ul>
        </div>

        {/* P/B Ratio Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">P/B</span> - Tỷ lệ giá/giá trị sổ sách
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            So sánh giá thị trường với giá trị tài sản ròng
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">P/B &lt; 1:</span> Giao dịch dưới giá trị sổ sách</li>
            <li><span className="font-medium">P/B = 1-3:</span> Mức hợp lý cho nhiều ngành</li>
            <li><span className="font-medium text-red-500">P/B &gt; 3:</span> Có thể định giá cao</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> Phù hợp với ngành tài sản nặng
            </li>
          </ul>
        </div>

        {/* ROA Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">ROA</span> - Tỷ suất sinh lời/tài sản
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Hiệu quả sử dụng tài sản để tạo lợi nhuận
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">ROA &gt; 15%:</span> Hiệu quả xuất sắc</li>
            <li><span className="font-medium">ROA 5-15%:</span> Mức khá tốt</li>
            <li><span className="font-medium text-red-500">ROA &lt; 5%:</span> Cần cải thiện</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> So sánh với cùng ngành
            </li>
          </ul>
        </div>

        {/* CFO Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">CFO</span> - Dòng tiền hoạt động
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Tiền thực tế từ hoạt động kinh doanh chính
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">CFO dương:</span> Tạo tiền từ kinh doanh</li>
            <li><span className="font-medium">CFO &gt; Lợi nhuận:</span> Chất lượng lợi nhuận tốt</li>
            <li><span className="font-medium text-red-500">CFO âm:</span> Cảnh báo vấn đề thanh khoản</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> Quan trọng với đánh giá bền vững
            </li>
          </ul>
        </div>

        {/* Gross Margin Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">Biên LN gộp</span> - Gross Margin
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Tỷ lệ lợi nhuận gộp trên doanh thu
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">&gt; 40%:</span> Lợi thế cạnh tranh mạnh</li>
            <li><span className="font-medium">20-40%:</span> Mức trung bình</li>
            <li><span className="font-medium text-red-500">&lt; 20%:</span> Cạnh tranh khốc liệt</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> Phản ánh sức mạnh định giá
            </li>
          </ul>
        </div>

        {/* Asset Turnover Card */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <span className="text-primary">Vòng quay TS</span> - Asset Turnover
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Hiệu quả tạo doanh thu từ tài sản
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">Cao:</span> Sử dụng tài sản hiệu quả</li>
            <li><span className="font-medium">Trung bình:</span> Tùy thuộc ngành</li>
            <li><span className="font-medium text-red-500">Thấp:</span> Tài sản chưa tối ưu</li>
            <li className="pt-1 border-t">
              <span className="font-medium">💡 Lưu ý:</span> Kết hợp với ROA để đánh giá
            </li>
          </ul>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📊 Hướng dẫn sử dụng bộ lọc
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>
            <span className="font-medium">1. Tìm cổ phiếu định giá thấp:</span> Lọc P/E và P/B thấp hơn trung bình ngành
          </li>
          <li>
            <span className="font-medium">2. Đánh giá chất lượng:</span> Kiểm tra ROA &gt; 10% và CFO dương
          </li>
          <li>
            <span className="font-medium">3. So sánh ngành:</span> Luôn so sánh với các chỉ số trung bình ngành
          </li>
          <li>
            <span className="font-medium">4. Kết hợp chỉ số:</span> Không dựa vào một chỉ số duy nhất để quyết định
          </li>
          <li>
            <span className="font-medium">5. Theo dõi xu hướng:</span> Quan sát sự thay đổi của các chỉ số theo thời gian
          </li>
        </ul>
      </div>
    </div>
  );
}
