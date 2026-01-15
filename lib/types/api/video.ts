import { ShowOrFranchiseEnum, ShowRowContent } from "./show-data";
import { FranchiseImages } from "./franchise-data";
import { SocialLinkElement } from '@/lib/helpers/get-social-links';

export interface ContentFlags {
    is_new:           boolean;
    is_mvod:          boolean;
    has_captions:     boolean;
    is_expiring_soon: boolean;
    is_fully_watched: null;
}

export enum VideoTypeEnum {
    Episode = "episode",
    Preview = "preview",
    Clip = "clip",
    Special = "special",
    FullLength = "full_length",
    // This really isn't what we get, but we use it as a fallback
    Video = "video",
    // For rare, special events
    Live = "live",
}

export interface SeasonElement {
    cid:     string;
    ordinal: number;
}

export interface VideosStrip {
    has_more_from_collection: boolean;
}

export interface VideoRowCollection {
    title: string;
    title_link?: string;
    content: VideoClass[];
    description?: string;
    slug?: string;
    call_to_action?: boolean;
    has_profile_data?: boolean;
    collection_type?: string;
    url?: string;
    item_type?: string;
    // this doesn't exist as of 5/22/24, but is in the designs
    logo?: string;
    logo_alt?: string;
}

export interface ShowPosterVideoRowCollection {
    call_to_action?: boolean;
    content: VideoClass[];
    default_season?: number;
    description?: string;
    has_scheduled_content?: boolean;
    item_type?: string;
    poster_image?: string;
    seasons?: SeasonElement[];
    show_logo_color?: string;
    show_logo_white?: string;
    show_slug: string;
    slug?: string;
    title_link?: string;
    title: string;
}
export interface GaEvents {
    show_page_tracking_code?:  string;
    show_event_tracking_code?: string;
}

export interface Promo {
    url:         string;
    link:        PromoLink;
    type:        string;
    image:       string;
    title:       string;
    description: string;
}

export interface PromoLink {
    url:   string;
    title: string;
}

export interface ShowRowCollection {
    slug:             string;
    title:            string;
    item_type:        ShowOrFranchiseEnum;
    has_profile_data: boolean;
    collection_type:  string;
    url:              string;
    content:          ShowRowContent[];
    title_link:       string;
}
export interface Audience {
    scope:   string;
    station: null | {
        cid: string;
        call_sign: string;
        short_common_name: string;
    };
}

export interface Genre {
    cid:        string;
    slug:       string;
    title:      string;
    item_type?: string;
    url:        string;
}

export interface ContentImages {
    "show-logo"?:         string;
    "show-mezzanine16x9": string;
    "show-poster2x3":     string;
    "show-showcase"?:     string;
    "show-white-logo"?:   string;
    "show-black-logo"?:   string;
    "show-color-logo"?:   string;
    "white-logo-41"?:     string;
    "black-logo-41"?:     string;
    "color-logo-41"?:     string;
    background?:          string;
    "show-banner"?:       string;
}

export interface LinkElement {
    value:      string;
    profile:    string;
    updated_at: Date;
}

export interface VideoHeroLink {
    url:  string;
    text: string;
}

export interface VideoClass {
    slug:                          string;
    title:                         string;
    title_sortable:                string;
    url:                           string;
    duration:                      number;
    description_short:             string;
    video_type:                    VideoTypeEnum;
    premiere_date:                 string;
    encore_date:                   string;
    expire_date:                   string | null;
    available_date?:               string;
    seconds_watched:               null;
    images:                        VideoImages;
    description_long:              string;
    flags:                         VideoFlags;
    hls_videos?:                    ClosedCaption[];
    hls_drm_videos?:                any[];
    dash_drm_videos?:               any[];
    mp4_videos?:                    ClosedCaption[];
    funder_message?:                string;
    closed_captions?:               ClosedCaption[];
    transcripts?:                   CaptionsLanguage[];
    captions_language?:             CaptionsLanguage[];
    chapters?:                      any[];
    related_links?:                 any[];
    related_promos?:                any[];
    links?:                         LinkElement[];
    hero_links?:                    VideoHeroLink[];
    availability:                  string;
    content_rating?:                string;
    content_rating_descriptor?:     any[];
    is_excluded_from_dfp?:          boolean;
    item_type:                     string;
    trick_play_files?:              any[];
    enhance_html_title_tag?:        string;
    audio:                         Audio[];
    parent_type:                   "episode" | "preview" | "clip" | "special" | "full_length" | "season" | "franchise" | "show" | "video";
    show?:                         VideoShow;
    franchise?:                    VideoFranchise;
    summary:                       string;
    ancestor_title:                string;
    ancestor_slug:                 string;
    ancestor_type:                 "show" | "franchise" | "season";
    ancestor_white_logo?:          string;
    image:                         string;
    legacy_tp_media_id:            number;
    cid:                           string;
    share?:                         Share;
    has_audio_description?:         boolean;
    meta_title?:                    string;
    related_accessibility_videos?:  RelatedAccessibilityVideo[];
    related_video_asset?:           RelatedVideoAsset | null;
    related_is_expired?:            boolean;
    related_content_title?:         string;
    test_data?:                     boolean;
    transcript?:                    string[];
    transcript_file?:               string;
    sponsor_logos?:                 any[];
    local_content_stations?:        any[];
    genre?:                         Genre;
    // this is really removed in the normalization process, but is here to keep TS happy
    parent?:                        Parent;
    learning_media_url?:            string;
    ga_events?:                     GaEvents;
}

