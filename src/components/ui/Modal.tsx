'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { ModalProps, CardProps } from '@/types';

export const Modal = ({ 
  children, 
  isOpen, 
  onClose, 
  size = 'md',
  classNames = {}
}: ModalProps) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    '2xl': 'modal-2xl',
    '3xl': 'modal-2xl', // Map to 2xl since we don't have 3xl
    '4xl': 'modal-4xl',
    '5xl': 'modal-4xl', // Map to 4xl since we don't have 5xl
    full: 'modal-full',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className={clsx(
        'modal-backdrop',
        classNames.base
      )}
      onClick={handleBackdropClick}
    >
      <div 
        className={clsx(
          'modal-content',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalContent = ({ children, ...props }: CardProps) => {
  return (
    <div className="flex flex-col" {...props}>
      {children}
    </div>
  );
};

export const ModalHeader = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'modal-header',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalBody = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'modal-body',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        'modal-footer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};