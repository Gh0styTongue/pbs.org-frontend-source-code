'use client';

// imports
import Link from "next/link";
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';

// lib files
import { canAccessStorage } from "@/lib/helpers/is-storage-available";
import { continueWatchingAtom } from '@/lib/atoms/continueWatching';
import { ContinueWatchingData } from '@/lib/types/api/home-data';
import { EXPLORE_TOPIC_CONFIGS } from '@/lib/constants';
import { formatVideoMetadata } from "@/lib/helpers/format-video-metadata";
import { INTERNALLY_NAVIGATING_KEY } from '@/lib/constants';
import { ProfileData } from '@/lib/types/api/profile-data';
import { ShowDetails, FeaturedPreview } from "@/lib/types/api/show-data";
import { StationData } from '@/lib/types/api/stations-data';
import { useHasMounted, useIsPreviewVideoPlayingWebKit } from '@/lib/hooks';
import { userProfile } from '@/lib/atoms/profile';
import { VideoClass, VideoTypeEnum } from "@/lib/types/api/video";

// components
import BackButton from "@/components/Button/BackButton";
import ExpandableText from "@/components/ExpandableText/ExpandableText";
import FromFranchise from '@/components/FromFranchise/FromFranchise';
import ITSImage from "@/components/ITSImage/ITSImage";
import KabobMenu from "@/components/KabobMenu/KabobMenu";
import LinkButton from "@/components/Button/LinkButton";
import MezzanineVideoInitializer from '@/components/MezzanineVideoInitializer/MezzanineVideoInitializer';
import MyListButton from '@/components/Button/MyList/MyListButton';
import SponsorshipVideoHelpRow from '@/components/SponsorshipVideoHelpRow/SponsorshipVideoHelpRow';
import UserProgressBar from "@/components/UserProgressBar/UserProgressBar";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

// svgs
import ExternalLinkIcon from '@/public/svg/external-link.svg';

// styles
import styles from './ShowDetailHero.module.scss';

interface ShowDetailHeroProps {
  videoToDirectTo?: VideoClass;
  depContinueWatchingData?: ContinueWatchingData["content"];
  depIsLoggedIn?: boolean;
  depPercentageWatched?: number;
  episodeToDirectTo?: VideoClass;
  featuredPreview?: FeaturedPreview;
  isSVP: boolean;
  profileStub?: ProfileData;
  show: ShowDetails;
  sponsorInfoLink?: string;
  stationData?: StationData;
  hasFullLengthAssets?: boolean;
}

