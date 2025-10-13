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
    const reactionContainers = document.querySelectorAll('.github-reactions');
    
    if (reactionContainers.length === 0) {
      return;
    }

    if (this.isDevelopment) {
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
        }, 1000 + (index * 200));
      });
      return;
    }

    const promises = Array.from(reactionContainers).map(async (container) => {
      const prNumber = container.dataset.pr;
      const slug = container.dataset.slug;
      
      if (prNumber && prNumber !== 'undefined' && prNumber !== '') {
        return this.loadReactionsForPR(prNumber, slug);
      } else {
        return this.findAndLoadReactions(slug);
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error processing reaction containers:', error);
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
      
      const prInfo = await this.fetchPRInfo(sanitizedPR);
      if (!prInfo) {
        if (this.isDevelopment) {
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
      
      const reactions = await this.fetchReactions(sanitizedPR);
      this.renderReactions(reactions, slug, prInfo);
      
      return { success: true, prNumber: sanitizedPR, reactions: reactions.length };
    } catch (error) {
      if (this.isDevelopment) {
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
    
    const mockReactions = [
      { content: '+1', user: { login: 'dev1' } },
      { content: '+1', user: { login: 'dev2' } },
      { content: 'heart', user: { login: 'community1' } },
      { content: 'rocket', user: { login: 'contributor1' } },
      { content: 'eyes', user: { login: 'reviewer1' } }
    ];
    
    const shuffled = mockReactions.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2;
    return shuffled.slice(0, count);
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

      const sanitizedPR = this.sanitizePRNumber(prNumber);
      if (!sanitizedPR) {
        throw new Error('Invalid PR number provided');
      }

      const url = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/issues/${sanitizedPR}/reactions`;
      
      try {
        const response = await this.secureFetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Hiero-Website-Reactions/1.0'
          }
        });

        this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || null;
        this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset')) || null;

        if (!response.ok) {
          const errorText = await response.text();
          
          if (response.status === 403 && errorText.includes('rate limit')) {
            if (this.isDevelopment) {
              return this.getMockReactions();
            }
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          }
          
          throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const reactions = await response.json();
        return reactions;
      } catch (error) {
        console.error(`Network error fetching reactions for PR #${prNumber}:`, error);
        
        if (this.isDevelopment && (
          error.name === 'TypeError' || 
          error.message.includes('NetworkError') ||
          error.message.includes('rate limit')
        )) {
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
        const sanitizedPR = this.sanitizePRNumber(prNumber);
        if (!sanitizedPR) {
          throw new Error('Invalid PR number provided');
        }

        const url = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls/${sanitizedPR}`;
        
        const response = await this.secureFetch(url, {
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
        
        if (response.status === 403) {
          const errorText = await response.text();
          if (errorText.includes('rate limit')) {
            if (this.isDevelopment) {
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
      
      const searchUrl = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls?state=closed&sort=updated&direction=desc&per_page=50`;
      
      const searchResponse = await this.secureFetch(searchUrl, {
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
          const sanitizedPR = this.sanitizePRNumber(pr.number);
          if (!sanitizedPR) {
            console.warn(`Invalid PR number: ${pr.number}`);
            continue;
          }

          const filesUrl = `${this.BASE_API_URL}/repos/${encodeURIComponent(this.REPO_OWNER)}/${encodeURIComponent(this.REPO_NAME)}/pulls/${sanitizedPR}/files`;
          
          const filesResponse = await this.secureFetch(filesUrl, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Hiero-Website-Reactions/1.0'
            }
          }).catch(error => {
            console.warn(`Failed to fetch files for PR ${sanitizedPR}:`, error);
            return null;
          });
          
          if (!filesResponse) continue;
          
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
      
      if (this.isDevelopment) {
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
      console.error(`Error in auto-discovery for ${slug}:`, error);
      
      if (this.isDevelopment) {
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

  isValidApiUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname !== 'api.github.com') {
        return false;
      }
      
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      if (pathParts.length < 6 || pathParts[0] !== 'repos') {
        return false;
      }
      
      if (pathParts[1] !== this.REPO_OWNER || pathParts[2] !== this.REPO_NAME) {
        return false;
      }
      
      const endpointType = pathParts[3];
      if (!['issues', 'pulls'].includes(endpointType)) {
        return false;
      }
      
      const number = pathParts[4];
      if (!/^\d+$/.test(number)) {
        return false;
      }
      
      const num = parseInt(number, 10);
      if (num < 1 || num > 999999) {
        return false;
      }
      
      const subEndpoint = pathParts[5];
      if (subEndpoint && !['reactions', 'files'].includes(subEndpoint)) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async secureFetch(url, options = {}) {
    if (!this.isValidApiUrl(url)) {
      throw new Error('Invalid or unsafe URL: Only GitHub API URLs for this repository are allowed');
    }
    
    return fetch(url, options);
  }

  isValidGitHubUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      
      if (urlObj.hostname !== 'github.com' || pathParts.length !== 4) {
        return false;
      }
      
      const [owner, repo, type, prNumber] = pathParts;
      if (type !== 'pull' || !/^\d+$/.test(prNumber)) {
        return false;
      }
      
      if (owner !== this.REPO_OWNER || repo !== this.REPO_NAME) {
        return false;
      }
      
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
        const sanitizedUrl = String(prInfo.html_url).replace(/[<>]/g, '');
        
        if (this.isValidGitHubUrl(sanitizedUrl)) {
          githubLink.setAttribute('href', sanitizedUrl);
          githubLink.style.display = 'flex';
          
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
    
    const reactionTypes = Array.from(reactionCounts.entries()).map(([type, count]) => ({
      type,
      count: Math.max(0, Math.floor(count))
    }));
    
    reactionTypes.sort((a, b) => b.count - a.count);
    
    reactionTypes.forEach(({ type, count }) => {
      if (!this.ALLOWED_REACTIONS.includes(type)) return;
      
      const emoji = Object.prototype.hasOwnProperty.call(this.emojiMap, type) ? this.emojiMap[type] : '❓';
      const label = Object.prototype.hasOwnProperty.call(this.reactionLabels, type) ? this.reactionLabels[type] : 'unknown';
      
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
  }

  logAutoDiscoveryProgress(message, data = null) {
    if (this.isDevelopment) {
      console.log(`Auto-Discovery: ${String(message).substring(0, 100)}`, data || '');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const reactionsManager = new GitHubReactions();
  
  window.GitHubReactions = reactionsManager;
  
  reactionsManager.initializeReactions().catch(error => {
    console.error('Failed to initialize GitHub reactions:', error);
  });
});

window.clearReactionsCache = () => {
  if (window.GitHubReactions) {
    window.GitHubReactions.clearCache();
  }
};