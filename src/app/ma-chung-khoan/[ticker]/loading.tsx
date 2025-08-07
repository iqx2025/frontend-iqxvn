import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for ticker pages using shadcn/ui Skeleton
 * This is displayed while the async page component is loading
 */
export default function TickerLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Stock Profile Loading Skeleton */}
        <div className="border rounded-lg p-6 space-y-6">
          {/* Header with logo and basic info */}
          <div className="flex items-start space-x-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Price and change info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-14" />
              </div>
            ))}
          </div>
        </div>

        {/* Business Information Loading Skeleton */}
        <div className="border rounded-lg p-6 space-y-6">
          {/* Section title */}
          <Skeleton className="h-6 w-48" />
          
          {/* Business overview */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Business details grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Financial metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Additional sections placeholder */}
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
