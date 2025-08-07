"use client";

import React, { useState } from 'react';

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function NewsImage({ src, alt, className }: NewsImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
