import Link from 'next/link';

import ITSImage from '@/components/ITSImage/ITSImage';

import styles from './FromFranchise.module.scss';

interface FromFranchiseProps {
  franchise: {
    title: string;
    slug: string;
    logo_cropped_white?: string;
    images?: {
      'white-logo-41'?: string;
    }
  };
  className?: string;
}

const FromFranchise = (props: FromFranchiseProps) => {
  const { franchise, className } = props;

  const { title, slug, logo_cropped_white, images } = franchise;

  const franchiseLogo = logo_cropped_white || images?.['white-logo-41'];

  return (
    <p className={`${styles.from_franchise}${className ? ` ${className}` : ''}`}>
      From
      <Link
        href={`/franchise/${slug}/`}
        className={styles.from_franchise__link}
        >
        { franchiseLogo ? (
          <ITSImage
            src={franchiseLogo}
            alt={title}
            width={120}
          />
          ) : (
            <>
              {title}
            </>
          )
        }
      </Link>
    </p>
  )
}

export default FromFranchise;
