import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          {/* Search Bar Skeleton */}
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Grid Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="h-full">
                {/* Image Skeleton */}
                <Skeleton className="h-48 w-full rounded-t-lg" />
                
                <CardContent className="p-4">
                  {/* Categories Skeleton */}
                  <div className="flex gap-1 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>

                  {/* Title Skeleton */}
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-2" />

                  {/* Excerpt Skeleton */}
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />

                  {/* Meta Info Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>

                  {/* Reading Time Skeleton */}
                  <Skeleton className="h-3 w-24 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
