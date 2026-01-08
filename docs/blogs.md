# Writing Blog Posts 

## Detailed Steps

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
2. Ceate `{blog_post_title}.md` 
3. Write the text of your blog post complete with headers and subheaders. 
4. Apply correct markdown syntax
The blog needs to be writen in markdown for it to render correctly. Most AI tools will be able to convert your blog post text into blog post markdown for you.

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

Add, making minor edits:

```markdown
+++
title = "The Blog Post Title I Want The Community To See At Hiero Blog"
featured_image = "/images/the_icon_image_for_my_blog.jpg"
date = 2025-08-01T11:00:00-07:00
categories = ["Blog"]
abstract = "A brief abstract"
[[authors]]
name = "your name or github alias"
title = ""
organization = "Python Team"
link = ""
image = "/images/your_personal__or_github_image.png"
+++
```

## 4. Create Pull Request and View Preview
Commit and create the pull request following [Guide](workflow.md). Well done!

Once you create your pull request, several checks will run and a preview will be generated.
- Click the netlify preview
- Check the blog post renders as expected

## 5. Wait for Reviews

The Hiero website community will review your new blog post and publish it once approved.

Thank you!