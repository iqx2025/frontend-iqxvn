'use client';

/**
 * Error UI for the stock market page
 * Follows Next.js 14+ App Router conventions
 */

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Stock market page error:', error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mã chứng khoán
        </h1>
        <p className="text-muted-foreground">
          Tìm kiếm và theo dõi mã chứng khoán Việt Nam
        </p>
      </div>

      {/* Error State */}
      <Card className="max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
          
          <h2 className="text-2xl font-semibold mb-3">
            Đã xảy ra lỗi
          </h2>
          
          <p className="text-muted-foreground mb-6 text-sm max-w-md">
            Không thể tải dữ liệu chứng khoán. Vui lòng thử lại hoặc quay về trang chủ.
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left w-full">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Chi tiết lỗi (chỉ hiển thị trong môi trường phát triển)
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                {error.message}
                {error.stack && '\n\nStack trace:\n' + error.stack}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset} 
              className="flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="flex items-center gap-2"
              size="lg"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </div>

          {/* Additional help text */}
          <p className="text-xs text-muted-foreground mt-6">
            Nếu lỗi vẫn tiếp tục xảy ra, vui lòng liên hệ với bộ phận hỗ trợ.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
