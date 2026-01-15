import { Options } from '@splidejs/react-splide';
import { rowArrowPath } from '@/components/CarouselArrow/ArrowPath';
import { ShopLinks } from './types/api/shop-data';
import NewsletterList from "@/lib/types/newsletters";
import { trimTrailingSlash } from '@/lib/helpers/trim-trailing-slash';

export const GA_COOKIE = '_ga'
export const PBS_UID_COOKIE = 'pbs_uid'
export const SESSION_ID_COOKIE = 'pbs_session_id';
export const STATION_ID_COOKIE = 'pbsol.station_id';
export const UNLOCALIZED_USER_COOKIE = 'pbsol.user_is_unlocalized';
export const STATION_CALLSIGN_COOKIE = 'pbsol.station';
// RWEB-9563 this is very important - by setting a cookie domain like this, cookies
// become available to player
export const PBS_COOKIE_DOMAIN = '.pbs.org';
export const TMP_VIDEO_COOKIE = 'tmp_data_video';
export const TMP_SHOW_COOKIE = 'tmp_data_show';
export const CAMPAIGN_INFO_COOKIE = 'tmp_campaign_info';
export const STATION_COOKIE_AGE_DAYS = 354; // 354 days - same as JAWS
export const STATION_COOKIE_AGE_SECONDS = 60 * 60 * 24 * STATION_COOKIE_AGE_DAYS;
export const UNLOCALIZED_VALUE = 'unlocalized';
const _NEXT_SSO_ENABLED = process.env.NEXT_PUBLIC_SSO_ENABLED?.toLowerCase() === 'true'

export const FIVE_MINUTES_IN_MS = (5*60) * 1000
export const ONE_HOUR_IN_MS = (60*60) * 1000
export const CS_CACHE_TIME = FIVE_MINUTES_IN_MS

export const STATION_COMMON_NAME_COOKIE = 'pbsol.common.name';
export const USER_ID_COOKIE = 'pbs_uid';

export const REDIRECT_COOKIE = 'pbsol.redirect_url';

export const COUNTRY_ID_COOKIE = 'pbsol.country_id'

export const CONTENT_SERVICE_HOST =
  trimTrailingSlash(
    process.env.CONTENT_SERVICE_HOST ||
    // Fallback in case the CS environmental variable is not set.
    'https://content.services.pbs.org'
  );

export const PROFILE_ENDPOINT = `${CONTENT_SERVICE_HOST}/v3/pbsorg/profile`;

// Not keeping this in our env file because it's not a secret
// and we only use this on the backend
export const LOCALIZATION_SERVICE = 'https://localization.services.pbs.org/localize';

export const ITERABLE_ENDPOINT = 'https://api.iterable.com/api/subscriptions/messageType/'

export const MVAULT_ENDPOINT = process.env.MVAULT_ENDPOINT || 'https://mvault.services.pbs.org/api'

export const DEV_PORTALS = [
  'koth.localhost',
  'watch.weta.localhost',
  'video.whut.localhost'
]

// NOTE: if you update this list, also update the DEV_STATIONS_LIST
// in lib/station-services/dev-stations.ts to associate a station ID with a URL
export const SVP_PORTALS = [
  'koth.svp.preprod.pbs.org',
  'weta.svp.preprod.pbs.org',
  'whut.svp.preprod.pbs.org',
  'koth.svp.staging.pbs.org',
  'weta.svp.staging.pbs.org',
  'whut.svp.staging.pbs.org',
  'koth.svp.beta.pbs.org',
  'weta.svp.beta.pbs.org',
  'whut.svp.beta.pbs.org',
]

const DEV_ORIGINS_PORT_MAPPING = [
  { host: 'dev.pbs.org', port: _NEXT_SSO_ENABLED ? 7000 : 3000 },
  { host: 'watch.weta.localhost', port: _NEXT_SSO_ENABLED ? 7000 : 3010 },
  { host: 'koth.localhost', port: _NEXT_SSO_ENABLED ? 7000 : 3020 },
  { host: 'video.whut.localhost', port: _NEXT_SSO_ENABLED ? 7000 : 3030 },
]

