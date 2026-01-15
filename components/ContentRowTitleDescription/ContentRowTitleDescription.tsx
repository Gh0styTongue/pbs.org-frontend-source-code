'use client'

// imports
import { useEffect, useRef } from 'react';

// lib files
import { slugify } from '@/lib/helpers/slugify';
import { useHasMounted } from '@/lib/hooks';

// components
import ITSImage from '@/components/ITSImage/ITSImage';
import ContentRowLinkPopover from '@/components/ContentRowTitleDescription/ContentRowLinkPopover';

// styles
import styles from './ContentRowTitleDescription.module.scss';

interface ContentRowTitleDescriptionProps {
  title: string;
  description?: string;
  logo?: string;
  logo_alt?: string;
}

const ContentRowTitleDescription = (props: ContentRowTitleDescriptionProps) => {
  const { title, logo, logo_alt, description } = props;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const titleSlug = slugify(title);
  const anchorId = `--anchor-${titleSlug}`;
  const hasMounted = useHasMounted();

  // Because the page renders and these titles may not have been hydrated, URLs like
  // https://www.pbs.org/example/#example-anchor will not work by default.
  // This effect will scroll to the title if it exists in the URL hash.
  useEffect(() => {
    // check to see if the URL has a hash
    const hash = window.location.hash;

    if (hasMounted && hash === `#${titleSlug}`) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      titleRef.current?.scrollIntoView();
    }
  }, [titleSlug, hasMounted]);

  // This is a click handler for an h2 element.
  // Usually this is an anti-pattern, and we should be using a button.
  // However, we don't want this to behave any differently than a normal h2 element,
  // gaining focus, etc.
  const handleTitleClick = () => {
    popoverRef.current?.showPopover();
  }

  if (!hasMounted) {
    return null;
  }

  return (
    <div className={styles.content_row_title_description}>
      <h2
        className={styles.content_row_title}
        id={titleSlug}
        ref={titleRef}
        // @ts-ignore React styles types don't yet have anchorName
        style={{anchorName: anchorId}}
        onClick={handleTitleClick}
      >
        { (logo && logo_alt) && (
          <span className={styles.content_row_title__logo__wrapper}>
            <ITSImage
              src={logo}
              alt={logo_alt}
              width={125}
              className={styles.content_row_title__logo}
              />
          </span>
        )}
        {title}
      </h2>
      <ContentRowLinkPopover
        id={titleSlug}
        anchorId={anchorId}
        ref={popoverRef}
      />

      {description && (
        <p className={styles.content_row_description}>{description}</p>
      )}

    </div>
  );
};

export default ContentRowTitleDescription;
