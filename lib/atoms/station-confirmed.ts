import { atomWithStorage } from 'jotai/utils';
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<boolean>('localStorage')

let storedStationConfirmed: boolean;

if (canAccessStorage('localStorage')) {
  storedStationConfirmed = JSON.parse(window.localStorage.getItem('station-confirmed')!);

  // Defaulting to not confirmed
  if (!storedStationConfirmed) {
    window.localStorage.setItem('station-confirmed', JSON.stringify(false));
    storedStationConfirmed = false
  }
} else {
  storedStationConfirmed = false
}

export const stationConfirmedAtom = atomWithStorage<boolean>('station-confirmed', storedStationConfirmed, storage);
