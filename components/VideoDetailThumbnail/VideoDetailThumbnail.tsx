// imports
import Link from 'next/link';

// lib files
import { fromSeconds } from '@/lib/helpers/from-seconds';
import { VideoClass } from '@/lib/types/api/video';

// components
import AccessibilityIcons from '@/components/AccessibilityIcons/AccessibilityIcons';
import MyListButton from '@/components/Button/MyList/MyListButton';
import VideoMezzanineLink from '@/components/VideoMezzanineLink/VideoMezzanineLink';

// styles
import styles from './VideoDetailThumbnail.module.scss';

type VideoDetailThumbnailProps = {
  video: VideoClass;
  gtmLabel?: string;
  nowPlaying?: boolean;
  displayShowName?: boolean;
  // this prop is really here for storybook development
  depIsNew?: boolean;
  depPercentageWatched?: number;
};

const VideoDetailThumbnail = (props: VideoDetailThumbnailProps) => {
  const {
    video,
    gtmLabel,
    nowPlaying = false,
    displayShowName = false,
    depIsNew = false,
    depPercentageWatched = 0,
  } = props;

  const {
    title,
    slug,
    description_short: description,
    show,
    summary
  } = video;

  const formattedDuration = fromSeconds(video.duration);
  // If display_episode_number is not set, default to true
  const shouldDisplayEpisodeNumber = video.parent?.season?.show?.display_episode_number || true

  let text = description;

  if (summary && summary !== '' && shouldDisplayEpisodeNumber) {
    text = `${summary} | ` + text;
  }

  if (formattedDuration && formattedDuration !== '') {
    text = text + ` (${formattedDuration})`;
  }

  return (
    <div className={styles.video_detail_thumbnail_container}>
      <div className={styles.video_detail_thumbnail}>
        <VideoMezzanineLink
          video={video}
          gtmLabel={gtmLabel}
          nowPlaying={nowPlaying}
          depIsNew={depIsNew}
          depPercentageWatched={depPercentageWatched} />
        <p className={styles.video_title}>
          { displayShowName && show && show.title && (
            <span className={styles.video_detail_show_title}>
              <Link href={`/show/${show.slug}/`}>
                {show.title}
              </Link>
            </span>
          )}
          <Link href={`/video/${slug}/`}>{title}</Link>
        </p>
        <p className={styles.video_detail_accessibility_icons}>
          <AccessibilityIcons video={video} preceedWithPipe={false} />
        </p>
        <p className={styles.video_description}>
          {text}
        </p>

        <MyListButton video={video} style='iconOnly' />

      </div>
    </div>
  );
}

export default VideoDetailThumbnail;
