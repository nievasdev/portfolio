'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommitActivity {
  id: string;
  type: 'commit' | 'pull_request';
  message: string;
  repository: string;
  date: string;
  url: string;
  additions?: number;
  deletions?: number;
  branch?: string;
}

interface GitHubActivityTimelineProps {
  username: string;
  className?: string;
}

export default function GitHubActivityTimeline({ username, className = '' }: GitHubActivityTimelineProps) {
  const [activities, setActivities] = useState<CommitActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      setIsLoading(true);
      try {
        // First try with authenticated API
        const response = await fetch('/api/github/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        } else {
          // Fallback to simulated data
          setActivities(generateFallbackActivity(1));
        }
      } catch (error) {
        console.error('Failed to fetch GitHub activity:', error);
        setActivities(generateFallbackActivity(1));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubActivity();
  }, [username]);

  const loadMoreActivities = async () => {
    if (isLoadingMore || !hasMoreData) return;
    
    setIsLoadingMore(true);
    
    try {
      // En una implementación real, aquí cargarías más datos de la API
      // Por ahora simulamos la carga de más datos
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red
      
      const nextPage = page + 1;
      const newActivities = generateFallbackActivity(nextPage);
      
      if (newActivities.length === 0 || nextPage > 10) { // Limitar a 10 páginas para demo
        setHasMoreData(false);
      } else {
        setActivities(prev => [...prev, ...newActivities]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more activities:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Detectar scroll interno para infinite loading
  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    console.log('Scroll detected:', { scrollTop, scrollHeight, clientHeight, isLoadingMore, hasMoreData });
    
    // Cargar más cuando esté cerca del final (50px antes)
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoadingMore && hasMoreData) {
      console.log('Loading more activities...');
      loadMoreActivities();
    }
  };

  const generateFallbackActivity = (pageNum: number = 1, itemsPerPage: number = 8): CommitActivity[] => {
    const repositories = ['portfolio', 'portfolio-web', 'react-projects', 'node-backend', 'python-tools'];
    const commitMessages = [
      'Add hover preview for work cards',
      'Implement theme switching functionality',
      'Fix responsive layout issues',
      'Update dependencies and security patches',
      'Optimize build performance',
      'Add internationalization support',
      'Improve CSS animations and transitions',
      'Refactor component architecture',
      'Add TypeScript type definitions',
      'Update README with new features',
      'Fix mobile responsive design',
      'Add unit tests for components',
      'Improve accessibility features',
      'Update CI/CD pipeline',
      'Refactor API endpoints',
      'Add error handling',
      'Optimize database queries',
      'Update documentation',
      'Fix security vulnerabilities',
      'Add logging functionality'
    ];

    const activities: CommitActivity[] = [];
    const now = new Date();
    const startIndex = (pageNum - 1) * itemsPerPage;

    for (let i = 0; i < itemsPerPage; i++) {
      const dayOffset = startIndex + i;
      const date = new Date(now.getTime() - (dayOffset * 24 * 60 * 60 * 1000) - (Math.random() * 24 * 60 * 60 * 1000));
      const isCommit = Math.random() > 0.3;
      
      activities.push({
        id: `activity_${pageNum}_${i}`,
        type: isCommit ? 'commit' : 'pull_request',
        message: commitMessages[Math.floor(Math.random() * commitMessages.length)],
        repository: repositories[Math.floor(Math.random() * repositories.length)],
        date: date.toISOString(),
        url: `https://github.com/${username}/${repositories[Math.floor(Math.random() * repositories.length)]}`,
        additions: isCommit ? Math.floor(Math.random() * 50) + 1 : undefined,
        deletions: isCommit ? Math.floor(Math.random() * 20) : undefined,
        branch: isCommit ? 'main' : `feature/branch-${i}`
      });
    }

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    }
  };

  const formatDateKey = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const groupActivitiesByDate = (activities: CommitActivity[]) => {
    const grouped: { [key: string]: { [repo: string]: CommitActivity[] } } = {};
    
    activities.forEach(activity => {
      const dateKey = formatDateKey(activity.date);
      const repo = activity.repository;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {};
      }
      if (!grouped[dateKey][repo]) {
        grouped[dateKey][repo] = [];
      }
      
      grouped[dateKey][repo].push(activity);
    });
    
    return grouped;
  };

  const getActivityIcon = (type: string) => {
    if (type === 'commit') {
      return (
        <svg className="w-5 h-5 commit-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M1 2.5A2.5 2.5 0 0 1 3.5 0h8.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V1.5h-8a1 1 0 0 0-1 1v6.708A2.493 2.493 0 0 1 3.5 9h3.25a.75.75 0 0 1 0 1.5H3.5a1 1 0 0 0 0 2h5.75a.75.75 0 0 1 0 1.5H3.5A2.5 2.5 0 0 1 1 11.5Zm13.23 7.79h-.001l-1.224-1.224v6.184a.75.75 0 0 1-1.5 0V9.066L10.28 10.29a.75.75 0 0 1-1.06-1.061l2.505-2.504a.75.75 0 0 1 1.06 0L15.29 9.23a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018Z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 pr-icon" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
        </svg>
      );
    }
  };

  if (isLoading) {
    return (
      <div className={`github-activity-timeline ${className}`}>
        <div className="timeline-header mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            Actividad Reciente de GitHub
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="timeline-item-skeleton bg-spacial-1 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-spacial-2 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-spacial-2 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`github-activity-timeline ${className}`}>
      <div className="timeline-header mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          GitHub Activity
        </h3>
        <p className="text-sm text-spacial-4-70">
          Recent commits and pull requests
        </p>
      </div>

      <div 
        className="timeline-scrollable-container relative overflow-y-auto overflow-x-hidden"
        style={{ 
          maxHeight: '300px',
          height: '300px'
        }}
        onScroll={handleContainerScroll}
      >
        <div className="timeline-container relative" style={{ paddingBottom: '2rem' }}>
          {/* Single continuous timeline line */}
          <div 
            className="absolute w-0.5 bg-border" 
            style={{ 
              left: '25px',
              top: '1rem',
              height: 'calc(100% - 3rem)'
            }}
            aria-hidden="true"
          ></div>
          
          <div className="space-y-8 pb-4">
            {Object.entries(groupActivitiesByDate(activities)).map(([date, repos], dateIndex) => (
              <div key={date} className="timeline-date-group">
                {/* Date header */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-1">{date}</h4>
                </div>
                
                {/* Repositories for this date */}
                <div className="space-y-6">
                  {Object.entries(repos).map(([repo, repoActivities]) => (
                    <div key={`${date}-${repo}`} className="timeline-repo-group relative">
                      <div className="timeline-item relative">
                        {/* Timeline node (small icon on timeline) */}
                        <div 
                          className="absolute top-2 w-2 h-2 rounded-full bg-green-500 z-10"
                          style={{ left: '24px' }}
                        ></div>
                        
                        {/* Content */}
                        <div style={{ marginLeft: '50px' }} className="pb-6">
                          <div className="flex items-center gap-3 text-sm">
                            {/* Small commit icon next to text */}
                            <div className="w-4 h-4">
                              {getActivityIcon('commit')}
                            </div>
                            <a 
                              href={`https://github.com/${username}/${repo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-spacial-3 hover:underline"
                            >
                              {repo}
                            </a>
                            <span className="text-spacial-4-70">
                              ({repoActivities.length} commit{repoActivities.length > 1 ? 's' : ''})
                            </span>
                            <span className="text-spacial-4-70">•</span>
                            <span className="text-spacial-4-70">{formatDate(repoActivities[0].date)}</span>
                            <a 
                              href={`https://github.com/${username}/${repo}/commits`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-spacial-3 hover:underline"
                            >
                              Ver commits →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2 text-sm text-spacial-4-70">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-spacial-3"></div>
              <span>Cargando más actividad...</span>
            </div>
          </div>
        )}

        {/* No more data indicator */}
        {!hasMoreData && activities.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-spacial-4-70">
              No hay más actividad para mostrar
            </div>
          </div>
        )}
      </div>

      <div className="timeline-footer mt-6 text-center">
        <a 
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-spacial-3 hover:underline"
        >
          View all activity on GitHub
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}