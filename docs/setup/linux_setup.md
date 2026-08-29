# Linux Setup

This guide explains how to set up the Hiero website locally on a Linux system.

## Step 1: Install Dependencies

Install Git, Node.js, and pnpm.

    sudo apt update
    sudo apt install git nodejs npm -y
    sudo npm install -g pnpm

## Step 2: Clone the Repository

Clone the repository and navigate into it:

    git clone https://github.com/hiero-ledger/hiero-website.git
    cd hiero-website

## Step 3: Install Node Packages

Install required dependencies:

    pnpm install

## Step 4: Local Development

Start the Next.js development server with live reloading:

    pnpm dev

Open your browser and visit:

    http://localhost:3000/

Both `pnpm dev` and `pnpm build` first run `pnpm sync:data`, which fetches
repository statistics from the GitHub API. Anonymous requests are rate-limited,
and when the limit is hit the sync quietly falls back to the JSON caches
committed in `src/data/`. To keep the numbers fresh during repeated local
builds, export a GitHub token first:

    export GITHUB_TOKEN=<your personal access token>

## Step 5: Preview Draft Content

To preview draft blog posts, just ensure the `draft` flag in your markdown front matter is respected by your application logic, and run:

    pnpm dev

## Step 6: Build for Production

To generate a production-ready build:

    pnpm build
