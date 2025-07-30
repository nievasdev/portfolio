'use client';

import React from 'react';
import { clsx } from 'clsx';

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  position?: 'static' | 'sticky' | 'fixed';
  [key: string]: any;
}

interface NavbarContentProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
  [key: string]: any;
}

interface NavbarItemProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  [key: string]: any;
}

interface NavbarMenuToggleProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  [key: string]: any;
}

interface NavbarMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  [key: string]: any;
}

interface NavbarMenuItemProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Navbar = ({ 
  children, 
  className, 
  maxWidth = 'lg',
  position = 'sticky',
  ...props 
}: NavbarProps) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const positionClasses = {
    static: 'static',
    sticky: 'sticky top-0',
    fixed: 'fixed top-0 left-0 right-0'
  };

  return (
    <nav
      className={clsx(
        // Base navbar styles
        'z-40 flex h-auto items-center justify-center',
        'backdrop-saturate-150 bg-[#1a1a1a]',
        // Position
        positionClasses[position] || positionClasses.sticky,
        className
      )}
      {...props}
    >
      <div
        className={clsx(
          'relative flex w-full items-center justify-between px-4 h-16',
          maxWidthClasses[maxWidth] || maxWidthClasses.lg
        )}
      >
        {children}
      </div>
    </nav>
  );
};

export const NavbarContent = ({ 
  children, 
  className, 
  justify = 'start',
  ...props 
}: NavbarContentProps) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div
      className={clsx(
        'flex items-center',
        justifyClasses[justify] || justifyClasses.start,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const NavbarItem = ({ 
  children, 
  className,
  isActive = false,
  ...props 
}: NavbarItemProps) => {
  return (
    <div
      className={clsx(
        'flex items-center',
        isActive && 'text-primary font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const NavbarMenuToggle = ({ 
  isOpen = false,
  onToggle,
  className,
  ...props 
}: NavbarMenuToggleProps) => {
  return (
    <button
      className={clsx(
        'flex items-center justify-center',
        'w-8 h-8 rounded-md',
        'text-spacial-4 hover:text-white',
        'transition-colors duration-150',
        'sm:hidden',
        className
      )}
      onClick={onToggle}
      aria-label="Toggle menu"
      {...props}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
};

export const NavbarMenu = ({ 
  children, 
  className,
  isOpen = false,
  ...props 
}: NavbarMenuProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        'absolute top-full left-0 right-0 z-50',
        'bg-spacial-2 border-b border-spacial-3/20',
        'backdrop-blur-md backdrop-saturate-150',
        'sm:hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const NavbarMenuItem = ({ 
  children, 
  className,
  ...props 
}: NavbarMenuItemProps) => {
  return (
    <div
      className={clsx(
        'flex items-center px-4 py-2',
        'text-spacial-4 hover:text-white',
        'transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Link styles helper (to replace @nextui-org/theme)
export const linkStyles = ({ color = 'foreground' }: { color?: string } = {}) => {
  const colorClasses = {
    foreground: 'text-spacial-4 hover:text-white',
    primary: 'text-spacial-3 hover:text-spacial-3/80',
    secondary: 'text-gray-500 hover:text-gray-400',
    success: 'text-green-600 hover:text-green-500',
    warning: 'text-yellow-600 hover:text-yellow-500',
    danger: 'text-red-600 hover:text-red-500'
  };

  return clsx(
    'relative inline-flex items-center',
    'transition-colors duration-150',
    'tap-highlight-transparent',
    'outline-none focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-spacial-3 focus-visible:ring-offset-2',
    colorClasses[color as keyof typeof colorClasses] || colorClasses.foreground
  );
};