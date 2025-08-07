import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import wordpressService from '@/services/wordpressService';
import NewsDetailContent from '../components/NewsDetailContent';
import NewsDetailSkeleton from '../components/NewsDetailSkeleton';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await wordpressService.getPostBySlug(slug);
    
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
    
    return {
      title: `${stripHtml(post.title.rendered)} - IQX`,
      description: stripHtml(post.excerpt.rendered).substring(0, 160),
      keywords: post.tags.map(tag => tag.name).join(', '),
      openGraph: {
        title: stripHtml(post.title.rendered),
        description: stripHtml(post.excerpt.rendered).substring(0, 160),
        type: 'article',
        publishedTime: post.date,
        authors: [post.author.name],
        images: post.featured_image ? [
          {
            url: post.featured_image.url,
            width: 1200,
            height: 630,
            alt: post.featured_image.alt || post.title.rendered,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: stripHtml(post.title.rendered),
        description: stripHtml(post.excerpt.rendered).substring(0, 160),
        images: post.featured_image ? [post.featured_image.url] : [],
      },
    };
  } catch {
    return {
      title: 'Bài viết không tìm thấy - IQX',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  try {
    const post = await wordpressService.getPostBySlug(slug);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<NewsDetailSkeleton />}>
          <NewsDetailContent post={post} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}
