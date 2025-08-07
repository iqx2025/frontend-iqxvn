"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function NewsImage({ src, alt, className, width = 800, height = 400 }: NewsImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
