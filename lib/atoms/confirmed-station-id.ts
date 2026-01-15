import { atomWithStorage } from 'jotai/utils';
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const KEY = 'confirmed-station-id'
const storage = createStorage<string>('localStorage')

let storedConfirmedStationId: string;

if (canAccessStorage('localStorage')) {
  try {
    storedConfirmedStationId = JSON.parse(window.localStorage.getItem(KEY)!)
  } catch(_error) {
    console.error('Failed to parse', KEY, 'from localStorage')
    storedConfirmedStationId = ''
  }

  // Defaulting to not confirmed
  if(!storedConfirmedStationId) {
    storedConfirmedStationId = ''
    window.localStorage.setItem(KEY, JSON.stringify(storedConfirmedStationId));
  }
} else {
  storedConfirmedStationId = ''
}

export const confirmedStationIdAtom = atomWithStorage<string>(KEY, storedConfirmedStationId, storage);
