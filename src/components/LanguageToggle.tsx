'use client';

import React from 'react';
import { Button } from './ui';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <Button
      className="group bg-spacial-3 hover:bg-spacial-2 text-white font-semibold px-4 py-3 transition-all duration-200 relative overflow-hidden"
      size="lg"
      variant="solid"
      onClick={toggleLanguage}
    >
      <span className="button-text relative z-10">
        {language === 'en' ? '🇪🇸' : '🇺🇸'} {language === 'en' ? t('lang.spanish') : t('lang.english')}
      </span>
      <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"></div>
    </Button>
  );
}