// Shows / Franchises that we want to suppress from search results or we have for testing
export const PUBLISHED_TEST_DATA_SLUGS = [
  "koth-show",
  "koth-franchise",
  "press-exclusives",
  "fundraising-extras",
]

export const PUBLISHED_TEST_STATION_IDS = [
  // KOTH Public
  "f3842586-2c40-43fa-a79f-841fd5f2b9cb",
]


function get_origin_string(): string {
  if(process.env.NODE_ENV === 'development' && typeof window !== "undefined") {
    // Storybook
    if(document.location.host === 'localhost:6006') {
      const port = _NEXT_SSO_ENABLED ? 7000: 3000
      return `https://dev.pbs.org:${port}`
    }

    const devOrigin = DEV_ORIGINS_PORT_MAPPING.find(origin => (
      origin.host === document.location.hostname)
    )

    return `https://${devOrigin!.host}:${devOrigin!.port}`
  } else if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const port = _NEXT_SSO_ENABLED ? 7000: 3000
    return `https://dev.pbs.org:${port}`
  }

  return ''
}

export const ORIGIN_STRING: string = get_origin_string();

export const INTERNALLY_NAVIGATING_KEY = "internallyNavigating";
export const NEW_VIDEO_THRESHOLD_IN_DAYS = 7;

export const LOCAL_PLAYER_HOST = 'https://player.localhost:8080';

// Since these strings are used client side, we need these enviornment variables
// to be prefixed with NEXT_PUBLIC_. This means changes to these variables
// require a full code deploy, not just a web service update.
export const PORTAL_PLAYER_HOST =
  trimTrailingSlash(
    process.env.NEXT_PUBLIC_PORTAL_PLAYER_HOST ||
    // Fallback in case the player environmental variables are not set.
    // This is possibly overkill, but video playback is our core experience,
    // so we want to make sure we have a fallback.
    'https://player.pbs.org'
  );

// Default image format that we ask for from ITS in ITSImage and ITSPicture components
export const DEFAULT_IMAGE_FORMAT = 'avif';

// Official GPT sources.
export const GPT_STANDARD_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
export const GPT_NETWORK_ID = '/22540141786/n6735.pbs.new/';

// Livestream
export const LIVESTREAM_PLAYER_HOST =
  trimTrailingSlash(
    process.env.NEXT_PUBLIC_LIVESTREAM_PLAYER_HOST ||
    // Fallback in case the player environmental variables are not set.
    // This is possibly overkill, but video playback is our core experience,
    // so we want to make sure we have a fallback.
    'https://player.pbs.org'
  );
export const LIVESTREAM_SCHEDULE_FETCH_INTERVAL_IN_MINUTES = 1;
export const LIVESTREAM_SCHEDULE_FETCH_INTERVAL =
  LIVESTREAM_SCHEDULE_FETCH_INTERVAL_IN_MINUTES * 60 * 1000;
export const LIVESTREAM_POSSIBLE_CHANNELS = [
  'ga-main',
  'ga-world',
  'ga-create',
  'ga-fnx',
  'ga-nhk',
  'ga-local-subchannel-1',
  'ga-local-subchannel-2',
  'kids-main',
  // @TODO in future there may be other sub channels which would need to be added here
];
export const LIVESTREAM_DEFAULT_FEED_PROFILE = 'ga-main';

// shared settings we use in all of our instances of splide
export const DEFAULT_SPLIDE_OPTIONS: Options = {
    arrowPath: rowArrowPath,
    drag: true,
    pagination: false,
    mediaQuery: "min",
    rewind: false,
    slideFocus: false,
}

