import { Octokit } from '@octokit/core';

// GitHub API client
const octokit = new Octokit();

// Get user repositories count
export async function getGitHubReposCount(username: string = 'maurocardena'): Promise<number> {
  try {
    const response = await octokit.request('GET /users/{username}', {
      username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    return response.data.public_repos || 0;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return 0;
  }
}

// Get user profile data
export async function getGitHubProfile(username: string = 'maurocardena') {
  try {
    const response = await octokit.request('GET /users/{username}', {
      username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    return {
      repos: response.data.public_repos || 0,
      followers: response.data.followers || 0,
      following: response.data.following || 0,
      avatar_url: response.data.avatar_url,
      bio: response.data.bio,
      location: response.data.location,
      blog: response.data.blog,
      company: response.data.company,
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return {
      repos: 0,
      followers: 0,
      following: 0,
      avatar_url: '',
      bio: '',
      location: '',
      blog: '',
      company: '',
    };
  }
}