const ShowDetailHero: React.FC<ShowDetailHeroProps> = (props) => {
  const {
    videoToDirectTo,
    depContinueWatchingData,
    depIsLoggedIn,
    depPercentageWatched,
    featuredPreview,
    isSVP,
    show,
    sponsorInfoLink,
    stationData,
    hasFullLengthAssets,
  } = props;

  const hasMounted = useHasMounted();

  // We listen for post-messages coming from the embedded iframe Player
  // to adjust show detail page elements for improved closed captions visibility on Safari at mobile breakpoints
  const isPreviewVideoPlayingWebKit: boolean = useIsPreviewVideoPlayingWebKit();

  const [showPreviewFromButton, setShowPreviewFromButton] = useState(false);
  const [isInternallyNavigating, setIsInternallyNavigating] = useState(false);
  const [continueWatchingData] = useAtom(continueWatchingAtom);
  const [profile] = useAtom(userProfile)
  const isLoggedIn = depIsLoggedIn === true || profile !== undefined;
  const continueWatchingDataToUse = depContinueWatchingData || continueWatchingData;
  const continueWatchingVideo = continueWatchingDataToUse?.find((video) => {
    return video.show.slug === show.slug;
  });
  const isShowInContinueWatchingData = continueWatchingVideo !== undefined;
  const getMinutesLeft = (duration: number, secondsWatched: number) => {
    const secondsLeft = duration - secondsWatched;
    return Math.floor(secondsLeft / 60);
  }

  let minLeft = 0;

  if (continueWatchingVideo) {
    minLeft = getMinutesLeft(continueWatchingVideo.duration, continueWatchingVideo.seconds_watched);
  }

  // If a show is yet to premiere
  const isPrePremiere = show.premiere_date && new Date(show.premiere_date) > new Date();

  // Get the metadata for the continue watching video
  const continueWatchingVideoMetadata = formatVideoMetadata({
    show: {
      season: continueWatchingVideo?.parent.season?.ordinal,
      display_episode_number: true,
      seasons_count: show.seasons_count,
      episode: continueWatchingVideo?.parent.ordinal,
    },
    video_type: continueWatchingVideo?.video_type || 'episode',
    parent_type: continueWatchingVideo?.parent.resource_type || 'episode',
    duration: continueWatchingVideo?.duration || 0,
  }, "shortEpOnly");
  // and construct a summary to be used to provide more context to the user of which video they're
  // being suggested to continue watching
  const continueWatchingVideoSummary = `${continueWatchingVideoMetadata ? `${continueWatchingVideoMetadata}:` : ""} ${continueWatchingVideo?.title}`;

  // We show a continue watching hero if:
  // 1. The user is logged in
  // 2. The show is represented in the continue watching data
  const shouldShowContinueWatchingHero = (
    isLoggedIn &&
    isShowInContinueWatchingData
  );

  let descriptionToDisplay;

  if (shouldShowContinueWatchingHero) {
    descriptionToDisplay = continueWatchingVideo.description_long || continueWatchingVideo.description_short || null;
  } else {
    descriptionToDisplay = show.description_long || show.description_short || null;
  }

  useEffect(() => {
    if(canAccessStorage('sessionStorage')) {
      setIsInternallyNavigating(sessionStorage.getItem(INTERNALLY_NAVIGATING_KEY) === 'true')
    }
  }, [])

  // @TODO at whatever point we add a user setting for auto play & sound, we will need to account for that here
  const hasAvailableFeaturedPreview = featuredPreview && featuredPreview.availability === 'available';
  const letsShowThePreview = hasAvailableFeaturedPreview && (isInternallyNavigating || showPreviewFromButton);
  const previewShouldBeMuted = !showPreviewFromButton;

  let showBackgroundImage: string | null = null;

  // For background art, prioritize the show's "background"
  if (show.images?.['background']) {
    showBackgroundImage = show.images['background'];
  } else if (videoToDirectTo?.image) {
    // fall back to the episode that we're sending users to's image
    // looking at you, NOVA
    showBackgroundImage = videoToDirectTo.image;
  }

  // we shift the preview layout controls up if there is a sponsorship row to render
  const shouldShiftControlsUp = show.funder_message != '' || (show.sponsor_logos && show.sponsor_logos?.length > 0);

  let moveControlsUpBreakpoint = undefined;

  if (shouldShiftControlsUp) {
    moveControlsUpBreakpoint = 1024;
  }

  const ShowPreviewOrBackgroundImage = () => {
    switch (true) {
      case shouldShowContinueWatchingHero: {
        const continueWatchingBackgroundImage =
          continueWatchingVideo?.images?.['asset-mezzanine-16x9'] ||
          continueWatchingVideo?.images?.['asset-kids-mezzanine1-16x9']

        if (continueWatchingBackgroundImage) {
          return (
            <ITSImage
              src={continueWatchingBackgroundImage}
              alt={show.title}
              width={860}
              height={480}
              loading="eager"
              fetchPriority="high"
            />
          )
        }
        // fall through if we don't have a background image for the continue watching video
        break
      }
      case letsShowThePreview: {
        const playerConfig = {
          autoplay: true,
          muted: previewShouldBeMuted,
          disableContinuousPlay: true,
          embedType: isSVP ? 'stationplayer' : 'portalplayer',
          previewLayout: true,
          shiftControlsUp: shouldShiftControlsUp,
          stationId: stationData?.id,
          callsign: stationData?.attributes.call_sign,
        }

        return (
          <VideoPlayer
            video={featuredPreview}
            playerConfig={playerConfig}
            moveControlsUpBreakpoint={moveControlsUpBreakpoint}
          />
        )
      }
      case hasAvailableFeaturedPreview: {
        return (
          <MezzanineVideoInitializer
            videoType={featuredPreview.videoType.toLowerCase() as VideoTypeEnum}
            imgSrc={featuredPreview.mezzanine16x9ImageUrl}
            alt={featuredPreview.title}
            verticalOffsetButton={false}
            onClick={() => setShowPreviewFromButton(true)}
            width={860}
            className={styles.detail_hero_mezzanine_video_initializer}
          />
        )
      }
      case (showBackgroundImage !== null): {
        return (
          <div className={styles.detail_hero_show_image}>
            <ITSImage
              src={showBackgroundImage}
              alt={show.title}
              width={860}
              height={480}
              loading="eager"
            />
          </div>
        )
      }

      default:
        return null
    }
  }


  let showPreviewBackgroundClassName = styles.detail_hero_background_image;

  if (letsShowThePreview) {
    showPreviewBackgroundClassName = styles.detail_hero_video
    if (isPreviewVideoPlayingWebKit) {
      showPreviewBackgroundClassName = `${styles.detail_hero_video} ${styles.detail_hero_webkit_mods}`;
    }
  }

  let logoToShow = null;

  if (show.images?.['white-logo-41']) {
    logoToShow = show.images['white-logo-41'];
  } else if (show.images?.['show-white-logo']) {
    logoToShow = show.images['show-white-logo'];
  }

  // Checks if component is mounted on the client before attempting to
  // hydrate, otherwise a hydration error occurs
  if (!hasMounted ) {
    return null;
  }

  return (
    <div className={styles.detail_hero}>
      <BackButton className={styles.detail_hero_back_button} />

      <div className={showPreviewBackgroundClassName}>
        <ShowPreviewOrBackgroundImage />
      </div>

      <div className={styles.detail_hero_overlay}>
        { !hasFullLengthAssets && !isPrePremiere && (
          <div className={styles.detail_hero_no_full_length_videos}>
            There are no episodes currently available. Check back for updates.
          </div>
        )}

        <h1 className={styles.detail_hero_show_name}>
          { logoToShow ? (
            <ITSImage
              src={logoToShow}
              alt={show.title}
              width={300}
            />
          ) : (
            <>{show.title}</>
          )}
        </h1>

        { show.broadcast_info && (
          <p className={styles.detail_hero_broadcast_info}>{show.broadcast_info}</p>
        )}

        { shouldShowContinueWatchingHero && (
          <h2 className={styles.detail_hero_continue_watching_summary}>
            {continueWatchingVideoSummary}
          </h2>
        )}

        { descriptionToDisplay && (
          <ExpandableText
            text={descriptionToDisplay}
            className={styles.detail_hero_description}
          />
        )}

        { shouldShowContinueWatchingHero && (
          <div className={styles.detail_hero_progress_info}>
            <UserProgressBar
              slug={continueWatchingVideo.slug}
              className={styles.user_progress_bar}
              depPercentageWatched={depPercentageWatched}
              alwaysVisible={true}
            />
            <span>{`${minLeft} minute${minLeft === 1 ? "" : "s"} remaining`}</span>
          </div>
        )}

        { show.franchise && (
          <FromFranchise franchise={show.franchise} className={styles.show_franchise_label}/>
        )}

        <div className={styles.detail_hero_overlay_buttons}>
          { videoToDirectTo && (
            <LinkButton
              style='blue'
              iconBefore="play"
              href={`/video/${shouldShowContinueWatchingHero ? continueWatchingVideo.slug : videoToDirectTo.slug}/`}
            >
              { shouldShowContinueWatchingHero ? "Resume Watching" : "Watch Now"}
            </LinkButton>
          )}

          { show.website && (
            <LinkButton
              href={show.website}
              target="_blank"
              className={styles.detail_hero_overlay_buttons_website_button}
              >
              Visit Official Site
            </LinkButton>
          )}

          { !hasFullLengthAssets && show.genre && (
            <LinkButton
              style='white_ghost'
              href={EXPLORE_TOPIC_CONFIGS[show.genre.slug].href}
            >
              {`Explore More ${show.genre.title}`}
            </LinkButton>
          )}

          <MyListButton show={show} style='iconOnly' />

          { show.website && (
            <KabobMenu className={styles.detail_hero_overlay_buttons_kabob_menu}>
              <Link
                href={show.website}
                className={styles.detail_hero_overlay_buttons_kabob_menu_external_link_icon}>
                <ExternalLinkIcon
                  width="16"
                  height="13"
                />
                Visit The Official Site
              </Link>
            </KabobMenu>
          )}
        </div>
      </div>

      <SponsorshipVideoHelpRow
        source={show}
        title={show.title}
        sponsorInfoLink={sponsorInfoLink}
        className={styles.sponsorship_row__top}
        sponsorshipLogosPagePosition='top'
        sponsorshipTextVisibility='desktop' />
    </div>
  )
}

export default ShowDetailHero;