export const SHOW_ROW_SPLIDE_OPTIONS: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 3,
    gap: '8px',
    breakpoints: {
      600: {
        perPage: 4,
      },
      768: {
        perPage: 5,
      },
      1024: {
        gap: '12px',
        perPage: 6,
      },
      1440: {
        gap: '16px',
        perPage: 7,
      },
    },
}

export const PBS_SOCIAL_LINKS = [
  {
    "platform": "Instagram",
    "url": "https://www.instagram.com/pbs/",
  },
  {
    "platform": "TikTok",
    "url": "https://www.tiktok.com/@pbs?lang=en",
  },
  {
    "platform": "Facebook",
    "url": "https://www.facebook.com/pbs",
  },
  {
    "platform": "Twitter",
    "url": "https://twitter.com/PBS",
  },
  {
    "platform": "YouTube",
    "url": "https://www.youtube.com/PBS",
  },
]

// PBS.org homepage collections
export const VIDEO_HERO_COLLECTION_SLUG = 'hero-spotlight';
export const VIDEO_HERO_FALLBACK_COLLECTION_SLUG = 'pbsorg-redesign-hero-video';
export const FEATURED_SHOWS_COLLECTION_SLUG = 'head-popular-shows';
export const TOP_TEN_SHOWS_COLLECTION_SLUG = 'popular-shows-by-station';
export const SHOWS_HIGHLIGHTED_BY_STATION_COLLECTION_SLUG = 'shows-highlighted-by-your-local-station';
export const FEATURED_ARTICLES_COLLECTION_SLUG = 'featured-articles';
export const PASSPORT_SHOWS_COLLECTION_SLUG = 'mvod-landing-shows';
export const PASSPORT_SHOWS_ORDERED_AZ_COLLECTION_SLUG = 'mvod-landing-shows-ordered-az';
export const PASSPORT_SHOWS_WITH_LOCAL_COLLECTION_SLUG = 'mvod-landing-shows-with-local';
export const SHOP_COLLECTION_SLUG = 'homepage-shop';
export const VIDEOS_HIGHLIGHTED_BY_STATION_COLLECTION_SLUG = 'videos-highlighted-by-your-local-station';
export const STATION_EVENTS_COLLECTION_SLUG = 'station-events';

// SVP collections
export const STATION_PROGRAMS_COLLECTION_SLUG = 'station-programs-stack';
export const NEW_VIDEOS_COLLECTION_SLUG = 'new-videos';
export const VIDEOS_LANDING_LOCAL_COLLECTION_SLUG = 'video-landing-local-videos';
export const STATION_SHOWS_COLLECTION_SLUG = 'station-show-menu';
export const STATION_VIDEOS_COLLECTION_SLUG = 'station-video-collection';
export const VIDEO_CAROUSEL_COLLECTION_SLUG = 'video-carousel';

// Explore Dramas Topic Collections Slugs
export const EXPLORE_DRAMAS_VIDEO_HERO_COLLECTION_SLUG = 'explore-dramas-hero-video';
export const EXPLORE_DRAMAS_MUST_WATCH_COLLECTION_SLUG = 'must-watch-dramas';
export const EXPLORE_DRAMAS_LOCAL_SPOTLIGHT_COLLECTION_SLUG = 'local-drama-spotlight';
export const EXPLORE_DRAMAS_TOP_10_COLLECTION_SLUG = 'top-10-dramas';
export const EXPLORE_DRAMAS_FEATURED_PASSPORT_COLLECTION_SLUG = 'explore-dramas-featured-passport';

// Explore Henry Louis Gates Jr Topic Collection Slugs
export const EXPLORE_HENRY_LOUIS_GATES_JR_VIDEO_HERO_COLLECTION_SLUG = 'explore-henry-louis-gates-hero-video';

// per https://pbsdigital.atlassian.net/browse/CS-5232
export const EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG = 'explore-video-genre-hero';

export const EXPLORE_SCIENCE_AND_NATURE_VIDEO_HERO_COLLECTION_SLUG = 'explore-science-hero-video';

