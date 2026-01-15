'use client'

import { useEffect } from "react"
import { useHasMounted } from "@/lib/hooks"
import Cookies from "js-cookie"
import { REDIRECT_COOKIE } from "@/lib/constants"
import { asyncDeleteCookie } from "@/lib/helpers/cookie"

function NetworkRedirect() {
  const hasMounted = useHasMounted()
  const redirectCookie = Cookies.get(REDIRECT_COOKIE)

  useEffect(() => {
    if(redirectCookie) {
      asyncDeleteCookie(REDIRECT_COOKIE).then(() => {
        // we don't need to redirect if we're already there
        if(window.location.href !== redirectCookie) {
          window.location.href = redirectCookie
        }
      })
    } else {
      return
    }
  }, [redirectCookie])

  if(!hasMounted) return null

  return (<></>)
}

export default NetworkRedirect
