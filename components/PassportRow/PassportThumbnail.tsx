import Link from 'next/link';

import { ShowRowContent } from '@/lib/types/api/show-data';
import IconLinkButton from '@/components/Button/IconLinkButton';

import styles from './PassportThumbnail.module.scss';
import ITSImage from '../ITSImage/ITSImage';
import MyListButton from '@/components/Button/MyList/MyListButton';
import CompassRoseCorner from '@/public/svg/compass-rose-corner.svg';


interface PassportThumbnailProps {
  show: ShowRowContent;
}

const PassportThumbnail = (props: PassportThumbnailProps) => {
  const { show } = props;
  const { title, slug, images, description_short} = show;

  let logoToUse = null;

  if (images['white-logo-41']) {
    logoToUse = images['white-logo-41'];
  } else if (images['show-white-logo']) {
    logoToUse = images['show-white-logo'];
  }

  return (
    <div className={styles.passport_thumbnail}>
      { images.background && (
        <Link href={`/show/${slug}/`} className={styles.passport_thumbnail_image_link}>

          <span className={styles.passport_thumbnail_passport_badge} aria-label="Passport">
            <CompassRoseCorner />
          </span>

          <ITSImage
            className={styles.passport_thumbnail_image}
            src={images.background}
            alt=""
            width={475}
            resizeWithCrop={true}
            srcSetSizes={[[140,78], [348,195], [475, 267], [640,360], [1280, 720] ]}
          />
        </Link>
      )}

      <div className={styles.passport_show_info}>

        <h3 className={styles.show_name}>
          {logoToUse ? (
            <ITSImage
              className={styles.show_logo}
              src={logoToUse}
              alt={title}
              width={288}
              srcSetSizes={[[140,78], [348,195], [475, 267], [640,360], [1280, 720] ]}
            />
          ) : (
            <span className={styles.show_title}>
            {title}
            </span>
          )}
        </h3>
        { description_short && (
          <p className={styles.show_description}>{description_short}</p>
        )}

        <div className={styles.passport_buttons}>
          <IconLinkButton
            href={`/show/${slug}`}
            icon="play"
            title="Watch Now"
            />

          <MyListButton
            style="iconOnly"
            show={show}
          />

          {/* @TODO when CS can give us the show level preview in this collection, we'll add it here. */}
        </div>

      </div>
    </div>
  );
};

export default PassportThumbnail;
