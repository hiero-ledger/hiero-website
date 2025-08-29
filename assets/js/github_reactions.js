/**
 * GitHub Reactions Module for Hiero Blog
 * Fetches and displays GitHub PR reactions for blog posts
 */

class GitHubReactions {
  constructor() {
    this.baseUrl = 'https://api.github.com/repos/hiero-ledger/hiero-website/pulls';
    this.cache = new Map();
    this.reactionEmojis = {
      '+1': '👍',
      '-1': '👎',
      'laugh': '😄',
      'confused': '😕',
      'heart': '❤️',
      'hooray': '🎉',
      'rocket': '🚀',
      'eyes': '👀'
    };
  }

  /**
   * Fetch reactions for a specific PR
   * @param {number} prNumber - GitHub PR number
   * @returns {Promise<Array>} Array of reaction objects
   */
  async fetchReactions(prNumber) {
    // Check cache first
    const cacheKey = `reactions_${prNumber}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/${prNumber}/reactions`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hiero-Website'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.info(`PR #${prNumber} not found - this is normal for draft posts`);
          return [];
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const reactions = await response.json();
      
      // Cache the result for 5 minutes
      this.cache.set(cacheKey, reactions);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return reactions;
    } catch (error) {
      console.warn(`Failed to fetch reactions for PR #${prNumber}:`, error);
      return [];
    }
  }

  /**
   * Count reactions by type
   * @param {Array} reactions - Array of reaction objects from GitHub API
   * @returns {Object} Object with reaction types as keys and counts as values
   */
  countReactionTypes(reactions) {
    return reactions.reduce((counts, reaction) => {
      counts[reaction.content] = (counts[reaction.content] || 0) + 1;
      return counts;
    }, {});
  }

  /**
   * Render reactions for blog post previews (simplified view)
   * @param {number} prNumber - GitHub PR number
   * @param {string} containerId - ID of the container element
   */
  async renderPreview(prNumber, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reactions = await this.fetchReactions(prNumber);
    const totalReactions = reactions.length;

    if (totalReactions === 0) {
      container.innerHTML = '<span class="text-gray-400 text-sm">No reactions yet</span>';
      return;
    }

    const reactionCounts = this.countReactionTypes(reactions);
    const topReaction = Object.entries(reactionCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const emoji = this.reactionEmojis[topReaction[0]] || '👍';
    
    container.innerHTML = `
      <span class="flex items-center space-x-1 text-sm text-gray-600">
        <span class="text-base">${emoji}</span>
        <span>${totalReactions}</span>
      </span>
    `;
  }

  /**
   * Render full reactions display for individual blog posts
   * @param {number} prNumber - GitHub PR number
   * @param {string} containerId - ID of the container element
   */
  async renderFull(prNumber, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reactions = await this.fetchReactions(prNumber);
    const totalReactions = reactions.length;

    if (totalReactions === 0) {
      container.innerHTML = `
        <div class="text-center py-6">
          <div class="text-gray-500 mb-2">
            <span class="text-2xl">💭</span>
          </div>
          <p class="text-gray-500 font-medium mb-1">No reactions yet</p>
          <p class="text-sm text-gray-400">Be the first to react to this post!</p>
        </div>
      `;
      return;
    }

    const reactionCounts = this.countReactionTypes(reactions);
    
    // Generate individual reaction displays
    const reactionElements = Object.entries(reactionCounts)
      .filter(([type, count]) => count > 0)
      .sort(([,a], [,b]) => b - a) // Sort by count descending
      .map(([type, count]) => {
        const emoji = this.reactionEmojis[type] || '👍';
        return `
          <div class="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span class="text-xl">${emoji}</span>
            <span class="font-medium text-gray-700">${count}</span>
          </div>
        `;
      });

    // Generate summary statistics
    const mostPopularReaction = Object.entries(reactionCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    const summaryText = totalReactions === 1 
      ? '1 person reacted to this post'
      : `${totalReactions} people reacted to this post`;

    container.innerHTML = `
      <div class="reactions-full">
        <!-- Reaction counts -->
        <div class="flex flex-wrap gap-3 mb-4">
          ${reactionElements.join('')}
        </div>
        
        <!-- Summary -->
        <div class="text-center">
          <p class="text-gray-600 text-sm mb-2">${summaryText}</p>
          ${mostPopularReaction ? `
            <p class="text-xs text-gray-500">
              Most popular: ${this.reactionEmojis[mostPopularReaction[0]]} 
              ${mostPopularReaction[0] === '+1' ? 'Thumbs up' : 
                mostPopularReaction[0] === 'heart' ? 'Heart' : 
                mostPopularReaction[0] === 'hooray' ? 'Celebration' : 
                mostPopularReaction[0]} 
              (${mostPopularReaction[1]})
            </p>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Initialize reactions for all elements on the page
   */
  initializePage() {
    // Handle preview reactions (blog listing page)
    const previewElements = document.querySelectorAll('[id^="reactions-preview-"]');
    previewElements.forEach(element => {
      const prNumber = element.id.replace('reactions-preview-', '');
      this.renderPreview(parseInt(prNumber), element.id);
    });

    // Handle full reactions (blog post page)
    const fullElements = document.querySelectorAll('[id^="reactions-"]:not([id*="preview"])');
    fullElements.forEach(element => {
      const prNumber = element.id.replace('reactions-', '');
      this.renderFull(parseInt(prNumber), element.id);
    });
  }

  /**
   * Get popular posts based on reaction counts
   * @param {Array} prNumbers - Array of PR numbers to check
   * @returns {Promise<Array>} Array of {prNumber, totalReactions} sorted by popularity
   */
  async getPopularPosts(prNumbers) {
    const results = await Promise.all(
      prNumbers.map(async (prNumber) => {
        const reactions = await this.fetchReactions(prNumber);
        return {
          prNumber,
          totalReactions: reactions.length,
          reactions: this.countReactionTypes(reactions)
        };
      })
    );

    return results
      .filter(result => result.totalReactions > 0)
      .sort((a, b) => b.totalReactions - a.totalReactions);
  }
}

// Global instance
window.GitHubReactions = new GitHubReactions();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.GitHubReactions.initializePage();
});

// Utility functions for direct use in templates
window.loadReactions = function(prNumber, containerId, type = 'full') {
  if (type === 'preview') {
    window.GitHubReactions.renderPreview(prNumber, containerId);
  } else {
    window.GitHubReactions.renderFull(prNumber, containerId);
  }
};

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubReactions;
}