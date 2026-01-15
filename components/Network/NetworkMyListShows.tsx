'use client'

// imports
import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai'

// lib files
import { myListShowsAtom, myListShowsStatus as myListShowsStatusAtom } from '@/lib/atoms/myListShows';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import CompanionState from '@/lib/types/atoms/companionState';
import { ShowRowContent } from '@/lib/types/api/show-data';

function NetworkMyListShows() {
  const [profile] = useAtom(userProfile)
  const [profileStatus] = useAtom(userProfileStatus)
  const [_, setMyListShows] = useAtom(myListShowsAtom)
  const [myListShowsStatus, setMyListShowsStatus] = useAtom(myListShowsStatusAtom)

  const fetchMyListShows = useCallback(async () => {
    try {
      const response = await fetch(`/api/profile/my-list-shows/`);
      const json = await response.json();
      const { myListShowsData } = json;
      setMyListShows(myListShowsData as ShowRowContent[]);
      setMyListShowsStatus(CompanionState.IsLoadedWithData)
    } catch (error) {
      setMyListShowsStatus(CompanionState.Error)
      console.error(error);
    }
  }, [setMyListShowsStatus, setMyListShows])

   useEffect(() => {
    // if we have a profile and it's loaded
    if(profile && profileStatus === CompanionState.IsLoadedWithData) {
      // and also if we haven't already loaded the status and it's not currently loading
      if(myListShowsStatus === CompanionState.NotLoaded) {
        setMyListShowsStatus(CompanionState.IsLoading)
        fetchMyListShows()
      }
    }
  }, [profile, profileStatus, fetchMyListShows, myListShowsStatus, setMyListShowsStatus])

  return (<></>)
}

export default NetworkMyListShows
