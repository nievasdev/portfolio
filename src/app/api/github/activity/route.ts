import { NextRequest, NextResponse } from 'next/server';

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{
      message: string;
      url: string;
      sha: string;
    }>;
    pull_request?: {
      title: string;
      html_url: string;
      number: number;
    };
  };
}

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

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const activities: CommitActivity[] = [];

    if (githubToken) {
      try {
        // Fetch recent events from GitHub API
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=50`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App'
          }
        });

        if (eventsResponse.ok) {
          const events: GitHubEvent[] = await eventsResponse.json();
          
          // Process events and extract commits and PRs
          for (const event of events) {
            if (event.type === 'PushEvent' && event.payload.commits) {
              // Process commits
              for (const commit of event.payload.commits) {
                activities.push({
                  id: `commit_${commit.sha}`,
                  type: 'commit',
                  message: commit.message,
                  repository: event.repo.name.split('/')[1], // Get repo name without username
                  date: event.created_at,
                  url: commit.url.replace('api.github.com/repos', 'github.com').replace('/commits/', '/commit/'),
                  branch: 'main' // Default branch, could be extracted from event
                });
              }
            } else if (event.type === 'PullRequestEvent' && event.payload.pull_request) {
              // Process pull requests
              const pr = event.payload.pull_request;
              activities.push({
                id: `pr_${pr.number}_${event.repo.name}`,
                type: 'pull_request',
                message: pr.title,
                repository: event.repo.name.split('/')[1],
                date: event.created_at,
                url: pr.html_url
              });
            }
          }

          // Sort by date (most recent first) and limit to 10
          activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          return NextResponse.json({ 
            activities: activities.slice(0, 10),
            source: 'github_api'
          });
        }
      } catch (apiError) {
        console.error('GitHub API error:', apiError);
      }
    }

    // Fallback: return empty array, let client handle fallback data
    return NextResponse.json({ 
      activities: [],
      source: 'fallback'
    });

  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json({ 
      activities: [],
      source: 'error'
    }, { status: 500 });
  }
}