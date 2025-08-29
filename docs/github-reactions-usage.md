# GitHub Reactions for Blog Posts

This feature allows blog posts to display GitHub reactions from their corresponding Pull Requests, providing a way to measure community engagement without requiring a backend.

## How It Works

The GitHub reactions system automatically fetches reaction data from GitHub PRs and displays them on blog posts. Users can see community reactions (thumbs up, heart, rocket, etc.) and click through to the GitHub PR to add their own reactions.

## Features

- **Automatic PR Discovery**: If no PR number is specified, the system automatically searches for PRs that modified the blog post
- **Real-time Reactions**: Fetches current reaction counts from GitHub
- **Caching**: Implements intelligent caching to respect GitHub API rate limits
- **Fallback Handling**: Gracefully handles cases where no PR is found
- **Responsive Design**: Works on all device sizes

## Usage

### Option 1: Specify PR Number (Recommended)

Add a `pr_number` field to your blog post frontmatter:

```yaml
+++
title = 'Your Blog Post Title'
date = 2025-01-01T00:00:00Z
pr_number = "456"  # GitHub PR number
+++
```

### Option 2: Automatic Discovery

If you don't specify a PR number, the system will automatically search for PRs that modified your blog post file. This works by:

1. Searching through recent closed PRs
2. Checking which files were modified in each PR
3. Matching the blog post filename/slug
4. Loading reactions from the discovered PR

## Supported Reaction Types

The system supports all standard GitHub reactions:
- 👍 thumbs up
- 👎 thumbs down
- 😄 laugh
- 🎉 hooray
- 😕 confused
- ❤️ heart
- 🚀 rocket
- 👀 eyes

## Technical Implementation

### Files
- **Shortcode**: `layouts/shortcodes/github-reactions.html`
- **CSS**: `static/css/github-reactions.css`
- **JavaScript**: `static/js/github-reactions.js`
- **Layout Integration**: `layouts/posts/single.html`

### API Endpoints Used
- `GET /repos/hiero-ledger/hiero-website/pulls/{pr_number}/reactions`
- `GET /repos/hiero-ledger/hiero-website/pulls/{pr_number}`
- `GET /repos/hiero-ledger/hiero-website/pulls?state=closed&sort=updated&direction=desc&per_page=50`
- `GET /repos/hiero-ledger/hiero-website/pulls/{pr_number}/files`

### Rate Limiting
- Respects GitHub API rate limits
- Implements intelligent caching (30-minute cache)
- Graceful fallback when rate limits are exceeded

## Customization

### Styling
The appearance can be customized by modifying `static/css/github-reactions.css`. The component uses CSS custom properties and supports both light and dark modes.

### JavaScript Behavior
Modify `static/js/github-reactions.js` to change:
- Cache duration
- API endpoints
- Reaction display logic
- Error handling

## Troubleshooting

### Common Issues

1. **No reactions displayed**
   - Check browser console for errors
   - Verify the PR number is correct
   - Ensure the PR has reactions

2. **Rate limit errors**
   - The system will show appropriate error messages
   - Reactions will load when rate limits reset

3. **PR not found**
   - Verify the PR number exists
   - Check if the PR is public and accessible

### Debug Mode

Open browser console and look for:
- `🚀 Initializing GitHub reactions...`
- `Found X reaction containers`
- `Processing container X: {prNumber, slug}`

## Future Enhancements

- GitHub token support for higher rate limits
- Real-time updates via GitHub webhooks
- Analytics integration
- Custom reaction types
- Bulk reaction loading for multiple posts

## Contributing

To contribute to this feature:

1. Fork the repository
2. Make your changes
3. Test with different PR scenarios
4. Submit a PR with clear description of changes

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review this documentation
3. Open an issue on GitHub with detailed information
4. Tag @belloibrahv for assistance
