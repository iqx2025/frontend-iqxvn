"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface NewsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NewsError({ error, reset }: NewsErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('News detail error:', error);
  }, [error]);

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
            <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Có lỗi xảy ra
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                Không thể tải tin tức này. Vui lòng thử lại sau.
              </p>
              <p className="text-sm text-gray-500">
                Nếu lỗi vẫn tiếp tục, vui lòng liên hệ với chúng tôi.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <p className="text-xs text-gray-600 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="gap-2 w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                Thử lại
              </Button>
              
              <Link href="/tin-tuc">
                <Button variant="outline" className="gap-1 w-full sm:w-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Tin tức
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="ghost" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Button>
              </Link>
            </div>

            {/* Help Information */}
            <div className="border-t pt-6 space-y-2">
              <h3 className="font-medium text-gray-900">Cần hỗ trợ?</h3>
              <p className="text-sm text-gray-600">
                Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
