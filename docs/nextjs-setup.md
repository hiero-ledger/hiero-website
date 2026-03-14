# Setting Up Next.js Locally

This guide will walk you through setting up the Hiero website locally on your machine.

## What You'll Need

Before you start, make sure you have these tools installed on your computer:

1. **Node.js** - JavaScript runtime (version 20 or higher recommended)
2. **npm/pnpm** - Node package manager (we recommend `pnpm` for this project)
3. **Git** - Version control system

## Step 1: Install Prerequisites

### Install Node.js and pnpm

Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended).
Once Node is installed, you can enable `pnpm` which comes bundled with modern Node versions, or install it globally:

```bash
npm install -g pnpm
```

**Verify Installation:**

```bash
node --version
pnpm --version
```

You should see version numbers for both.

## Step 2: Clone the Repository

Open your terminal and navigate to where you want to store the project, then clone the repository:

```bash
git clone https://github.com/hiero-ledger/hiero-website.git
cd hiero-website
```

## Step 3: Install Project Dependencies

The project uses Tailwind CSS and other React packages. Install them by running:

```bash
pnpm install
```

This command reads the [package.json](../package.json) file and installs all required dependencies. It may take a minute or two.

## Step 4: Run the Site Locally

Now you're ready to start the development server!

```bash
pnpm dev
```

**What Happens:**

- Next.js builds your site
- Starts a local development server
- Watches for file changes
- Automatically rebuilds and Hot Reloads when you save changes

**Expected Output:**

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 5: Preview Your Changes

### Access the Website

Open your web browser and go to:

```
http://localhost:3000/
```

You should see the Hiero website running locally!

### Making Changes

Next.js provides **Fast Refresh**. Here's how it works:

1. **Open a file** in your code editor (e.g., a component in `src/components/`, or a blog post in `content/posts/`)
2. **Make changes** - edit text, add content, modify components
3. **Save the file** (Ctrl+S or Cmd+S)
4. **Watch your browser** - it automatically refreshes to show your changes!

**No need to:**

- Restart the server
- Manually refresh your browser
- Run build commands

### Preview Draft Content

If you're working on a blog post that has `draft: true` in its front matter, it will be skipped by the parser by default. To preview it locally, temporarily set `draft: false` or alter the `getAllPosts` filter in code if working on the preview itself.

## Step 6: Stop the Server

When you're done working, stop the development server by pressing:

```
Ctrl + C
```

in your terminal.

## Common Tasks

### Check for Errors

Next.js will show compilation errors in your terminal and overlay them in your browser if something goes wrong. Common issues:

- **Syntax errors in markdown front matter** - Check your YAML formatting
- **Missing files** - Make sure linked images or files exist
- **Port already in use** - Another process is using port 3000

To use a different port:

```bash
pnpm dev -p 3001
```

### Formatting and Linting

Before opening a PR, ensure your code is formatted and linted properly. We use Prettier and ESLint.

```bash
pnpm format
pnpm lint
```

### Build for Production

To create a production-ready build:

```bash
pnpm build
```

This creates an optimized production build in the `.next` directory. You can test it locally with:

```bash
pnpm start
```

## Next Steps

Now that you have the site running locally, you can:

- **Create a blog post**: See [Blog Creation Guide](./blogs.md)
- **Understand the workflow**: See [Workflow Guide](./workflow.md)
- **Make your first contribution**: Check [Open Issues](https://github.com/hiero-ledger/hiero-website/issues)

## Quick Reference

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `pnpm install` | Install all dependencies           |
| `pnpm dev`     | Start dev server with Fast Refresh |
| `pnpm build`   | Build for production               |
| `pnpm start`   | Start the production server        |
| `pnpm format`  | Run code formatting (Prettier)     |
| `pnpm lint`    | Run code quality checks (ESLint)   |

---

**Need Help?** Ask questions in our [Discord server](https://discord.gg/hiero) or open an issue on GitHub!
