import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";

/**
 * Not found page for ticker routes
 * Displayed when a ticker symbol is not found
 */
export default function TickerNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Không tìm thấy mã chứng khoán
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mã chứng khoán bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/ma-chung-khoan" className="inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/tim-kiem" className="inline-flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm khác
              </Link>
            </Button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Gợi ý:</p>
            <ul className="mt-2 space-y-1">
              <li>• Kiểm tra lại chính tả mã chứng khoán</li>
              <li>• Thử tìm kiếm bằng tên công ty</li>
              <li>• Xem danh sách tất cả mã chứng khoán</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
