import { ContinueWatchingContent } from '@/lib/types/api/home-data';
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import CompanionState from '@/lib/types/atoms/companionState';

import createStorage from '@/lib/helpers/createStorage';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<ContinueWatchingContent[] | null>('sessionStorage')

let storedContinueWatching = null

if (canAccessStorage('sessionStorage')) {
  const storageItem = window.sessionStorage.getItem('continueWatching');
  if (storageItem !== null && storageItem !== 'null' && storageItem !== 'undefined') {
    storedContinueWatching = JSON.parse(storageItem) as ContinueWatchingContent[]
  }
}

export const continueWatchingAtom = atomWithStorage<ContinueWatchingContent[] | null>('continueWatching', storedContinueWatching, storage);
export const continueWatchingStatusAtom = atom<CompanionState>(CompanionState.NotLoaded)
