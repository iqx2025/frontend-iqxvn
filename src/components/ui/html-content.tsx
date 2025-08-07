import { cn } from "@/lib/utils";

interface HtmlContentProps {
  content: string;
  className?: string;
  variant?: "default" | "excerpt";
}

export function HtmlContent({ 
  content, 
  className,
  variant = "default" 
}: HtmlContentProps) {
  const baseClasses = "news-content max-w-none";
  
  const variantClasses = {
    default: "",
    excerpt: "[&>p]:mb-2 [&>p]:text-lg [&>p]:font-medium"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
