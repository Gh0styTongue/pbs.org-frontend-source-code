import Link from 'next/link';
import { VideoClass } from '@/lib/types/api/video';
import VideoMezzanineLink from '@/components/VideoMezzanineLink/VideoMezzanineLink';

import styles from './VideoThumbnail.module.scss';

type VideoThumbnailProps = {
  video: VideoClass;
  gtmLabel?: string;
  displayParentLink?: boolean;
  nowPlaying?: boolean;
  // this prop is really here for storybook development
  depIsNew?: boolean;
  depPercentageWatched?: number;
}

const VideoThumbnail = (props: VideoThumbnailProps) => {
  const {
    video,
    gtmLabel,
    displayParentLink = true,
    nowPlaying = false,
    depIsNew = false,
    depPercentageWatched = 0,
  } = props;

  let parentTitle = null;
  let parentLink = null;

  if (video.ancestor_type === 'show' && video.show) {
    parentTitle = video.show.title;
    parentLink = `/show/${video.show.slug}/`;
  } else if (video.ancestor_type === 'franchise' && video.franchise) {
    parentTitle = video.franchise.title;
    parentLink = `/franchise/${video.franchise.slug}/`;
  }

  return (
    <div className={styles.video_thumbnail}>
      <VideoMezzanineLink
        video={video}
        gtmLabel={gtmLabel}
        nowPlaying={nowPlaying}
        depIsNew={depIsNew}
        depPercentageWatched={depPercentageWatched} />

      {displayParentLink && parentLink && (
        <p className={styles.parent_link_wrapper}>
          <Link href={parentLink} className={styles.parent_link}>
            {parentTitle}
          </Link>
        </p>
      )}
      <p>
        <Link href={`/video/${video.slug}/`} className={styles.video_link}>
          {video.title}
        </Link>
      </p>
      <p className={styles.video_meta}>{video.summary}</p>
    </div>
  );
}

export default VideoThumbnail;
