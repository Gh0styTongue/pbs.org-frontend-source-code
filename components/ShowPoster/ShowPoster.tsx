"use client"

// imports
import Link from 'next/link';
import { KeyboardEvent, Ref } from 'react';

// lib files
import { Franchise } from '@/lib/types/api/franchise-data';
import { ShowNode } from '@/lib/types/graphql/searchShowsResponse';
import { ShowRowContent, ShowDetails, ShowOrFranchiseEnum } from '@/lib/types/api/show-data';

// components
import ITSImage from '@/components/ITSImage/ITSImage';

// styles
import styles from './ShowPoster.module.scss';

export type ShowWithImages = ShowDetails | ShowRowContent
export interface ShowPosterType {
  images: {
    'show-poster2x3': string;
  };
  slug: string;
  title: string;
  item_type: ShowOrFranchiseEnum;
}
export interface FranchisePosterType {
  images: {
    'franchise-poster2x3': string;
  };
  slug: string;
  title: string;
  item_type: ShowOrFranchiseEnum;
}
export interface ShowPosterProps {
  show: ShowWithImages | ShowNode | Franchise | ShowPosterType | FranchisePosterType;
  href?: string;
  gtmLabel?: string;
  className?: string;
  onClick?: (show: ShowRowContent) => void;
  width?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLAnchorElement>) => void;
  onFocus?: () => void;
  ref?: Ref<HTMLAnchorElement>;
}

const ShowPoster = (props: ShowPosterProps) => {
  const { show, href, gtmLabel, className, onClick, width = 227, onKeyDown, onFocus, ref } = props;
  const { item_type } = show;

  const handleClick = () => {
    if (onClick) onClick(show as ShowRowContent);
  };

  let imgSrc = null;
  let parentSlug = 'show';

  switch (item_type?.toLowerCase()) {
    case ShowOrFranchiseEnum.Franchise:
      const franchise = show as Franchise;
      imgSrc = franchise.images?.['franchise-poster2x3'] || franchise.image;
      parentSlug = 'franchise';
      break;
    case ShowOrFranchiseEnum.Show:
      // sorry for all of this - typescript is a right bastard
      if(Object.hasOwn(show, 'images')) {
        const showWithImages = show as ShowWithImages

        if (showWithImages.images?.['show-poster2x3']) {
          imgSrc = showWithImages.images['show-poster2x3'];
        }
      } else if(Object.hasOwn(show, 'image')) {
        const showWithImage = show as ShowNode
        imgSrc = showWithImage.image as string;
      }
  }

  const linkHref = href || `/${parentSlug}/${show.slug}/`;

  let classNames = styles.show_poster__link;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <Link
      href={linkHref}
      className={classNames}
      data-gtm-label={gtmLabel}
      onClick={handleClick}
      ref={ref}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      >
      {imgSrc ? (
        <ITSImage
          src={imgSrc}
          alt={show.title}
          width={width}
          height={Math.round(width * 1.5)}
          resizeWithCrop={true}
        />
      ) : (
        <p className={styles.show_poster__fallback}>{show.title}</p>
      )}
    </Link>
  );
};

export default ShowPoster;
