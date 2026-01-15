// lib files
import { featureFlags } from '@/lib/feature-flags';
import { FeaturedPreview } from '@/lib/types/api/show-data';
import { getQueryString } from '@/lib/helpers/get-query-string';
import { PORTAL_PLAYER_HOST, isDev } from '@/lib/constants';
import { VideoClass, RelatedVideoAsset } from '@/lib/types/api/video';

// @TODO if we want to support localPlayer=true, this is where that would take place
export interface PlayerParams {
  autoplay?: boolean;
  callsign?: string;
  end?: string;
  inContinuousPlayFlow?: boolean;
  muted?: boolean;
  previewLayout?: boolean;
  parentURL?: string;
  shiftControlsUp?: boolean;
  start?: string;
  station_id?: string;
  uid?: string;
  unsafeDisableContinuousPlay?: boolean;
  unsafeDisableUpsellHref?: boolean;
  userPassportStatus?: string;
  unsafeDisableSponsorship?: boolean;
}

export interface PlayerConfig {
  autoplay?: boolean;
  embedType?: string;
  id?: string;
  muted?: boolean;
  previewLayout?: boolean;
  shiftControlsUp?: boolean;
  slug?: string;
  callsign?: string;
  stationId?: string;
  disableContinuousPlay?: boolean;
}

const getWindowHref = ():string => {
  if (typeof window !== "undefined") {
    return window.location.href
  } else {
    return ''
  }
}

/**
 * Build player base url.
 * @param {(VideoClass | RelatedVideoAsset)} video
 * @param {PlayerConfig} playerConfig
 * @returns {string} The string version of the base url for the videoplayer src.
 */
const buildBaseUrl = (
    video: VideoClass | RelatedVideoAsset | FeaturedPreview,
    playerConfig: PlayerConfig
  ):string => {
  const { embedType, id, slug } = playerConfig;

  const playerType = embedType || 'portalplayer';
  // Ignoring typing error to use legacy_tp_media_id as a fallback
  // @ts-ignore:next-line
  const mediaId = id || slug || video.slug || video.legacy_tp_media_id;

  return `${PORTAL_PLAYER_HOST}/${playerType}/${mediaId}/`;
}

/**
 * Build a PlayParams object based on window context and player config.
 * @param {string | undefined} uid
 * @param {boolean} isPassportMember
 * @param {string} windowHref
 * @param {PlayerConfig} playerConfig
 * @returns {PlayerParams}
*/
const buildPlayerParams = (
    uid: string | undefined,
    isPassportMember: boolean,
    queryParams: string,
    windowHref: string,
    playerConfig: PlayerConfig,
  ):PlayerParams => {
  const playerParams: PlayerParams = {};
  const {
    autoplay,
    muted,
    previewLayout,
    shiftControlsUp,
    callsign,
    stationId,
    disableContinuousPlay
  } = playerConfig

  if (uid) {
    playerParams.uid = uid;
    if (isPassportMember) {
      playerParams.userPassportStatus = 'yes';
    } else {
      playerParams.userPassportStatus = 'no';
    }
  } else {
    // if anonymous, set parentURL to the current page
    playerParams.parentURL = windowHref;
    playerParams.userPassportStatus = 'loggedout';
  }

  if (muted) {
    playerParams.muted = true;
  }

  if (previewLayout) {
    playerParams.previewLayout = true
  }

  if (shiftControlsUp) {
    playerParams.shiftControlsUp = true
  }

  // Station video player params
  if (callsign) {
    playerParams.callsign = callsign;
  }
  if (stationId) {
    playerParams.station_id = stationId;
  }

  // tells the player to render a button to trigger sign in
  playerParams.unsafeDisableUpsellHref = true;

  // start and end times are passed through the query params
  const params = new URLSearchParams(queryParams)
  const start = params.get('start')
  const end = params.get('end')
  // we check for a string in case they mistakenly add more than
  // one 'start' or 'end', which would generate an array and note work
  if (start && typeof start === 'string') {
    playerParams.start = start
  }
  if (end && typeof end === 'string') {
    playerParams.end = end
  }

  // this flag explicitly sets autoplay to true, regardless of continuous play
  if (autoplay) {
    playerParams.autoplay = true;
  }

  // this flag will disable continuous play
  // note: player query parameters are prefixed by 'unsafe' because
  // they reprsent a brittle agreement between the player and it's user
  if (disableContinuousPlay === true ) {
    playerParams.unsafeDisableContinuousPlay = true;
  }

  // if we are being prompted to this page by a continuous play command
  // load the video with autoplay enabled
  const continuousPlayAutoPlayEnabled =
    params.get('continuousplayautoplay') &&
    params.get('continuousplayautoplay') === 'true' &&
    !disableContinuousPlay;

  if (continuousPlayAutoPlayEnabled ) {
    playerParams.inContinuousPlayFlow = true;
  }

  if (isDev && featureFlags.DISABLE_SPONSORSHIP) {
    playerParams.unsafeDisableSponsorship = true;
  }

  return playerParams
}

/**
 * Build full src URL for the video player.
 * @param {(VideoClass | RelatedVideoAsset)} video
 * @param {string | undefined} uid
 * @param {boolean} isPassportMember
 * @param {PlayerConfig} playerConfig
 * @returns {string} The string version of the src url for a video player iframe element.
 *
*/
const buildPlayerSrc = (
    video: VideoClass | RelatedVideoAsset | FeaturedPreview,
    uid: string | undefined,
    isPassportMember: boolean,
    playerConfig: PlayerConfig,
  ):string => {
  const baseUrl = buildBaseUrl(video, playerConfig)
  const playerSrc = new URL(`${baseUrl}`);
  const windowHref = getWindowHref();
  const queryString = getQueryString();
  const playerParams = buildPlayerParams(uid, isPassportMember, queryString, windowHref, playerConfig);

  Object.entries(playerParams).forEach(([param, value]) => {
      // one off case where param name is snake-cased and needs explicit assignment
      if (param === "inContinuousPlayFlow" && value === true) {
          playerSrc.searchParams.set('in_continuous_play_flow', 'true')
      } else {
        // if param is true, set as the string 'true'
        if (value === true) {
          playerSrc.searchParams.set(param, 'true');
        } else {
          playerSrc.searchParams.set(param, value);
        }
      }
    });
    return playerSrc.toString();
}

export { buildBaseUrl, buildPlayerParams, buildPlayerSrc }