// Explore Documentaries Topic Collections Slugs
export const EXPLORE_DOCUMENTARIES_AND_INDIE_FILMS_VIDEO_HERO_COLLECTION_SLUG = 'explore-indies-hero-video';

export const EXPLORE_PASSPORT_VIDEO_HERO_COLLECTION_SLUG = 'passport-landing-hero-video';

// Video Page Collection Slugs
export const VIDEO_PAGE_EPISODES_FROM_COLLECTION_COLLECTION_SLUG = 'episodes-from-collection';
export const VIDEO_PAGE_EXTRAS_FROM_EPISODE_COLLECTION_SLUG = 'extras-from-episode';
export const VIDEO_PAGE_EXTRAS_FROM_SPECIAL_COLLECTION_SLUG = 'extras-from-special';
export const VIDEO_PAGE_FRANCHISE_ASSETS_COLLECTION_SLUG = 'franchise-assets';
export const VIDEO_PAGE_MORE_COLLECTIONS_COLLECTION_SLUG = 'more-collections';
export const VIDEO_PAGE_MORE_EPISODES_COLLECTION_SLUG = 'more-episodes';
export const VIDEO_PAGE_SEASON_ASSETS_COLLECTION_SLUG = 'season-assets';

// Show Page Collection Slugs
export const SHOW_PAGE_CUSTOM_WATCH_NOW_VIDEO_COLLECTION_SLUG = 'show-custom-watch-now-video';
export const SHOW_PAGE_FLEXIBLE_PROMO_COLLECTION_SLUG = 'show-flexible-promo';
export const SHOW_PAGE_PHOTO_GALLERY_COLLECTION_SLUG = 'photo-gallery';
export const SHOW_PAGE_SEASON_EPISODES_COLLECTION_SLUG = 'season-episodes';
export const SHOW_PAGE_SHOW_CAROUSEL_COLLECTION_SLUG = 'show-carousel';
export const SHOW_PAGE_SHOW_SPECIALS_COLLECTION_SLUG = 'show-specials';
export const SHOW_PAGE_SUPPORTING_LINKS_COLLECTION_SLUG = 'supporting-links';
export const SHOW_PAGE_SUPPORTING_TEXT_COLLECTION_SLUG = 'supporting-text';
export const SHOW_PAGE_SHOW_BROADCAST_INFORMATION_COLLECTION_SLUG = 'show-broadcast-information';

// CS Collection Slugs
export const FRANCHISE_SHOWS_COLLECTION_SLUG = 'franchise-shows';
export const MIGHT_ALSO_LIKE_COLLECTION_SLUG = 'might-also-like';
export const SHOW_ASSETS_COLLECTION_SLUG = 'show-assets';
export const SHOW_COLLECTIONS_COLLECTION_SLUG = 'show-collections';
export const SHOW_EVENTS_COLLECTION_SLUG = 'show-events';
export const SHOW_FLEXIBLE_PROMO_COLLECTION_SLUG = 'show-flexible-promo';
export const SHOW_SEASONS_COLLECTION_SLUG = 'show-seasons';
export const SHOW_SPONSOR_LOGOS_COLLECTION_SLUG = 'show-sponsor-logos';

export interface ExploreTopicConfig {
  adUnit?: string;
  cs_api_slug: string;
  cs_genre_slug?: string;
  // we are hard coding display names here, but they _can_ be overriden by CS
  display_name: string;
  newsletter_list?: NewsletterList;
  video_hero_collection_slug?: string;
  href: string;
  redirectToHref?: boolean;
}

export interface ExploreTopicConfigs {
  [key: string]: ExploreTopicConfig;
}

