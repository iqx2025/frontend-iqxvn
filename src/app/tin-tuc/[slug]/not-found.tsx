import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Newspaper className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bài viết không tìm thấy
            </h1>
            <p className="text-gray-600">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/news">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại tin tức
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
