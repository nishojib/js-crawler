export function printReport(pages) {
  console.log('report starting...');

  const sortedPages = sortPages(pages);

  for (const [url, count] of Object.entries(sortedPages)) {
    console.log(`Found ${count} internal links to ${url}`);
  }
}

export function sortPages(pages) {
  // 2D array where the
  // inner array: [ url, count ]
  const pagesArr = Object.entries(pages);
  pagesArr.sort((pageA, pageB) => {
    if (pageB[1] === pageA[1]) {
      return pageA[0].localeCompare(pageB[0]);
    }
    return pageB[1] - pageA[1];
  });
  return pagesArr;
}
