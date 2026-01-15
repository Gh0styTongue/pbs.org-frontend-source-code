import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import CompanionState from '@/lib/types/atoms/companionState';
import createStorage from '@/lib/helpers/createStorage';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';
import { VideoClass } from '@/lib/types/api/video';

const storage = createStorage<VideoClass[] | undefined>('sessionStorage')

let storedMyListVideos = undefined

if (canAccessStorage('sessionStorage')) {
  storedMyListVideos = JSON.parse(window.sessionStorage.getItem('myListVideos')!) as VideoClass[]
}

export const myListVideosAtom = atomWithStorage<VideoClass[] | undefined>('myListVideos', storedMyListVideos, storage);
export const myListVideosStatusAtom = atom<CompanionState>(CompanionState.NotLoaded)
