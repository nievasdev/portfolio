'use client';

import { useMemo } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { getWorks, getProjects } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  // Get data synchronously based on current language - no loading state needed
  const works = useMemo(() => getWorks(language), [language]);
  const projects = useMemo(() => getProjects(language), [language]);

  return <ResponsiveLayout works={works} projects={projects} />;
}
