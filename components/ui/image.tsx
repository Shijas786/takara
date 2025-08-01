'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width = 150,
  height = 150,
  className = '',
  fallbackSrc = 'https://placehold.co/150x150',
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onError={handleError}
        priority={priority}
      />
    </div>
  );
}

interface SafeImgProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

export function SafeImg({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://placehold.co/150x150',
  width = 150,
  height = 150,
}: SafeImgProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
} 