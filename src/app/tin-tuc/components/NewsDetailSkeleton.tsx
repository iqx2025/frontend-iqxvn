import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Article Header Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Categories Skeleton */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Title Skeleton */}
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-3/4 mb-4" />

          {/* Meta Information Skeleton */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Share Button Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Featured Image Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <Skeleton className="h-64 md:h-96 w-full rounded-lg" />
          <div className="p-4">
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>

      {/* Article Content Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Excerpt Skeleton */}
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 mb-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Info Skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-20 mb-3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
