# Hiero Website

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-website/badge)](https://scorecard.dev/viewer/?uri=github.com/hiero-ledger/hiero-website)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10697/badge)](https://bestpractices.coreinfrastructure.org/projects/10697)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

This repo contains the website of [Hiero](https://hiero.org).

## Building the website
See [docs/hugo-setup.md](docs/hugo-setup.md) for installing prerequisites (Hugo, Node.js/npm, Tailwind CSS, PostCSS) and running the site locally.


## Install packages
```
npm i 
```
For Linux Setup Instructions [linux_setup.md](docs/setup/linux_setup.md)
For Windows Setup Instructions [Windows_setup.md](docs/setup/windows_setup.md)
For Windows Setup Instructions [Macbook_setup.md](docs/setup/Macbook_setup.md)
## Environments

### Dev
For development run the following command in terminal.
```
npm run start
```

While the process is running the website can be reached at http://localhost:1313/.

### Production
For production ready css, run the following command in terminal.
```
npm run build
```

## Contributing

We welcome contributions such as:
- Code additions or changes
- Blog posts


### Code Changes and Additions
We have several [Open Issues](https://github.com/hiero-ledger/hiero-website/issues?q=is%3Aissue%20state%3Aopen%20no%3Aassignee) at the Hiero website that need help.

Read [Workflow Guide](./docs/workflow.md) to get started.

### Blog Posts

See [Detailed Guide on Creating a Blog Post](./docs/blogs.md)

Quickly create new blog post with basic [front matter](https://gohugo.io/content-management/front-matter/):

    hugo new posts/my-first-post.md

This will create `content/posts/my-first-post.md` and it will look like this:
```
+++
title = 'My First Post' #Edit title
date = 2025-04-15T09:40:56-07:00 #Edit date
draft = true #Do not edit 
+++
## Start Writing here
```

Once written, save and preview, then turn draft to false once finished:
```
hugo server --buildDrafts
```

Learn about [draft](https://gohugo.io/getting-started/usage/#draft-future-and-expired-content)

See an example [Blog Post](https://github.com/hiero-ledger/hiero-website/blob/main/content/posts/python-v0.1.7-release.md)

See [Detailed Guide on Creating a Blog Post](./docs/blogs.md)

