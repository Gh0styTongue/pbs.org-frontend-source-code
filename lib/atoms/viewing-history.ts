import { atomWithStorage } from 'jotai/utils';
import { ViewingHistoryItem } from '@/lib/types/api/viewing-history';
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<ViewingHistoryItem[] | null>('sessionStorage')

let storedHistory = null

if (canAccessStorage('sessionStorage')) {
  storedHistory = JSON.parse(window.sessionStorage.getItem('viewing_history')!)
}

export const percentageWatchedViewingHistoryAtom = atomWithStorage<ViewingHistoryItem[] | null>('percentageWatchedViewingHistory', storedHistory, storage);
