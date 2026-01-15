import { ORIGIN_STRING } from '@/lib/constants';
import { featureFlags } from '@/lib/feature-flags';
import { SocialLogin } from '@/lib/types/sso/login';
import { isEmpty } from '@/lib/helpers/empty';

/*
 * These prefix bits are to support the transition from /sso/login style to
 * /session/login/ where the top level route is different AND has a trailing slash
 */

const NEXT_SESSION_ROUTE_ENABLED = process.env.NEXT_PUBLIC_SESSION_ROUTE_ENABLED ? process.env.NEXT_PUBLIC_SESSION_ROUTE_ENABLED === 'true' : false

const NEXT_PREFIX = 'session'
const DJANGO_PREFIX = 'sso'

const PREFIX = (featureFlags.NEXT_SSO_ENABLED && NEXT_SESSION_ROUTE_ENABLED) ? NEXT_PREFIX : DJANGO_PREFIX
const TRAILING_SLASH = (featureFlags.NEXT_SSO_ENABLED && NEXT_SESSION_ROUTE_ENABLED) ? '/' : ''

const ssoLink = (path: string) => `${ORIGIN_STRING}/${PREFIX}/${path}${TRAILING_SLASH}`
const ssoBarePath = (path: string) => `/${PREFIX}/${path}${TRAILING_SLASH}`

const ssoProfileLink = ssoLink('profile-link')

const ssoLogoutLink = ssoLink('logout')
const ssoLogoutPath = ssoBarePath('logout')
const ssoResolvePath = ssoBarePath('resolve')
const ssoLoginCompletePath = ssoBarePath('login-complete')
const ssoLoginPath = ssoBarePath('login')

interface LoginLinkParams {
  activation?: boolean,
  social?: SocialLogin,
  forcePrompt?: boolean
}

const ssoLoginLink = ({ activation , social, forcePrompt }: LoginLinkParams) => {
  const searchParams = new URLSearchParams()

  // If we're operating locally with DJANGO sign in we still need next_dev set.
  if (process.env.NODE_ENV === 'development' && !featureFlags.NEXT_SSO_ENABLED) {
    searchParams.set('next_dev', 'true');
  }

  if(activation) {
    searchParams.set('activation', 'true');
  }

  if(social) {
    searchParams.set('social', social);
  }

  if(forcePrompt) {
    searchParams.set('prompt', 'true')
  }

  const params = searchParams.toString()

  if(isEmpty(params)) {
    return ssoLink('login')
  }

  return `${ssoLink('login')}?${params}`
}

const ssoRegisterLink = ({ activation }: { activation: boolean }) => {
  const searchParams = new URLSearchParams()

  if(activation) {
    searchParams.set('activation', 'true');
  }

  const params = searchParams.toString()

  if(isEmpty(params)) {
    return ssoLink('register')
  }

  return `${ssoLink('register')}?${params.toString()}`
}

export {
  ssoProfileLink,
  ssoRegisterLink,
  ssoLoginLink,
  ssoLogoutLink,
  ssoLogoutPath,
  ssoResolvePath,
  ssoLoginCompletePath,
  ssoLoginPath
}
