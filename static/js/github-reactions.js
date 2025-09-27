class GitHubReactions {
  constructor() {
    this.REPO_OWNER = 'hiero-ledger';
    this.REPO_NAME = 'hiero-website';
    this.BASE_API_URL = 'https://api.github.com';
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000;
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
    this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
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

    this.ALLOWED_REACTIONS = Object.freeze(['+1', '-1', 'laugh', 'hooray', 'confused', 'heart', 'rocket', 'eyes']);
  }

  async initializeReactions() {
    console.log('🚀 Initializing GitHub reactions...');
    console.log('🌍 Environment:', this.isDevelopment ? 'Development' : 'Production');
    
    const reactionContainers = document.querySelectorAll('.github-reactions');
    console.log(`Found ${reactionContainers.length} reaction containers`);
    
    if (reactionContainers.length === 0) {
      console.log('No reaction containers found on this page');
      return;
    }

    // In development, immediately show mock data for testing
    if (this.isDevelopment) {
      console.log('🧪 Development mode: Showing mock data immediately');
      reactionContainers.forEach((container, index) => {
        const slug = container.dataset.slug;
        const prNumber = container.dataset.pr || 'mock';
        
        setTimeout(() => {
          const mockReactions = this.getMockReactions();
          const mockPRInfo = {
            number: prNumber,
            title: `Mock PR #${prNumber}`,
            html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/${prNumber}`,
            state: 'closed'
          };
          this.renderReactions(mockReactions, slug, mockPRInfo);
        }, 1000 + (index * 200)); // Stagger the loading
      });
      return;
    }

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

    try {
      await Promise.allSettled(promises);
      console.log('✅ All reaction containers processed');
    } catch (error) {
      console.error('❌ Error processing reaction containers:', error);
    }
  }

  sanitizePRNumber(prNumber) {
    if (!prNumber) return null;
    
    const cleaned = String(prNumber).replace(/[^\d]/g, '');
    const numeric = parseInt(cleaned, 10);
    
    if (isNaN(numeric) || numeric < 1 || numeric > 999999) {
      throw new Error('Invalid PR number format');
    }
    
    return numeric;
  }

  clearContainer(container) {
    if (!container) return;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  groupReactions(reactions) {
    const safeCounts = new Map();
    
    if (Array.isArray(reactions)) {
      reactions.forEach(reaction => {
        if (reaction && typeof reaction === 'object' && reaction.content) {
          const content = String(reaction.content);
          
          if (this.ALLOWED_REACTIONS.includes(content)) {
            const currentCount = safeCounts.get(content) || 0;
            safeCounts.set(content, currentCount + 1);
          }
        }
      });
    }
    
    return safeCounts;
  }

  async fetchWithCache(cacheKey, fetchFn) {
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Using cached data for ${cacheKey}`);
      return cached.data;
    }

    const data = await fetchFn();
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  async loadReactionsForPR(prNumber, slug) {
    try {
      const sanitizedPR = this.sanitizePRNumber(prNumber);
      if (!sanitizedPR) {
        throw new Error('Invalid PR number provided');
      }
      
      console.log(`Fetching reactions for PR #${sanitizedPR}...`);
      
      // First check if PR exists
      const prInfo = await this.fetchPRInfo(sanitizedPR);
      if (!prInfo) {
        // In development, use mock data if PR not found
        if (this.isDevelopment) {
          console.log('🔄 PR not found, using mock data for development');
          const mockReactions = this.getMockReactions();
          const mockPRInfo = {
            number: sanitizedPR,
            title: `Mock PR #${sanitizedPR}`,
            html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/${sanitizedPR}`,
            state: 'closed'
          };
          this.renderReactions(mockReactions, slug, mockPRInfo);
          return { success: true, prNumber: sanitizedPR, reactions: mockReactions.length };
        }
        this.renderError(slug, `PR #${sanitizedPR} not found or not accessible`);
        return { success: false, prNumber: sanitizedPR, error: 'PR not found' };
      }
      
      console.log(`PR #${sanitizedPR} found: "${prInfo.title}"`);
      
      const reactions = await this.fetchReactions(sanitizedPR);
      
      console.log(`Found ${reactions.length} reactions for PR #${sanitizedPR}`);
      this.renderReactions(reactions, slug, prInfo);
      
      return { success: true, prNumber: sanitizedPR, reactions: reactions.length };
    } catch (error) {
      console.error(`❌ Error loading reactions for PR ${prNumber}:`, error);
      
      // In development, use mock data for any error
      if (this.isDevelopment) {
        console.log('🔄 Error occurred, using mock data for development');
        const mockReactions = this.getMockReactions();
        const mockPRInfo = {
          number: prNumber,
          title: `Mock PR #${prNumber}`,
          html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/${prNumber}`,
          state: 'closed'
        };
        this.renderReactions(mockReactions, slug, mockPRInfo);
        return { success: true, prNumber, reactions: mockReactions.length };
      }
      
      // Provide more specific error messages for production
      if (error.message.includes('404')) {
        this.renderError(slug, `PR #${prNumber} not found`);
      } else if (error.message.includes('403')) {
        this.renderError(slug, `Access denied for PR #${prNumber}`);
      } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        this.renderError(slug, `Network error: Unable to fetch reactions`);
      } else {
        this.renderError(slug, `Failed to load reactions: ${error.message}`);
      }
      
      return { success: false, prNumber, error: error.message };
    }
  }

  getMockReactions() {
    if (!this.isDevelopment) return null;
    
    console.log('🎭 Generating mock reactions for development');
    
    const mockReactions = [
      { content: '+1', user: { login: 'dev1' } },
      { content: '+1', user: { login: 'dev2' } },
      { content: 'heart', user: { login: 'community1' } },
      { content: 'rocket', user: { login: 'contributor1' } },
      { content: 'eyes', user: { login: 'reviewer1' } }
    ];
    
    const shuffled = mockReactions.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2;
    const result = shuffled.slice(0, count);
    
    console.log(`🎭 Generated ${result.length} mock reactions:`, result);
    return result;
  }

  async fetchReactions(prNumber) {
    const cacheKey = `reactions-${prNumber}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      if (this.rateLimitRemaining !== null && this.rateLimitRemaining <= 1) {
        const now = Date.now();
        const resetTime = this.rateLimitReset * 1000;
        
        if (now < resetTime) {
          throw new Error(`Rate limit exceeded. Resets at ${new Date(resetTime).toLocaleTimeString()}`);
        }
      }

      // Sanitize PR number to prevent URL injection
      const sanitizedPR = this.sanitizePRNumber(prNumber);
      if (!sanitizedPR) {
        throw new Error('Invalid PR number provided');
      }

      // Construct URL safely with validated components
      const url = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/issues/${sanitizedPR}/reactions`;
      console.log(`Making API request to: ${url}`);
      
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Hiero-Website-Reactions/1.0'
          }
        });

        this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || null;
        this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset')) || null;
        
        console.log(`Rate limit remaining: ${this.rateLimitRemaining}`);

        if (!response.ok) {
          const errorText = await response.text();
          
          // Handle rate limit specifically
          if (response.status === 403 && errorText.includes('rate limit')) {
            console.warn('GitHub API rate limit exceeded. Using mock data for development.');
            if (this.isDevelopment) {
              return this.getMockReactions();
            }
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          }
          
          throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const reactions = await response.json();
        console.log(`Successfully fetched ${reactions.length} reactions for PR #${prNumber}`);
        return reactions;
      } catch (error) {
        console.error(`Network error fetching reactions for PR #${prNumber}:`, error);
        
        // Use mock data in development for any network issues or rate limits
        if (this.isDevelopment && (
          error.name === 'TypeError' || 
          error.message.includes('NetworkError') ||
          error.message.includes('rate limit')
        )) {
          console.log('🔄 Using mock reactions data for development');
          const mockReactions = this.getMockReactions();
          if (mockReactions) {
            return mockReactions;
          }
        }
        
        throw error;
      }
    });
  }

  async fetchPRInfo(prNumber) {
    const cacheKey = `pr-info-${prNumber}`;
    
    try {
      return await this.fetchWithCache(cacheKey, async () => {
        // Sanitize PR number to prevent URL injection
        const sanitizedPR = this.sanitizePRNumber(prNumber);
        if (!sanitizedPR) {
          throw new Error('Invalid PR number provided');
        }

        // Construct URL safely with validated components
        const url = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls/${sanitizedPR}`;
        
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
          return await response.json();
        }
        
        // Handle rate limit specifically
        if (response.status === 403) {
          const errorText = await response.text();
          if (errorText.includes('rate limit')) {
            console.warn('GitHub API rate limit exceeded for PR info.');
            if (this.isDevelopment) {
              // Return mock PR info for development
              return {
                number: prNumber,
                title: `Mock PR #${prNumber}`,
                html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/${prNumber}`,
                state: 'closed'
              };
            }
          }
        }
        
        throw new Error(`Failed to fetch PR info: ${response.status}`);
      });
    } catch (error) {
      console.warn(`Could not fetch PR info for #${prNumber}:`, error);
      return null;
    }
  }

  async findAndLoadReactions(slug) {
    try {
      this.logAutoDiscoveryProgress(`Starting auto-discovery for blog post: ${slug}`);
      
      // Construct search URL safely with validated components
      const searchUrl = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls?state=closed&sort=updated&direction=desc&per_page=50`;
      
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
      
      for (const pr of pulls) {
        try {
          // Sanitize PR number to prevent URL injection
          const sanitizedPR = this.sanitizePRNumber(pr.number);
          if (!sanitizedPR) {
            console.warn(`Invalid PR number: ${pr.number}`);
            continue;
          }

          // Construct files URL safely with validated components
          const filesUrl = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls/${sanitizedPR}/files`;
          
          const filesResponse = await fetch(filesUrl, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Hiero-Website-Reactions/1.0'
            }
          });
          
          if (!filesResponse.ok) continue;
          
          const files = await filesResponse.json();
          
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
            this.renderInfo(slug, `Found reactions from PR #${pr.number}: "${pr.title}"`);
            await this.loadReactionsForPR(pr.number, slug);
            return;
          }
        } catch (error) {
          console.warn(`Error checking files for PR #${pr.number}:`, error);
          continue;
        }
      }
      
      this.logAutoDiscoveryProgress(`No matching PR found for blog post: ${slug}`);
      
      // In development, show mock data when no PR is found
      if (this.isDevelopment) {
        console.log('🔄 No PR found, using mock data for development');
        const mockReactions = this.getMockReactions();
        const mockPRInfo = {
          number: 'auto-discovered',
          title: `Mock PR for ${slug}`,
          html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/auto-discovered`,
          state: 'closed'
        };
        this.renderReactions(mockReactions, slug, mockPRInfo);
        return;
      }
      
      this.renderError(slug, `Unable to find related discussion for this blog post`);
      
    } catch (error) {
      console.error(`❌ Error in auto-discovery for ${slug}:`, error);
      
      // In development, use mock data for any auto-discovery error
      if (this.isDevelopment) {
        console.log('🔄 Auto-discovery error, using mock data for development');
        const mockReactions = this.getMockReactions();
        const mockPRInfo = {
          number: 'auto-discovered',
          title: `Mock PR for ${slug}`,
          html_url: `https://github.com/${this.REPO_OWNER}/${this.REPO_NAME}/pull/auto-discovered`,
          state: 'closed'
        };
        this.renderReactions(mockReactions, slug, mockPRInfo);
        return;
      }
      
      this.renderError(slug, 'Unable to find related discussion');
    }
  }

  isValidGitHubUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      
      // Validate hostname and path structure
      if (urlObj.hostname !== 'github.com' || pathParts.length !== 4) {
        return false;
      }
      
      // Validate path components against expected values
      const [owner, repo, type, prNumber] = pathParts;
      if (type !== 'pull' || !/^\d+$/.test(prNumber)) {
        return false;
      }
      
      // Validate owner and repo match expected values
      if (owner !== this.REPO_OWNER || repo !== this.REPO_NAME) {
        return false;
      }
      
      // Additional validation: ensure PR number is within reasonable range
      const prNum = parseInt(prNumber, 10);
      if (prNum < 1 || prNum > 999999) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  renderReactions(reactions, slug, prInfo = null) {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) {
      console.warn(`Container not found for slug: ${slug}`);
      return;
    }

    const isMockData = this.cache.get(`reactions-${slug}`)?.isMock || false;

    if (prInfo && prInfo.html_url) {
      const githubLink = container.closest('.github-reactions').querySelector('.github-link');
      if (githubLink) {
        // Validate URL before setting href to prevent HTML injection
        if (this.isValidGitHubUrl(prInfo.html_url)) {
          // Use setAttribute for safer URL assignment
          githubLink.setAttribute('href', prInfo.html_url);
          githubLink.style.display = 'flex';
          
          // Sanitize title to prevent HTML injection
          const prTitle = prInfo.title ? String(prInfo.title).substring(0, 100).replace(/[<>]/g, '') : 'Untitled';
          const titleText = `React on PR #${prInfo.number}: ${prTitle}`;
          githubLink.setAttribute('title', titleText);
        }
      }
    }

    const reactionCounts = this.groupReactions(reactions);

    if (reactionCounts.size === 0) {
      this.clearContainer(container);
      const noReactionsDiv = document.createElement('div');
      noReactionsDiv.className = 'no-reactions';
      noReactionsDiv.textContent = 'No reactions yet - be the first to react!';
      container.appendChild(noReactionsDiv);
      return;
    }

    if (isMockData) {
      this.showDevelopmentNotice(container);
    }

    this.clearContainer(container);
    this.renderReactionItems(container, reactionCounts);
    
    this.trackReactionsLoaded(slug, reactionCounts.size, reactions.length);
  }

  renderReactionItems(container, reactionCounts) {
    if (!(reactionCounts instanceof Map)) return;
    
    console.log('🎨 Rendering reaction items:', reactionCounts);
    console.log('📦 Container:', container);
    
    const reactionTypes = Array.from(reactionCounts.entries()).map(([type, count]) => ({
      type,
      count: Math.max(0, Math.floor(count))
    }));
    
    console.log('📊 Reaction types:', reactionTypes);
    
    reactionTypes.sort((a, b) => b.count - a.count);
    
    reactionTypes.forEach(({ type, count }, index) => {
      if (!this.ALLOWED_REACTIONS.includes(type)) return;
      
      // Safely access emoji and label with fallbacks to prevent object injection
      const emoji = this.emojiMap.hasOwnProperty(type) ? this.emojiMap[type] : '❓';
      const label = this.reactionLabels.hasOwnProperty(type) ? this.reactionLabels[type] : 'unknown';
      
      console.log(`🎯 Creating reaction item ${index + 1}:`, { type, count, emoji, label });
      
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
      
      console.log(`✅ Added reaction item ${index + 1} to container`);
    });
    
    console.log('🎨 Finished rendering reaction items. Container children:', container.children.length);
  }

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
    
    infoDiv.textContent = String(message).substring(0, 200);
  }

  renderNoReactions(slug) {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) return;
    
    const reactionsWrapper = container.closest('.github-reactions');
    if (reactionsWrapper) {
      reactionsWrapper.style.display = 'none';
    }
  }

  renderError(slug, message = 'Unable to load reactions') {
    const container = document.getElementById(`reactions-${slug}`);
    if (!container) return;
    
    if (message.includes('Invalid search URL') || message.includes('auto-discovery')) {
      this.renderNoReactions(slug);
      return;
    }
    
    this.clearContainer(container);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'reactions-error';
    errorDiv.textContent = String(message).substring(0, 100);
    container.appendChild(errorDiv);
  }

  trackReactionsLoaded(slug, uniqueReactions, totalReactions) {
    console.log(`📊 Reactions loaded for ${slug}:`, {
      uniqueReactions,
      totalReactions
    });
    
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'reactions_loaded', {
        'custom_parameter_1': String(slug).substring(0, 50),
        'custom_parameter_2': Math.max(0, Math.floor(uniqueReactions)),
        'value': Math.max(0, Math.floor(totalReactions))
      });
    }
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Reactions cache cleared');
  }

  logAutoDiscoveryProgress(message, data = null) {
    if (this.isDevelopment) {
      console.log(`🔍 Auto-Discovery: ${String(message).substring(0, 100)}`, data || '');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 GitHub Reactions system starting...');
  
  const reactionsManager = new GitHubReactions();
  
  window.GitHubReactions = reactionsManager;
  
  reactionsManager.initializeReactions().catch(error => {
    console.error('❌ Failed to initialize GitHub reactions:', error);
  });
});

window.clearReactionsCache = () => {
  if (window.GitHubReactions) {
    window.GitHubReactions.clearCache();
  }
};