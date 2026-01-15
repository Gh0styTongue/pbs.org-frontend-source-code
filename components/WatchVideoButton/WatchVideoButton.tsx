'use client';
import { VideoTypeEnum } from '@/lib/types/api/video';
import PlayIcon from '@/public/svg/play.svg';

import styles from './WatchVideoButton.module.scss';

interface WatchVideoButtonProps {
  videoType: VideoTypeEnum;
  onClick: (() => void) | null;
  className?: string;
  gtmLabel?: string;
  verticalOffset: boolean;
}

const WatchVideoButton = (props: WatchVideoButtonProps) => {
  const {
    videoType,
    onClick,
    className,
    gtmLabel,
    verticalOffset,
  } = props;

  let videoTypeString = 'Video';

  switch (videoType) {
    case 'preview':
      videoTypeString = 'Preview';
      break;
    case 'episode':
      videoTypeString = 'Episode';
      break;
    case 'special':
      videoTypeString = 'Special';
      break;
    case 'clip':
      videoTypeString = 'Clip';
      break;
    case 'live':
      videoTypeString = 'Live';
      break;
  }

  let classNames = `${styles.watch_video_button}`;

  if (className) {
    classNames += ` ${className}`;
  }

  if (verticalOffset) {
    classNames += ` ${styles.vertical_offset}`;
  }

  if (onClick) {
    return (
      <button
        onClick={() => onClick()}
        data-gtm-label={gtmLabel}
        className={classNames}
        >
        <div className={styles.watch_video_button_icon}>
          <PlayIcon />
        </div>
        <span className={styles.watch_video_button_text}>
          Watch {videoTypeString}
        </span>
      </button>
    );
  } else if (onClick === null) {
    return (
        <div
          data-gtm-label={gtmLabel}
          className={classNames}
          >
          <div className={styles.watch_video_button_icon}>
            <PlayIcon />
          </div>
          <span className={styles.watch_video_button_text}>
            Watch {videoTypeString}
          </span>
        </div>
      );
  }
}

export default WatchVideoButton;
