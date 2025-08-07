import { ErrorDisplayProps } from "@/types/stock";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Reusable error display component using shadcn/ui Alert
 */
export function ErrorDisplay({ message, className }: ErrorDisplayProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{message}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

/**
 * Simple error display without reload button using shadcn/ui Alert
 */
export function SimpleErrorDisplay({ message, className }: ErrorDisplayProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

/**
 * Error display with custom action using shadcn/ui Alert
 */
export function ErrorDisplayWithAction({
  message,
  className,
  actionLabel = "Thử lại",
  onAction
}: ErrorDisplayProps & {
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{message}</p>
            {onAction && (
              <Button
                onClick={onAction}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {actionLabel}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
