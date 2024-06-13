import { test, expect } from '@jest/globals';
import { normalizeURL, getURLsFromHTML } from './crawl';

test('normalizeURL `https://blog.boot.dev/path/`', () => {
  expect(normalizeURL('https://blog.boot.dev/path/')).toBe(
    'blog.boot.dev/path'
  );
});

test('normalizeURL `https://blog.boot.dev/path`', () => {
  expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeURL `http://blog.boot.dev/path/`', () => {
  expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizeURL `http://blog.boot.dev/path`', () => {
  expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeURL capitalized url', () => {
  expect(normalizeURL('https://BLOG.boot.dev/path/')).toBe(
    'blog.boot.dev/path'
  );
});

test('normalizeURL `invalid url`', () => {
  expect.assertions(1);
  try {
    normalizeURL('invalid url');
  } catch (e) {
    expect(e.message).toBe('Invalid URL');
  }
});

test('normalizeURL empty url throws error', () => {
  expect.assertions(1);
  try {
    normalizeURL('');
  } catch (e) {
    expect(e.message).toBe('Invalid URL');
  }
});

test('getURLsFromHTML convert all links to absolute urls', () => {
  expect(
    getURLsFromHTML(
      `<html>
        <body>
          <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
          <a href="/path"><span>Go to Boot.dev</span></a>
          <a href="/path/to/page"><span>Go to Boot.dev</span></a>
        </body>
      </html>`,
      'https://blog.boot.dev'
    )
  ).toEqual([
    'https://blog.boot.dev/',
    'https://blog.boot.dev/path',
    'https://blog.boot.dev/path/to/page',
  ]);
});
