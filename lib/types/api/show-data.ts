import { FranchiseImages } from '@/lib/types/api/franchise-data';
import { Sponsor } from "@/components/SponsorshipVideoHelpRow/SponsorshipVideoHelpRow";
import { SocialLinkElement } from '@/lib/helpers/get-social-links';

export enum ShowOrFranchiseEnum {
    Show = "show",
    Franchise = "franchise",
}

export interface Flags {
    is_new:           boolean;
    is_mvod:          boolean;
    has_captions:     boolean;
    is_expiring_soon: boolean;
    is_fully_watched: null;
}

export interface Season {
    cid:     string;
    ordinal: number;
    flags: {
        has_episodes: boolean;
        has_assets: boolean;
    };
}

export interface FeaturedContent {
    url:         string;
    link:        FeaturedContentLink;
    type:        string;
    image:       string;
    title:       string;
    description: string;
}

export interface FeaturedContentLink {
    url:   string;
    title: string;
}

export interface ContentImages {
    "asset-mezzanine-16x9": string;
}

export interface SupportingLink {
    url?: string;
    image?: string;
    title?: string;
}

export interface SupportingLinks {
    title: string;
    content: SupportingLink[];
    className?: string;
}

export interface PhotoGallery {
    title:   string;
    content: PhotoGalleryContent[];
}

export interface PhotoGalleryContent {
    alt_text:     string;
    image_url:    string;
    credit_text:  string;
    caption_text: string;
}

export interface ShowAirdates {
    content: any[];
}

export interface ShowDetails {
    cid:                    string;
    url?:                    string;
    slug:                   string;
    title:                  string;
    title_sortable?:         string;
    nola_root?:              string;
    description_short:      string;
    tracking_ga_page?:       string;
    tracking_ga_event?:      string;
    links?:                  LinkElement[];
    seasons_count?:          number;
    description_long?:       string;
    countries?:              string[];
    audience?:               Audience[];
    genre?:                  Genre;
    images?:                 ShowDetailsImages;
    image?:                  string;
    hashtag?:                string;
    funder_message?:         string;
    premiere_date?:          string;
    popularity?:            string | boolean | number | null;
    popularity_position?:   number | null;
    franchise?:              {
      cid: string;
      slug: string;
      title: string;
      url: string;
      images?: FranchiseImages;
      description_long?: string;
      logo?: string;
      logo_white?: string;
      image?: string;
    } | null;
    item_type:              'show';
    broadcast_info?:         string;
    funder_information?:     string;
    logo_white?:             string;
    logo_color?:             string;
    logo_black?:             string;
    poster?:                 string;
    social_links?:           SocialLinkElement[];
    website?:                string;
    sponsor_logos?:          Sponsor[];
    test_data?:              boolean;
    local_content_stations?: any[];
    is_kids?:                boolean;
    sort_episodes_descending?: boolean;
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
    cid:   string;
    slug:  string;
    title: string;
    url:   string;
}

export interface ShowDetailsImages {
    "show-mezzanine16x9"?:          string;
    "show-banner"?:                string;
    "show-poster2x3":              string;
    "white-logo-41"?:              string;
    "color-logo-41"?:              string;
    background?:                   string;
    "black-logo-41"?:              string;
    "show-logo"?:                  string;
    "show-showcase"?:              string;
    "show-white-logo"?:            string;
    "show-black-logo"?:            string;
    "show-color-logo"?:            string;
    "asset-kids-mezzanine1-16x9"?: string;
}

export interface LinkElement {
    value:      string;
    profile:    string;
    updated_at: string;
}

export interface ShowRow {
    title:      string;
    title_link: string;
    content:    ShowRowContent[];
}

export interface ShowRowContent {
    audience:             Audience[];
    cid:                  string;
    countries?:           string[];
    description_long?:    string;
    description_short?:   string;
    franchise:            Genre | null;
    genre:                Genre;
    image?:               string;
    images:               ShowDetailsImages;
    item_type:            ShowOrFranchiseEnum;
    links:                LinkElement[];
    popularity_position:  number | null;
    popularity:           null;
    slug:                 string;
    title_sortable:       string;
    title:                string;
    tracking_ga_event:    string;
    tracking_ga_page:     string;
    url:                  string;
    recommendation_id?:   string;
}

export interface SupportingText {
    title:          string;
    text:           string | null;
    text_secondary: string | null;
    className?:     string;
}
export interface SupportingTextCSResponse {
    label:          string;
    text:           string;
    text_secondary: string;
}

export interface FeaturedPreview {
    cid: string;
    slug: string;
    title: string;
    videoType: 'CLIP' | 'PREVIEW' | 'FULL_LENGTH';
    mezzanine16x9ImageUrl: string;
    availability: string;
}

export interface ShowFeaturedPreviewResponse {
    data: {
      showContext: {
        featuredPreview: FeaturedPreview
      }
    }
}

export interface ShowCollectionData {
    cid:                string;
    slug:               string;
    title:              string;
    title_sortable:     string;
    flags:              Flags;
    show:               ShowRowContent;
    description_short:  string;
    description_long:   string;
    featured:           boolean;
    images:             ContentImages;
    item_type:          string;
}

export interface BroadcastInfo {
    'broadcast-time': string;
}
