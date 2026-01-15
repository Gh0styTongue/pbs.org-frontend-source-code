'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'

import { continueWatchingAtom, continueWatchingStatusAtom } from '@/lib/atoms/continueWatching';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import CompanionState from '@/lib/types/atoms/companionState';

function NetworkMyListContinueWatching() {
  const [profile] = useAtom(userProfile)
  const [profileStatus] = useAtom(userProfileStatus)
  const [continueWatching, setContinueWatching] = useAtom(continueWatchingAtom)
  const [status, setStatus] = useAtom(continueWatchingStatusAtom)

  const [shouldFetch, setShouldFetch] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)

  const isProfileReady = profile && profileStatus === CompanionState.IsLoadedWithData

  const fetchContinueWatching = useCallback(async () => {
    if(status === CompanionState.IsLoading) return
    setStatus(CompanionState.IsLoading)

    try {
      const response = await fetch(`/api/profile/continue-watching/`);
      const json = await response.json();
      setStatus(CompanionState.IsLoadedWithData)
      setHasFetchedOnce(true)
      setContinueWatching(json.continueWatchingData);
    } catch (error) {
      setStatus(CompanionState.Error)
      console.error(error);
    }
  }, [status, setStatus, setContinueWatching, setHasFetchedOnce])

  useEffect(() => {
    if(continueWatching) {
      setShouldFetch(false)
    } else {
      setShouldFetch(true)
    }
  }, [continueWatching])

  useEffect(() => {
    if(isProfileReady) {
      if(!hasFetchedOnce && shouldFetch) {
        fetchContinueWatching()
        setShouldFetch(false)
      }
    }
  }, [isProfileReady, profile, profileStatus, shouldFetch, hasFetchedOnce, fetchContinueWatching])

  return (<></>)
}

export default NetworkMyListContinueWatching
