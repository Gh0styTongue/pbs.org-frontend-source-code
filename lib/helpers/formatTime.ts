import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { PBSTimezones } from '@/lib/types/api/timezones';


dayjs.extend(utc);
dayjs.extend(timezone)
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);

/**
 * Derives the UTC offset, in minutes, from an ISO string
 * @param {String} time - timestamp in ISO format
 * @returns {Number} the offset, in minutes
 */
const getUtcOffsetFromIsoString = (time: string): number => {
  // the regex that pulls apart an ISO string
  const re = /^(.*)T(\d*:\d*:\d*)(.*)$/;
  // the offset, from the regex - usually looks like `-04:00`
  const match = time.match(re)

  // if the string has no offset, return 0, which means UTC time.
  // if there were any point that we might want to 'guess' based
  // on the user's location, this would be it, but we're not doing that now
  if(!match || match[3] === undefined || match[3] === '') {
    return 0;
  } else {
    var reOffset = match[3];
  }

  // split it into `-04` and `00`
  const [h, m] = reOffset.split(':');
  // convert the hours to minutes `-04` -> `-240`
  const hToM = parseInt(h) * 60;
  // if the converted hours is a negative number (which is most of the time)
  // we'll need to return that minus the minutes,
  // thus returning a negative number
  if (hToM < 0) {
    return hToM - parseInt(m);
  } else {
    // if the converted hours is a positive number,
    // which is true ahead of the UTC line (e.g. east of Greenwich, UK),
    // which is not our typical use case,
    // we'll need to return that plus the minutes, as a positive number
    return hToM + parseInt(m);
  }
}

/**
 * Formats an ISO Time string
 * Defaults to `8:00 PM`, but can be passed other formats.
 * NOTE: if using the ` z` format (lowercase z, for short timezone name),
 * you need to provide a timezone, otherwise it will not work as expected.
 * @param {String} time - timestamp to format.
 * @param {String} format - optional, formatting string to follow. See https://day.js.org/docs/en/display/format and https://day.js.org/docs/en/plugin/advanced-format
 * @param {String} timezone - optional, timezone to shift to.
 * @returns {String} formated time.
 */
const formatTime = (time: string, format = `LT`, timezone: PBSTimezones | undefined = undefined): string | boolean => {
  if (time && dayjs(time).isValid()) {
    // if we are passed a timezone, we can shift it to that timezone then format it
    if (timezone) {
      return dayjs(time).tz(timezone).format(format);
    } else {
      // if we are not passed a timezone, but the format includes ' z'
      // we need to warn the developer that it won't work as expected
      if (format.includes(' z')) {
        console.warn("formatTime(): the ' z' format does not work when a timezone is not provided. Please provide a timezone, or remove the ' z' from the format string. Time is being converted to the local timezone.");

        return dayjs(time).format(format);
      }
      // Our use case for displaying time is counter to the way
      // JavaScript and day.js are built - we want to take an ISO string
      // and format it *without converting to the user's local time*.
      // JS (and day.js), by default will *always* convert an ISO string
      // to local time before anything else.
      // We still want to use day.js to do the formatting.

      // In order to work around that, we need to derive the UTC offset based
      // on the ISO string, which we get from getUtcOffsetFromIsoString().
      const offset = getUtcOffsetFromIsoString(time);
      // Then we first create the dayjs object, which by default will be local
      // to the environment's
      return dayjs(time)
        // we then need to *reset the time back to the orignal offset*
        .utcOffset(offset)
        // then we format it
        .format(format);
    }
  }
  return false;
};

export { formatTime, getUtcOffsetFromIsoString };
