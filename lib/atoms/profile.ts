import { ProfileData } from "@/lib/types/api/profile-data"
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import CompanionState from "@/lib/types/atoms/companionState";
import createStorage from "@/lib/helpers/createStorage";
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

const storage = createStorage<ProfileData | null>('localStorage')

let storedProfile = null

if (canAccessStorage('localStorage')) {
  storedProfile = JSON.parse(window.localStorage.getItem('profile')!) as ProfileData
}

export const userProfile = atomWithStorage<ProfileData | null>('profile', storedProfile, storage);

export const userProfileStatus = atom<CompanionState>(CompanionState.NotLoaded)
