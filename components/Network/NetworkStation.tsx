'use client'
// imports
import { useAtom } from 'jotai'
import { useEffect } from "react"

// lib files
import { StationData } from "@/lib/types/api/stations-data";
import { stationDataAtom } from "@/lib/atoms/station-data";
import { useHasMounted } from "@/lib/hooks";

interface NetworkStationProps {
  stationData: StationData;
}

// The component isn't the same as the other network components per se -
// it doesn't actually make any network reqeusts. All it really does
// is take the stationData found in layout.tsx and set it in the stationDataAtom
// for global consumption by client components.
function NetworkStation(props: NetworkStationProps) {
  const { stationData } = props;
  const hasMounted = useHasMounted()
  const [_, setStationDataAtomValue] = useAtom(stationDataAtom)

  useEffect(() => {
    setStationDataAtomValue(stationData)
  }, [setStationDataAtomValue, stationData])

  if(!hasMounted) return null

  return (<></>)
}

export default NetworkStation
