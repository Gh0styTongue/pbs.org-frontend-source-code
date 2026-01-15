'use client'

import { useSearchParams } from 'next/navigation'

import { COUNTRY_ID_COOKIE, isDev } from "@/lib/constants"
import { useHasMounted } from "@/lib/hooks"
import Cookies from "js-cookie"
import { useEffect } from "react"

const fetchCountryId = async () => {
  try {
    const response = await fetch('/api/country/')
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const json = await response.json();
    return json.countryId;
  } catch(error) {
    // RWEB-9170: This fetch sometimes results in a "Load Failed" error which is
    // not something we can control and is pretty noisy in Sentry so we
    // swallow it here and log a warning instead.
    if (error instanceof TypeError && error.message === 'Load failed') {
      console.warn('fetchCountryId - Load failed', error);
      return null
    }
    // rethrowing if there's another type of error
    throw error
  }
}

function NetworkCountry() {
  const searchParams = useSearchParams()
  const hasMounted = useHasMounted()

  const searchCountryId = searchParams.get('countryId')
  const cookieCountryId = Cookies.get(COUNTRY_ID_COOKIE)

  useEffect(() => {
    // we're in dev mode, and someone is passing the countryId param to force
    // a country change
    if(isDev && searchCountryId) {
      // @TODO - is there any benefit to setting the 'domain' of this cookie?
      Cookies.set(COUNTRY_ID_COOKIE, searchCountryId)
    } else if(cookieCountryId) {
      // there's already a country set so exit early
      return
    } else {
      // fetch the countryId from the server which will use the
      // cloudfront-viewer-country header
      fetchCountryId().then(countryId => Cookies.set(COUNTRY_ID_COOKIE, countryId))
    }
    // deliberately only running this after the initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!hasMounted) return null

  return (<></>)
}

export default NetworkCountry
