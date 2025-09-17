class GitHubReactions {
  constructor() {
    // Hardcoded constants - no user input allowed
    this.REPO_OWNER = 'hiero-ledger';
    this.REPO_NAME = 'hiero-website';
    this.BASE_API_URL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
    this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Reaction emoji mapping - frozen to prevent modification
    this.emojiMap = Object.freeze({
      '+1': '👍',
      '-1': '👎',
      'laugh': '😄',
      'hooray': '🎉',
      'confused': '😕',
      'heart': '❤️',
      'rocket': '🚀',
      'eyes': '👀'
    });

    // Reaction labels for accessibility - frozen to prevent modification
    this.reactionLabels = Object.freeze({
      '+1': 'thumbs up',
      '-1': 'thumbs down',
      'laugh': 'laugh',
      'hooray': 'hooray',
      'confused': 'confused',
      'heart': 'heart',
      'rocket': 'rocket',
      'eyes': 'eyes'
    });

    // Allowed reaction types - whitelist for security
    this.ALLOWED_REACTIONS = Object.freeze(['+1', '-1', 'laugh', 'hooray', 'confused', 'heart', 'rocket', 'eyes']);
  }

  // Main initialization function
  async initializeReactions() {
    console.log('🚀 Initializing GitHub reactions...');
    
    const reactionContainers = document.querySelectorAll('.github-reactions');
    console.log(`Found ${reactionContainers.length} reaction containers`);
    
    if (reactionContainers.length === 0) {
      console.log('No reaction containers found on this page');
      return;
    }

    // Process each container
    const promises = Array.from(reactionContainers).map(async (container, index) => {
      const prNumber = container.dataset.pr;
      const slug = container.dataset.slug;
      
      console.log(`Processing container ${index + 1}:`, { prNumber, slug });
      
      if (prNumber && prNumber !== 'undefined' && prNumber !== '') {
        console.log(`Loading reactions for PR #${prNumber}`);
        return this.loadReactionsForPR(prNumber, slug);
      } else {
        console.log(`No PR specified for ${slug}, attempting auto-discovery`);
        return this.findAndLoadReactions(slug);
      }
    });

    // Wait for all containers to process
    try {
      await Promise.allSettled(promises);
      console.log('✅ All reaction containers processed');
    } catch (error) {
      console.error('❌ Error processing reaction containers:', error);
    }
  }

  // Validate and sanitize PR number
  sanitizePRNumber(prNumber) {
    if (!prNumber) return null;
    
    // Convert to string and remove any non-numeric characters
    const cleaned = String(prNumber).replace(/[^\d]/g, '');
    const numeric = parseInt(cleaned, 10);
    
    // Validate range (GitHub PR numbers are positive integers)
    if (isNaN(numeric) || numeric < 1 || numeric > 999999) {
      throw new Error('Invalid PR number format');
    }
    
    return numeric;
  }

  // Load reactions for a specific PR number
  async loadReactionsForPR(prNumber, slug) {
    try {
      const sanitizedPR = this.sanitizePRNumber(prNumber);
      if (!sanitizedPR) {
        throw new Error('Invalid PR number provided');
      }
      
      console.log(`Fetching reactions for PR #${sanitizedPR}...`);
      const reactions = await this.fetchReactions(sanitizedPR);
      
      // Also get PR info for the GitHub link
      const prInfo = await this.fetchPRInfo(sanitizedPR);
      
      console.log(`Found ${reactions.length} reactions for PR #${sanitizedPR}`);
      this.renderReactions(reactions, slug, prInfo);
      
      return { success: true, prNumber: sanitizedPR, reactions: reactions.length };
    } catch (error) {
      console.error(`❌ Error loading reactions for PR ${prNumber}:`, error);
      this.renderError(slug, `Unable to load reactions for PR #${prNumber}`);
      return { success: false, prNumber, error: error.message };
    }
  }

  // Provide mock reactions data for development
  getMockReactions() {
    if (!this.isDevelopment) return null;
    
    // Generate some realistic mock data
    const mockReactions = [
      { content: '+1', user: { login: 'dev1' } },
      { content: '+1', user: { login: 'dev2' } },
      { content: 'heart', user: { login: 'community1' } },
      { content: 'rocket', user: { login: 'contributor1' } },
      { content: 'eyes', user: { login: 'reviewer1' } }
    ];
    
    // Randomize the reactions slightly for realism
    const shuffled = mockReactions.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 reactions
    
    return shuffled.slice(0, count);
  }

  // Fetch reactions from GitHub API with caching and rate limit handling
  async fetchReactions(prNumber) {
    const cacheKey = `reactions-${prNumber}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Using cached reactions for PR #${prNumber}`);
      return cached.data;
    }

    // Check rate limit before making request
    if (this.rateLimitRemaining !== null && this.rateLimitRemaining <= 1) {
      const now = Date.now();
      const resetTime = this.rateLimitReset * 1000; // Convert to milliseconds
      
      if (now < resetTime) {
        throw new Error(`Rate limit exceeded. Resets at ${new Date(resetTime).toLocaleTimeString()}`);
      }
    }

    // Build URL using hardcoded template - NO user input
    const url = `${this.BASE_API_URL}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/issues/${prNumber}/reactions`;
    console.log(`Making API request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hiero-Website-Reactions/1.0'
          // Note: Add GitHub token here for higher rate limits in production
          // 'Authorization': 'token YOUR_GITHUB_TOKEN'
        }
      });

      // Update rate limit tracking
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || null;
      this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset')) || null;
      
      console.log(`Rate limit remaining: ${this.rateLimitRemaining}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const reactions = await response.json();
      
      // Cache the successful response
      this.cache.set(cacheKey, {
        data: reactions,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${reactions.length} reactions for PR #${prNumber}`);
      return reactions;
    } catch (error) {
      console.error(`Network error fetching reactions for PR #${prNumber}:`, error);
      
      // If it's a CORS error in development, use mock data
      if (this.isDevelopment && (error.name === 'TypeError' || error.message.includes('NetworkError'))) {
        console.log('🔄 Using mock reactions data for development (CORS limitation)');
        const mockReactions = this.getMockReactions();
        if (mockReactions) {
          // Cache mock data with shorter timeout
          this.cache.set(cacheKey, {
            data: mockReactions,
            timestamp: Date.now(),
            isMock: true
          });
          return mockReactions;
        }
      }
      
      throw error;
    }
  }

  // Fetch PR info for GitHub link
  async fetchPRInfo(prNumber) {
    const cacheKey = `pr-info-${prNumber}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Build URL using hardcoded template - NO user input
      const url = `${this.BASE_API_URL}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/pulls/${prNumber}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hiero-Website-Reactions/1.0',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        const prInfo = await response.json();
        this.cache.set(cacheKey, {
          data: prInfo,
          timestamp: Date.now()
        });
        return prInfo;
      }
    } catch (error) {
      console.warn(`Could not fetch PR info for #${prNumber}:`, error);
    }
    
    return null;
  }

  // Find PR by searching through recent PRs (fallback method)
  async findAndLoadReactions(slug) {
    try {
      this.logAutoDiscoveryProgress(`Starting auto-discovery for blog post: ${slug}`);
      
      // Build URL using hardcoded template
      const searchUrl = `${this.BASE_API_URL}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/pulls?state=closed&sort=updated&direction=desc&per_page=50`;
      
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hiero-Website-Reactions/1.0'
        }
      });
      
      if (!searchResponse.ok) {
        throw new Error(`Failed to search PRs: ${searchResponse.status}`);
      }
      
      const pulls = await searchResponse.json();
      this.logAutoDiscoveryProgress(`Searching through ${pulls.length} recent PRs...`);
      
      // Look for PR that added/modified this blog post
      for (const pr of pulls) {
        try {
          // Build URL using hardcoded template
          const filesUrl = `${this.BASE_API_URL}/repos/${this.REPO_OWNER}/${this.REPO_NAME}/pulls/${pr.number}/files`;
          
          const filesResponse = await fetch(filesUrl, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Hiero-Website-Reactions/1.0'
            }
          });
          
          if (!filesResponse.ok) continue;
          
          const files = await filesResponse.json();
          
          // Check if this PR modified the blog post file
          const hasPostFile = files.some(file => {
            const filename = file.filename.toLowerCase();
            const slugLower = slug.toLowerCase();
            
            return (
              filename.includes(`content/posts/${slugLower}.md`) ||
              filename.includes(`content/posts/${slugLower}/index.md`) ||
              filename.includes(`${slugLower}.md`) ||
              (filename.includes('content/posts/') && filename.includes(slugLower))
            );
          });
          
          if (hasPostFile) {
            this.logAutoDiscoveryProgress(`Found matching PR #${pr.number}: "${pr.title}"`);
            
            // Show info message about auto-discovery
            this.renderInfo(slug, `Found reactions from PR #${pr.number}: "${pr.title}"`);
            
            // Load reactions for the discovered PR
            await this.loadReactionsForPR(pr.number, slug);
            return;
          }
        } catch (error) {
          console.warn(`Error checking files for PR #${pr.number}:`, error);
          continue;
        }
      }
      
      this.logAutoDiscoveryProgress(`No matching PR found for blog post: ${slug}`);
      this.renderNoReactions(slug);
      
    } catch (error) {
      console.error(`❌ Error in auto-discovery for ${slug}:`, error);
      this.renderError(slug, 'Unable to find related discussion');
    }
  }

  // Validate GitHub URL safely - only allow specific pattern
  isValidGitHubUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Only allow GitHub.com URLs for our specific repo
    const allowedPattern = new RegExp(`^https://github\\.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/\\d+$`);
    return allowedPattern.test(url);
  }

  // Render reactions in the UI
  renderReactions(reactions, slug, prInfo = null) {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) {
      console.warn(`Container not found for slug: ${slug}`);
      return;
    }

    // Check if we're using mock data
    const isMockData = this.cache.get(`reactions-${slug}`)?.isMock || false;

    // Update GitHub link if we have PR info
    if (prInfo && prInfo.html_url) {
      const githubLink = container.closest('.github-reactions').querySelector('.github-link');
      if (githubLink) {
        // Validate URL before assignment - only allow our repo URLs
        if (this.isValidGitHubUrl(prInfo.html_url)) {
          githubLink.href = prInfo.html_url;
          githubLink.style.display = 'flex';
          
          // Create safe title text
          const prTitle = prInfo.title ? String(prInfo.title).substring(0, 100) : 'Untitled';
          const titleText = `React on PR #${prInfo.number}: ${prTitle}`;
          githubLink.title = titleText;
        }
      }
    }

    // Group reactions by type and count them safely
    const reactionCounts = this.groupReactionsByTypeSafely(reactions);

    // If no reactions, show appropriate message
    if (this.countReactionsSafely(reactionCounts) === 0) {
      this.clearContainerSafely(container);
      const noReactionsDiv = document.createElement('div');
      noReactionsDiv.className = 'no-reactions';
      noReactionsDiv.textContent = 'No reactions yet - be the first to react!';
      container.appendChild(noReactionsDiv);
      return;
    }

    // Show development notice if using mock data
    if (isMockData) {
      this.showDevelopmentNotice(container);
    }

    // Create reaction elements safely
    this.clearContainerSafely(container);
    this.renderReactionItemsSafely(container, reactionCounts);
    
    // Add analytics event
    this.trackReactionsLoaded(slug, this.countReactionsSafely(reactionCounts), reactions.length);
  }

  // Group reactions by type safely - prevent injection
  groupReactionsByTypeSafely(reactions) {
    const safeCounts = new Map(); // Use Map instead of Object for safety
    
    if (Array.isArray(reactions)) {
      reactions.forEach(reaction => {
        if (reaction && typeof reaction === 'object' && reaction.content) {
          const content = String(reaction.content);
          
          // Only allow whitelisted reaction types
          if (this.ALLOWED_REACTIONS.includes(content)) {
            const currentCount = safeCounts.get(content) || 0;
            safeCounts.set(content, currentCount + 1);
          }
        }
      });
    }
    
    return safeCounts;
  }

  // Count reactions safely
  countReactionsSafely(reactionCounts) {
    return reactionCounts instanceof Map ? reactionCounts.size : 0;
  }

  // Render individual reaction items safely
  renderReactionItemsSafely(container, reactionCounts) {
    if (!(reactionCounts instanceof Map)) return;
    
    // Convert Map to array and sort safely
    const reactionTypes = Array.from(reactionCounts.entries()).map(([type, count]) => ({
      type,
      count: Math.max(0, Math.floor(count)) // Ensure positive integer
    }));
    
    reactionTypes.sort((a, b) => b.count - a.count); // Sort by count (highest first)
    
    reactionTypes.forEach(({ type, count }) => {
      // Double-check whitelist
      if (!this.ALLOWED_REACTIONS.includes(type)) return;
      
      const emoji = this.emojiMap[type] || '👍';
      const label = this.reactionLabels[type] || type;
      
      const reactionDiv = document.createElement('div');
      reactionDiv.className = 'reaction-item';
      reactionDiv.title = `${count} ${label} reaction${count !== 1 ? 's' : ''}`;
      reactionDiv.setAttribute('data-reaction', type);
      
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'reaction-emoji';
      emojiSpan.setAttribute('role', 'img');
      emojiSpan.setAttribute('aria-label', label);
      emojiSpan.textContent = emoji;
      
      const countSpan = document.createElement('span');
      countSpan.className = 'reaction-count';
      countSpan.textContent = String(count);
      
      reactionDiv.appendChild(emojiSpan);
      reactionDiv.appendChild(countSpan);
      container.appendChild(reactionDiv);
    });
  }

  // Show development notice
  showDevelopmentNotice(container) {
    const parent = container.parentElement;
    if (!parent) return;
    
    let devNotice = parent.querySelector('.reactions-dev-notice');
    
    if (!devNotice) {
      devNotice = document.createElement('div');
      devNotice.className = 'reactions-dev-notice';
      
      const noticeDiv = document.createElement('div');
      noticeDiv.style.cssText = 'background: #f0f8ff; border: 1px solid #0066cc; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 0.875rem; color: #0066cc;';
      
      const iconSpan = document.createElement('span');
      iconSpan.textContent = '🧪 ';
      
      const strongElement = document.createElement('strong');
      strongElement.textContent = 'Development Mode: ';
      
      const textSpan = document.createElement('span');
      textSpan.textContent = 'Showing mock reactions data. In production, this will display real GitHub reactions.';
      
      noticeDiv.appendChild(iconSpan);
      noticeDiv.appendChild(strongElement);
      noticeDiv.appendChild(textSpan);
      devNotice.appendChild(noticeDiv);
      
      parent.insertBefore(devNotice, container);
    }
  }

  // Clear container safely
  clearContainerSafely(container) {
    if (!container) return;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  // Render info message
  renderInfo(slug, message) {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) return;
    
    const parent = container.parentElement;
    if (!parent) return;
    
    let infoDiv = parent.querySelector('.reactions-info');
    
    if (!infoDiv) {
      infoDiv = document.createElement('div');
      infoDiv.className = 'reactions-info';
      parent.insertBefore(infoDiv, container);
    }
    
    infoDiv.textContent = String(message).substring(0, 200); // Limit message length
  }

  // Render no reactions state
  renderNoReactions(slug) {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) return;
    
    // Hide the entire reactions component when no PR is found
    const reactionsWrapper = container.closest('.github-reactions');
    if (reactionsWrapper) {
      reactionsWrapper.style.display = 'none';
    }
  }

  // Render error state
  renderError(slug, message = 'Unable to load reactions') {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) return;
    
    // For auto-discovery errors, hide the component instead of showing error
    if (message.includes('Invalid search URL') || message.includes('auto-discovery')) {
      this.renderNoReactions(slug);
      return;
    }
    
    this.clearContainerSafely(container);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'reactions-error';
    errorDiv.textContent = String(message).substring(0, 100); // Limit error message length
    container.appendChild(errorDiv);
  }

  // Analytics/tracking (optional)
  trackReactionsLoaded(slug, uniqueReactions, totalReactions) {
    // You can integrate with your analytics system here
    console.log(`📊 Reactions loaded for ${slug}:`, {
      uniqueReactions,
      totalReactions
    });
    
    // Example: Google Analytics event (only if gtag is available)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'reactions_loaded', {
        'custom_parameter_1': String(slug).substring(0, 50),
        'custom_parameter_2': Math.max(0, Math.floor(uniqueReactions)),
        'value': Math.max(0, Math.floor(totalReactions))
      });
    }
  }

  // Utility method to clear cache (useful for development)
  clearCache() {
    this.cache.clear();
    console.log('🧹 Reactions cache cleared');
  }

  // Log auto-discovery progress for debugging
  logAutoDiscoveryProgress(message, data = null) {
    if (this.isDevelopment) {
      console.log(`🔍 Auto-Discovery: ${String(message).substring(0, 100)}`, data || '');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 GitHub Reactions system starting...');
  
  const reactionsManager = new GitHubReactions();
  
  // Make available globally for debugging
  window.GitHubReactions = reactionsManager;
  
  // Initialize reactions
  reactionsManager.initializeReactions().catch(error => {
    console.error('❌ Failed to initialize GitHub reactions:', error);
  });
});

// Expose utility functions for development/debugging
window.clearReactionsCache = () => {
  if (window.GitHubReactions) {
    window.GitHubReactions.clearCache();
  }
};
