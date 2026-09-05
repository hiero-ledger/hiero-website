# Windows Setup

## Instructions

### Install packages

Ensure you have Node.js installed, then run these commands to install `pnpm`:

```bash
npm install -g pnpm
```

### Clone repository and install dependencies

Navigate to your workspace and clone the repository, then install packages:

```bash
git clone https://github.com/hiero-ledger/hiero-website
cd hiero-website
pnpm install
```

### Run Start Command

Run the following to start the local development server:

```bash
pnpm dev
```

You should see output similar to this in your console:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open `http://localhost:3000` to see the project.

Both `pnpm dev` and `pnpm build` first run `pnpm sync:data`, which fetches
repository statistics from the GitHub API. Anonymous requests are rate-limited,
and when the limit is hit the sync quietly falls back to the JSON caches
committed in `src/data/`. To keep the numbers fresh during repeated local
builds, set a GitHub token first:

```powershell
$env:GITHUB_TOKEN = "<your personal access token>"
```

You have just set up the Hiero-Website locally!

### Run Build Command

To verify the production build works correctly on your machine:

```bash
pnpm build
```
