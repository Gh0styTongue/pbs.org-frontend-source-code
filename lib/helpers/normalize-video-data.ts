// This is a translated function from the pbsorg codebase called "flatten_video_info" that can be found here:
// https://github.com/pbs-digital/pbsorg/blob/main/core/utils.py#L373 (as of this writing)
// It is used to translate the kind-of-weird data that Content Service has for Video Objects
// into something more usable / approachable for the front-end

import { Parent, ParentSeason, SeasonShow, VideoClass, VideoFranchise, VideoHeroLink, VideoTypeEnum } from '@/lib/types/api/video';
import { ContentServiceVideoObject } from '@/lib/types/api/content-service';
import { FormatOptions, formatVideoMetadata } from '@/lib/helpers/format-video-metadata';
import { getBestVideoImage } from '@/lib/helpers/get-best-video-image';
import { getMetaTitle } from '@/lib/helpers/get-meta-title';
import { LinkElement } from '@/lib/types/api/video';
import { getLocalContentStations } from './get-local-content-stations';
import { getSocialLinks } from '@/lib/helpers/get-social-links';

type Episode = {
    ordinal: number;
    slug: string;
    title: string;
    season: ParentSeason;
    cid: string;
    resource_type: string;
};

function iso8601ToDatetime(dateStr: string | undefined): Date | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

