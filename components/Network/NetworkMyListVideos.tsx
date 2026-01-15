'use client'

// imports
import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai'

// lib files
import { ContentServiceVideoObject } from '@/lib/types/api/content-service';
import { myListVideosAtom, myListVideosStatusAtom } from '@/lib/atoms/myListVideos';
import { normalizeVideoData } from '@/lib/helpers/normalize-video-data';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import CompanionState from '@/lib/types/atoms/companionState';

function NetworkMyListVideos() {
  const [profile] = useAtom(userProfile)
  const [profileStatus] = useAtom(userProfileStatus)
  const [_, setMyListVideos] = useAtom(myListVideosAtom);
  const [myListVideosStatus, setMyListVideosStatus] = useAtom(myListVideosStatusAtom)

  const fetchMyListVideos = useCallback(async () => {
    try {
      const response = await fetch(`/api/profile/my-list-videos/`);
      const json = await response.json();
      const { myListVideosData } = json;
      const normalizedData = myListVideosData ? myListVideosData?.map((v: ContentServiceVideoObject) => normalizeVideoData(v)) : null;
      setMyListVideos(normalizedData);
      setMyListVideosStatus(CompanionState.IsLoadedWithData)
    } catch (error) {
      setMyListVideosStatus(CompanionState.Error)
      console.error(error);
    }
  }, [setMyListVideos, setMyListVideosStatus])

  useEffect(() => {
    // if we have a profile and it's loaded
    if(profile && profileStatus === CompanionState.IsLoadedWithData) {
      // and also if we haven't already loaded the status and it's not currently loading
      if(myListVideosStatus === CompanionState.NotLoaded) {
        setMyListVideosStatus(CompanionState.IsLoading)
        fetchMyListVideos()
      }
    }
  }, [profile, profileStatus, fetchMyListVideos, myListVideosStatus, setMyListVideosStatus])

  return (<></>)
}

export default NetworkMyListVideos
