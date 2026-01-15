"use client"

// imports
import Link from 'next/link';

// lib files
import { VideoClass } from '@/lib/types/api/video';

// components
import KabobMenu from '@/components/KabobMenu/KabobMenu';
import LinkButton from '@/components/Button/LinkButton';
import MezzanineVideoInitializer from '@/components/MezzanineVideoInitializer/MezzanineVideoInitializer';
import MyListButton from '@/components/Button/MyList/MyListButton';

// svgs
import PlayIcon from "@/public/svg/play.svg";

// styles
import styles from './Highlight.module.scss';

export interface VideoHighlightProps {
  video: VideoClass
}

export default function VideoHighlight(props: VideoHighlightProps) {
  const { video } = props;

  return (
    <div className={styles.highlight}>
      <div className={styles.highlight_poster}>
        {/* @TODO let these play a *related asset* when clicked */}
        <MezzanineVideoInitializer
          imgSrc={video.image}
          onClick={() => {}}
          alt={video.title}
          videoType={video.video_type}
          verticalOffsetButton={false}
          showWatchButton={false}
          width={860}
        />
      </div>

      <div className={styles.highlight_block__description}>
        {/* TODO: Add badging here post MVP when the backend supports it */}
        <h2 className={styles.highlight_first_title}>
          <Link href={`/show/${video.show?.slug}/`}>{video.show?.title}</Link>
        </h2>
        <h3 className={styles.highlight_second_title}>
          <Link href={`/video/${video.slug}/`}>{video.title}</Link>
        </h3>
        <span className={styles.highlight_text}>
          {video.description_short}
        </span>

        <div className={styles.highlight__controls}>
          <LinkButton
            href={`/video/${video.slug}/`}
            style="white"
            iconBefore="play"
            className={styles.highlight__controls_button}
          >
            Watch Now
          </LinkButton>
          <KabobMenu className={styles.highlight__controls_kabob}>
            <ul>
              <li>
                <MyListButton
                  style='kabobMenu'
                  video={video}
                />
              </li>
              <li>
                <Link
                  href={`/show/${video.show?.slug}/`}
                  className={styles.highlight_explore_the_show}
                  >
                    <PlayIcon />
                    Explore the Show
                </Link>
              </li>
            </ul>
          </KabobMenu>
        </div>
      </div>
    </div>
  )
}
