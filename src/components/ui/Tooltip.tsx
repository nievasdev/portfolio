'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { TooltipProps } from '@/types';

export const Tooltip = ({ 
  children, 
  content, 
  placement = 'top',
  showArrow = false,
  classNames = {}
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    // Calculate position based on placement
    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Boundary collision detection
    if (x < 8) x = 8;
    if (x + tooltipRect.width > viewport.width - 8) {
      x = viewport.width - tooltipRect.width - 8;
    }
    if (y < 8) y = 8;
    if (y + tooltipRect.height > viewport.height - 8) {
      y = viewport.height - tooltipRect.height - 8;
    }

    setPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, placement]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const tooltipContent = isVisible && typeof window !== 'undefined' ? (
    createPortal(
      <div
        ref={tooltipRef}
        className={clsx(
          'fixed z-50 px-3 py-2 text-sm font-medium',
          'bg-spacial-1 border border-spacial-3/30 text-spacial-4',
          'rounded-lg shadow-lg backdrop-blur-md',
          'pointer-events-none',
          'animate-fade-in',
          classNames.content
        )}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {content}
        {showArrow && (
          <div
            className={clsx(
              'absolute w-2 h-2 bg-spacial-1 border',
              'border-spacial-3/30 transform rotate-45',
              {
                'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0': placement === 'top',
                'top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-r-0': placement === 'bottom',
                'right-[-4px] top-1/2 -translate-y-1/2 border-t-0 border-r-0': placement === 'left',
                'left-[-4px] top-1/2 -translate-y-1/2 border-b-0 border-l-0': placement === 'right',
              }
            )}
          />
        )}
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={clsx('inline-block', classNames.base)}
      >
        {children}
      </div>
      {tooltipContent}
    </>
  );
};