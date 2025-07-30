'use client';

import React, { useState, useEffect } from 'react';
import { fetchGitHubContributions, generateFallbackContributions, ContributionsData, ContributionDay } from '../lib/github-contributions';
import { Tooltip } from './ui';

interface GitHubContributionsProps {
    username: string;
    className?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitHubContributions({ username, className = '' }: GitHubContributionsProps) {
    const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const loadContributions = async () => {
            setIsLoading(true);
            setHasError(false);
            
            try {
                const data = await fetchGitHubContributions(username);
                if (data) {
                    setContributionsData(data);
                } else {
                    // Use fallback data if API fails
                    setContributionsData(generateFallbackContributions());
                }
            } catch (error) {
                console.error('Failed to load contributions:', error);
                setContributionsData(generateFallbackContributions());
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadContributions();
    }, [username]);

    const getContributionColor = (count: number): string => {
        if (count === 0) return 'var(--color-spacial-5)'; // Dark background
        if (count <= 2) return 'rgba(0, 173, 181, 0.25)'; // Light spacial-3
        if (count <= 5) return 'rgba(0, 173, 181, 0.5)';  // Medium spacial-3
        if (count <= 8) return 'rgba(0, 173, 181, 0.75)'; // Strong spacial-3
        return 'var(--color-spacial-3)'; // Full spacial-3 cyan
    };

    const handleDayClick = (date: string) => {
        // Format: https://github.com/users/{username}/contributions?to={YYYY-MM-DD}
        const githubUrl = `https://github.com/users/${username}/contributions?to=${date}`;
        window.open(githubUrl, '_blank');
    };

    const generateMonthLabels = () => {
        if (!contributionsData?.contributionCalendar?.weeks?.length) return [];
        
        const MIN_DISTANCE_MONTH_LABELS = 2;
        
        // GitHub's standard algorithm: detect month transitions directly
        const labels = contributionsData.contributionCalendar.weeks.reduce((monthLabels: Array<{month: string, x: number}>, week, weekIndex) => {
            const firstDay = new Date(week.contributionDays[0].date);
            const month = firstDay.getMonth();
            const monthName = MONTHS[month];
            const prevLabel = monthLabels[monthLabels.length - 1];
            
            // Add label when month changes or it's the first week
            if (weekIndex === 0 || !prevLabel || prevLabel.month !== monthName) {
                return [...monthLabels, {
                    month: monthName,
                    x: weekIndex * 12 // Direct week-based positioning
                }];
            }
            
            return monthLabels;
        }, []);
        
        // Apply minimum distance filtering (GitHub's spacing algorithm)
        return labels.filter((label, index) => {
            if (index === 0) {
                // First label is shown only if there's enough space to the next one
                return labels[1] && labels[1].x - label.x > MIN_DISTANCE_MONTH_LABELS * 12;
            }
            return true;
        });
    };

    if (isLoading) {
        return (
            <div className={`github-contributions ${className}`}>
                <div className="contributions-header mb-3">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white text-center">
                        GitHub Contributions
                    </h3>
                </div>
                <div className="contributions-wrapper rounded-lg p-4 overflow-hidden">
                    <div className="contributions-loading">
                        Loading contributions...
                    </div>
                </div>
            </div>
        );
    }

    if (!contributionsData) {
        return (
            <div className={`github-contributions ${className}`}>
                <div className="contributions-header mb-3">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white text-center">
                        GitHub Contributions
                    </h3>
                </div>
                <div className="contributions-wrapper rounded-lg p-4 overflow-hidden">
                    <div className="contributions-error">
                        Unable to load GitHub contributions
                    </div>
                </div>
            </div>
        );
    }

    const monthLabels = generateMonthLabels();

    return (
        <div className={`github-contributions ${className}`}>
            <div className="contributions-header mb-3">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white text-center">
                    GitHub Contributions
                </h3>
                <p className="text-sm text-spacial-4-70 text-center mt-1">
                    {contributionsData.contributionCalendar.totalContributions} contributions in the last year
                    {hasError && <span className="text-xs opacity-60 block mt-1">*Simulated based on profile data</span>}
                </p>
            </div>
            <div className="contributions-wrapper rounded-lg p-4 overflow-hidden">
                <div className="contributions-calendar">
                    {/* Month labels */}
                    <div className="month-labels">
                        {monthLabels.map((label, index) => (
                            <span
                                key={index}
                                className="month-label"
                                style={{ left: `${label.x}px` }}
                            >
                                {label.month}
                            </span>
                        ))}
                    </div>
                    
                    {/* Day labels */}
                    <div className="day-labels">
                        <span className="day-label" style={{ top: '12px' }}>L</span>
                        <span className="day-label" style={{ top: '36px' }}>M</span>
                        <span className="day-label" style={{ top: '60px' }}>F</span>
                    </div>
                    
                    {/* Contribution grid */}
                    <div className="contributions-grid">
                        {contributionsData.contributionCalendar.weeks?.map((week, weekIndex) => (
                            <div key={weekIndex} className="contribution-week">
                                {week.contributionDays?.map((day, dayIndex) => (
                                    <Tooltip
                                        key={`${weekIndex}-${dayIndex}`}
                                        content={
                                            <div className="text-center">
                                                <div className="font-semibold">
                                                    {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}
                                                </div>
                                                <div className="text-xs opacity-90">
                                                    {new Date(day.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-xs opacity-75 mt-1">
                                                    Click to view on GitHub
                                                </div>
                                            </div>
                                        }
                                        placement="top"
                                        showArrow={true}
                                        classNames={{
                                            base: "backdrop-blur-md",
                                            content: "tooltip"
                                        }}
                                    >
                                        <div
                                            className="contribution-day clickable"
                                            style={{
                                                backgroundColor: getContributionColor(day.contributionCount)
                                            }}
                                            onClick={() => handleDayClick(day.date)}
                                        />
                                    </Tooltip>
                                )) || []}
                            </div>
                        )) || []}
                    </div>
                    
                    {/* Legend */}
                    <div className="contributions-legend">
                        <span className="legend-text">Less</span>
                        <div className="legend-squares">
                            {[0, 1, 3, 6, 9].map((count, index) => (
                                <div
                                    key={index}
                                    className="legend-square"
                                    style={{
                                        backgroundColor: getContributionColor(count)
                                    }}
                                />
                            ))}
                        </div>
                        <span className="legend-text">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}