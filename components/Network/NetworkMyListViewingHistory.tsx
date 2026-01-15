'use client'

import { useEffect, useCallback, useState } from 'react';
import { useAtom } from 'jotai'

import { myListViewingHistoryAtom, myListViewingHistoryStatusAtom } from '@/lib/atoms/myListViewingHistory';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import CompanionState from '@/lib/types/atoms/companionState';

function NetworkMyListViewingHistory() {
  const [profile] = useAtom(userProfile)
  const [profileStatus] = useAtom(userProfileStatus)

  const [myListViewingHistory, setMyListViewingHistory] = useAtom(myListViewingHistoryAtom)
  const [status, setStatus] = useAtom(myListViewingHistoryStatusAtom)

  const [shouldFetch, setShouldFetch] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)

  const isProfileReady = profile && profileStatus === CompanionState.IsLoadedWithData

  const fetchMyListViewingHistory = useCallback(async () => {
    if(status === CompanionState.IsLoading) return
    setStatus(CompanionState.IsLoading)

    try {
      const response = await fetch(`/api/profile/viewing-history/`);
      const json = await response.json();
      setMyListViewingHistory(json.myListViewingHistoryData);

      setStatus(CompanionState.IsLoadedWithData)
      setHasFetchedOnce(true)
    } catch (error) {
      setStatus(CompanionState.Error)
      console.error(error);
    }
  }, [status, setStatus, setMyListViewingHistory])

  useEffect(() => {
    if(myListViewingHistory) {
      setShouldFetch(false)
    } else {
      setShouldFetch(true)
    }
  }, [myListViewingHistory])

  useEffect(() => {
    if(isProfileReady) {
      if(!hasFetchedOnce && shouldFetch) {
        fetchMyListViewingHistory()
        setShouldFetch(false)
      }
    }
  }, [profile, profileStatus, isProfileReady, shouldFetch, hasFetchedOnce, fetchMyListViewingHistory])

  return (<></>)
}

export default NetworkMyListViewingHistory