export enum ExploreTopicLabelEnum {
  Arts = 'Arts & Music',
  Culture = 'Culture',
  DocumentariesAndIndieFilms = 'Documentaries & Indie Films',
  Drama = 'Drama',
  Food = 'Food',
  HenryLouisGatesJr = 'Dr. Henry Louis Gates Jr.',
  History = 'History',
  HomeAndHowTo = 'Home & How-To',
  NewsAndPublicAffairs = 'News & Public Affairs',
  Passport = 'Best of PBS Passport',
  ScienceAndNature = 'Science & Nature',
  AmericaAt250 = 'PBS America @ 250',
}

// Make sure the slug in `/explore/____/` matches EXPLORE_TOPIC_CONFIGS keys
export enum ExploreTopicRouteEnum {
  Arts = '/explore/arts/',
  Culture = '/explore/culture/',
  DocumentariesAndIndieFilms = '/explore/documentaries-and-indie-films/',
  Drama = '/explore/drama/',
  Food = '/explore/food/',
  HenryLouisGatesJr = '/explore/henry-louis-gates-jr/',
  History = '/explore/history/',
  HomeAndHowTo = '/explore/home-and-how-to/',
  NewsAndPublicAffairs = '/explore/news-and-public-affairs/',
  Passport = '/explore/passport/',
  ScienceAndNature = '/explore/science-and-nature/',
  AmericaAt250 = '/explore/pbs-america-at-250/',
}

// Explore Topic Configurations
// If new topics are added, they need to be added here.
// If they aren't in this list, we raise a 404.
// The keys in this object dictate the routes that will resolve for each topic.
// e.g. /explore/drama, /explore/home-and-how-to, etc.
// The values in this object are the configurations for each explore hub, which figure into how we call content service
// e.g. https://content.services.pbs.org/v3/pbsorg/screens/${cs_api_slug}/?genre_slug=${cs_genre_slug}`;
// CS needs both an API slug _and_ a genre slug for the "automated" genre collections to work (like History, Food)
// It's not necessary on explore hubs that are more manually curated (Drama)

