/**
 * Sanitizes HTML content by escaping special characters to prevent XSS.
 * @param input - The input string to sanitize.
 * @returns A sanitized string with HTML entities escaped.
 */
function sanitizeHTML(input: string): string {
  return input.replace(/[&<>"]/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[match]));
}

/**
 * Generates a complete HTML document with the provided options.
 * @param options - Configuration options for the website.
 * @param options.title - The title of the website (required).
 * @param options.bodyContent - The HTML content for the body (required).
 * @param options.styles - CSS styles to include in the document.
 * @param options.scripts - JavaScript code to include in the document.
 * @returns A string containing the full HTML document.
 * @throws {Error} If title or bodyContent are missing or invalid.
 */
export function generateWebsite(options: {
  title: string;
  bodyContent: string;
  styles?: string;
  scripts?: string;
}): string {
  // Validation
  if (!options || typeof options.title !== 'string' || options.title.trim() === '') {
    throw new Error('Title is required and must be a non-empty string');
  }
  if (typeof options.bodyContent !== 'string' || options.bodyContent.trim() === '') {
    throw new Error('Body content is required and must be a non-empty string');
  }

  // Sanitize inputs
  const sanitizedTitle = sanitizeHTML(options.title);
  const sanitizedBody = sanitizeHTML(options.bodyContent);
  const sanitizedStyles = options.styles ? sanitizeHTML(options.styles) : '';
  const sanitizedScripts = options.scripts ? sanitizeHTML(options.scripts) : '';

  // Generate HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizedTitle}</title>
  ${sanitizedStyles ? `<style>${sanitizedStyles}</style>` : ''}
</head>
<body>
  ${sanitizedBody}
  ${sanitizedScripts ? `<script>${sanitizedScripts}</script>` : ''}
</body>
</html>`;
}

/**
 * Creates an HTML heading element.
 * @param text - The text content of the heading.
 * @param level - The heading level (1-6).
 * @returns A string representing the HTML heading element.
 */
export function createHeading(text: string, level: 1 | 2 | 3 | 4 | 5 | 6): string {
  return `<h${level}>${sanitizeHTML(text)}</h${level}>`;
}

/**
 * Creates an HTML paragraph element.
 * @param text - The text content of the paragraph.
 * @returns A string representing the HTML paragraph element.
 */
export function createParagraph(text: string): string {
  return `<p>${sanitizeHTML(text)}</p>`;
}

/**
 * Creates an HTML unordered list.
 * @param items - An array of list items.
 * @returns A string representing the HTML unordered list.
 */
export function createUnorderedList(items: string[]): string {
  const listItems = items.map(item => `<li>${sanitizeHTML(item)}</li>`).join('\n');
  return `<ul>\n${listItems}\n</ul>`;
}

/**
 * Creates an HTML hyperlink.
 * @param text - The clickable text of the link.
 * @param href - The URL the link points to.
 * @returns A string representing the HTML anchor element.
 * @throws {Error} If href contains disallowed protocols (javascript:, data:).
 */
export function createLink(text: string, href: string): string {
  if (href.startsWith('javascript:') || href.startsWith('data:')) {
    throw new Error('Invalid href: Potential XSS attack detected');
  }
  return `<a href="${sanitizeHTML(href)}">${sanitizeHTML(text)}</a>`;
}