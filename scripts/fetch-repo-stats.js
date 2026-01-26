#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repos = [
  'hiero-consensus-node', 'hiero-local-node', 'hiero-mirror-node',
  'hiero-improvement-proposals', 'hiero-sdk-js', 'hiero-sdk-java',
  'hiero-json-rpc-relay', 'hiero-sdk-go', 'hiero-sdk-rust',
  'hiero-mirror-node-explorer', 'hiero-cli', 'solo', 'hiero-block-node',
  'hiero-sdk-tck', 'hiero-sdk-cpp', 'governance', 'hiero-sdk-python',
  'hiero-sdk-swift', 'sdk-collaboration-hub', 'tsc'
];

async function fetchRepoStats() {
  const stats = {};
  console.log('📊 Fetching repository statistics...');
  
  for (const repo of repos) {
    try {
      const response = await fetch(`https://api.github.com/repos/hiero-ledger/${repo}`);
      if (response.ok) {
        const data = await response.json();
        stats[repo] = { stars: data.stargazers_count };
        console.log(`✓ ${repo}: ${data.stargazers_count} stars`);
      } else {
        stats[repo] = { stars: 0 };
        console.log(`✗ ${repo}: API error ${response.status}`);
      }
    } catch (error) {
      stats[repo] = { stars: 0 };
      console.log(`✗ ${repo}: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 50)); // Rate limit
  }
  
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  fs.writeFileSync(
    path.join(dataDir, 'repository_stats.json'),
    JSON.stringify(stats, null, 2)
  );
  
  const totalStars = Object.values(stats).reduce((sum, repo) => sum + repo.stars, 0);
  console.log(`🎉 Stats saved! Total stars: ${totalStars.toLocaleString()}`);
}

fetchRepoStats().catch(console.error);