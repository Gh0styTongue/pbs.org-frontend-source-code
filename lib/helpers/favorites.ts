import safeFetch from '@/lib/helpers/safe-fetch'

export async function addFavoriteVideo(videoCid: string) {
  return await put(`/api/profile/my-list-videos/${videoCid}/`);
}

export async function removeFavoriteVideo(videoCid: string) {
  return await httpDelete(`/api/profile/my-list-videos/${videoCid}/`);
}

export async function addFavoriteShow(showCid: string) {
  return await put(`/api/profile/my-list-shows/${showCid}/`);
}

export async function removeFavoriteShow(showCid: string) {
  return await httpDelete(`/api/profile/my-list-shows/${showCid}/`);
}

export async function removeWatchedVideo(videoCid: string) {
  return await httpDelete(`/api/profile/viewing-history/${videoCid}/`);
}

async function put(url: string) {
  return await safeFetch(url, { method: 'PUT', credentials: 'include'})
}

async function httpDelete(url: string) {
  return await safeFetch(url, { method: 'DELETE', credentials: 'include'})
}

