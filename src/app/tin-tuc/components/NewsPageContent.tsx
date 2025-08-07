import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Search,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import wordpressService from "@/services/wordpressService";
import { WordPressPost, WordPressCategory } from "@/types/wordpress";

interface NewsPageContentProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};

export default async function NewsPageContent({ searchParams }: NewsPageContentProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const selectedCategory = params.category || '';
  const searchQuery = params.search || '';
  const pageSize = 12;

  let posts: WordPressPost[] = [];
  let categories: WordPressCategory[] = [];
  let pagination: any = null;
  let error: string | null = null;

  try {
    // Fetch categories
    categories = await wordpressService.getCategories({
      hierarchical: true,
      hide_empty: false,
    });

    // Fetch posts
    const response = await wordpressService.getPostsWithPagination({
      page: currentPage,
      per_page: pageSize,
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
      orderby: 'date',
      order: 'desc',
      status: 'publish',
    });

    posts = response.posts;
    pagination = response.pagination;
  } catch (err) {
    console.error('Error fetching news:', err);
    error = 'Không thể tải tin tức. Vui lòng thử lại sau.';
  }

  // Generate filter URLs
  const createFilterUrl = (newCategory: string) => {
    const urlParams = new URLSearchParams();
    if (newCategory && newCategory !== selectedCategory) {
      urlParams.set('category', newCategory);
    }
    if (searchQuery) {
      urlParams.set('search', searchQuery);
    }
    return urlParams.toString() ? `?${urlParams.toString()}` : '';
  };

  const createPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (page > 1) urlParams.set('page', page.toString());
    if (selectedCategory) urlParams.set('category', selectedCategory);
    if (searchQuery) urlParams.set('search', searchQuery);
    return urlParams.toString() ? `?${urlParams.toString()}` : '';
  };

  const createSearchUrl = (query: string) => {
    const urlParams = new URLSearchParams();
    if (query) urlParams.set('search', query);
    if (selectedCategory) urlParams.set('category', selectedCategory);
    return urlParams.toString() ? `?${urlParams.toString()}` : '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tin tức
        </h1>
        <p className="text-gray-600">
          Cập nhật tin tức mới nhất về kinh tế, tài chính và đầu tư
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <form action="/tin-tuc" method="get" className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm tin tức..."
                  defaultValue={searchQuery}
                  className="w-full"
                />
              </div>
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              <Button type="submit" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Link href={createFilterUrl('')}>
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Newspaper className="h-4 w-4" />
                Tất cả
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={createFilterUrl(String(category.id))}>
                <Button
                  variant={selectedCategory === String(category.id) ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Content */}
      <Card>
        <CardContent className="p-6">
          {error ? (
            <div className="text-center text-red-600 py-8">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không có tin tức nào được tìm thấy.</p>
            </div>
          ) : (
            <>
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="block group"
                  >
                    <Card className="h-full pt-0">
                      {/* Featured Image */}
                      {post.featured_image && (
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={post.featured_image.sizes.medium || post.featured_image.url}
                            alt={post.featured_image.alt || post.title.rendered}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}

                      <CardContent className="p-4">
                        {/* Categories */}
                        {post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.categories.slice(0, 2).map((category) => (
                              <Badge key={category.id} variant="secondary" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                          {stripHtml(post.title.rendered)}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {stripHtml(post.excerpt.rendered)}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(post.date)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author.name}
                          </div>
                        </div>

                        {/* Reading Time */}
                        {post.meta?.reading_time && (
                          <div className="mt-2 text-xs text-gray-500">
                            Thời gian đọc: {post.meta.reading_time} phút
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <div className="text-sm text-gray-600">
                    Trang {pagination.current_page} / {pagination.total_pages} 
                    ({pagination.total_items} bài viết)
                  </div>

                  <div className="flex items-center gap-2">
                    {pagination.has_previous && (
                      <Link href={createPageUrl(pagination.current_page - 1)}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ChevronLeft className="h-4 w-4" />
                          Trước
                        </Button>
                      </Link>
                    )}

                    {pagination.has_next && (
                      <Link href={createPageUrl(pagination.current_page + 1)}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          Sau
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
