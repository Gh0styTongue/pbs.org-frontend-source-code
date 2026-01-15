'use client'

// imports
import Link from 'next/link';

// lib files
import { VideoClass } from '@/lib/types/api/video';

// components
import AccessibilityIcons from '@/components/AccessibilityIcons/AccessibilityIcons';
import AiringExpiringRating from '@/components/AiringExpiringRating/AiringExpiringRating';
import FromFranchise from '@/components/FromFranchise/FromFranchise';
import ITSImage from '@/components/ITSImage/ITSImage';
import MyListButton from '@/components/Button/MyList/MyListButton';
import SeeAllVideosWithAudioDescription from '@/components/SeeAllVideosWithAudioDescription/SeeAllVideosWithAudioDescription';

// svgs
import CompassRose from '@/public/svg/compass-rose.svg';

// styles
import styles from './VideoPlayerOverlay.module.scss';

interface VideoPlayerOverlayProps {
  video: VideoClass;
  isPlaying: boolean;
  isUserHoveringOverVideo: boolean;
  isClosedCaptionsSettingsOpen: boolean;
}

const VideoPlayerOverlay = (props: VideoPlayerOverlayProps) => {
  const { video, isPlaying, isUserHoveringOverVideo, isClosedCaptionsSettingsOpen } = props;
  const isPassport = typeof video.flags !== 'undefined' && video.flags.is_mvod;

  // Video show data
  const videoShowLogo = video.show?.images?.['white-logo-41'];
  const videoShowTitle = video.show?.title || "";

  // Video navigation data
  let linkHref;
  let ariaLabel;
  let logoOrTitle;

  // Check if it's a franchise
  if (video.parent_type === 'franchise') {
    linkHref = `/franchise/${video.franchise?.slug}`;
    ariaLabel = "Go to Franchise Page";
    // Check if franchise logo is available
    if (video.franchise?.logo_cropped_white) {
      logoOrTitle = (
        <ITSImage
          src={video.franchise.logo_cropped_white}
          alt={video.franchise.title}
          width={200}
        />
      );
    } else {
      // If no logo, fallback to the franchise title
      logoOrTitle = <p className={`${styles.nav_link__title}`}>{(video as VideoClass).franchise?.title}</p>;
    }
  // If not a franchise, link the show page
  } else {
    linkHref = `/show/${video.show?.slug}`;
    ariaLabel = "Go to Show Page";

    // Check if show logo is available
    if (videoShowLogo) {
      logoOrTitle = (
        <ITSImage
          src={videoShowLogo}
          alt={videoShowTitle}
          width={200}
          className={styles.nav_link__logo}
        />);
    } else {
      // If no logo, fallback to the show title
      logoOrTitle = <p className={`${styles.nav_link__title}`}>{videoShowTitle}</p>;
    }
  }

  let videoPlayerOverlayClassname = `${styles.video_player_overlay}`;
  // Hide the overlay if:
  // - the player controls fade out
  // - the video is playing
  // - the closed captions settings modal is open
  if (!isUserHoveringOverVideo && isPlaying) {
    videoPlayerOverlayClassname += ` ${styles.video_player_overlay_hidden} ${styles.video_player_overlay_hidden_transition}`;
  } else if (isClosedCaptionsSettingsOpen) {
    videoPlayerOverlayClassname += ` ${styles.video_player_overlay_hidden}`;
  } else {
    // Show the overlay if:
    // - the user is actively hovering over video
    // - the video is either playing or paused
    // - the closed captions settings modal is closed
    videoPlayerOverlayClassname = `${styles.video_player_overlay}`;
  }

  return (
    <div className={videoPlayerOverlayClassname}>
      <Link className={styles.nav_link} href={linkHref} aria-label={ariaLabel} >
        {logoOrTitle}
      </Link>
      <div className={styles.overlay_details}>
        <p className={`${styles.video_title}`}>{video.title}</p>
        <p className={`${styles.video_meta_data}`}>
          {isPassport && <CompassRose className={styles.compass_rose_icon}/>}
          {video.summary}
          <AccessibilityIcons video={video} />
        </p>
        <p className={`${styles.video_description}`}>{video.description_short}</p>

        <AiringExpiringRating video={video} className={styles.airing_expiring_rating} />

        { video.franchise && (
          <FromFranchise franchise={video.franchise} />
        )}
        { video.has_audio_description &&
          <SeeAllVideosWithAudioDescription />
        }
        <MyListButton
          video={video}
          style='iconOnly'
        />
      </div>
    </div>
  )
}

export default VideoPlayerOverlay;
