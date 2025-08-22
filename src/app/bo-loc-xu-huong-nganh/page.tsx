/**
 * Industry Trend Filter Page
 * Server-side rendered page for displaying industry trend data
 */

import { Metadata } from 'next';
import { IndustryTrendService } from '@/services/industryTrendService';
import { IndustryTrendTable } from '@/components/business/IndustryTrendTable';
import { IndustryTrendData } from '@/types/industryTrend';

export const metadata: Metadata = {
  title: 'Bộ lọc xu hướng ngành | IQX Vietnam Stock Express',
  description: 'Phân tích xu hướng ngành với dữ liệu RRG, Beta, khối lượng giao dịch và hiệu suất đầu tư của các mã chứng khoán Việt Nam',
  keywords: 'xu hướng ngành, RRG, Beta, phân tích kỹ thuật, chứng khoán Việt Nam, IQX',
  openGraph: {
    title: 'Bộ lọc xu hướng ngành - IQX',
    description: 'Công cụ phân tích xu hướng ngành chứng khoán Việt Nam',
    type: 'website',
  },
};

/**
 * Industry Trend Filter Page Component
 */
export default async function IndustryTrendPage() {
  let initialData: IndustryTrendData | undefined;
  let error: string | null = null;

  try {
    // Fetch initial data server-side for SSR
    initialData = await IndustryTrendService.fetchIndustryTrendDataServerSide();
  } catch (err) {
    console.error('Failed to fetch initial industry trend data:', err);
    error = err instanceof Error ? err.message : 'Không thể tải dữ liệu ban đầu';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bộ lọc xu hướng ngành
        </h1>
        <p className="text-muted-foreground">
          Phân tích xu hướng ngành với các chỉ số RRG (Relative Rotation Graph), 
          Beta, khối lượng giao dịch và hiệu suất đầu tư
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
        /* Industry Trend Table */
        <IndustryTrendTable initialData={initialData} />
      )}

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">Pha RRG</h3>
          <p className="text-xs text-muted-foreground">
            Chỉ báo vị trí của cổ phiếu trong chu kỳ xoay vòng tương đối
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium text-green-500">Tăng giá:</span> Động lượng mạnh</li>
            <li><span className="font-medium text-yellow-500">Tích lũy:</span> Chuẩn bị tăng</li>
            <li><span className="font-medium text-red-500">Giảm giá:</span> Động lượng yếu</li>
            <li><span className="font-medium text-gray-500">Phân phối:</span> Chuẩn bị giảm</li>
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">Hệ số Beta</h3>
          <p className="text-xs text-muted-foreground">
            Đo lường mức độ biến động của cổ phiếu so với thị trường
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium">Beta &gt; 1:</span> Biến động cao hơn thị trường</li>
            <li><span className="font-medium">Beta = 1:</span> Biến động như thị trường</li>
            <li><span className="font-medium">Beta &lt; 1:</span> Biến động thấp hơn thị trường</li>
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">Khối lượng giao dịch</h3>
          <p className="text-xs text-muted-foreground">
            So sánh khối lượng hiện tại với trung bình
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium">KL TB 1W:</span> Trung bình 1 tuần</li>
            <li><span className="font-medium">KL TB 1M:</span> Trung bình 1 tháng</li>
            <li>Khối lượng cao báo hiệu sự quan tâm của nhà đầu tư</li>
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-sm">Hiệu suất đầu tư</h3>
          <p className="text-xs text-muted-foreground">
            Tỷ suất sinh lời trong các khung thời gian
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li><span className="font-medium">% 1D:</span> Thay đổi trong 1 ngày</li>
            <li><span className="font-medium">% 1W:</span> Thay đổi trong 1 tuần</li>
            <li><span className="font-medium">% 1M:</span> Thay đổi trong 1 tháng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