/** This is a generic find function where the object's values can be typed as any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function find(key: string, obj: { [key: string]: any }): object | null {
    let result = null;
    for (const k in obj) {
        if (k === key) {
            result = obj[k]
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
            const value = find(key, obj[k]);
            if (value !== undefined && value !== null) {
                result = value
            }
        }
    }
    return result;
}

/**
 * Takes a raw Content Service video collection and normalizes it into a usable format,
 * matching what was done in the pbsorg django codebase
 * @param {VideoData} videoDataRaw
 * @param {string} [format="short"]
 * @param {boolean} [includeDuration=true]
 * @returns {VideoClass | null}
*/
const normalizeVideoData = (videoDataRaw: ContentServiceVideoObject, format: FormatOptions = "short", includeDuration = true): VideoClass => {
    // RWEB-9403 some video objects from CS contain a watch_preview key,
    // which we will use as the related_video_asset.
    let existingRelatedVideoAsset;
    if (videoDataRaw.watch_preview) {
        // this is used further down after videoData is created
        existingRelatedVideoAsset = videoDataRaw.watch_preview;
        delete videoDataRaw.watch_preview;
    }

    /** TypeScript is complaining that we are casting the videoData variable as a VideoClass
     * When it starts off as a raw CS video object, the missing fields are later added
     * in this function, but TS doesn't know that :)
    */
    // @ts-ignore
    const videoData = { ...videoDataRaw } as VideoClass;

    // if the raw data had the existing related video,
    // here is where we add it to the videoData object
    // as related_video_asset
    if (existingRelatedVideoAsset) {
        videoData.related_video_asset = existingRelatedVideoAsset;
    }

    // @TODO we need to handle VideoHeroParent objects as well
    const parent = videoDataRaw.parent as Parent;
    const resourceType: Parent["resource_type"] = parent.resource_type;

    if (videoDataRaw.video_type === "full_length") {
        videoData.video_type = resourceType as VideoTypeEnum;
    }

    if (resourceType) {
        // @ts-ignore
        videoData[resourceType] = parent;
    }

    const season = find("season", videoData) as ParentSeason;
    // if the video has a parent.key, use that as the show first.
    // otherewise, use the find function to find the show elsewhere in the response.
    const show = parent.show || find("show", videoData) as SeasonShow;
    const episode = find("episode", videoData) as Episode;
    const franchise = find("franchise", videoData) as VideoFranchise;

    delete videoData.parent;

    videoData.parent_type = resourceType;

    const premiereDate = iso8601ToDatetime(videoDataRaw.premiere_date as unknown as string);
    let formattedPremiereDate: string = '';
    if (premiereDate) {
        formattedPremiereDate = premiereDate.toLocaleDateString('en-US');
    }

    let episodeMeta: number | string = formattedPremiereDate;


    if (show?.display_episode_number !== false) {
        episodeMeta = typeof episode === "number" ? episode : episode?.ordinal || "";
    }

    // @ts-ignore
    delete videoData[resourceType];

    let audience;
    if (show) {
        audience = show.audience;
        videoData.show = {
            slug: show.slug || "",
            title: show.title || "",
            season: typeof season === "number" ? season : season?.ordinal,
            episode: episodeMeta,
            hashtag: show.hashtag || undefined,
            social_links: show.links && getSocialLinks(show.links) || undefined,
            seasons_count: show.seasons_count || 0,
            // some show objects have a .logos object, some have .images -
            // this papers over this inconsistency
            images: {  ...show.logos, ...show.images },
            display_episode_number: show.display_episode_number,
        };
    }

    videoData.local_content_stations = audience && getLocalContentStations(audience);

    videoData.summary = formatVideoMetadata(videoData, format, includeDuration);

    if (franchise && Object.keys(franchise).length > 0) {
        videoData.franchise = {
            title: franchise.title,
            slug: franchise.slug,
            logo: franchise.images?.["franchise-color-logo"] || "",
            logo_cropped: franchise.images?.["color-logo-41"] || "",
            logo_cropped_white: franchise["logo_cropped_white"] || franchise.images?.["white-logo-41"] || "",
            image: franchise.images?.["franchise-poster2x3"] || "",
        };
    }

    videoData.ancestor_title = "";
    videoData.ancestor_slug = "";

    if (show) {
        videoData.ancestor_title = show.title || "";
        videoData.ancestor_slug = show.slug || "";
        videoData.ancestor_type = "show";
        videoData.genre = show.genre;
        videoData.ancestor_white_logo = videoData.show?.images?.["white-logo-41"] || videoData.show?.images?.["show-white-logo"];
        videoData.ga_events = {
          show_page_tracking_code: show.tracking_ga_page
        }
    } else if (franchise) {
        videoData.ancestor_title = franchise.title || "";
        videoData.ancestor_slug = franchise.slug || "";
        videoData.ancestor_type = "franchise";
        videoData.ancestor_white_logo = videoData.franchise?.logo_cropped_white;
        videoData.ga_events = {
          show_page_tracking_code: franchise.tracking_ga_page
        }
    }

    const videoImages = {...videoData.images};
    videoImages['asset-mezzanine-16x9'] ??= videoDataRaw['asset-mezzanine-16x9'] || "";

    videoData.image = getBestVideoImage(videoImages) || "";
    videoData.legacy_tp_media_id = videoDataRaw.legacy_tp_media_id!;
    videoData.cid = videoDataRaw.cid;
    videoData.flags = videoDataRaw.flags;

    const relatedPromos = videoDataRaw.related_promos;

    if (relatedPromos) {
        for (const relatedPromo of relatedPromos) {
            if (relatedPromo.item_type === "related_video_asset") {
                if (relatedPromo.images) {
                    const imageUrl = getBestVideoImage(relatedPromo.images);
                    relatedPromo.image_url = imageUrl;
                }
                if (relatedPromo.slug) {
                    relatedPromo.url = `/video/${relatedPromo.slug}`;
                }
            }
        }
    }

    const videoLinks = videoDataRaw.links;

    const learningMediaUrl = show?.links?.find(link => {
        const { profile } = link;
        return profile === 'learning-media-content'
    })?.value;

    videoData.learning_media_url = learningMediaUrl;

    if (videoLinks && videoLinks.length > 0) {
      // @ts-ignore
      if (videoLinks[0].url) {
        videoData.hero_links = videoLinks as VideoHeroLink[];
      } else {
        videoData.links = videoLinks as LinkElement[];
      }
    }

    videoData.meta_title = getMetaTitle(videoData);

    return videoData;
}


export { normalizeVideoData };
