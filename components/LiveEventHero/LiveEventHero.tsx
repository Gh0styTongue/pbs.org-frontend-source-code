// imports
import Link from 'next/link';

// lib files
import { VideoTypeEnum } from '@/lib/types/api/video';

// components
import ITSImage from '@/components/ITSImage/ITSImage';
import LinkButton from '@/components/Button/LinkButton';
import MezzanineVideoInitializer from '@/components/MezzanineVideoInitializer/MezzanineVideoInitializer';

// styles
import styles from './LiveEventHero.module.scss';

interface LiveEventHeroProps {
  liveEventHeroDescription: string;
  liveEventHeroHeadline: string;
  liveEventHeroImageAlt: string;
  liveEventHeroImageUrl: string;
  liveEventHeroShowLogoAlt: string;
  liveEventHeroShowLogoUrl: string;
  liveEventHeroUrl: string;
}

const LiveEventHero = (props: LiveEventHeroProps) => {
  const {
    liveEventHeroDescription,
    liveEventHeroHeadline,
    liveEventHeroImageAlt,
    liveEventHeroImageUrl,
    liveEventHeroShowLogoAlt,
    liveEventHeroShowLogoUrl,
    liveEventHeroUrl,
  } = props;

  return (
    <section className={styles.live_event_hero}>
      <MezzanineVideoInitializer
        videoType={VideoTypeEnum.Live}
        imgSrc={liveEventHeroImageUrl}
        alt={liveEventHeroImageAlt}
        showWatchButton={false}
        href={liveEventHeroUrl}
        prefetch={false}
        verticalOffsetButton={true}
        width={1440}
        className={styles.live_event_hero_background}
      />
      <div className={styles.live_event_hero_overlay}>
        <h2 className={styles.live_event_show_logo}>
          <Link href={liveEventHeroUrl}>
            <ITSImage
              src={liveEventHeroShowLogoUrl}
              alt={liveEventHeroShowLogoAlt}
              width={240}
            />
          </Link>
        </h2>
        <h3 className={styles.live_event_title}>
          <Link href={liveEventHeroUrl}>
            {liveEventHeroHeadline}
          </Link>
        </h3>
        <p className={styles.live_event_description}>
          {liveEventHeroDescription}
        </p>

        <div className={styles.live_event_hero_overlay_buttons}>
          <LinkButton
            href={liveEventHeroUrl}
            style="white"
            iconBefore="play"
          >
            Watch Live
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default LiveEventHero;
