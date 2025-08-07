import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/tin-tuc">
          <Button variant="ghost" size="sm" className="gap-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-3 w-3" />
            Tin tức
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
              <Newspaper className="h-12 w-12 text-gray-400" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Không tìm thấy tin tức
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <p className="text-sm text-gray-500">
                Có thể tin tức đã được di chuyển hoặc URL không chính xác.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tin-tuc">
                <Button className="gap-2 w-full sm:w-auto">
                  <Newspaper className="h-4 w-4" />
                  Xem tất cả tin tức
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Button>
              </Link>
            </div>

            {/* Suggestions */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-medium text-gray-900">Gợi ý cho bạn:</h3>
              <div className="grid gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Kiểm tra lại đường dẫn URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span>Xem các tin tức mới nhất</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Quay về trang chủ để khám phá thêm</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
