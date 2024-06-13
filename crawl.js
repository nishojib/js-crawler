import { JSDOM } from 'jsdom';

export function normalizeURL(urlInput) {
  if (urlInput === '') {
    throw new Error('Invalid URL');
  }

  const url = new URL(urlInput);
  return url.hostname + url.pathname.replace(/\/$/, '');
}

export function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);

  const links = dom.window.document.querySelectorAll('a');

  const urls = [];

  for (const link of links) {
    const href = link.getAttribute('href');
    if (href) {
      const url = new URL(href, baseURL);
      urls.push(url.href);
    }
  }

  return urls;
}

// use default args to prime the first call
export async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // if this is an offsite URL, bail immediately
  const base = new URL(baseURL);
  const current = new URL(currentURL);

  if (current.hostname !== base.hostname) {
    return pages;
  }

  // use a consistent URL format
  const normalizedCurrentURL = normalizeURL(currentURL);

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL] += 1;
    return pages;
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedCurrentURL] = 1;

  // fetch and parse the html of the currentURL
  let htmlBody;
  try {
    htmlBody = await getPage(currentURL);
  } catch (error) {
    console.error('Error fetching URL: ', currentURL, error);
    return pages;
  }

  // recur through the page's links
  const urls = getURLsFromHTML(htmlBody, baseURL);
  for (const url of urls) {
    await crawlPage(baseURL, url, pages);
  }

  return pages;
}

export async function getPage(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Content-Type': 'text/html',
      },
    });

    if (response.status >= 400) {
      console.error('Error fetching URL: ', url);
      return;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.log(`Got non-HTML response: ${contentType}`);
      return;
    }

    if (response.status === 200) {
      return response.text();
    }
  } catch (error) {
    console.error('Error fetching URL: ', url, error);
  }
}
