'use client'

// imports
import Cookies from 'js-cookie';
import { useEffect } from 'react';

// constants
import {
  PBS_COOKIE_DOMAIN,
  STATION_CALLSIGN_COOKIE,
  STATION_COOKIE_AGE_DAYS,
  STATION_ID_COOKIE,
  UNLOCALIZED_USER_COOKIE
} from '@/lib/constants';

// lib
import { useHasMounted } from '@/lib/hooks'
import { asyncDeleteCookie } from '@/lib/helpers/cookie';

interface NetworkLocalizationProps {
  initialStationId?: string;
}

const localize = () => fetch('/api/localize/').then(r => r.json())

// If even though any prefetching might have occured, the server will
// still render a localized page if it was able to localize at all. In
// many cases this server rendered page based on the initial station id,
// will match what we got back in the browser. Hence there's no need
// to do a hard refresh.
const reloadIfRequired = (stationId: string, initialStationId?: string) => {
  if(stationId !== initialStationId) {
    window.location.reload()
  }
}

function NetworkLocalization({ initialStationId }: NetworkLocalizationProps) {
  const hasMounted = useHasMounted()

  useEffect(() => {
    const stationIdCookie = Cookies.get(STATION_ID_COOKIE)
    const wasPrefetched = Cookies.get(UNLOCALIZED_USER_COOKIE) === 'prefetched'

    if(!stationIdCookie && wasPrefetched) {
      localize().then(json => {
        const { stationId, callsign, unlocalized } = json

        if(unlocalized) {
          Cookies.set(UNLOCALIZED_USER_COOKIE, 'true', {
            domain: PBS_COOKIE_DOMAIN,
            path: '/',
            expires: STATION_COOKIE_AGE_DAYS,
            sameSite: 'none',
            secure: true,
          })
        } else {
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

          if(Cookies.get(UNLOCALIZED_USER_COOKIE)) {
            asyncDeleteCookie(UNLOCALIZED_USER_COOKIE, {
              domain: PBS_COOKIE_DOMAIN,
              path: '/',
            }).then(() => reloadIfRequired(stationId, initialStationId))
          } else {
            reloadIfRequired(stationId, initialStationId)
          }
        }
      })
    }
    // deliberately only running this after the initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!hasMounted) return null
  return (<></>)
}

export default NetworkLocalization
