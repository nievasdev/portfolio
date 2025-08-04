'use client';

import React from 'react';

interface GitHubContributionsSkeletonProps {
    className?: string;
}

export default function GitHubContributionsSkeleton({ className = '' }: GitHubContributionsSkeletonProps) {
    // Generate skeleton grid (52 weeks x 7 days)
    const generateSkeletonGrid = () => {
        const weeks = [];
        for (let week = 0; week < 52; week++) {
            const days = [];
            for (let day = 0; day < 7; day++) {
                // Add some variation to the skeleton - some days more "active" than others
                const intensity = Math.random();
                let skeletonClass = 'contribution-day-skeleton';
                
                if (intensity > 0.8) {
                    skeletonClass += ' skeleton-high';
                } else if (intensity > 0.6) {
                    skeletonClass += ' skeleton-medium';
                } else if (intensity > 0.3) {
                    skeletonClass += ' skeleton-low';
                } else {
                    skeletonClass += ' skeleton-none';
                }
                
                days.push(
                    <div
                        key={`${week}-${day}`}
                        className={skeletonClass}
                    />
                );
            }
            weeks.push(
                <div key={week} className="contribution-week-skeleton">
                    {days}
                </div>
            );
        }
        return weeks;
    };

    // Generate skeleton month labels every 4 columns
    const generateSkeletonMonthLabels = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        
        // Show month label every 4 weeks, simulating a year progression
        for (let weekIndex = 0; weekIndex < 52; weekIndex += 4) {
            // Calculate which month this week would be in (approximate)
            const monthIndex = Math.floor((weekIndex / 4.33)); // ~4.33 weeks per month
            const month = months[monthIndex % 12];
            
            labels.push(
                <span
                    key={weekIndex}
                    className="month-label-skeleton"
                    style={{ left: `${weekIndex * 13}px` }}
                >
                    <span className="skeleton-text">{month}</span>
                </span>
            );
        }
        
        return labels;
    };

    return (
        <div className={`github-contributions ${className}`}>
            <div className="contributions-header mb-3">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white text-center">
                    GitHub Contributions
                </h3>
                <div className="skeleton-stats">
                    <div className="skeleton-text-bar skeleton-animate"></div>
                </div>
            </div>
            <div className="contributions-wrapper rounded-lg p-4 overflow-hidden">
                <div className="contributions-calendar-skeleton">
                    {/* Skeleton Month labels */}
                    <div className="month-labels-skeleton">
                        {generateSkeletonMonthLabels()}
                    </div>
                    
                    {/* Skeleton Day labels */}
                    <div className="day-labels-skeleton">
                        <span className="day-label-skeleton"><span className="skeleton-text">L</span></span>
                        <span className="day-label-skeleton"><span className="skeleton-text">M</span></span>
                        <span className="day-label-skeleton"><span className="skeleton-text">F</span></span>
                    </div>
                    
                    {/* Skeleton Contribution grid */}
                    <div className="contributions-grid-skeleton">
                        {generateSkeletonGrid()}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}