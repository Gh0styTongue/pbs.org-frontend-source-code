import { atomWithStorage } from 'jotai/utils';

import createStorage from '@/lib/helpers/createStorage';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<boolean>('localStorage')

let storedContinuousPlay = true;
const CONTINUOUS_PLAY_STORAGE_KEY = 'continuous-play';

if (canAccessStorage('localStorage')) {
  const itemInStorage = JSON.parse(window.localStorage.getItem(CONTINUOUS_PLAY_STORAGE_KEY)!);

  if (itemInStorage !== null && itemInStorage !== undefined) {
    storedContinuousPlay = itemInStorage;
  } else {
    window.localStorage.setItem(CONTINUOUS_PLAY_STORAGE_KEY, JSON.stringify(storedContinuousPlay));
  }
}

export const continuousPlay = atomWithStorage<boolean>(CONTINUOUS_PLAY_STORAGE_KEY, storedContinuousPlay, storage);
