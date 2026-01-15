'use client'

// imports
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';

// types
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import { VideoClass } from '@/lib/types/api/video';

// components
import VideoThumbnail from '@/components/VideoThumbnail/VideoThumbnail';

// styles
import '@splidejs/splide/dist/css/splide.min.css';
import styles from './VideoThumbnailCarousel.module.scss';

interface VideoThumbnailCarouselProps {
  videos: VideoClass[]
  className?: string;
  defaultPerPage: number,
  smPerPage: number,
  displayParentLink?: boolean,
  padding?: {
    left?: string,
    right?: string,
    top?: string,
    bottom?: string,
  },
  breakpoints?: {
    [key: number]: Options
  }
}

const VideoThumbnailCarousel = (props: VideoThumbnailCarouselProps) => {
  const { videos, defaultPerPage, smPerPage, padding, displayParentLink = true, className, breakpoints } = props;

  let classes = styles.video_thumbnail_carousel;

  if (className) {
    classes += ` ${className}`;
  }

  const splideBreakpoints: Options = {
    768: {
      perPage: smPerPage,
    },
    1024: {
      gap: '12px',
    },
    1280: {
    },
    1440: {
      gap: '16px',
      perPage: smPerPage + 1,
    },
  }

  if (breakpoints) {
    for (const bp in breakpoints) {
      const options = breakpoints[bp]
      if (splideBreakpoints[bp]) {
        splideBreakpoints[bp] = {
          ...splideBreakpoints[bp],
          ...options
        }
      } else {
        splideBreakpoints[bp] = options
      }
    }
  }

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: defaultPerPage,
    gap: '8px',
    breakpoints: splideBreakpoints,
    padding: padding ? padding : undefined,
    classes: {
      list: `splide__list ${styles.splide__list}`,
      arrow: `splide__arrow ${styles.splide__arrow}`
    }
  }

  return (
    <Splide options={options} className={classes}>
      {videos.map((video, index) => (
        <SplideSlide key={index} className={styles.splide__slide}>
          <VideoThumbnail video={video} displayParentLink={displayParentLink} />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default VideoThumbnailCarousel;
