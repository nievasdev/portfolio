// Client-side fetch function for GitHub contributions
// Removed direct Node.js imports to avoid browser execution

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  colors: string[];
}

export interface ContributionsData {
  contributionCalendar: ContributionCalendar;
}

/**
 * Fetch GitHub contributions using server-side API route
 * This avoids client-side execution of Node.js modules
 */
export async function fetchGitHubContributions(username: string): Promise<ContributionsData | null> {
  try {
    const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      console.error('Failed to fetch contributions from API route:', response.status);
      return generateFallbackContributions();
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('API route returned error:', data.error);
      return generateFallbackContributions();
    }

    console.log('Successfully fetched GitHub contributions from API route');
    return data;

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return generateFallbackContributions();
  }
}

// Client-side fallback - removed server-side logic

// Generate fallback data for when API is unavailable
export function generateFallbackContributions(): ContributionsData {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  // Start from the first Sunday of the year
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
    const week: ContributionWeek = {
      contributionDays: [],
      firstDay: ''
    };

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);

      if (weekIndex === 0 && dayIndex === 0) {
        week.firstDay = currentDate.toISOString().split('T')[0];
      }

      // Generate semi-random contribution count
      const random = Math.random();
      let contributionCount = 0;
      let color = '#161b22'; // No contributions

      if (random > 0.7) {
        contributionCount = Math.floor(Math.random() * 10) + 1;
        if (contributionCount >= 1 && contributionCount <= 2) {
          color = '#0e4429';
        } else if (contributionCount >= 3 && contributionCount <= 5) {
          color = '#006d32';
        } else if (contributionCount >= 6 && contributionCount <= 8) {
          color = '#26a641';
        } else {
          color = '#39d353';
        }
      }

      week.contributionDays.push({
        date: currentDate.toISOString().split('T')[0],
        contributionCount,
        color,
        weekday: dayIndex
      });
    }

    weeks.push(week);
  }

  return {
    contributionCalendar: {
      totalContributions: weeks.reduce((total, week) =>
        total + week.contributionDays.reduce((weekTotal, day) => weekTotal + day.contributionCount, 0), 0
      ),
      weeks: weeks.slice(0, 52), // GitHub shows 52 weeks
      colors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    }
  };
}