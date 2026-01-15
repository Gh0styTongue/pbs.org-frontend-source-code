export type VideoPageData = {
    show?: {
        display_episode_number?: boolean;
        seasons_count?: number;
        season?: number | string | null;
        episode?: number | string;
    };
    ancestor_title?: string;
    enhance_html_title_tag?: string;
    title?: string;
};

const getMetaTitle = (data: VideoPageData): string => {
    const show = data.show || {};
    const ancestorTitle = data.ancestor_title || "";
    const enhanceHtmlTitleTag = data.enhance_html_title_tag;
    const displayEpisodeNumber = show.display_episode_number;
    const seasonNumber = show.season;
    const episodeNumber = show.episode?.toString();
    const videoAssetTitle = data.title || "";
    const videoAssetTitleLower = videoAssetTitle.toLowerCase();

    const shouldDisplaySeasonNumber = seasonNumber !== undefined && show.seasons_count !== 1;
    const shouldDisplayEpisodeNumber = episodeNumber !== undefined && displayEpisodeNumber;
    const shouldDisplayAssetTitle = videoAssetTitleLower !== ancestorTitle.toLowerCase();

    let seasonString: string | undefined;
    if (seasonNumber !== undefined && seasonNumber !== null) {
        seasonString = `Season ${seasonNumber}`;
    }

    let episodeString: string | undefined;
    if (episodeNumber !== undefined && episodeNumber !== "") {
        episodeString = `Episode ${episodeNumber}`;
    }

    const meta: string[] = [];

    if (ancestorTitle) {
        meta.push(ancestorTitle);
    }

    if (
        videoAssetTitleLower.includes("episode") &&
        videoAssetTitleLower.includes("season") &&
        shouldDisplayAssetTitle
    ) {
        meta.push(videoAssetTitle);
    } else if (videoAssetTitleLower.includes("episode")) {
        if (shouldDisplaySeasonNumber && seasonString) {
            meta.push(seasonString);
        }
        if (shouldDisplayAssetTitle) {
            meta.push(videoAssetTitle);
        }
    } else {
        if (shouldDisplayAssetTitle) {
            meta.push(videoAssetTitle);
        }
        if (shouldDisplaySeasonNumber && seasonString) {
            meta.push(seasonString);
        }
        if (shouldDisplayEpisodeNumber && episodeString) {
            meta.push(episodeString);
        }
    }

    if (enhanceHtmlTitleTag) {
        meta.push(enhanceHtmlTitleTag);
    }

    return meta.join(" | ");
}

export { getMetaTitle };
