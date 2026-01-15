'use client'

import { useState } from 'react';

import styles from './SponsorshipText.module.scss';

interface SponsorshipTextProps {
  id?: string;
  className?: string;
  title: string;
  source: {
    local_content_stations?: string[];
    funder_message?: string;
  };
  sponsorInfoLink?: string;
  sponsorshipTextVisibility?: 'mobile' | 'desktop';
}

const maxWords = 30; // Display first 30 words
const wordsThreshold = 40; // Show "Show More" button if more than 40 words

const SponsorshipText = (props: SponsorshipTextProps) => {
  const { title, source, sponsorInfoLink, className, sponsorshipTextVisibility } = props;

  const [expanded, setExpanded] = useState(false);
  const funderMessageWords = source.funder_message?.replace(/<[^>]*>/g, '').split(/\s+/);
  const displayFunderMessage =
    funderMessageWords && funderMessageWords.length > wordsThreshold
      ? funderMessageWords.slice(0, maxWords).join(' ') + '...'
      : source.funder_message;

  let responsiveClass = '';

  if (sponsorshipTextVisibility === 'mobile') {
    responsiveClass = ' visible_below_sm';
  } else if (sponsorshipTextVisibility === 'desktop') {
    responsiveClass = ' visible_above_sm';
  }

  return (
    <div className={`${styles.sponsorship_text}${className ? ` ${className}` : ''}${responsiveClass}`}>

      {source.local_content_stations && source.local_content_stations.length > 0 && (
        <p className={styles.sponsorship_text_local_disclaimer}>
          {source.local_content_stations.length === 1 && (
            <>
              {title} is a local public television program presented by {source.local_content_stations[0]}
            </>
          )}
          {source.local_content_stations.length === 2 && (
            <>
              {title} is a local public television program presented by {source.local_content_stations[0]} and {source.local_content_stations[1]}
            </>
          )}
          {source.local_content_stations.length > 2 && (
            <>
              {title} is presented by your local public television station.
            </>
          )}
        </p>
      )}

      {source.funder_message && (
        <p className={styles.sponsorship_text_funder_message}>
          <span dangerouslySetInnerHTML={{ __html: expanded ? source.funder_message : displayFunderMessage as string }} />
          {funderMessageWords && funderMessageWords.length > wordsThreshold && (
            <button className={styles.sponsorship_text_funder_message_button} onClick={() => setExpanded(!expanded)}>
              { expanded ? `Less` : `More`}
            </button>
          )}
        </p>
      )}

      {sponsorInfoLink && (
        <p className={styles.sponsorship_text_sponsor_info_link}>
          <a href={sponsorInfoLink}>Program Sponsorship</a>
        </p>
      )}
    </div>
  )
}

export default SponsorshipText;
