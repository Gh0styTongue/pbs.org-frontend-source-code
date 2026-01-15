'use client'

// imports
import Link from 'next/link';

// components
import GenreBadge from '@/components/Badge/GenreBadge';
import ITSImage from '@/components/ITSImage/ITSImage';
import MyListButton from '@/components/Button/MyList/MyListButton';

// types
import { ShowRowContent } from '@/lib/types/api/show-data';

import styles from '@/components/ShowGrid/ShowGridCard.module.scss';

interface ShowGridCardProps {
  show: ShowRowContent
  className?: string;
}

function ShowGridCard({ show, className }: ShowGridCardProps) {
  const { description_short, genre, slug, title } = show;

  const ShowLogoOrTitle = () => {
    const showLogo =  show.images?.['white-logo-41'];

    return (
      <>
        { showLogo ? (
          <h2 className={styles.show_grid_card__logo}>
            <Link href={`/show/${slug}/`}>
              <ITSImage
                src={showLogo}
                alt={title}
                width={240}
              />
            </Link>
          </h2>
        ) : (
          <h2 className={styles.show_grid_card__overtitle}>
            <Link href={`/show/${slug}/`}>
              {title}
            </Link>
          </h2>
        )}
      </>
    )
  }

  let classNames = `${styles.show_grid_card}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <div className={classNames}>
      {genre?.slug && (
        <GenreBadge
          href={`/explore/${genre.slug}`}
          className={styles.show_grid_card__genre}
        >
          {genre.title}
        </GenreBadge>
      )}
      <ShowLogoOrTitle />
      <p className={styles.show_grid_card__description}>
        {description_short}
      </p>
      <MyListButton
        show={show}
        style='iconOnly'
      />
    </div>
  )
}

export default ShowGridCard
