'use client'

// imports
import {
  motion,
  useMotionValue,
  useScroll,
} from "framer-motion";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'

// lib files
import shouldRenderContentNav from "@/lib/helpers/content-nav";
import { StationData } from "@/lib/types/api/stations-data";

// components
import ContentNav from '@/components/Navigation/ContentNav';
import UtilityNav from '@/components/Navigation/UtilityNav';

// styles
import styles from '@/components/Navigation/Navigation.module.scss';

interface NavigationProps {
  stationData?: StationData;
  isSVP: boolean;
  isUS: boolean;
  depRenderContentNav?: boolean;
  isPBSPatrioticLogoEnabled?: boolean;
  searchAutocompleteEnabled?: boolean;
}

const scrollThreshold = [0, 50];

const Navigation = (props: NavigationProps) => {
  const { stationData, isSVP, isUS, depRenderContentNav, isPBSPatrioticLogoEnabled = false, searchAutocompleteEnabled = false } = props;

  const { scrollY } = useScroll();
  const scrollYOnDirectionChange = useRef(scrollY.get());
  const lastPixelsScrolled = useRef(null);
  const lastScrollDirection = useRef(null);
  const pixelsScrolled = useMotionValue(0);

  const [scrollDirectionState, setScrollDirectionState] = useState('down')
  const [atTop, setAtTop] = useState(true)
  const pathname = usePathname()
  const renderContentNav = depRenderContentNav !== undefined ? depRenderContentNav : shouldRenderContentNav(pathname)

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (latest < 0) return;

      const previous = scrollY.getPrevious()
      const isScrollingDown =  previous ? (previous - latest < 0) : false;
      const scrollDirection = isScrollingDown ? "down" : "up";
      const currentPixelsScrolled = pixelsScrolled.get();
      let newPixelsScrolled;

      setScrollDirectionState(scrollDirection)

      // @ts-ignore
      if (scrollY.current < 5) {
        setAtTop(true);
      } else {
        setAtTop(false);
      }

      if (lastScrollDirection.current !== scrollDirection) {
        // @ts-ignore
        lastPixelsScrolled.current = currentPixelsScrolled;
        scrollYOnDirectionChange.current = latest;
      }

      if (isScrollingDown) {
        newPixelsScrolled = Math.min(
          // @ts-ignore
          lastPixelsScrolled.current +
            (latest - scrollYOnDirectionChange.current),
          scrollThreshold[1]
        );
      } else {
        newPixelsScrolled = Math.max(
          // @ts-ignore
          lastPixelsScrolled.current -
            (scrollYOnDirectionChange.current - latest),
          scrollThreshold[0]
        );
      }

      pixelsScrolled.set(newPixelsScrolled);
      // @ts-ignore
      lastScrollDirection.current = scrollDirection;
    });
  }, [pixelsScrolled, scrollY]);

  return (
    <motion.header className={styles.navigation}>
      <UtilityNav
        stationData={stationData}
        isSVP={isSVP}
        isUS={isUS}
        atTop={atTop}
        isPBSPatrioticLogoEnabled={isPBSPatrioticLogoEnabled}
        searchAutocompleteEnabled={searchAutocompleteEnabled}
      />
      {renderContentNav && (
        <ContentNav
          isSVP={isSVP}
          atTop={atTop}
          scrollDirection={scrollDirectionState as "up" | "down"}
        />
      )}
    </motion.header>
  );
}

export default Navigation;
