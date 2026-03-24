/**
 * Validates if a URL is safe to use as an href.
 * Checks for valid http/https protocols or relative paths.
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;

  try {
    // Allow relative URLs (start with / or ../)
    if (url.startsWith('/') || url.startsWith('../')) {
      return true;
    }

    // Allow http and https URLs
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // Invalid URL format
    return false;
  }
}
