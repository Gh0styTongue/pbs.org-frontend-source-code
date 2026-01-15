'use client'

import { ORIGIN_STRING, STATION_ID_COOKIE } from "@/lib/constants"
import { ProfileData } from "@/lib/types/api/profile-data"
import Cookies from "js-cookie"
import { fetchViewingHistory } from "@/lib/content-services/queries"
import { CampaignCode, PBS_COOKIE_DOMAIN, USER_ID_COOKIE } from '@/lib/constants';
import safeFetch from "@/lib/helpers/safe-fetch"
import { ClientSessionInvalid } from "@/lib/errors"

export const NoUIDError = new Error('PBS UID Cookie is not set')

export function getStationId() {
  return Cookies.get(STATION_ID_COOKIE) || window.SVP?.stationId
}

export function getUserId() {
  return Cookies.get(USER_ID_COOKIE)
}

export async function getProfile(): Promise<ProfileData> {
  const response = await safeFetch(`${ORIGIN_STRING}/sso/profile`, {
    credentials: 'include'
  })

  if(response.status === 401 || response.status === 403 || response.status === 404) {
    const domain = window.pbsPlatform === 'svp' ? window.location.hostname : PBS_COOKIE_DOMAIN;
    Cookies.remove(USER_ID_COOKIE, { path: '/', domain })
    throw new ClientSessionInvalid('Invalid Session')
  }

  const json = await response.json()

  // Override profile service passport flag with data directly from mvault
  const { passportEnabled } = await getPassportStatus()
  json.personal_data.is_passport = passportEnabled

  return json
}

export async function getPassportStatus() {
  const response = await safeFetch(`/api/v1/membership/${getUserId()}/passport/`)
  return await response.json()
}

export async function getFavoriteStations() {
  const uid = Cookies.get(USER_ID_COOKIE)

  if(!uid) {
    throw NoUIDError
  }

  const response = await safeFetch('/api/profile/stations/')
  return await response.json()
}

export async function getViewingHistory() {
  const uid = Cookies.get(USER_ID_COOKIE)

  if(!uid) {
    throw NoUIDError
  }

  const viewingHistory = await fetchViewingHistory(uid)
  return viewingHistory
}

export async function setFavoriteStation(stationId: string) {
  const uid = Cookies.get(USER_ID_COOKIE)

  if(!uid) {
    throw NoUIDError
  }

  const response = await safeFetch('/api/profile/stations/', {
    method: 'PUT',
    body: JSON.stringify({ stationId })
  })
  return await response.json()
}

export async function putCampaignInfo(campaignInfoCode: CampaignCode) {
  const response = await safeFetch(
    `/api/profile/campaign-info/${campaignInfoCode}/`,
    { method: 'PUT' }
  )

  return response.ok
}
