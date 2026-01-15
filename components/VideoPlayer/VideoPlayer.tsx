'use client'

// imports
import { useRef, useEffect, useState, memo, useCallback  } from 'react';
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import useThrottledCallback from '@/lib/hooks/useThrottledCallback';
import useWindowResize from '@/lib/hooks/useWindowResize';

// lib files
import { FeaturedPreview } from '@/lib/types/api/show-data';
import { INTERNALLY_NAVIGATING_KEY, PORTAL_PLAYER_HOST } from '@/lib/constants';
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';
import { useHasMounted } from '@/lib/hooks';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import { VideoClass, RelatedVideoAsset, VideoTypeEnum } from '@/lib/types/api/video';
import { getQueryString } from '@/lib/helpers/get-query-string';
import { continuousPlay as continuousPlayAtom } from '@/lib/atoms/continuous-play';
import { sendPlayerPostMessage } from '@/lib/helpers/send-player-postmessage';
import { StationData } from '@/lib/types/api/stations-data';
import { useIsUserHoveringOverVideo, useIsPlayerReady, useIsClosedCaptionsSettingsOpen } from '@/lib/hooks';
import CompanionState from '@/lib/types/atoms/companionState';
import { getUserId as getClientUserId } from '@/lib/profile';

// helper functions
import { buildPlayerSrc, PlayerConfig } from './buildPlayerSrc';

// components
import PassportBenefitScreen from './PassportBenefitScreen';
import VideoPlayerOverlay from './VideoPlayerOverlay';
import MezzanineVideoInitializer from '@/components/MezzanineVideoInitializer/MezzanineVideoInitializer';
import UnavailableMessage from './UnavailableMessage';

// styles
import styles from './VideoPlayer.module.scss';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

interface PlayerIframeProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  playerSource?: string;
  title: string;
}

/**
 * PlayerIframe
 * A memoized component for our Player iFrame.
 * This was done in order to help prevent needless rerenders
 * of this expensive piece of UI.
 * @param {event} e - click event
 * @returns {boolean}
*/
const PlayerIframe = memo(function PlayerIframe(props: PlayerIframeProps) {
  const { iframeRef, playerSource, title } = props;

  return (
    <iframe
      ref={iframeRef}
      src={playerSource}
      scrolling="no"
      title={ title }
      name="player"
      className={styles.video_player_iframe}
      allow="autoplay; encrypted-media"
      loading="lazy"
      data-testid="video-player"
      allowFullScreen
    />
  )
});

