const dotenv = require('dotenv');

// Load environment variables from .env files
dotenv.config();

/**
 * Environment configuration module using Node.js dotenv
 * This module handles environment variable loading independently from Next.js
 */
class EnvironmentConfig {
  constructor() {
    this.loadEnvironmentVariables();
  }

  loadEnvironmentVariables() {
    // Load environment variables using dotenv
    const result = dotenv.config();
    
    if (result.error) {
      console.warn('Warning: Could not load .env file:', result.error.message);
    }
  }

  /**
   * Get GitHub token from environment variables
   * @returns {string|null} GitHub token or null if not found
   */
  getGitHubToken() {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      console.warn('Warning: GITHUB_TOKEN not found in environment variables');
      return null;
    }
    
    // Validate token format (basic validation)
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
      console.warn('Warning: GITHUB_TOKEN may not be in correct format');
    }
    
    return token;
  }

  /**
   * Check if GitHub token is available
   * @returns {boolean} True if token exists
   */
  hasGitHubToken() {
    return !!this.getGitHubToken();
  }

  /**
   * Get all environment info for debugging (without sensitive data)
   * @returns {object} Environment info
   */
  getEnvironmentInfo() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasGitHubToken: this.hasGitHubToken(),
      dotenvLoaded: !!process.env.GITHUB_TOKEN
    };
  }
}

// Export singleton instance
const envConfig = new EnvironmentConfig();
module.exports = envConfig;