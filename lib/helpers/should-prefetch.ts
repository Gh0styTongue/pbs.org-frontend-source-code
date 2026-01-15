import { PREFETCH_RESTRICTED_ROUTES } from '@/lib/constants';

type LinkType = URL | string | {
  pathname: string,
  query: {
    [key: string]: string,
  }
}

// URL.parse does not exist in Next.js land.
function parseUrl(str: string) {
  try {
    return new URL(str)
  } catch {
    return null
  }
}

function shouldPrefetch(href: LinkType) {
  if(href instanceof URL) {
    var pathname = href.pathname
  } else if(typeof href === 'string') {
    var pathname = parseUrl(href)?.pathname || href
  } else if(href?.pathname) {
    var pathname = href.pathname
  }

  return !PREFETCH_RESTRICTED_ROUTES.some(path => pathname.startsWith(path)) 
}

export {
  shouldPrefetch
}