export interface RelatedAccessibilityVideo {
    accessibility_profile: 'asl' | 'ead-english' | 'ead-spanish' | 'oc-english' | 'oc-spanish' | 'non-enhanced';
}

export interface Audio {
    channel:     string;
    language:    string;
    descriptive: boolean;
}

export interface CaptionsLanguage {
    url:      string;
    primary:  boolean;
    profile:  string;
    language: string;
}

export interface ClosedCaption {
    url:     string;
    profile: string;
}

export interface VideoFlags {
    is_new:                   boolean;
    is_mvod:                  boolean;
    has_captions:             boolean;
    is_expiring_soon?:        boolean;
    is_fully_watched?:        boolean | null;
    is_playable:              boolean;
    is_playable_explanation:  string[] | null;
    can_embed_player?:        boolean;
    is_in_watchlist?:         null;
}

export interface VideoImages {
    "asset-mezzanine-16x9": string;
}

export interface RelatedVideoAsset {
    cid:                string;
    slug:               string;
    title:              string;
    title_sortable:     string;
    url:                string;
    duration:           number;
    description_short:  string;
    description_long:   string;
    video_type:         VideoTypeEnum;
    premiere_date:      string;
    encore_date:        string;
    expire_date:        string | null;
    availability:       string;
    seconds_watched:    null;
    images:             VideoImages | null;
    flags:              ContentFlags;
    parent:             Parent | VideoHeroParent;
    legacy_tp_media_id: number;
    item_type:          string;
    audio:              Audio[];
}

export interface Parent {
    ordinal:       number;
    slug:          string;
    title:         string;
    season:        ParentSeason | any;
    cid:           string;
    resource_type: "episode" | "preview" | "clip" | "special" | "full_length" | "season";
    show?:         SeasonShow;
}

export interface ParentSeason {
    ordinal:       number;
    title:         string;
    show:          SeasonShow;
    cid:           string;
    resource_type: string;
}

export interface VideoHeroParent {
    show: VideoHeroShow;
}

export interface VideoHeroShow {
    slug:  string;
    title: string;
    logos: VideoShowImages;
}
export interface SeasonShow {
    audience:               Audience[];
    display_episode_number: boolean;
    franchise:              null;
    seasons_count:          number;
    slug:                   string;
    title:                  string;
    tracking_ga_event:      string;
    tracking_ga_page:       string;
    cid:                    string;
    resource_type:          ShowOrFranchiseEnum;
    funder_message:         string;
    genre?:                 Genre;
    images?:                VideoShowImages;
    logos?:                 VideoShowImages;
    hashtag?:               string;
    links?:                 LinkElement[];
}

export interface Share {
    title:    string;
    facebook: boolean;
    twitter:  boolean;
    google:   boolean;
    email:    boolean;
    embed:    boolean;
}

export interface VideoShow {
    slug:                    string;
    title:                   string;
    season?:                 number;
    episode?:                number | string;
    seasons_count?:          number;
    display_episode_number?: boolean;
    hashtag?:                string;
    images?:                VideoShowImages;
    logos?:                 VideoShowImages;
    social_links?:          SocialLinkElement[];
}

export interface VideoShowImages {
  "show-mezzanine16x9"?: string,
  "show-poster2x3"?:     string,
  "white-logo-41"?:      string,
  "black-logo-41"?:      string,
  "color-logo-41"?:      string,
  "background"?:         string,
  "show-logo"?:          string,
  "show-white-logo"?:    string,
  "show-black-logo"?:    string,
  "show-color-logo"?:    string,
  "show-banner"?:        string,
  "show-showcase"?:      string,
}


export interface VideoFranchise {
    slug:                   string;
    title:                  string;
    logo:                   string,
    logo_cropped:           string,
    logo_cropped_white:     string,
    image:                  string,
    images?:                FranchiseImages,
    tracking_ga_page?:      string,
}
