# Setting Up Hugo Locally

This guide will walk you through setting up the Hiero website locally on your machine. No prior experience with Hugo is required!

## What You'll Need

Before you start, make sure you have these tools installed on your computer:

1. **Hugo** - The static site generator that builds our website
2. **Node.js** - JavaScript runtime (version 14 or higher recommended)
3. **npm** - Node package manager (comes with Node.js)
4. **Git** - Version control system

## Step 1: Install Prerequisites

### Install Hugo

**On Linux:**
```bash
sudo snap install hugo
```

Or download from the [Hugo releases page](https://github.com/gohugoio/hugo/releases).

**On macOS:**
```bash
brew install hugo
```

**On Windows:**
```bash
choco install hugo-extended -y
```

Or use [Scoop](https://scoop.sh/):
```bash
scoop install hugo-extended
```

**Verify Hugo Installation:**
```bash
hugo version
```

You should see something like `hugo v0.xxx.x`.

### Install Node.js and npm

Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended).

**Verify Node.js Installation:**
```bash
node --version
npm --version
```

You should see version numbers for both.

## Step 2: Clone the Repository

Open your terminal and navigate to where you want to store the project, then clone the repository:

```bash
git clone https://github.com/hiero-ledger/hiero-website.git
cd hiero-website
```

## Step 3: Install Project Dependencies

The project uses Tailwind CSS and other Node.js packages. Install them by running:

```bash
npm install
```

This command reads the [package.json](../package.json) file and installs all required dependencies. It may take a minute or two.

## Step 4: Run the Site Locally

Now you're ready to start the development server! There are two ways to do this:

### Option 1: Using npm Scripts (Recommended)

This method automatically handles Tailwind CSS compilation and starts Hugo:

```bash
npm run start
```

### Option 2: Using Hugo Server Directly

If you only want to run Hugo without watching for CSS changes:

```bash
hugo server
```

**What Happens:**
- Hugo builds your site
- Starts a local development server
- Watches for file changes
- Automatically rebuilds when you save changes

**Expected Output:**
```
Web Server is available at http://localhost:1313/
Press Ctrl+C to stop
```

## Step 5: Preview Your Changes

### Access the Website

Open your web browser and go to:
```
http://localhost:1313/
```

You should see the Hiero website running locally!

### Making Changes

The magic of Hugo's development server is **live reload**. Here's how it works:

1. **Open a file** in your code editor (e.g., a blog post in `content/posts/`)
2. **Make changes** - edit text, add content, modify layouts
3. **Save the file** (Ctrl+S or Cmd+S)
4. **Watch your browser** - it automatically refreshes to show your changes!

**No need to:**
- Restart the server
- Manually refresh your browser
- Run build commands

### Preview Draft Content

If you're working on a blog post that has `draft = true` in its front matter, you need to tell Hugo to show drafts:

```bash
npm run start
```

Or with Hugo directly:
```bash
hugo server --buildDrafts
```

Now draft posts will be visible at `http://localhost:1313/blog/`.

## Step 6: Stop the Server

When you're done working, stop the development server by pressing:

```
Ctrl + C
```

in your terminal.

## Common Tasks

### View a Specific Blog Post

After starting the server, navigate to:
```
http://localhost:1313/blog/your-post-name/
```

### Check for Errors

Hugo will show errors in your terminal if something goes wrong. Common issues:
- **Syntax errors in front matter** - Check your YAML/TOML formatting
- **Missing files** - Make sure linked images or files exist
- **Port already in use** - Another process is using port 1313

To use a different port:
```bash
hugo server --port 3000
```

### Build for Production

To create a production-ready build (minified and optimized):

```bash
npm run build
```

This creates a `public/` directory with all the static files ready for deployment.

## Troubleshooting

### "hugo: command not found"

Hugo isn't installed or not in your PATH. Reinstall Hugo and verify with `hugo version`.

### "npm: command not found"

Node.js/npm isn't installed. Download and install from [nodejs.org](https://nodejs.org/).

### Changes Not Showing

1. Make sure the development server is running
2. Check the terminal for error messages
3. Try a hard refresh in your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. If still not working, stop the server (Ctrl+C) and start it again

### Port 1313 Already in Use

Another Hugo server might be running. Either:
- Find and stop the other process
- Use a different port: `hugo server --port 3000`

## Next Steps

Now that you have Hugo running locally, you can:

- **Create a blog post**: See [Blog Creation Guide](./blogs.md)
- **Understand the workflow**: See [Workflow Guide](./workflow.md)
- **Make your first contribution**: Check [Open Issues](https://github.com/hiero-ledger/hiero-website/issues)

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run start` | Start dev server with Tailwind CSS watching |
| `hugo server` | Start Hugo server only |
| `hugo server --buildDrafts` | Include draft content in preview |
| `npm run build` | Build for production |
| `hugo new posts/title.md` | Create a new blog post |

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Quick Start](https://gohugo.io/getting-started/quick-start/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Need Help?** Ask questions in our [Discord server](https://discord.gg/hiero) or open an issue on GitHub!