import { addCopyToClipboardButtons } from './copy-to-clipboard';

/* Bio Modal */
const initBioModal = () => {

    const showBio = (divId) => {
        const div = document.getElementById(divId);
        if (div) {
            hideBioFromAll();
            div.classList.add('active-bio');
            div.ariaHidden = "false";
        }
    }

    const hideBio = (divId) => {
        const div = document.getElementById(divId);
        if (div) {
            div.classList.remove('active-bio');
            div.ariaHidden = "true";
        }
    }

    const hideBioFromAll = () => {
        const elements = document.querySelectorAll('.active-bio');
        
        elements.forEach(element => {
            element.classList.remove('active-bio');
            element.ariaHidden = "true";
        });
    }

    // Attach the function(s) to the global window object to be accessible globally
    window.showBio = showBio;
    window.hideBio = hideBio;
}

/* Mobile Navigation */
const initMenu = () => {    
    const elNavigation = document.getElementById('navigation');

    const hideMobileNav = (ariaHidden = "true") => {
        if ((elNavigation && window.innerWidth < 640) || (elNavigation && ariaHidden === "false")) {
            elNavigation.classList.remove('active-navigation');
            elNavigation.ariaHidden = ariaHidden;
        }
    }

    const showMobileNav = () => {
        if (elNavigation) {
            elNavigation.classList.add('active-navigation');
            elNavigation.ariaHidden = "false";
        }
    }

    const handleResize = () => {
        if (window.innerWidth >= 640) {
            hideMobileNav("false");

        } else if (elNavigation) {
            if(!elNavigation.classList.contains('active-navigation')) {
                hideMobileNav("true");
            }
        }
    }
    
    // Attach the resize event listener to the window
    window.addEventListener('resize', handleResize);
    // Call the function on page load to ensure the class is removed if the window starts at a large width
    handleResize();

    // Attach the function(s) to the global window object to be accessible globally 
    window.hideMobileNav = hideMobileNav;
    window.showMobileNav = showMobileNav;
}

document.addEventListener('DOMContentLoaded', function () {
    initBioModal();
    initMenu();
    addCopyToClipboardButtons('highlight');
});

// Bio modal functions (existing functionality)
function showBio(bioId) {
    const bioElement = document.getElementById(bioId);
    if (bioElement) {
      bioElement.classList.remove('hidden');
      bioElement.classList.add('flex');
      bioElement.setAttribute('aria-hidden', 'false');
    }
  }
  
  function hideBio(bioId) {
    const bioElement = document.getElementById(bioId);
    if (bioElement) {
      bioElement.classList.add('hidden');
      bioElement.classList.remove('flex');
      bioElement.setAttribute('aria-hidden', 'true');
    }
  }
  
  // Mobile navigation functions (existing functionality)
  function showMobileNav() {
    const navigation = document.getElementById('navigation');
    if (navigation) {
      navigation.classList.remove('hidden');
      navigation.classList.add('active-navigation');
      navigation.setAttribute('aria-hidden', 'false');
    }
  }
  
  function hideMobileNav() {
    const navigation = document.getElementById('navigation');
    if (navigation) {
      navigation.classList.add('hidden');
      navigation.classList.remove('active-navigation');
      navigation.setAttribute('aria-hidden', 'true');
    }
  }
  
  // GitHub Reactions functionality (new)
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
  
    async fetchReactions(prNumber) {
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
            return [];
          }
          throw new Error(`GitHub API error: ${response.status}`);
        }
  
        const reactions = await response.json();
        this.cache.set(cacheKey, reactions);
        setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);
  
        return reactions;
      } catch (error) {
        console.warn(`Failed to fetch reactions for PR #${prNumber}:`, error);
        return [];
      }
    }
  
    countReactionTypes(reactions) {
      return reactions.reduce((counts, reaction) => {
        counts[reaction.content] = (counts[reaction.content] || 0) + 1;
        return counts;
      }, {});
    }
  
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
      
      const reactionElements = Object.entries(reactionCounts)
        .filter(([type, count]) => count > 0)
        .sort(([,a], [,b]) => b - a)
        .map(([type, count]) => {
          const emoji = this.reactionEmojis[type] || '👍';
          return `
            <div class="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span class="text-xl">${emoji}</span>
              <span class="font-medium text-gray-700">${count}</span>
            </div>
          `;
        });
  
      const mostPopularReaction = Object.entries(reactionCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      const summaryText = totalReactions === 1 
        ? '1 person reacted to this post'
        : `${totalReactions} people reacted to this post`;
  
      container.innerHTML = `
        <div class="reactions-full">
          <div class="flex flex-wrap gap-3 mb-4">
            ${reactionElements.join('')}
          </div>
          <div class="text-center">
            <p class="text-gray-600 text-sm mb-2">${summaryText}</p>
            ${mostPopularReaction ? `
              <p class="text-xs text-gray-500">
                Most popular: ${this.reactionEmojis[mostPopularReaction[0]]} 
                ${this.getReactionName(mostPopularReaction[0])} 
                (${mostPopularReaction[1]})
              </p>
            ` : ''}
          </div>
        </div>
      `;
    }
  
    getReactionName(type) {
      const names = {
        '+1': 'Thumbs up',
        '-1': 'Thumbs down',
        'laugh': 'Laugh',
        'confused': 'Confused',
        'heart': 'Heart',
        'hooray': 'Celebration',
        'rocket': 'Rocket',
        'eyes': 'Eyes'
      };
      return names[type] || type;
    }
  
    initializePage() {
      const previewElements = document.querySelectorAll('[id^="reactions-preview-"]');
      previewElements.forEach(element => {
        const prNumber = element.id.replace('reactions-preview-', '');
        this.renderPreview(parseInt(prNumber), element.id);
      });
  
      const fullElements = document.querySelectorAll('[id^="reactions-"]:not([id*="preview"])');
      fullElements.forEach(element => {
        const prNumber = element.id.replace('reactions-', '');
        this.renderFull(parseInt(prNumber), element.id);
      });
    }
  }
  
  // Global instance
  window.GitHubReactions = new GitHubReactions();
  
  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    // (Bio modals and mobile nav are handled by onclick attributes)
    
    // Initialize GitHub reactions
    window.GitHubReactions.initializePage();
  });
  
  // Make functions globally available for onclick attributes
  window.showBio = showBio;
  window.hideBio = hideBio;
  window.showMobileNav = showMobileNav;
  window.hideMobileNav = hideMobileNav;