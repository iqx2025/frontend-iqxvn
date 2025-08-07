"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Share2, BookmarkPlus, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface NewsArticleActionsProps {
  newsSourceLink: string;
  newsTitle: string;
}

interface Bookmark {
  title: string;
  url: string;
  timestamp: number;
}

export function NewsArticleActions({ newsSourceLink, newsTitle }: NewsArticleActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const { success, error: showError, ToastContainer } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsTitle,
          text: `Đọc tin tức: ${newsTitle}`,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        success("Đã chia sẻ bài viết!");
      } catch (error) {
        // User cancelled or error occurred, fallback to copy
        if (error instanceof Error && error.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      success("Đã sao chép liên kết!");
    } catch (error) {
      console.log('Failed to copy URL:', error);
      showError("Không thể sao chép liên kết");
    }
  };

  const handleBookmark = () => {
    // Save to localStorage for now
    const bookmarks: Bookmark[] = JSON.parse(localStorage.getItem('newsBookmarks') || '[]');
    const bookmark: Bookmark = {
      title: newsTitle,
      url: window.location.href,
      timestamp: Date.now()
    };

    const exists = bookmarks.find((b: Bookmark) => b.url === bookmark.url);
    if (!exists) {
      bookmarks.push(bookmark);
      localStorage.setItem('newsBookmarks', JSON.stringify(bookmarks));
      success('Đã lưu bài viết!');
    } else {
      showError('Bài viết đã được lưu trước đó!');
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        {/* Compact horizontal layout */}
        <div className="flex gap-1">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1 text-xs h-8"
            onClick={handleShare}
            title="Chia sẻ bài viết"
          >
            {shared ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Share2 className="h-3 w-3" />
            )}
          </Button>

          {/* Copy Link Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1 text-xs h-8"
            onClick={copyToClipboard}
            title="Sao chép liên kết"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1 text-xs h-8"
            onClick={handleBookmark}
            title="Lưu bài viết"
          >
            <BookmarkPlus className="h-3 w-3" />
          </Button>

          {/* Source Link Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-1 text-xs h-8"
            asChild
            title="Xem nguồn gốc"
          >
            <a
              href={newsSourceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
      <ToastContainer />
    </Card>
  );
}
