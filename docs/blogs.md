# Writing Blog Posts 

## Content Guidelines

Blog posts on hiero.org/blog should focus exclusively on technical content for a maintainer-focused audience.

For:
- Marketing
- Business-related content
- Major project announcements

Please use [LF Blog](https://www.linuxfoundation.org/blog)

## Step by Step Guide to Writing Blog Posts 

### 1. Search Existing Blog Posts

If a very similar blog post already exists, consider how to distinguish it slightly or create a follow-up blog.

### 2. Create a Blog Post New Feature Suggestion

Visit [Hiero Website Issues](https://github.com/hiero-ledger/hiero-website/issues). Click on the green button "New Issue" at the top right, select Feature and create a brief proposal for your blog post.

### 3. Get Assigned and Get Working

Comment /assign on the new issue to request to get assigned.

Then follow the [step-by-step instructions to creating your pull request](workflow.md)

You'll need to:
- Fork the repository
- Create a working branch
- GPG and DCO sign commits
- Submit the pull request

#### How to Create the Blog Post:

1. Find `/hiero-website/content/posts`. 
2. Create `{blog_post_title}.md` 

or skip steps 1 and 2 using a command line interface to quickly create at content/posts with:
```bash
hugo new posts/blog_post_title.md
```
3. Write the text of your blog post.

4. Apply correct markdown syntax
The blog needs to be written in markdown for it to render correctly. Most AI tools will be able to convert your blog post text into blog post markdown for you.

Markdown is simple, you can learn more about Markdown here [Introductory Markdown Guide](https://www.markdownguide.org/basic-syntax/).

5. Check the Preview
In Visual Studio, preview the blog post by clicking `command+shift+V` or `control+shift+V`. You can also click "Open Preview to the Side" which is a small split screen icon with a magnifying glass on the top right. 

If you find any errors, correct them in the raw file, not the preview file. Make sure to save as you go `command+S` to apply changes.

6. Add Images
Ask for help to attach images for your blog post.

We recommend images for:
- The blog post title
- The author

If you have images already, follow these steps:
    - 1. Locate `/hiero-website/static/images`
    - 2. Add high quality JPG image(s) and save them.

7. Add Hugo Requirements

The hiero blog is built using Hugo [Introduction to Hugo](https://gohugo.io/documentation/). We need to add instructions at the top of the markdown file for it to render correctly.

Copy paste and edit:

```markdown
+++
title = "The Blog Post Title I Want the Community to See on the Hiero Blog"
featured_image = "/images/the_icon_image_for_my_blog.jpg"
date = 2025-08-01T11:00:00-07:00
categories = ["Blog"]
tags = ["Announcement"]
duration = "3 min read"
abstract = "A brief summary of the blog post that appears in lists and meta descriptions."
[[authors]]
name = "Your name or GitHub alias"
title = "Your role or title"
organization = "Hiero"
link = "https://github.com/your-username"
image = "/images/your_profile_image.png"
+++
```

### Front Matter Parameters

| Parameter | Required | Description |
|---------|----------|-------------|
| `title` | Yes | The main title of the blog post. Displayed at the top of the post and used in page metadata, previews, and search results. |
| `featured_image` | No | Path to the image shown above the post content and when the post appears in a list. Supports absolute and relative paths. |
| `date` | Yes | The publication date and time of the post. Used by Hugo for ordering content and determining publish time. Must be in ISO 8601 format. |
| `categories` | No | A taxonomy used to represent major groupings or sections of the site. The Hiero website currently does not actively use this parameter. |
| `tags` | No | A taxonomy used to group and organize content. When enabled in the single post partial `related.html`, tags can be used to display related blog posts. |
| `duration` | No | The estimated average reading time of the article (for example, `3 min read`). |
| `abstract` | No | A short summary or preview of the post’s content. Displayed in post lists and used for the single post meta description for SEO. |
| `[[authors]]` | Yes | Defines one or more authors for the post. Supports the fields listed in the Author Fields table below. |

### Author Fields (`[[authors]]`)

| Field | Required | Description |
|------|----------|-------------|
| `name` | Yes | The author’s display name or GitHub username. |
| `title` | No | The author’s role or title (for example, Engineer, Maintainer). |
| `organization` | No | The organization or team the author represents. |
| `link` | No | A URL to the author’s profile (GitHub, LinkedIn, personal website, etc.). |
| `image` | No | Path to the author’s profile image. Supports absolute and relative paths. |




#### Assets


#### Sharing
The Hiero website uses [Hugo Share Buttons](https://github.com/Stals/hugo-share-buttons) for post sharing functionality.

#### Settings
Additional settings can be found in the **hugo.toml** configuration file.

## 4. Create Pull Request and View Preview
Commit and create the pull request following [Guide](workflow.md). Well done!

Once you create your pull request, several checks will run and a preview will be generated.
- Click the netlify preview
- Check the blog post renders as expected

## 5. Wait for Reviews

The Hiero website community will review your new blog post and publish it once approved.

Thank you!