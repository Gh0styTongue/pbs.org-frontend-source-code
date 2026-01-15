'use client';

// imports
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useInView } from 'react-intersection-observer';
import useThrottledCallback from '@/lib/hooks/useThrottledCallback';
import useWindowResize from '@/lib/hooks/useWindowResize';

// lib files
import { GPT_NETWORK_ID } from '@/lib/constants';
import { adsReady as adsReadyAtom } from '@/lib/atoms/ads-ready';
import { getMinimumSlotSize } from '@/components/SponsorshipUnit/get-minimum-slot-size';

import styles from './SponsorshipUnit.module.scss';

interface SponsorshipUnitProps {
 adUnit: string;
 size: googletag.GeneralSize;
 id: string;
 max?: number;
 min?: number;
 isMobile?: boolean;
 fullWidth?: boolean;
 depAdsReady?: boolean;
 className?: string;
}

/**
 * SponsorshipUnit
 * Displays an ad unit on the page.
 * @param {string} adUnit - string that should be appended after our network id, without a leading slash
 * @param {googletag.GeneralSize} size - size of the ad unit, e.g. [300, 250], or [[300, 250], [300, 600]]
 * @param {string} id - unique identifier for the ad unit - must be unique on the page
 * @param {number} min - the minimum viewport width at which the ad unit should be visible. Defaults to 1024.
 * @param {number} max - the maximum viewport width at which the ad unit should be visible. (No default value)
 * @param {boolean} isMobile - whether or not the ad unit is for mobile. Defaults to false.
 * @param {boolean} fullWidth - whether or not the ad unit spans the content well. Defaults to false.
 * @param {boolean} depAdsReady - dependency injected boolean to display ads in storybook. Defaults to false.
 * @returns {ReactNode} SponsorshipUnit - a div that will be replaced by the ad unit
*/
const SponsorshipUnit = (props: SponsorshipUnitProps) => {
  const {
    adUnit,
    size,
    id,
    max,
    min = 1024,
    isMobile = false,
    fullWidth = false,
    depAdsReady = false,
    className
  } = props;

  const [adsReady, setAdsReady] = useAtom(adsReadyAtom)

  if (depAdsReady) {
    setAdsReady(true);
  }

  const [ renderUnit, setRenderUnit ] = useState(false);
  const [ isAboveMinBreakpoint, setIsAboveMinBreakpoint ] = useState(false);
  const [ isBelowMaxBreakpoint, setIsBelowMaxBreakpoint ] = useState(false);
  const [ adSlot, setAdSlot ] = useState<googletag.Slot | null>(null);
  // in case we need to hide ads globally - i.e. for SVP
  const [ showAd, setShowAd ] = useState(true);
  const [ slotRefreshed, setSlotRefreshed ] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  const setSponsorshipVisibility = () => {
    // Log a warning if min is larger than max
    if (min && max && min > max) {
      console.warn(`SponsorshipUnit: min (${min}) is larger than max (${max}).`);
    }

    if (window.matchMedia(`(min-width: ${min}px)`).matches) {
      setIsAboveMinBreakpoint(true);
    } else {
      setIsAboveMinBreakpoint(false);
    }

    if (max && window.matchMedia(`(min-width: ${max}px)`).matches) {
      setIsBelowMaxBreakpoint(false);
    } else {
      setIsBelowMaxBreakpoint(true);
    }
  }

  // check if the ad is above the desired breakpoint on load
  useEffect(() => {
    setSponsorshipVisibility();
  });

  const onWindowResize = useWindowResize();

  // check if the ad is above the desired breakpoint on resize
  onWindowResize(useThrottledCallback(() => {
    setSponsorshipVisibility();
  }));

  // this ref is really here to prevent the slot getting defined twice
  // in the below useEffect. In dev mode, useEffects will be run twice
  // on component mount, which results in an error in the browser console.
  // The browser console error doesn't actually impact user experience, but
  // it can be confusing if you're working on this.
  // Ref work around from this video https://youtu.be/81faZzp18NM?si=6c1IHtnCyRk1hSPn&t=469
  const slotDefinedRef = useRef(false);
  useEffect(() => {
    if (window.pbsPlatform == 'svp') {
      setShowAd(false);
      return;
    }

    if (!adSlot && !slotDefinedRef.current) {
      const unit = `${GPT_NETWORK_ID}${adUnit}`;

      // Register the slot with GPT when the component is loaded.
      googletag.cmd.push(() => {
        const slot = googletag.defineSlot(unit, size, id);
        if (slot) {
          slot
            .setCollapseEmptyDiv(true)
            .addService(googletag.pubads());
          // save the slot in state
          setAdSlot(slot);
          googletag.display(slot);
          // set state when we have an ad to render (sometimes we don't)
          googletag.pubads().addEventListener("slotRenderEnded", (e) => {
            setRenderUnit(!e.isEmpty);
          });
        }
      });
    }

    return () => {
      // see comment above about this ref
      slotDefinedRef.current = true;
      // Clean up the slot when the component is unloaded.
      googletag.cmd.push(() => {
        if (adSlot) {
          googletag.destroySlots([adSlot]);
          setAdSlot(null);
        }
      });
    };
  }, [id, size, adUnit, adSlot, slotDefinedRef]);

  useEffect(() => {
    if (adsReady && adSlot && !slotRefreshed && isAboveMinBreakpoint && inView && googletag.apiReady) {
      googletag.cmd.push(() => {
        // .refresh() will actually fetch ad creative
        googletag.pubads().refresh([adSlot]);
      });
      // but we only want to do this once
      setSlotRefreshed(true);
    }
  }, [isAboveMinBreakpoint, inView, slotRefreshed, adSlot, adsReady]);

  // these help prevent layout shift
  const inlineStyles = getMinimumSlotSize(size);

  let unitClassName = styles.sponsorship_unit;

  if (isAboveMinBreakpoint && isBelowMaxBreakpoint) {
    unitClassName += ` ${styles.sponsorship_unit__in_flow}`;
  }

  if (renderUnit && isAboveMinBreakpoint && isBelowMaxBreakpoint && inView) {
    unitClassName += ` ${styles.sponsorship_unit__rendered}`;
  }

  if (fullWidth) {
    unitClassName += ` ${styles.sponsorship_unit__full_width}`;
  }

  if (className) {
    unitClassName += ` ${className}`;
  }

  if (!showAd) {
    return null;
  }
  // Create the ad slot container.
  // create class names based on whether or not to render the ad unit
  // Note: we can't simply test for renderUnit from state because
  // google needs to find the div to begin with.
  // So we toggle CSS classes based on the state of the ad unit.
  return (
    <div
      className={unitClassName}
      style={inlineStyles}
      ref={ref}
    >
      {isMobile && (
        <div className={styles.sponsorship_mobile_explanation}>
          <p className={styles.sponsorship_explanation__text}>Support for PBS provided by:</p>
        </div>
      )}

      <div id={id} className={styles.sponsorship_injected_ad}></div>

      {!isMobile && (
      <div className={styles.sponsorship_explanation}>
        <p className={styles.sponsorship_explanation__text}>Providing Support for PBS.org</p>
        <Link
          href="https://pbs.org/online-sponsorship-support"
          target="_blank"
          className={styles.sponsorship_explanation__link}
          rel="noopener noreferrer">
            Learn More
            <span className="visuallyhidden">about PBS online sponsorship</span>
        </Link>
      </div>
      )}
    </div>
  );
}

export default SponsorshipUnit;
