'use client'

// imports
import { useState } from 'react';
import { useAtom } from 'jotai';
import Link from 'next/link';

// Constants
import { DONATE_FALLBACK_URL } from '@/lib/constants';

// lib files
import { formatVideoMetadata } from '@/lib/helpers/format-video-metadata';
import { useHasMounted } from '@/lib/hooks';
import { userProfile } from '@/lib/atoms/profile';
import { VideoClass, VideoTypeEnum } from '@/lib/types/api/video';

// components
import DonateLinkButton from '@/components/Button/DonateLinkButton';
import ITSImage from '@/components/ITSImage/ITSImage';
import LinkButton from '@/components/Button/LinkButton';
import KabobMenu from '@/components/KabobMenu/KabobMenu';
import MezzanineVideoInitializer from '@/components/MezzanineVideoInitializer/MezzanineVideoInitializer';
import MyListButton from '@/components/Button/MyList/MyListButton';
import { StationData } from '@/lib/types/api/stations-data';
import VideoPlayer from  '@/components/VideoPlayer/VideoPlayer';

// svgs
import CompassRose from '@/public/svg/compass-rose.svg';
import PlayIcon from "@/public/svg/play.svg";
import ArrowRightIcon from '@/public/svg/arrow-right.svg';

// styles
import styles from './VideoHero.module.scss';

interface VideoHeroProps {
  depDisplayAsPassport?: boolean;
  depIsPassportMember?: boolean;
  isSVP: boolean;
  stationData?: StationData;
  video: VideoClass;
}