// A word on the duplicate keys - these configs are use both to resolve routes, and to handle information about the genres themselves.
// The genre slugs don't always agree with our desired path (e.g. arts-and-music is the genre slug, but we want /explore/arts/).
// In those cases we use the redirectToHref boolean to indicate that we should redirect requests to that route to the href value of the config.
export const EXPLORE_TOPIC_CONFIGS: ExploreTopicConfigs = {
  'documentaries-and-indie-films': {
    cs_api_slug: 'pbs-indies',
    cs_genre_slug: 'indie-films',
    display_name: ExploreTopicLabelEnum.DocumentariesAndIndieFilms,
    video_hero_collection_slug: EXPLORE_DOCUMENTARIES_AND_INDIE_FILMS_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.DocumentariesAndIndieFilms,
  },
  'indie-films': {
    cs_api_slug: 'pbs-indies',
    cs_genre_slug: 'indie-films',
    display_name: ExploreTopicLabelEnum.DocumentariesAndIndieFilms,
    video_hero_collection_slug: EXPLORE_DOCUMENTARIES_AND_INDIE_FILMS_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.DocumentariesAndIndieFilms,
    redirectToHref: true,
  },
  'henry-louis-gates-jr': {
    adUnit: 'topic_dr_gates',
    cs_api_slug: 'henry-louis-gates-jr',
    display_name: ExploreTopicLabelEnum.HenryLouisGatesJr,
    video_hero_collection_slug: EXPLORE_HENRY_LOUIS_GATES_JR_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.HenryLouisGatesJr,
  },
  'home-and-how-to': {
    cs_api_slug: 'pbs-home-howto',
    cs_genre_slug: 'home-and-howto',
    display_name: ExploreTopicLabelEnum.HomeAndHowTo,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.HomeAndHowTo,
  },
  'home-and-howto': {
    cs_api_slug: 'pbs-home-howto',
    cs_genre_slug: 'home-and-howto',
    display_name: ExploreTopicLabelEnum.HomeAndHowTo,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.HomeAndHowTo,
    redirectToHref: true,
  },
  'news-and-public-affairs': {
    cs_api_slug: 'pbs-news-public-affairs',
    cs_genre_slug: 'news-and-public-affairs',
    display_name: ExploreTopicLabelEnum.NewsAndPublicAffairs,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.NewsAndPublicAffairs,
  },
  'science-and-nature': {
    cs_api_slug: 'pbs-science-nature',
    cs_genre_slug: 'science-and-nature',
    display_name: ExploreTopicLabelEnum.ScienceAndNature,
    newsletter_list: NewsletterList.science,
    video_hero_collection_slug: EXPLORE_SCIENCE_AND_NATURE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.ScienceAndNature,
  },
  'arts-and-music': {
    cs_api_slug: 'pbs-arts',
    cs_genre_slug: 'arts-and-music',
    display_name: ExploreTopicLabelEnum.Arts,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.Arts,
    redirectToHref: true,
  },
  arts: {
    cs_api_slug: 'pbs-arts',
    cs_genre_slug: 'arts-and-music',
    display_name: ExploreTopicLabelEnum.Arts,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.Arts,
  },
  culture: {
    cs_api_slug: 'pbs-culture',
    cs_genre_slug: 'culture',
    display_name: ExploreTopicLabelEnum.Culture,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.Culture,
  },
  drama: {
    cs_api_slug: 'pbs-dramas',
    cs_genre_slug: 'drama',
    display_name: ExploreTopicLabelEnum.Drama,
    video_hero_collection_slug: EXPLORE_DRAMAS_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.Drama,
  },
  food: {
    cs_api_slug: 'pbs-food',
    cs_genre_slug: 'food',
    display_name: ExploreTopicLabelEnum.Food,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.Food,
  },
  history: {
    cs_api_slug: 'pbs-history',
    cs_genre_slug: 'history',
    display_name: ExploreTopicLabelEnum.History,
    video_hero_collection_slug: EXPLORE_GENRE_VIDEO_HERO_COLLECTION_SLUG,
    href: ExploreTopicRouteEnum.History,
  },
  'pbs-america-at-250': {
    cs_api_slug: 'pbsorg-america-at-250',
    display_name: ExploreTopicLabelEnum.AmericaAt250,
    href: ExploreTopicRouteEnum.AmericaAt250,
  }
}

// RWEB-9444
export const EXPLORE_HUB_COLLECTIONS_TO_INCLUDE_STATION_LOGO = [
  'local-climate-stories',
  'local-arts-spotlight',
  'explore-news-local-shows',
  'explore-indies-local-videos',
  'explore-home-how-to-local-shows',
  'explore-history-local-videos',
  'explore-food-local-shows',
  'local-drama-spotlight',
  'explore-culture-local-shows',
  'local-genre-show-poster-video-row',
]

// Shop Links
export const SHOP_LINKS: Record<string, keyof ShopLinks>= {
  'itunes': "itunes",
  'amazon': "amazon",
  'digital-download': "digital_download"
};

export const SOCIAL_MEDIA_LINKS = ["facebook", "twitter", "instagram", "tiktok", "youtube"];

// Link Profiles
export const SPONSOR_INFO_LINK_PROFILE = "sponsor-info";
export const PRODUCER_LINK_PROFILE = "producer";
export const LEARNING_MEDIA_LINK_PROFILE = "learning-media-content";

export const SENTRY_DSN = "https://288f494e62479c514a3e89974e97e130@o260369.ingest.us.sentry.io/4508015423193088"
export const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT

export const GOOGLE_TAG_MANAGER_ID = 'GTM-TWTDGH'

// This event name is used across PBS to track events in Google Analytics.
// Don't change unless expressly asked for by the BI team.
export const GOOGLE_EVENT_NAME = 'feature_tracking';

// This value for object_name is used across pbs.org AND player so we can rollup all donation link clicks
// in a single report in Google Analytics.
export const DONATE_OBJECT_NAME = 'donate link';

