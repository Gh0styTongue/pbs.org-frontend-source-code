import Cookies from 'js-cookie'
import { LocalizationServiceV3StationData } from '@/lib/types/api/stations-data';
import { FavoriteStation } from '@/lib/types/api/content-service';

import {
  PBS_COOKIE_DOMAIN,
  STATION_ID_COOKIE,
  STATION_CALLSIGN_COOKIE,
  STATION_COOKIE_AGE_DAYS,
  UNLOCALIZED_USER_COOKIE,
} from '@/lib/constants';

const setStationCookie = (station: LocalizationServiceV3StationData) => {
  let stationId: string | undefined;
  let callsign: string | undefined;

  if(station?.callsign) {
    const lsStation = station as LocalizationServiceV3StationData
    stationId = lsStation.station_id;
    callsign = lsStation.callsign;
  } else {
    const csStation = (station as unknown) as FavoriteStation
    stationId = csStation.cid
    callsign = csStation.call_sign
  }

  // RWEB-8832 if the UNLOCALIZED_USER_COOKIE exists, delete it
  if(Cookies.get(UNLOCALIZED_USER_COOKIE)) {
    Cookies.remove(UNLOCALIZED_USER_COOKIE, {
      domain: PBS_COOKIE_DOMAIN,
      path: '/',
    });
  }

  Cookies.set(STATION_ID_COOKIE, stationId, {
    domain: PBS_COOKIE_DOMAIN,
    path: '/',
    expires: STATION_COOKIE_AGE_DAYS,
    sameSite: 'none',
    secure: true,
  });

  Cookies.set(STATION_CALLSIGN_COOKIE, callsign, {
    domain: PBS_COOKIE_DOMAIN,
    path: '/',
    expires: STATION_COOKIE_AGE_DAYS,
    sameSite: 'none',
    secure: true,
  })
}

export { setStationCookie };
