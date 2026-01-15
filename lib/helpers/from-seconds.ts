const fromSeconds = (seconds: number): string => {
  if (!seconds) {
    return "";
  }

  try {
    seconds = Math.floor(Number(seconds));
  } catch (_error) {
    return "";
  }

  const time: string[] = [];

  // get the number of hours
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;

  // get the number of minutes
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  if (hours) {
    time.push(`${hours}h`);
  }
  if (minutes) {
    time.push(`${minutes}m`);
  }
  if (seconds) {
    time.push(`${seconds}s`);
  }

  return time.join(" ");
}

export { fromSeconds };
