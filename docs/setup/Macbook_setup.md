# Macbook Setup

Step 1: Install Dependencies

Open your Terminal and run the following commands:

# Install Node.js and pnpm (if not already installed)

```
brew install node
npm install -g pnpm
```

Step 2: Clone the Repository

Clone your fork of the project to your local machine:

```
git clone https://github.com/hiero-ledger/hiero-website
cd hiero-website
```

Step 3: Install Node Packages

The project uses pnpm to manage dependencies.

```
pnpm install
```

Step 4: Local Development

To start the Next.js development server with hot module reloading:

```
pnpm dev
```
Access the site: Once the command is running, open your browser to http://localhost:3000/

Both `pnpm dev` and `pnpm build` first run `pnpm sync:data`, which fetches
repository statistics from the GitHub API. Anonymous requests are rate-limited,
and when the limit is hit the sync quietly falls back to the JSON caches
committed in `src/data/`. To keep the numbers fresh during repeated local
builds, export a GitHub token first:

```
export GITHUB_TOKEN=<your personal access token>
```

Step 5: Building for Production

To generate the production-ready application build:

```
pnpm build
```
