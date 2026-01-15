// imports
import Link from 'next/link';

// lib files
import { isVideoNew } from '@/lib/helpers/is-video-new';
import { VideoClass } from '@/lib/types/api/video';

// components
import ITSImage from '@/components/ITSImage/ITSImage';
import UserProgressBar from '@/components/UserProgressBar/UserProgressBar';
import PassportHoverOverlay from '@/components/VideoMezzanineLink/PassportHoverOverlay';
import Badge from '@/components/Badge/Badge';

// svgs
import CompassRoseCorner from '@/public/svg/compass-rose-corner.svg';

// styles
import styles from './VideoMezzanineLink.module.scss';

type VideoMezzanineLinkProps = {
  video: VideoClass;
  gtmLabel?: string;
  nowPlaying?: boolean;
  // these props are really here for storybook development
  depIsNew?: boolean;
  depPercentageWatched?: number;
}

const VideoMezzanineLink = (props: VideoMezzanineLinkProps) => {
  const {
    video,
    gtmLabel,
    nowPlaying = false,
    depIsNew = false,
    depPercentageWatched = 0,
  } = props;

  const imgSrc = video.images?.['asset-mezzanine-16x9'] || video.image;
  const isPassport = video.flags.is_mvod;
  const isVideoNewBool = !nowPlaying && isVideoNew(video, depIsNew);

  let VideoMezzanineLinkImageLinkClassNames = styles.video_mezzanine_link;

  if (nowPlaying) {
    VideoMezzanineLinkImageLinkClassNames += ` ${styles.video_mezzanine_link_now_playing}`;
  }

  return (
    <div className={styles.video_mezzanine_link_wrapper}>
      <Link href={`/video/${video.slug}/`} className={VideoMezzanineLinkImageLinkClassNames} data-gtm-label={gtmLabel}>
        {/* @TODO make image fallback for video */}
        {imgSrc && (
          <ITSImage
            src={imgSrc}
            alt={video.title}
            width={316}
            height={177}
            srcSetSizes={[[140, 79], [316, 177]]}
            className={styles.video_mezzanine_link_image}
          />
        )}
      </Link>
      {isPassport && (
        <PassportHoverOverlay className={styles.passport_cta} />
      )}

      {isPassport && (
        <span className={styles.video_mezzanine_link_passport_badge} aria-label="Passport">
          <CompassRoseCorner />
        </span>
      )}

      {nowPlaying && (
        <Badge style={"coral"} className={styles.video_mezzanine_link_badge}>
          Now Playing
        </Badge>
      )}
      {isVideoNewBool && (
        <Badge style={"yellow"} className={styles.video_mezzanine_link_badge}>
          New
        </Badge>
      )}
      <UserProgressBar slug={video.slug} depPercentageWatched={depPercentageWatched} />
    </div>
  );
}

export default VideoMezzanineLink;
