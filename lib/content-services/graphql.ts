import safeFetch from "@/lib/helpers/safe-fetch";
import { CONTENT_SERVICE_HOST } from "@/lib/constants";

export const contentServicesGraphql = `${CONTENT_SERVICE_HOST}/graphql/`;

export type GraphQLPlatformType = 'pbsorg' | 'svp'

export interface GraphQLOptions {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any>;
  userId?: string;
  stationId?: string;
  platform: GraphQLPlatformType
}

interface FetchOptions {
  abortController?: AbortController
}

async function graphql(options: GraphQLOptions, fetchOptions?: FetchOptions) {
  const { query, variables, platform } = options

  const headers: HeadersInit ={
    'Content-Type': 'application/json',
    'X-PBS-Platform': platform,
    'X-PBS-Platform-Version': '1.0'
  }

  // we should check for user id first;
  // if it does not exist, we should check for station id.
  // cs graphql will accept only one of these at a time.
  if(options.userId) {
    headers['X-PBS-User-Id'] = options.userId
  } else if(options.stationId) {
    headers['X-PBS-Station-Id'] = options.stationId
  }

  const body = JSON.stringify({ query, variables })

  const fetchInit: RequestInit = {
    method: 'POST',
    headers,
    body
  }

  if(fetchOptions?.abortController) {
    fetchInit.signal = fetchOptions.abortController.signal
  }

  const response = await safeFetch(contentServicesGraphql, fetchInit)

  return await response.json()
}

export default graphql
