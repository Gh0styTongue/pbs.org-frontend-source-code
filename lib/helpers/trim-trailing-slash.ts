// Source:
// https://stackoverflow.com/a/36242700

/**
 * Checks to see if a string (e.g. a URL) ends with a trailing slash
 * and removes it.
 * @param {string} str - string
 * @returns {string} - string without trailing slash
*/
const trimTrailingSlash = (str: string) => {
  switch (true) {
    case str.endsWith('//'):
      return str.slice(0, -2);
    case str.endsWith('/'):
      return str.slice(0, -1);
    default:
      return str;
  }
};

export { trimTrailingSlash };