export const DONATE_FALLBACK_URL = 'https://www.pbs.org/donate/';

// Ask SEO folks - Richard Traylor, Sam Laney - before removing
export const GOOGLE_SITE_VERIFICATION_CODE = 'T2_cy5E9wKg4wpYbEb4t5m-SX0Uxz00XrgwueP1jOhU'

export const PREFETCH_RESTRICTED_ROUTES = [
  '/donation',
  '/pbs-app'
]

export interface ErrorNodeException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

// We manually set this event name so that when we push Data Layer updates
// to Google Tag Manager, a tag can listen for it and report the page view.
export const PAGE_VIEW_EVENT_WITH_PAGE_TRACKING_ID = 'page_view_with_page_tracking_id';

// Basic Auth for Beta
export const BASIC_AUTH_COOKIE_AGE_DAYS = 14;
export const BASIC_AUTH_COOKIE_AGE_SECONDS = 60 * 60 * 24 * BASIC_AUTH_COOKIE_AGE_DAYS;

export const ENVIRONMENTS_REQUIRING_BASIC_AUTH = ['beta']
export const BASIC_AUTH_COOKIE = 'AUTHENTICATED_BASIC_AUTH'

export const INTERNAL_BASIC_AUTH_USER = 'pbsbeta'
export const INTERNAL_BASIC_AUTH_PASS = 'solar'

export const EXTERNAL_BASIC_AUTH_USER = 'betapbs'
export const EXTERNAL_BASIC_AUTH_PASS = 'lunar'

export const BASIC_AUTH_EXEMPT_PATHS = [
  '/api/healthz/',
  '/api/v1/search/'
]

// Note - profile service _may_ be using this list of device names:
// https://github.com/pbs-digital/profile-service/blob/b059c65e15695b7f36b8c6e67b462180b302217d/profile_service/otp/management/commands/run_iterable_import.py#L58
export const DEVICE_TYPE_TO_CAMPAIGN_INFO_CODE_MAPPING = {
  'TVOS': "ATV",
  'Roku': "RK",
  'Fire TV': "FTV",
  'Android TV': "ANDTV",
  'Samsung TV': "SAMTV",
  'Vizio TV': "VIZTV",
  'Comcast X1': "COMX1TV",
  'LG TV': "LGTV",
  'Amazon OS TV': 'AmazonOSTV',
} as const

export type DeviceType = keyof typeof DEVICE_TYPE_TO_CAMPAIGN_INFO_CODE_MAPPING;
export type CampaignCode = typeof DEVICE_TYPE_TO_CAMPAIGN_INFO_CODE_MAPPING[DeviceType];

export const CLOSED_CAPTIONING_SUPPORT_URL = 'https://help.pbs.org/support/solutions/articles/5000673858-i-don-t-see-closed-captions-on-the-video-i-m-watching';
export const VIDEO_HELP_PAGE_URL = 'https://help.pbs.org/support/solutions/12000002757';

export const PASSPORT_ACTIVATION_FEATURE_CATEGORY = 'passport activation';
export const PASSPORT_TRANSFER_FEATURE_CATEGORY = 'passport transfer';
export const PASSPORT_TRANSFER_MEMBERSHIP_KEY = 'passportMembership';

// This is set in parameter store *only* in pbs-digi-prod
// https://us-east-1.console.aws.amazon.com/systems-manager/parameters/%252FPROD%252FNEXT%252FAPP_ENV/description?region=us-east-1&tab=Table#list_parameter_filters=Name:Contains:APP_ENV
// As of 9/24/25, the string is "production".
// We use this as a check to include or exclude things only in production.
// Note, we cannot use NODE_ENV because our builds for staging and preprod get a NODE_ENV of production.
export const PRODUCTION_APP_ENV_STRING = 'production';

export const isDev = process.env.APP_ENV === undefined || process.env.APP_ENV === 'development';
