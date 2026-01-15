'use client';

import { LazyMotion, domAnimation, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { JSX, PropsWithChildren } from 'react';

const pageAnimations = {
  pageInitial: {
    opacity: 0,
    y: 20,
  },
  pageAnimate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
};

// Lazy load the DOM animation subset of features we use from Framer Motion

const PageTransition = ({ children }: PropsWithChildren): JSX.Element => {
  const path = usePathname();
  return (
    <LazyMotion features={domAnimation}>
      {/* @TODO add <AnimatePresence /> when page exits are possible with Next.js */}
      <motion.div
        key={path}
        initial="pageInitial"
        animate="pageAnimate"
        transition={{ type: 'spring' }}
        // Scrolls to the top for the next page
        onAnimationStart={() => window.scrollTo(0, 0)}
        variants={pageAnimations}
      >
        {children}
      </motion.div>
    </LazyMotion>
  );
};

export default PageTransition;
