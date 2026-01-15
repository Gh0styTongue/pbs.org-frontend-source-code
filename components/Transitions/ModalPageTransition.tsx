'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useState, useEffect, JSX } from 'react';
import { INTERNALLY_NAVIGATING_KEY } from '@/lib/constants';

import styles from './ModalPageTransition.module.scss';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const pageAnimations = {
  pageInitial: {
    opacity: 0,
    y: 40,
  },
  pageAnimate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
};

const ModalPageTransition = ({ children }: PropsWithChildren): JSX.Element => {

  const [isInternallyNavigating, setIsInternallyNavigating] = useState(false);

  useEffect(() => {
    // Scrolls to the top for the next page
    window.scrollTo(0, 0);
    if(canAccessStorage('sessionStorage')) {
      setIsInternallyNavigating(sessionStorage.getItem(INTERNALLY_NAVIGATING_KEY) === 'true')
    }
  }, [])

  const path = usePathname();

  let classNames = `${styles.modal_page}`;

  if (isInternallyNavigating) {
    classNames += ` ${styles.internal_navigation}`;
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* @TODO add <AnimatePresence /> when page exits are possible with Next.js */}
      <m.div
        key={path}
        initial="pageInitial"
        animate="pageAnimate"
        transition={{ type: 'spring' }}
        // redundant - make sure we scroll to the top at the end of the animation as well
        onAnimationComplete={() => window.scrollTo(0, 0)}
        variants={pageAnimations}
        className={classNames}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export default ModalPageTransition;
