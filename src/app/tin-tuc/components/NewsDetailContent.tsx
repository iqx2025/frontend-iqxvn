"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HtmlContent } from "@/components/ui/html-content";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Tag,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/types/wordpress";

interface NewsDetailContentProps {
  post: WordPressPost;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
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

export default function NewsDetailContent({ post }: NewsDetailContentProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: stripHtml(post.title.rendered),
          text: stripHtml(post.excerpt.rendered),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link bài viết!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách tin tức
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/news?category=${category.id}`}>
                  <Badge variant="secondary" className="hover:bg-blue-100 cursor-pointer">
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {stripHtml(post.title.rendered)}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(post.date)}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author.name}
            </div>
            {post.meta?.reading_time && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {post.meta.reading_time} phút đọc
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
            {post.link && (
              <Link href={post.link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Xem gốc
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      {post.featured_image && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
              <Image
                src={post.featured_image.sizes.large || post.featured_image.url}
                alt={post.featured_image.alt || post.title.rendered}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            {post.featured_image.caption && (
              <div className="p-4 text-sm text-gray-600 italic">
                {stripHtml(post.featured_image.caption)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Article Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Excerpt */}
          {post.excerpt.rendered && (
            <div className="text-lg text-gray-700 font-medium mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <HtmlContent
                content={post.excerpt.rendered}
                variant="excerpt"
              />
            </div>
          )}

          {/* Main Content */}
          <HtmlContent
            content={post.content.rendered}
          />
        </CardContent>
      </Card>

      {/* Tags */}
      {post.tags.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
              <Tag className="h-5 w-5" />
              Thẻ
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-sm">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Author Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tác giả</h3>
          <div className="flex items-center gap-3">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-600">@{post.author.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
