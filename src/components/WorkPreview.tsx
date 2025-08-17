'use client';

import React from 'react';
import { Work } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import GitHubActivityTimeline from '@/components/GitHubActivityTimeline';

interface WorkPreviewProps {
  work: Work | null;
}

export default function WorkPreview({ work }: WorkPreviewProps) {
  const { t } = useLanguage();

  if (!work) {
    return (
      <div className="mt-6">
        <GitHubActivityTimeline username="nievasdev" />
      </div>
    );
  }

  return (
    <div className="work-preview-container mt-6 p-4 bg-spacial-1 rounded-lg border border-spacial-3/20 transition-all duration-300">
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">{work.name}</h3>
        <p className="text-sm text-spacial-4-70 font-medium mb-2">{work.time}</p>
      </div>
      
      <div className="space-y-2">
        {work.largeText.map((paragraph, index) => (
          <p 
            key={index} 
            className="text-sm text-spacial-4-90 leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
        
        {work.workMethod && (
          <div className="mt-3 pt-2 border-t border-spacial-3/20">
            <p className="text-sm text-spacial-4-70 font-medium mb-1">{t('works.workMethod')}:</p>
            <p className="text-sm text-spacial-4-90 leading-relaxed">{work.workMethod}</p>
          </div>
        )}
      </div>
    </div>
  );
}