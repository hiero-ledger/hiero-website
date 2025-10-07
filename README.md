# Hiero Website

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-website/badge)](https://scorecard.dev/viewer/?uri=github.com/hiero-ledger/hiero-website)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10697/badge)](https://bestpractices.coreinfrastructure.org/projects/10697)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

This repo contains the website of Hiero (https://hiero.org).

## Building the website

The project is based on [Hugo](https://gohugo.io/) and you need to [install Hugo](https://gohugo.io/installation/) to build the website along with [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), [Tailwind CSS](https://tailwindcss.com/), and [PostCSS](https://postcss.org/)

To help ensure that tailwindcss and Hugo play nicely together, the tailwindcss integration was stitched together based on the following articles:
[Making Tailwind JIT work with Hugo](https://www.brycewray.com/posts/2021/11/making-tailwind-jit-work-hugo/)
[Making Tailwind JIT work with Hugo, the Version 3 edition](https://www.brycewray.com/posts/2022/03/making-tailwind-jit-work-hugo-version-3-edition/)


## Install packages
```
npm i 
```

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


## Content

### Posts

To create a new post, run the following command:

    hugo new posts/my-first-post.md

Then, edit the `my-first-post.md` file to suit your needs.

Hugo created the file in the content/posts directory. Open the file with your editor.

```
+++
title = 'My First Post'
date = 2025-04-15T09:40:56-07:00
draft = true
+++
```

Notice the **draft** value in the [front matter](https://gohugo.io/content-management/front-matter/) is true. By default, Hugo does not publish draft content when you build the site. Learn more about [draft, future, and expired content](https://gohugo.io/getting-started/usage/#draft-future-and-expired-content).

Add some [Markdown](https://daringfireball.net/projects/markdown) to the body of the post, but do not change the **draft** value.
```
+++
title = 'My First Post'
date = 2025-04-15T09:40:56-07:00
draft = true
+++
## Introduction

This is **bold** text, and this is *emphasized* text.

Visit the [Hugo](https://gohugo.io) website!
```
Reference **content/posts/post-template-for-reference-only.md** for examples of markdown and shortcode features that the Hiero post template supports. 

Save the file, then start Hugo’s development server to view the site. You can run the following commands to include draft content.
```
hugo server --buildDrafts
```

View your site at the URL displayed in your terminal. Keep the development server running as you continue to add and change content.

When satisfied with your new content, set the front matter **draft** parameter to false.

The Hiero single post template supports additional metadata parameters that are optional as shown below:
```
featured_image = "/images/Hiero_v4.png"
categories = ["Blog"]
tags = ["Sample","Example"]
duration = "3 min read"
abstract = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, seiusmod tempor incididunt ut labore et dolore magna aliqua."
[[authors]]
name = "John Doe"
title = "Title Here"
organization = "Hiero"
link = ""
image = ""
```
| Parameter  | Description |
| ------------- | ------------- |
| featured_image     | Path to image that is shown above the post content and when the post is displayed within a list. The field supports absolute and relative paths.    |
| categories      | Categories are a type of taxonomy - typically represent major groupings or sections of your site. The Hiero website is currently not using this parameter.   |
| tags      | Tags are a type of taxonomy — a way to group and organize your content. The Hiero website can use these to show related blog posts when enabled in the single post partial **related.html**.    |
| duration | The average reading time of the article. |
| abstract | A short summary or preview of a post’s content. This is shown when the post is displayed in a list and in the single post description meta tag. |
| [[authors]] | Supports one or many authors with the parameters **name**, **title**, **organization**, **link**, and **image**. The **image** parameter supports absolute and relative paths.|

#### Assets
If the post includes self hosted assets then it is recommended to create a subdirectory within **posts** that contains the post and associated assets. Run the following command to create a post in a subdirectory:

    hugo new posts/my-first-post/index.md

Reference the assets with a relative path such as **images/my-firt-post-image.jpg**

#### Sharing
The Hiero website uses [Hugo Share Buttons](https://github.com/Stals/hugo-share-buttons) for post sharing functionality.

#### GitHub Reactions
The Hiero website includes a GitHub reactions system that displays community reactions from Pull Requests on blog posts. This feature helps measure community engagement without requiring a backend.

To enable reactions on a blog post, add a `pr_number` field to the frontmatter:
```
pr_number = "123"  # GitHub PR number
```

If no PR number is specified, the system will automatically search for PRs that modified the blog post file.

For detailed usage instructions, see [docs/github-reactions-usage.md](docs/github-reactions-usage.md).

#### Settings
Additional settings can be found in the **hugo.toml** configuration file.
