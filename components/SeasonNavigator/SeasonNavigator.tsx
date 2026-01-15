'use client';

// imports
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useState, useEffect, ChangeEvent } from 'react';

// lib files
import { canAccessStorage } from '@/lib/helpers/is-storage-available';
import { ContentServiceVideoObject } from '@/lib/types/api/content-service';
import { normalizeVideoData } from '@/lib/helpers/normalize-video-data';
import { Season, ShowRowContent } from '@/lib/types/api/show-data';
import { VideoClass, VideoShow } from '@/lib/types/api/video';

// components
import VideoDetailThumbnail from '@/components/VideoDetailThumbnail/VideoDetailThumbnail';

// styles
import styles from './SeasonNavigator.module.scss';
import { continueWatchingAtom } from '@/lib/atoms/continueWatching';
import { userProfile } from '@/lib/atoms/profile';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

async function fetchEpisodesFor(showSlug: string, cid: string) {
  const url = `/api/show/${showSlug}/season/${cid}/episodes/`
  const response = await fetch(url)
  return await response.json()
}

async function fetchExtrasFor(showSlug: string, cid: string) {
  const url = `/api/show/${showSlug}/season/${cid}/extras/`
  const response = await fetch(url)
  return await response.json()
}

export interface SeasonNavigatorProps {
  showSlug: string;
  videoSlug?: string;
  seasons: Season[];
  show?: ShowRowContent | VideoShow;
  defaultSeason?: string;
  contentType?: 'episodes' | 'extras';
}

function SeasonNavigator(props: SeasonNavigatorProps) {
  const { show, showSlug, videoSlug, contentType = 'episodes' } = props;
  const seasons = props.seasons.filter((s) => s.cid !== 'all-seasons')
  const [continueWatchingData] = useAtom(continueWatchingAtom);
  const [profile] = useAtom(userProfile)
  const pathname = usePathname();
  const isShowPage = pathname.startsWith("/show/");
  const isLoggedIn = profile !== undefined;
  const continueWatchingVideo = continueWatchingData?.find((video) => {
    return video.show.slug === show?.slug;
  });
  const isShowInContinueWatchingData = continueWatchingVideo !== undefined;
  const shouldUseContinueWatchingSeason = (
    isLoggedIn &&
    isShowInContinueWatchingData &&
    continueWatchingVideo.parent.resource_type === 'episode' &&
    isShowPage
  );

  let { defaultSeason } = props

  // We override the default season value if there's a continue watching video
  // and the user is logged in
  // and the show matches a video in the continue watching list
  // and the video is an episode (and not an extra or special)
  // and the current page is a show page
  if (shouldUseContinueWatchingSeason) {
    defaultSeason = continueWatchingVideo?.parent?.season?.cid;
  }

  // If no default season is defined, use the first season in the list
  if (!defaultSeason) {
    // @TODO add defensive code against the situation when seasons is an empty array
    defaultSeason = seasons[0].cid
  }

  const [selectedSeason, setSelectedSeason] = useState(defaultSeason)
  const [videos, setVideos] = useState<VideoClass[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const cid = event.target.value
    setSelectedSeason(cid)
  }

  useEffect(() => {
    setIsLoading(true)

    // RWEB-8958 - don't ask for episodes if the season is 'more-extras' - that's not a thing
    if (contentType === 'episodes' && selectedSeason !== 'more-extras') {
      fetchEpisodesFor(showSlug, selectedSeason).then((json) => {
        const normalizedVideosData = json?.map(
          (video: ContentServiceVideoObject) => normalizeVideoData(video, "shortEpOnly", false)
        );
        setVideos(normalizedVideosData)
        setIsLoading(false)
      }).catch(() => {
        setErrorMessage("Failed to fetch episodes. Please try again later.");
        setIsLoading(false);
      });
    } else if (contentType === 'extras') {
      fetchExtrasFor(showSlug, selectedSeason).then((json) => {
        const normalizedVideosData = json?.map(
          (video: ContentServiceVideoObject) => normalizeVideoData(video, "shortEpOnly", false)
        );
        setVideos(normalizedVideosData)
        setIsLoading(false)
      }).catch(() => {
        setErrorMessage("Failed to fetch extras. Please try again later.");
        setIsLoading(false);
      });
    }
  }, [selectedSeason, showSlug, contentType])

  useEffect(() => {
    if(videos.length === 0 && !canAccessStorage('localStorage')) {
      setErrorMessage("No results. It's possible your browser is blocking cookies or in an unsupported country.")
    } else {
      setErrorMessage(null)
    }
  }, [videos])

  return (
    <div className={styles.season_navigator}>
      { seasons.length > 1 && (
        <select
          className={styles.season_navigator_select}
          name='season-picker'
          value={selectedSeason}
          onChange={handleSelect}
        >
          {seasons.map((season, index: number) => {
            if (season.ordinal === 0) {
              return (
                <option value={season.cid} key={index}>More Clips & Previews</option>
              )
            }
            return (
              <option value={season.cid} key={index}>Season {season.ordinal}</option>
            )
          })}
        </select>
      )}

      <div className={styles.season_navigator__episodes}>
        { isLoading && (
          <LoadingSpinner className={styles.season_navigator__loading} />
        )}

        { !isLoading && errorMessage && (
          <p>{errorMessage}</p>
        )}

        { !isLoading && (
          videos.map((video, index: number) => {
            const videoEpisode = video.parent?.ordinal;
            const videoSeason = video.parent?.season?.ordinal;
            video.show = {
              ...show,
              episode: videoEpisode,
              season: videoSeason,
              display_episode_number: videoEpisode
            } as VideoShow;
            video.parent_type = 'show'
            return (
              <VideoDetailThumbnail
                key={index}
                video={video}
                nowPlaying={video.slug === videoSlug}
              />
            )
          })
        )}
      </div>
    </div>
  );
}

export default SeasonNavigator;
