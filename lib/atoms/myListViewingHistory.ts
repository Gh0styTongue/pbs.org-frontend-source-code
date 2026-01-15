// NOTE: this is different from the regular `viewing-history` atom because these are complete video objects
// which we need for the My List - Viewing History page
import { atom } from 'jotai'
import { ContentServiceVideoObject } from '@/lib/types/api/content-service';
import { atomWithStorage } from 'jotai/utils';
import CompanionState from '@/lib/types/atoms/companionState';
import createStorage from '@/lib/helpers/createStorage';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<ContentServiceVideoObject[] | undefined>('sessionStorage')

let storedMyListViewingHistory = undefined

if (canAccessStorage('sessionStorage')) {
  storedMyListViewingHistory = JSON.parse(window.sessionStorage.getItem('myListViewingHistory')!) as ContentServiceVideoObject[]
}

export const myListViewingHistoryAtom = atomWithStorage<ContentServiceVideoObject[] | undefined>('myListViewingHistory', storedMyListViewingHistory, storage);
export const myListViewingHistoryStatusAtom = atom<CompanionState>(CompanionState.NotLoaded)
