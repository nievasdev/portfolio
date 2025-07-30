'use client';

import React from 'react';
import NextLink from 'next/link';
import { clsx } from 'clsx';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  isExternal?: boolean;
  [key: string]: any;
}

export const Link = ({ 
  children, 
  href, 
  className, 
  isExternal = false,
  ...props 
}: LinkProps) => {
  const linkClasses = clsx(
    'relative inline-flex items-center',
    'transition-colors duration-150',
    'tap-highlight-transparent',
    'outline-none focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-spacial-3 focus-visible:ring-offset-2',
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={linkClasses}
      {...props}
    >
      {children}
    </NextLink>
  );
};