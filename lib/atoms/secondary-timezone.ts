import { atomWithStorage } from 'jotai/utils';
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';
import { PBSTimezones } from '@/lib/types/api/timezones';

const storage = createStorage<PBSTimezones | null>('localStorage')

let storedSecondaryTimezone

if (canAccessStorage('localStorage')) {
  storedSecondaryTimezone = JSON.parse(window.localStorage.getItem('timezoneToggle')!)
}

export const secondaryTimezone = atomWithStorage<PBSTimezones | null>('timezoneToggle', storedSecondaryTimezone, storage);
