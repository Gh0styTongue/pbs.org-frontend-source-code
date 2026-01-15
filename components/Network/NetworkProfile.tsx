'use client'

// imports
import { useAtom } from 'jotai';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Cookies from 'js-cookie'

// lib files
import { getFavoriteStations, getProfile, getViewingHistory, setFavoriteStation } from '@/lib/profile';
import { ProfileData } from '@/lib/types/api/profile-data';
import { STATION_ID_COOKIE, USER_ID_COOKIE } from '@/lib/constants';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import { percentageWatchedViewingHistoryAtom } from '@/lib/atoms/viewing-history';
import { ViewingHistoryItem } from '@/lib/types/api/viewing-history';
import CompanionState from '@/lib/types/atoms/companionState';
import { setStationCookie } from '@/lib/helpers/set-station-cookie';
import validateStationId from '@/lib/helpers/validate-station';

async function fetchProfile(
  setProfileData: Dispatch<SetStateAction<ProfileData | null>>,
  setViewingHistory: Dispatch<SetStateAction<ViewingHistoryItem[] | null>>,
  setProfileStatus: Dispatch<SetStateAction<CompanionState>>,
) {
  try {
    const profileData = await getProfile()
    setProfileData(profileData)
    setProfileStatus(CompanionState.IsLoadedWithData)

    const viewingHistory: ViewingHistoryItem[] = await getViewingHistory()
    setViewingHistory(viewingHistory)

    const favoriteStations = await getFavoriteStations()
    if(!favoriteStations || !favoriteStations?.collections) return
    const currentStationID = Cookies.get(STATION_ID_COOKIE)
    const favoriteStation = favoriteStations?.collections?.[0]?.content[0];
    if(!favoriteStation || !currentStationID) return
    const favoriteStationID = favoriteStation.cid
    const isPBSorg = window.pbsPlatform === 'pbsorg';

    // if we're on pbs.org, and the localized station is not the user's favorite station,
    // relocalize them to the favorite station by setting the station cookie
    if(isPBSorg && (currentStationID !== favoriteStationID)) {
      const valid = await validateStationId(favoriteStationID)

      if(valid) {
        setStationCookie(favoriteStation);
        window.location.reload();
      } else {
        // If their favorite station is invalid, update their favorite to their
        // currently localized station.
        await setFavoriteStation(currentStationID);
      }
    }
  } catch(_error) {
    setProfileData(null)
    setProfileStatus(CompanionState.Error)
  }
}

const NetworkProfile = () => {
  const [profile, setProfile] = useAtom(userProfile)
  const [profileStatus, setProfileStatus] = useAtom(userProfileStatus)

  const [_, setViewingHistory] = useAtom(percentageWatchedViewingHistoryAtom)
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false)
  const [initialProfileFetched, setInitialProfileFetched] = useState(false)

  useEffect(() => {
    const pid = Cookies.get(USER_ID_COOKIE)
    switch (true) {
      case !initialProfileFetched && !!pid:
        setShouldFetchProfile(true)
        setInitialProfileFetched(true)
        break;
      case !pid:
        setProfileStatus(CompanionState.IsLoadedWithoutData)
        setShouldFetchProfile(false)
        break;
      case profileStatus === CompanionState.Error:
        setShouldFetchProfile(false)
        break;
      case profile?.profile.pid === pid:
        setProfileStatus(CompanionState.IsLoadedWithData)
        setShouldFetchProfile(false)
        break;
      case profileStatus === CompanionState.NotLoaded:
      default:
        setShouldFetchProfile(true)
        break;
    }
  }, [profile, profileStatus, setProfileStatus, setShouldFetchProfile, initialProfileFetched])

  // polling effect
  useEffect(() => {
    if(profile) {
      const profileRefreshTask = () => fetchProfile(setProfile, setViewingHistory, setProfileStatus)
      const everyTenMinutes = 10 * 60 * 1000
      const intervalId = setInterval(profileRefreshTask, everyTenMinutes)
      return () => clearInterval(intervalId)
    }
  }, [profile, setProfile, setViewingHistory, setProfileStatus])

  useEffect(() => {
    if(shouldFetchProfile) {
      setProfileStatus(CompanionState.IsLoading)
      fetchProfile(setProfile, setViewingHistory, setProfileStatus)
    } else {
      if(!Cookies.get(USER_ID_COOKIE)) {
        setProfile(null)
      }
    }
  }, [shouldFetchProfile, setProfile, setViewingHistory, setProfileStatus])

  return (<></>);
}

export default NetworkProfile;
