'use client';

import React from 'react';
import { clsx } from 'clsx';
import { ButtonProps } from '@/types';

export const Button = ({ 
  children, 
  className, 
  variant = 'solid',
  color = 'primary',
  size = 'md',
  as: Component = 'button',
  href,
  disabled = false,
  isIconOnly = false,
  ...props 
}: ButtonProps) => {
  // Auto-detect component type
  if (href && Component === 'button') {
    Component = 'a';
  }

  const baseClasses = [
    'btn'
  ];

  const sizeClasses = {
    sm: isIconOnly ? 'btn-sm btn-icon' : 'btn-sm',
    md: isIconOnly ? 'btn-md btn-icon' : 'btn-md',
    lg: isIconOnly ? 'btn-lg btn-icon' : 'btn-lg',
  };

  const variantClasses = {
    solid: {
      primary: 'btn-solid btn-primary',
      secondary: 'btn-solid btn-secondary',
      success: 'btn-solid btn-success',
      warning: 'btn-solid btn-warning',
      danger: 'btn-solid btn-danger',
      default: 'btn-solid',
    },
    flat: {
      primary: 'btn-ghost btn-primary',
      secondary: 'btn-ghost btn-secondary',
      success: 'btn-ghost btn-success',
      warning: 'btn-ghost btn-warning',
      danger: 'btn-ghost btn-danger',
      default: 'btn-ghost',
    },
    ghost: {
      primary: 'btn-ghost btn-primary',
      secondary: 'btn-ghost btn-secondary',
      success: 'btn-ghost btn-success',
      warning: 'btn-ghost btn-warning',
      danger: 'btn-ghost btn-danger',
      default: 'btn-ghost',
    },
    bordered: {
      primary: 'btn-bordered btn-primary',
      secondary: 'btn-bordered btn-secondary',
      success: 'btn-bordered btn-success',
      warning: 'btn-bordered btn-warning',
      danger: 'btn-bordered btn-danger',
      default: 'btn-bordered',
    },
  };

  const buttonClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant][color],
    className
  );

  if (Component === 'a') {
    return (
      <a
        href={href}
        className={buttonClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Component
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};