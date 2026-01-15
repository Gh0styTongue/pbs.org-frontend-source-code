/**
 * Formats a Date object into the "MM/DD/YYYY" format.
 *
 * @param {Date} date The Date object to be formatted.
 * @returns {string} The formatted date string in the "MM/DD/YYYY" format.
 */

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
