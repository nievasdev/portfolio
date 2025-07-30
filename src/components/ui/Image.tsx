'use client';

import React from 'react';
import NextImage from 'next/image';
import { clsx } from 'clsx';
import { ImageProps } from '@/types';

export const Image = ({ 
  src,
  alt = '',
  className,
  radius = 'md',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
  ...props 
}: ImageProps) => {
  const radiusClasses = {
    none: 'img-rounded-none',
    sm: 'img-rounded-sm',
    md: 'img-rounded-md', 
    lg: 'img-rounded-lg',
    xl: 'img-rounded-xl',
    '2xl': 'img-rounded-2xl',
    full: 'img-rounded-full'
  };

  const baseClasses = [
    // Base image styles
    'img',
    'img-contain',
    // Radius
    radiusClasses[radius] || radiusClasses.md
  ];

  // For Next.js optimization, we need numeric dimensions
  const numericWidth = typeof width === 'string' ? parseInt(width) : width;
  const numericHeight = typeof height === 'string' ? parseInt(height) : height;

  // If we have numeric dimensions, use Next.js Image for optimization
  if (numericWidth && numericHeight) {
    return (
      <NextImage
        src={src}
        alt={alt}
        width={numericWidth}
        height={numericHeight}
        loading={loading}
        className={clsx(baseClasses, className)}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  }

  // Fallback to regular img tag for cases where we don't have dimensions
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={clsx(baseClasses, className)}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  );
};