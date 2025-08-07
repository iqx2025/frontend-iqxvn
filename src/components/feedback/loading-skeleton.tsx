import { LoadingSkeletonProps } from "@/types/stock";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reusable loading skeleton component for ticker pages using shadcn/ui Skeleton
 */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="space-y-6">
        {/* Stock Profile Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Business Info Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * More detailed loading skeleton with multiple sections using shadcn/ui Skeleton
 */
export function DetailedLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Stock Profile Skeleton */}
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Business Info Skeleton */}
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