const VideoHero: React.FC<VideoHeroProps> = (props) => {
  const hasMounted = useHasMounted();
  const {
    video,
    isSVP,
    depIsPassportMember,
    stationData,
    depDisplayAsPassport,
  } = props;
  const [showVideo, setShowVideo] = useState(false);
  const [profile] = useAtom(userProfile);
  // Checks if component is mounted on the client before attempting to
  // hydrate, otherwise a hydration error occurs
  if (!hasMounted) {
    return null;
  }

  const links = video.hero_links;
  const hasRelatedAsset = video.related_video_asset ? true : false;

  if(!stationData) {
    var short_common_name = 'PBS'
    var call_sign = ''
    var passport_url = ''
  } else {
    var { attributes: station_info } = stationData;
    var {
      short_common_name,
      call_sign,
      passport_url,
    } = station_info;
  }

  const isPassportMember = depIsPassportMember || profile?.personal_data?.is_passport || false;
  const isPassportMemberOfLocalizedStation = profile?.personal_data?.stations?.includes(call_sign) && isPassportMember;
  const isPassportVideo = depDisplayAsPassport || video.flags?.is_mvod || false;

  var passPortCalloutText: string | null = `Watch this video with ${short_common_name} Passport`;

  switch(true) {
    case isPassportMemberOfLocalizedStation:
      passPortCalloutText = `Available with your ${short_common_name} Passport benefit`;
      break;
    case isPassportMember:
      passPortCalloutText = `Available with your PBS Passport benefit`;
      break;
  }

  const donateUrl = passport_url ? passport_url : DONATE_FALLBACK_URL;
  let isDonateAndStartWatchingCTA: boolean = false;

  // Show a Donate CTA when the user is not a Passport Member and it is a Passport Video
  if (!isPassportMember && isPassportVideo) {
    isDonateAndStartWatchingCTA = true;
  }

  // Instead of using video.summary, we explicitly create metadata with the "shortEpOnly" format
  // so that the video's run time is excluded
  const videoMeta = formatVideoMetadata(video, "shortEpOnly");
  let videoDescription = video.description_short;

  if (videoMeta && videoMeta !== '') {
    videoDescription = `${videoMeta} | ` + videoDescription;
  }

  const ShowLogoOrTitle = () => {
    const ancestorWhiteLogo = video.ancestor_white_logo;

    if (!video.show) {
      return null;
    }

    return (
      <>
        { video.show && ancestorWhiteLogo ? (
          <h2 className={styles.video_show_logo}>
            <Link href={`/show/${video.show.slug}/`}>
              <ITSImage
                src={ancestorWhiteLogo}
                alt={video.show.title}
                width={240}
              />
            </Link>
          </h2>
        ) : (
          <h2 className={styles.video_show_overtitle}>
            <Link href={`/show/${video.show.slug}/`}>
              {video.show.title}
            </Link>
          </h2>
        )}
      </>
    )
  }

  const VideoHeroKabobMenuItems = () => (
    <ul>
      <li>
        <MyListButton
          style='kabobMenu'
          video={video}
        />
      </li>
      { video.show && (
        <li className={styles.video_hero_kabob_item_explore_the_show}>
          <Link href={`/show/${video.show.slug}/`}>
            <PlayIcon />
            <span>Explore the Show</span>
          </Link>
        </li>
      )}
     {isDonateAndStartWatchingCTA && (
        <li className={styles.video_hero_kabob_item_learn_more}>
          <CompassRose />
          <Link href='/passport/learn-more/' >
            What is Passport?
          </Link>
        </li>
      )}
      { links && links.length > 0 && (
        links.map((link, index) => {
          return (
            <li className={styles.video_hero_kabob_item_link} key={index}>
              { link.url && <Link href={link.url} target="_blank">
                <ArrowRightIcon />
                <span>{link.text}</span>
              </Link> }
            </li>
          )
        })
      )}
    </ul>
  )

  const VideoHeroPassportCallout = () => (
    <p className={styles.video_passport_callout}>
      <CompassRose className={styles.compass_rose_icon}/>
      {passPortCalloutText}
    </p>
  )

  const VideoHeroPrimaryCTAButton = () => (
    isDonateAndStartWatchingCTA ? (
      <DonateLinkButton
        href={donateUrl}
        style={'light_blue'}
        gtmEventData={{
          feature_category: "video hero",
          feature_name: "passport video hero donate link (non-passport member)",
          object_text: "Donate & Start Watching",
          object_url: donateUrl,
        }}
      >
        Donate & Start Watching
      </DonateLinkButton>
    ) : (
      <LinkButton
        href={`/video/${video.slug}/`}
        style="white"
        iconBefore="play"
      >
        Watch Now
      </LinkButton>
  ))

  const VideoHeroOverlay = (props: { isLoaded: boolean}) => {
    const { isLoaded } = props;
    return (
      <div className={isLoaded ? styles.video_hero_loaded_overlay : styles.video_hero_initial_overlay}>
        <ShowLogoOrTitle />
        <h3 className={styles.video_title}>
          <Link href={`/video/${video.slug}/`}>
            {video.title}
          </Link>
        </h3>
        <p className={styles.video_description}>
          {videoDescription}
        </p>
        {isPassportVideo && stationData && <VideoHeroPassportCallout />}
        <div className={isLoaded ? styles.video_hero_loaded_overlay_buttons : styles.video_hero_initial_overlay_buttons}>
          <VideoHeroPrimaryCTAButton />

          { video.show && (
            <LinkButton
              href={`/show/${video.show.slug}/`}
              style="white_ghost"
              className={styles.video_hero_explore_the_show_button}
              >
              Explore the Show
            </LinkButton>
          )}

          <KabobMenu
            className={styles.video_hero_kabob_button_above_sm}
            contentClassName={styles.video_hero_kabob_content_above_sm}
          >
            <VideoHeroKabobMenuItems />
          </KabobMenu>
        </div>
        <KabobMenu
          className={styles.video_hero_kabob_button_below_sm}
          contentClassName={styles.video_hero_kabob_content_below_sm}
        >
          <VideoHeroKabobMenuItems />
        </KabobMenu>
      </div>
    )
  }

  const InitialVideoHero = () => {
    return (
      <div className={styles.video_hero_initial}>
      {/* RWEB-8182 - we want to use the thumbnail of the curated video, but play the related asset (usually a preview) */}
        <MezzanineVideoInitializer
          videoType={video.related_video_asset?.video_type || VideoTypeEnum.Video }
          imgSrc={video.image}
          alt={video.title}
          showWatchButton={hasRelatedAsset}
          onClick={() => setShowVideo(true)}
          verticalOffsetButton={true}
          width={1440}
          className={styles.video_hero_video_initializer}
        />
        <VideoHeroOverlay isLoaded={false} />
      </div>
  )};

  const VideoPlayerLoaded = () => {
    const playerConfig = {
      autoplay: true,
      embedType: isSVP ? 'stationplayer' : 'portalplayer',
      disableContinuousPlay: true,
      previewLayout: true,
      stationId: stationData?.id,
      callsign: stationData?.attributes.call_sign,
    }

    return (
      <div className={styles.video_hero_loaded}>
        <VideoPlayer
          video={video.related_video_asset!}
          playerConfig={playerConfig}
          className={styles.video_hero_loaded_video_player}
        />

        <VideoHeroOverlay isLoaded={true} />
      </div>
    )
  };

  return (
    showVideo && hasRelatedAsset ?
      (<section>
        <VideoPlayerLoaded />
      </section>) :
      (<section>
        <InitialVideoHero />
      </section>)
  );
}

export default VideoHero;
