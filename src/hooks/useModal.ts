'use client';

import { useState, useCallback } from 'react';
import { UseModalReturn } from '@/types';

export const useModal = (defaultIsOpen: boolean = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpenChange = useCallback((open: boolean) => setIsOpen(open), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    onToggle,
  };
};