const { Octokit } = require('@octokit/core');
const envConfig = require('../config/env');

/**
 * GitHub Authentication Service
 * Handles GitHub API authentication using Node.js environment variables
 * Separated from Next.js environment variable loading
 */
class GitHubAuthService {
  constructor() {
    this.octokit = null;
    this.authenticated = false;
    this.initializeClient();
  }

  /**
   * Initialize GitHub client with authentication
   * @private
   */
  initializeClient() {
    const token = envConfig.getGitHubToken();
    
    if (token) {
      this.octokit = new Octokit({
        auth: token
      });
      this.authenticated = true;
      console.log('GitHub client initialized with authentication');
    } else {
      // Create client without authentication for public endpoints
      this.octokit = new Octokit();
      this.authenticated = false;
      console.log('GitHub client initialized without authentication (public access only)');
    }
  }

  /**
   * Get authenticated Octokit instance
   * @returns {Octokit} Octokit instance
   */
  getClient() {
    if (!this.octokit) {
      this.initializeClient();
    }
    return this.octokit;
  }

  /**
   * Check if client is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return this.authenticated;
  }

  /**
   * Get GitHub token (for internal use)
   * @returns {string|null} GitHub token or null
   * @private
   */
  getToken() {
    return envConfig.getGitHubToken();
  }

  /**
   * Test authentication by making a simple API call
   * @returns {Promise<boolean>} True if authentication works
   */
  async testAuthentication() {
    if (!this.authenticated) {
      return false;
    }

    try {
      const response = await this.octokit.request('GET /user');
      console.log('Authentication test successful:', response.data.login);
      return true;
    } catch (error) {
      console.error('Authentication test failed:', error.message);
      return false;
    }
  }

  /**
   * Make authenticated GraphQL request
   * @param {string} query GraphQL query
   * @param {object} variables Query variables
   * @returns {Promise<object>} GraphQL response
   */
  async graphqlRequest(query, variables = {}) {
    if (!this.authenticated) {
      throw new Error('GraphQL requests require authentication');
    }

    try {
      const response = await this.octokit.request('POST /graphql', {
        query,
        variables
      });
      
      return response.data;
    } catch (error) {
      console.error('GraphQL request failed:', error.message);
      throw error;
    }
  }

  /**
   * Make public REST API request (no authentication required)
   * @param {string} endpoint API endpoint
   * @param {object} params Request parameters
   * @returns {Promise<object>} API response
   */
  async publicRequest(endpoint, params = {}) {
    try {
      const response = await this.octokit.request(endpoint, {
        ...params,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          ...params.headers
        }
      });
      
      return response;
    } catch (error) {
      console.error('Public API request failed:', error.message);
      throw error;
    }
  }

  /**
   * Get service status and configuration
   * @returns {object} Service status
   */
  getStatus() {
    return {
      authenticated: this.authenticated,
      hasToken: envConfig.hasGitHubToken(),
      environmentInfo: envConfig.getEnvironmentInfo()
    };
  }
}

// Export singleton instance
const githubAuth = new GitHubAuthService();
module.exports = githubAuth;