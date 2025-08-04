'use client';

import React, { useState, useEffect } from 'react';
import { fetchGitHubContributions, generateFallbackContributions, ContributionsData, ContributionDay } from '../lib/github-contributions';
import { Tooltip } from './ui';
import GitHubContributionsSkeleton from './GitHubContributionsSkeleton';

interface GitHubContributionsProps {
    username: string;
    className?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitHubContributions({ username, className = '' }: GitHubContributionsProps) {
    const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProgressiveLoading, setIsProgressiveLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [loadedWeeks, setLoadedWeeks] = useState(0);

    useEffect(() => {
        const loadContributions = async () => {
            setIsLoading(true);
            setHasError(false);
            setLoadedWeeks(0);

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
                setIsProgressiveLoading(true);
            }
        };

        loadContributions();
    }, [username]);

    // Progressive loading animation effect
    useEffect(() => {
        if (isProgressiveLoading && contributionsData) {
            const totalWeeks = contributionsData.contributionCalendar.weeks?.length || 52;
            const chunkSize = 4; // Load 4 weeks at a time for smoother progression
            let currentWeek = 0;

            const loadNextChunk = () => {
                if (currentWeek < totalWeeks) {
                    const nextWeek = Math.min(currentWeek + chunkSize, totalWeeks);
                    setLoadedWeeks(nextWeek);
                    currentWeek = nextWeek;
                    setTimeout(loadNextChunk, 35); // 35ms delay between chunks for smoother flow
                } else {
                    setIsProgressiveLoading(false);
                }
            };

            // Start progressive loading with a smooth initial delay
            const timer = setTimeout(loadNextChunk, 80);

            return () => clearTimeout(timer);
        }
    }, [isProgressiveLoading, contributionsData]);

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

        const labels: Array<{month: string, x: number}> = [];
        const totalWeeks = contributionsData.contributionCalendar.weeks.length;

        // Show month label every 4 columns (weeks)
        for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 4) {
            const week = contributionsData.contributionCalendar.weeks[weekIndex];
            if (week && week.contributionDays && week.contributionDays.length > 0) {
                const firstDay = new Date(week.contributionDays[0].date);
                const month = firstDay.getMonth();
                const monthName = MONTHS[month];

                labels.push({
                    month: monthName,
                    x: weekIndex * 13 // Each week is 13px wide (10px + 3px gap)
                });
            }
        }

        return labels;
    };

    if (isLoading) {
        return <GitHubContributionsSkeleton className={className} />;
    }

    // Show progressive loading state
    if (isProgressiveLoading && contributionsData) {
        return (
            <div className={`github-contributions ${className}`}>
                <div className="contributions-header mb-3">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white text-center">
                        GitHub Contributions
                    </h3>
                    <p className="text-sm text-spacial-4-70 text-center mt-1 progressive-stats">
                        <span className="loading-progress">
                            Loading {loadedWeeks} of {contributionsData.contributionCalendar.weeks?.length || 52} weeks...
                        </span>
                    </p>
                </div>
                <div className="contributions-wrapper rounded-lg p-4 overflow-hidden">
                    <div className="contributions-calendar progressive-loading">
                        {/* Month labels */}
                        <div className="month-labels">
                            {generateMonthLabels().map((label, index) => (
                                <span
                                    key={index}
                                    className={`month-label ${(index * 4) < loadedWeeks ? 'progressive-visible' : 'progressive-hidden'}`}
                                    style={{ left: `${label.x}px` }}
                                >
                                    {label.month}
                                </span>
                            ))}
                        </div>

                        {/* Day labels */}
                        <div className="day-labels">
                            <span className={`day-label progressive-visible`} style={{ top: '12px' }}>L</span>
                            <span className={`day-label progressive-visible`} style={{ top: '36px' }}>M</span>
                            <span className={`day-label progressive-visible`} style={{ top: '60px' }}>F</span>
                        </div>

                        {/* Contribution grid with progressive loading */}
                        <div className="contributions-grid">
                            {contributionsData.contributionCalendar.weeks?.map((week, weekIndex) => (
                                <div key={weekIndex} className="contribution-week">
                                    {week.contributionDays?.map((day, dayIndex) => {
                                        const isLoaded = weekIndex < loadedWeeks;

                                        if (isLoaded) {
                                            return (
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
                                                        className={`contribution-day progressive-day progressive-loaded clickable`}
                                                        style={{
                                                            backgroundColor: getContributionColor(day.contributionCount),
                                                            animationDelay: `${Math.floor(weekIndex / 4) * 15 + (weekIndex % 4) * 3}ms`
                                                        }}
                                                        onClick={() => handleDayClick(day.date)}
                                                    />
                                                </Tooltip>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`contribution-day progressive-day progressive-skeleton`}
                                                    style={{
                                                        backgroundColor: 'var(--color-spacial-5)',
                                                        animationDelay: `${Math.floor(weekIndex / 4) * 15 + (weekIndex % 4) * 3}ms`
                                                    }}
                                                />
                                            );
                                        }
                                    }) || []}
                                </div>
                            )) || []}
                        </div>

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
                    {contributionsData.contributionCalendar.totalContributions} contributions across all projects
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

                </div>
            </div>
        </div>
    );
}