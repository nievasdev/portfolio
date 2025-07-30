'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CardProps } from '@/types';

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'card-header',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'card-body',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'card-footer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Divider = ({ className, ...props }: { className?: string; [key: string]: any }) => {
  return (
    <hr
      className={clsx(
        'card-divider',
        className
      )}
      {...props}
    />
  );
};