interface VideoPlayerProps {
  className?: string;
  depStationData?: StationData;
  moveControlsUpBreakpoint?: number;
  playerConfig: PlayerConfig;
  showOverlay?: boolean;
  video: VideoClass | RelatedVideoAsset | FeaturedPreview;
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    className,
    depStationData,
    moveControlsUpBreakpoint,
    playerConfig,
    showOverlay = false,
    video,
  } = props;
  const [profile] = useAtom(userProfile)
  const [ profileStatus ] = useAtom(userProfileStatus);
  const [_, setIsOpen] = useAtom(signinModalAtom);
  const [continuousPlay] = useAtom(continuousPlayAtom);
  const [playerSource, setPlayerSource] = useState<string | undefined>(undefined);
  const playerSourceRef = useRef<string | undefined>(undefined);
  const router = useRouter()

  const [pid, setPid] = useState<string | undefined>(getClientUserId());
  const [isPassportMember, setIsPassportMember] = useState(false);

  const videoHasFlags = typeof (video as VideoClass).flags !== 'undefined';
  const isPassportVideo = videoHasFlags && (video as VideoClass).flags.is_mvod;
  const isNotPlayable = videoHasFlags && (video as VideoClass).flags.is_playable === false;
  // deliberately assuming they've accepted VPPA unless we find out otherwise
  const [vppaAccepted, setVppaAccepted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hasMounted = useHasMounted();
  const isProfileLoading = profileStatus === CompanionState.IsLoading;
  const pathname = usePathname();

  // This useEffect deals with updating state based on user profile info
  useEffect(() => {
    if (!isProfileLoading && profile?.personal_data) {
      if (profile.personal_data.is_passport !== undefined) {
        setIsPassportMember(profile?.personal_data?.is_passport);
      }

      if (profile.personal_data.vppa_accepted === false) {
        setVppaAccepted(profile?.personal_data?.vppa_accepted);
      }
   }
  }, [isProfileLoading, profile]);

  // This useEffect deals with building the player src URL
  useEffect(() => {
    if (!isProfileLoading) {
      // Backup in case the pid is missing because for some reason
      // getClientUserId missed the cookie the first time
      if (!pid) {
        const cookiePid = getClientUserId();
        if (cookiePid) {
          setPid(cookiePid);
        }
      }

      // We are sort of duplicating isPassportMember here deliberately
      // so that we don't retrigger this useEffect. Originally the call to
      // setIsPassportMember was here, but that triggered a change,
      // which meant this whole useEffect ran again.
      const localIsPassportMember = profile?.personal_data?.is_passport || false;

      const clonedPlayerConfig: PlayerConfig = { ...playerConfig };

      // Applying user's continuous play settings from local storage
      if (!continuousPlay) {
        clonedPlayerConfig.disableContinuousPlay = true;
      }

      if (canAccessStorage('sessionStorage')) {
        // Reading session storage *here* to prevent weird re-renders of the iframe
        if (sessionStorage.getItem(INTERNALLY_NAVIGATING_KEY) === 'true'){
          clonedPlayerConfig.autoplay = true;
        }
      }

      const possibleNewSource = buildPlayerSrc(video, pid, localIsPassportMember, clonedPlayerConfig);

      // Only update player source in state if it's changed
      if (possibleNewSource !== playerSourceRef.current) {
        setPlayerSource(possibleNewSource);
        playerSourceRef.current = possibleNewSource;
      }
    }
  },
  [
    continuousPlay,
    isProfileLoading,
    // we create the player src url on pathname change
    // this helps prevent weird race conditions between next.js and the browser
    pathname,
    pid,
    playerConfig,
    profile,
    video,
  ])

  const isPlayerReady: boolean = useIsPlayerReady();
  const [isPlaying, setIsPlaying] = useState(false);

  // There are some contexts (e.g. Show Detail Heros) where we want to shift the controls up.
  // We supply the optional `moveControlsUpBreakpoint` prop to indicate that we should do
  // this, as well as what breakpoint above which we should.
  const handleIsAboveBreakpoint = useCallback(() => {
    if (window.matchMedia(`(min-width: ${moveControlsUpBreakpoint}px)`).matches) {
      sendPlayerPostMessage('controlsUp')
    } else {
      sendPlayerPostMessage('controlsDefault')
    }
  }, [moveControlsUpBreakpoint])

  // Do this check on mount
  useEffect(() => {
    if (moveControlsUpBreakpoint && isPlayerReady) {
      handleIsAboveBreakpoint();
    }
  }, [moveControlsUpBreakpoint, isPlayerReady, handleIsAboveBreakpoint])

  const onWindowResize = useWindowResize();

  // check if the viewport is above the desired breakpoint on resize
  onWindowResize(useThrottledCallback(() => {
    if (moveControlsUpBreakpoint) {
      handleIsAboveBreakpoint();
    }
  }));

  // We listen for post-messages coming from the embedded iframe Player
  // to synchronize the overlay visibility with Player controls
  const isUserHoveringOverVideo: boolean = useIsUserHoveringOverVideo();
  const isClosedCaptionsSettingsOpen: boolean = useIsClosedCaptionsSettingsOpen();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const userPressedSpacebar = e.key === " ";
    const userPressedCKey = e.key === "c";
    const userPressedKKey = e.key === "k";
    const userPressedMKey = e.key === "m";
    const userPressedFKey = e.key === "f";
    const userPressedRightArrow = e.key === "ArrowRight";
    const userPressedLeftArrow = e.key === "ArrowLeft";
    const userPressedUpArrow = e.key === "ArrowUp";
    const userPressedDownArrow = e.key === "ArrowDown";

    // grab the element currently in focus
    const focusEl = document.querySelector(':focus');
    // if an element is actually in focus (which won't be the case on a fresh page load)
    // use it's tagName, else use an empty string
    const focusTag = focusEl ? focusEl.tagName : ``;
    // make sure the focused element is not something that should respond to a spacebar normally
    const focusIsNotInputOrButton = focusTag !== `BUTTON` && focusTag !== `INPUT` && focusTag !== `TEXTAREA`;

    const sendKeyboardCommand = (command: string) => {
      e.preventDefault();
      if (iframeRef) {
        iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command }), '*');
      }
    };

    if (focusIsNotInputOrButton) {
      switch (true) {
        case userPressedSpacebar || userPressedKKey:
          // toggle video player
          sendKeyboardCommand('toggle');
          break;
        case userPressedRightArrow:
          // skip forward 10 seconds
          sendKeyboardCommand('skipForward');
          break;
        case userPressedLeftArrow:
          // skip backward 10 seconds
          sendKeyboardCommand('skipBackward');
          break;
        case userPressedMKey:
          // mute video
          sendKeyboardCommand('mute');
          break;
        case userPressedFKey:
          // toggle fullscreen video
          sendKeyboardCommand('toggleFullscreen');
          break;
        case userPressedCKey:
          // toggle captions
          sendKeyboardCommand('closedCaptions');
          break;
        case userPressedUpArrow:
          // volume up
          sendKeyboardCommand('volumeUp');
          break;
        case userPressedDownArrow:
          // volume down
          sendKeyboardCommand('volumeDown');
          break;
        default:
          break;
      }
    }
}, [])

  // @TODO with the passport benefit screen in dotorg now, is this necessary?
  const handleSignInClick = useCallback((event: MessageEvent) => {
    const isPlayerSignInPostMessage =
      // does the message come from player?
      // adding this as a security check
      event.origin.indexOf(PORTAL_PLAYER_HOST) !== -1 &&
      // does it indicate that the user hit "sign in"?
      // this is the most brittle point of this feature.
      // if the sign in button stops working in player,
      // it likely changed this message data
      event.data === 'gtm-event:Passport,Sign In';

      if(isPlayerSignInPostMessage) {
        setIsOpen(SignInModalStateEnum.True)
      }
  }, [setIsOpen])

  const handleMessage = useCallback((event: MessageEvent) => {
    let messageType;
    let upNextVideoSlug;

    if (typeof event.data === 'string') {
      if(event.data === 'gtm-event:Passport,Sign In') {
        return handleSignInClick(event)
      }

      if(event.data.match(/"command":"navigate-to-continuous-play-video"/)) {
        const messageData = event.data.match(/"payload":{"slug":"([^"]+)"}/)
        messageType = 'upNextVideoSlug'
        upNextVideoSlug = messageData ? messageData[1] : null;
      } else {
        const messageData = event.data.match(/"event":"videojs:([^"]+)"/);
        messageType = messageData ? messageData[1] : null;
      }
    }

    switch (messageType) {
      case 'upNextVideoSlug':
        if (upNextVideoSlug) {
          const queryString = getQueryString();
          const params = new URLSearchParams(queryString)
          if (
            params.get('continuousplayautoplay') &&
            params.get('continuousplayautoplay') === 'true'
          ) {
            router.push(`/video/${upNextVideoSlug}/?continuousplayautoplay=true`)
          } else {
            router.push(`/video/${upNextVideoSlug}`)
          }
        }
        break;
      case 'play':
        setIsPlaying(true)
        break;
      case 'pause':
        setIsPlaying(false)
        break;
    }
  }, [handleSignInClick, router])

  let classNames = `${styles.video_player_container}`;
  if (className) {
    classNames += ` ${className}`
  }

  useEffect(()=>{
    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeyPress)

    return ()=>{
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyPress)
    }
  })

  let mezzImgSrc = null;

  // sorry for all of these ts-ingores - we are dealing with a lot of different video types
  // @ts-ignore
  if (video.image) {
    // @ts-ignore
    mezzImgSrc = video.image;
  // @ts-ignore
  } else if (video.images && video.images['asset-mezzanine-16x9']) {
    // @ts-ignore
    mezzImgSrc = video.images['asset-mezzanine-16x9'];
  // @ts-ignore
  } else if (video.mezzanine16x9ImageUrl) {
    // @ts-ignore
    mezzImgSrc = video.mezzanine16x9ImageUrl;
  }

  let content = null;
  switch (true) {
    case videoHasFlags && !isPassportVideo && isNotPlayable:
      content = (
        <>
          {/* Note the mezz image is kept separate from the unavailable messsage purely for CSS z-index reasons */}
          { mezzImgSrc && (
            <MezzanineVideoInitializer
              videoType={ VideoTypeEnum.Video }
              imgSrc={mezzImgSrc}
              alt={video.title}
              showWatchButton={false}
              onClick={() => {}}
              verticalOffsetButton={false}
              width={1440}
              className={styles.video_image}
            />
          )}
          <UnavailableMessage />
        </>
      )
      break;
    case isPassportVideo && isProfileLoading:
      content = null;
      break;
    case isPassportVideo && !isProfileLoading && !isPassportMember:
    // @TODO this will need to be updated when the is_playable flag is updated to not
    // return false for passport users who have not accepted VPPA.
    // But for the time being this prevents a weird situation where the regular video overlay
    // is present but the player displays the passport benefit screen.
    case isPassportVideo && !isProfileLoading && isPassportMember && vppaAccepted === false:
      content = (
        <>
          { mezzImgSrc && (
            <MezzanineVideoInitializer
              videoType={ VideoTypeEnum.Video }
              imgSrc={mezzImgSrc}
              alt={video.title}
              showWatchButton={false}
              onClick={() => {}}
              verticalOffsetButton={false}
              width={1440}
              className={styles.video_image}
            />
          )}
          <PassportBenefitScreen video={video as VideoClass} depStationData={depStationData} />
        </>
      )
      break;
    case isPassportVideo && !isProfileLoading && isPassportMember:
    default:
      content = (
        <PlayerIframe
          iframeRef={iframeRef}
          playerSource={playerSource}
          title={video.title}
        />
      )
      break;
  }

  if (!hasMounted) {
    return null;
  }

  return (
    <div className={classNames}>
      { showOverlay &&
        <VideoPlayerOverlay
          video={video as VideoClass}
          isPlaying={isPlaying}
          isUserHoveringOverVideo={isUserHoveringOverVideo}
          isClosedCaptionsSettingsOpen={isClosedCaptionsSettingsOpen}
        />
      }
      {content}
    </div>
  );
}

export default VideoPlayer;
