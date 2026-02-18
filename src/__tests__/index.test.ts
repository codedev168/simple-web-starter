import { describe, it, expect } from 'vitest';
import {
  generateWebsite,
  createHeading,
  createParagraph,
  createUnorderedList,
  createLink,
} from '../index.js';

describe('createHeading', () => {
  it('should create a heading element with valid level 1', () => {
    expect(createHeading('Main Title', 1)).toBe('<h1>Main Title</h1>');
  });

  it('should create a heading element with valid level 6', () => {
    expect(createHeading('Subsection', 6)).toBe('<h6>Subsection</h6>');
  });

  it('should throw an error for invalid level 0', () => {
    expect(() => createHeading('Invalid', 0)).toThrow('Heading level must be between 1 and 6');
  });

  it('should throw an error for invalid level 7', () => {
    expect(() => createHeading('Invalid', 7)).toThrow('Heading level must be between 1 and 6');
  });
});

describe('createParagraph', () => {
  it('should create a paragraph with provided text', () => {
    expect(createParagraph('This is a paragraph.')).toBe('<p>This is a paragraph.</p>');
  });

  it('should create an empty paragraph when given empty string', () => {
    expect(createParagraph('')).toBe('<p></p>');
  });
});

describe('createUnorderedList', () => {
  it('should create an unordered list with multiple items', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const expected = '<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>';
    expect(createUnorderedList(items)).toBe(expected);
  });

  it('should create an empty unordered list when given an empty array', () => {
    expect(createUnorderedList([])).toBe('<ul>\n\n</ul>');
  });

  it('should throw an error when items is not an array', () => {
    expect(() => createUnorderedList('not an array')).toThrow('Items must be an array of strings');
  });
});

describe('createLink', () => {
  it('should create a hyperlink with provided text and URL', () => {
    expect(createLink('Click here', 'https://example.com')).toBe('<a href="https://example.com">Click here</a>');
  });

  it('should handle special characters in URL', () => {
    expect(createLink('Test', 'http://example.com?query=hello world')).toBe('<a href="http://example.com?query=hello world">Test</a>');
  });

  it('should allow empty text and URL (though not recommended)', () => {
    expect(createLink('', '')).toBe('<a href="">');
  });
});

describe('generateWebsite', () => {
  it('should generate a complete HTML document with title, body content, styles, and scripts', () => {
    const options = {
      title: 'Test Site',
      bodyContent: '<div>Hello</div>',
      styles: 'body { font-family: sans-serif; }',
      scripts: 'console.log("loaded");',
    };
    const expected = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Site</title>
  <style>body { font-family: sans-serif; }</style>
</head>
<body>
  <div>Hello</div>
  <script>console.log("loaded");</script>
</body>
</html>`;
    expect(generateWebsite(options)).toBe(expected);
  });

  it('should generate a complete HTML document without optional styles and scripts', () => {
    const options = {
      title: 'Simple Site',
      bodyContent: '<p>Content</p>',
    };
    const expected = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Site</title>
  
</head>
<body>
  <p>Content</p>
  
</body>
</html>`;
    expect(generateWebsite(options)).toBe(expected);
  });

  it('should throw an error when title is missing', () => {
    const options = {
      bodyContent: '<p>Content</p>',
    };
    expect(() => generateWebsite(options as any)).toThrow('Title is required and must be a non-empty string');
  });

  it('should throw an error when title is an empty string', () => {
    const options = {
      title: '',
      bodyContent: '<p>Content</p>',
    };
    expect(() => generateWebsite(options)).toThrow('Title is required and must be a non-empty string');
  });

  it('should throw an error when bodyContent is missing', () => {
    const options = {
      title: 'Test',
    };
    expect(() => generateWebsite(options as any)).toThrow('Body content is required and must be a non-empty string');
  });

  it('should throw an error when bodyContent is an empty string', () => {
    const options = {
      title: 'Test',
      bodyContent: '',
    };
    expect(() => generateWebsite(options)).toThrow('Body content is required and must be a non-empty string');
  });
});