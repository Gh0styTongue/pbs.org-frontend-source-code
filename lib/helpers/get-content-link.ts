/**
 * This returns a link with a hash to a given anchor.
 * It clears existing query parameters and hashes.
 * @param {string} id - the anchor we're targetimg
 * @param {string} [depWindowLocation] - optional, allows for testing with different URLs
 * @returns {string} - the full URL with the anchor
*/
const getContentLink = (id: string, depWindowLocation?: string): string => {
  const url = new URL(depWindowLocation || window.location.href);

  // Remove any query parameters from the URL
  const anyParams = url.searchParams;
  const keys = Array.from(anyParams.keys());
  for (const key of keys) {
    url.searchParams.delete(key);
  }

  // Ensure there's a trailing slash before adding the hash
  if (!url.pathname.endsWith('/')) {
    url.pathname += '/';
  }

  // Append / overwrite any hash in the url with the id
  url.hash = id;

  return url.toString();
}

export { getContentLink };

