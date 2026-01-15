/**
 * Determine minimum width and height values for an ad slot container
 * based on the configured slot sizes. This helps prevent layout shift.
 */
const getMinimumSlotSize = (size: googletag.GeneralSize) => {
  const maxValue = 1440;

  let minW = maxValue;
  let minH = maxValue;
  // we need to account for the explanation text below the ad
  const explanationTextHeight = 29;
  if (Array.isArray(size)) {
    // Convert googletag.SingleSize to googletag.MultiSize for convenience.
    const sizes = size.length <= 2 && !Array.isArray(size[0]) ? [size] : size;

    for (const size of sizes) {
      if (Array.isArray(size) && size[0] !== 'fluid') {
        minW = Math.min(size[0] as number, minW);
        minH = Math.min(size[1] as number, minH);
      }
    }
  }

  return minW < maxValue && minH < maxValue
    ? // Static ad slot.
      { width: 'max-content', minWidth: `${minW}px`, minHeight: `${minH + explanationTextHeight}px` }
    : // Fluid ad slot.
      { minWidth: '50%' };
}

export { getMinimumSlotSize };
