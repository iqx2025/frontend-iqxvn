import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsImage } from "@/components/ui/news-image";
import { NewsArticleActions } from "@/components/business/news-article-actions";
import {
  Clock,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  Building2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { ServerNewsService } from "@/services/serverNewsService";
import { NewsDetail } from "@/types/news";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return ServerNewsService.generateNewsDetailMetadata(slug);
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Vừa xong";
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  return `${Math.floor(diffInHours / 24)} ngày trước`;
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'Negative':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Negative':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  let article: NewsDetail;

  try {
    article = await ServerNewsService.getNewsDetail(slug);
  } catch (error) {
    console.error('Error loading news detail:', error);

    // If it's a 404 error, show not-found page
    if (error instanceof Error && error.message.includes('404')) {
      notFound();
    }

    // For other errors, throw to trigger error boundary
    throw error;
  }

  // Server component renders directly with data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-gray-600 hover:text-gray-900">
          <Link href="/tin-tuc">
            <ArrowLeft className="h-3 w-3" />
            Tin tức
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article>
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {article.ticker}
                </Badge>
                <Badge>{article.industry}</Badge>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}
                >
                  {getSentimentIcon(article.sentiment)}
                  {article.sentiment || 'Neutral'}
                </Badge>
                <span className="text-sm text-gray-500">{formatTimeAgo(article.update_date)}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.news_title}
              </h1>
              
              {article.summary && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {article.summary}
                </p>
              )}
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b pb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.news_from_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.update_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>~{Math.round(article.male_audio_duration / 60)} phút đọc</span>
                </div>
                {article.score && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Điểm: {article.score.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Article Image */}
            {article.news_image_url && (
              <div className="mb-8">
                <NewsImage
                  src={article.news_image_url}
                  alt={article.news_title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-8 html-content"
              dangerouslySetInnerHTML={{ __html: article.news_full_content }}
            />

            {/* Source Link */}
            <div className="border-t pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Nguồn: {article.news_from_name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  asChild
                >
                  <a
                    href={article.news_source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Xem bài gốc
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Article Actions */}
            <NewsArticleActions
              newsSourceLink={article.news_source_link}
              newsTitle={article.news_title}
            />

            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã chứng khoán:</span>
                  <Badge variant="outline">{article.ticker}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngành:</span>
                  <span className="font-medium">{article.industry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sentiment:</span>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${getSentimentColor(article.sentiment)}`}
                  >
                    {getSentimentIcon(article.sentiment)}
                    {article.sentiment || 'Neutral'}
                  </Badge>
                </div>
                {article.score && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Điểm đánh giá:</span>
                    <span className="font-medium">{article.score.toFixed(1)}/10</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian đọc:</span>
                  <span className="font-medium">~{Math.round(article.male_audio_duration / 60)} phút</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Stock Link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/ma-chung-khoan/${article.ticker.toLowerCase()}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Xem thông tin {article.ticker}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
