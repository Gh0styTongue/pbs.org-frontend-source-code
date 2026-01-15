'use client'

// imports
import { useEffect, useState } from 'react';

// lib files
import { useHasMounted } from '@/lib/hooks';
import waitOn from '@/lib/helpers/waiton';

// styles
import styles from './CookieSettings.module.scss';

type CookieSettingsProps = {
  className?: string;
}

export const CookieSettings = (props: CookieSettingsProps) => {
  const {className} = props;
  const [isKetchReady, setIsKetchReady] = useState(false);
  const hasMounted = useHasMounted();

  // Poll every .2 seconds after mount before trying to subscribe to the ketch event.
  // Firing too early means we may miss ketch loading and never turning on the cookie settings button.
  // This is a workaround for the fact that the ketch script is loaded asynchronously with a GTM tag.
  // It will time out after 60 seconds.
  useEffect(() => {
    const waitForKetch = async () => {
      try {
        await waitOn(window, ['ketch']);

        if (typeof window.ketch === 'function') {
          window.ketch('on', 'environment', () => {
            setIsKetchReady(true);
          });
        }
      } catch (_error) {
        // Swallow the error, ketch failed to load, and it's 99.9999% going to
        // be because of privacy extensions and/or ad blockers.
      }
    };

    waitForKetch();

    return () => {
      window?.ketch('off', 'environment');
    };
  }, []);

  let classes = styles.cookie_settings;

  if (className) {
    classes += ` ${className}`;
  }

  if (!hasMounted || !isKetchReady) {
    return null;
  }

  return (
    <li key={'cookie-settings'} className={classes}>
      <button
        onClick={() => {
          if (typeof window !== 'undefined' && typeof window.ketch === 'function') {
            window.ketch('showConsent', { displayHint: 'experiences.consent.modal' });
          }
        }}
      >
        Cookie Settings
      </button>
    </li>
  )
}
