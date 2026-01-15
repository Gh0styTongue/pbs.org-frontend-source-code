import { atom } from 'jotai';
import { ShowRowContent, ShowDetails } from '../types/api/show-data';
import { atomWithStorage } from 'jotai/utils';
import CompanionState from '@/lib/types/atoms/companionState';
import createStorage from '@/lib/helpers/createStorage';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<(ShowRowContent | ShowDetails)[] | undefined>('sessionStorage')

let storedMyListShows = undefined

if (canAccessStorage('sessionStorage')) {
  const storageItem = window.sessionStorage.getItem('myListShows');
  if (storageItem !== null && storageItem !== 'null' && storageItem !== 'undefined') {
    storedMyListShows = JSON.parse(storageItem) as ShowRowContent[]
  }
}

export const myListShowsAtom = atomWithStorage<(ShowRowContent | ShowDetails)[] | undefined>('myListShows', storedMyListShows, storage);
export const myListShowsStatus = atom<CompanionState>(CompanionState.NotLoaded)
