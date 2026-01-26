#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repos = [
  'hiero-consensus-node', 'hiero-local-node', 'hiero-mirror-node',
  'hiero-improvement-proposals', 'hiero-sdk-js', 'hiero-sdk-java',
  'hiero-json-rpc-relay', 'hiero-sdk-go', 'hiero-sdk-rust',
  'hiero-mirror-node-explorer', 'hiero-cli', 'solo', 'hiero-block-node',
  'hiero-sdk-tck', 'hiero-sdk-cpp', 'governance', 'hiero-sdk-python',
  'hiero-sdk-swift', 'sdk-collaboration-hub', 'tsc'
];

async function fetchRepoStats() {
  const stats = new Map(); // Fix: Use Map instead of Object to avoid injection
  console.log('📊 Fetching repository statistics...');
  
  for (const repo of repos) {
    try {
      const response = await fetch(`https://api.github.com/repos/hiero-ledger/${repo}`);
      if (response.ok) {
        const data = await response.json();
        stats.set(repo, { stars: data.stargazers_count }); // Fix: Use Map.set()
        console.log(`✓ ${repo}: ${data.stargazers_count} stars`);
      } else {
        stats.set(repo, { stars: 0 }); // Fix: Use Map.set()
        console.log(`✗ ${repo}: API error ${response.status}`);
      }
    } catch (error) {
      stats.set(repo, { stars: 0 }); // Fix: Use Map.set()
      console.log(`✗ ${repo}: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  
  // Convert Map to Object for JSON serialization
  const statsObj = Object.fromEntries(stats);
  
  fs.writeFileSync(
    path.join(dataDir, 'repository_stats.json'),
    JSON.stringify(statsObj, null, 2)
  );
  
  const totalStars = Array.from(stats.values()).reduce((sum, repo) => sum + repo.stars, 0);
  console.log(`🎉 Stats saved! Total stars: ${totalStars.toLocaleString()}`);
}

fetchRepoStats().catch(console.error);