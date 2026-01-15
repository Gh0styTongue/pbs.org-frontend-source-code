import { atom } from 'jotai';
import { StationData } from "@/lib/types/api/stations-data";

export const stationDataAtom = atom<StationData | undefined>(undefined);
