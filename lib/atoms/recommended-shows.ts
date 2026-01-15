import { ShowRowContent } from '@/lib/types/api/show-data';
import { atomWithStorage } from 'jotai/utils';
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<ShowRowContent[] | null>('localStorage')

let storedRecommendedShows = null

if (canAccessStorage('localStorage')) {
  storedRecommendedShows = JSON.parse(window.localStorage.getItem('recommendedShows')!) as ShowRowContent[]
}

export const recommendedShowsAtom = atomWithStorage<ShowRowContent[] | null>('recommendedShows', storedRecommendedShows, storage);
