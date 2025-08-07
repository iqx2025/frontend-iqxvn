import { Suspense } from 'react';
import { Metadata } from 'next';
import NewsPageContent from './components/NewsPageContent';
import NewsPageSkeleton from './components/NewsPageSkeleton';

export const metadata: Metadata = {
  title: 'Tin tức - IQX',
  description: 'Tin tức mới nhất về kinh tế, tài chính và đầu tư từ IQX',
  keywords: 'tin tức, kinh tế, tài chính, đầu tư, chứng khoán',
  openGraph: {
    title: 'Tin tức - IQX',
    description: 'Tin tức mới nhất về kinh tế, tài chính và đầu tư từ IQX',
    type: 'website',
  },
};

interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<NewsPageSkeleton />}>
        <NewsPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
