import { Channel, Listing } from "@/lib/types/api/multi-livestream";
import Link from "next/link";
import ITSImage from "@/components/ITSImage/ITSImage";
import Badge from "@/components/Badge/Badge";
import SignalIcon from '@/public/svg/signal.svg';

import styles from './ChannelThumbnail.module.scss';

interface ChannelThumbnailProps {
  channel: Channel,
  depNow?: Date;
}

const getCurrentListing = (listings: Listing[], depNow?: Date): Listing | undefined => {
  const now = depNow || new Date();
  return listings.find((listing) => {
    const listingStart = new Date(listing.start_time);
    const listingEnd = new Date(listing.start_time);
    listingEnd.setSeconds(listingEnd.getSeconds() + listing.duration);
    return now >= listingStart && now <= listingEnd;
  });
}

const ChannelThumbnail = (props: ChannelThumbnailProps) => {
  const { channel, depNow } = props;
  const { profile, listings, full_name, short_name, feed_image } = channel;

  const currentListing = getCurrentListing(listings, depNow);

  // if there is no current listing, don't render the thumbnail
  if (!currentListing) {
    return null;
  }

  const {
    show_title,
    episode_title,
    listing_image,
  } = currentListing;

  let classNames = styles.channel_thumbnail;

  if (!listing_image) {
    classNames += ` ${styles.no_image_fallback}`;
  }

  return (
    <Link
      href={{
        pathname: `/livestream/`,
        query: {
          selected: profile,
        }
      }}
      className={classNames}
    >
      { listing_image && (
        <ITSImage
          src={listing_image}
          className={styles.channel_thumbnail_image}
          width={140}
          srcSetSizes={[[140,78],[231,130],[316,178],[462,260],[632,356]]}
          alt={""}
          aria-hidden="true"
          />
      )}

      <div className={styles.channel_thumbnail_info}>
        <h3 className={styles.channel_name}>
          <span aria-hidden="true" className={styles.live_indicator}>
            <SignalIcon className={styles.signal_icon} />
            <Badge style="live" className={styles.live_badge}>Live</Badge>
          </span>
          { feed_image?.white_logo ? (
          <ITSImage
            className={styles.channel_logo}
            src={feed_image.white_logo}
            width={120}
            alt={full_name || short_name}
          />
          ):(
            <>{full_name || short_name}</>
          )}
        </h3>

        <div className={styles.channel_thumbnail_info__titles}>
          { show_title && (
            <h4 className={styles.show_title}>{show_title}</h4>
          )}

          { episode_title && (
            <p className={styles.episode_title}>{episode_title}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChannelThumbnail;
