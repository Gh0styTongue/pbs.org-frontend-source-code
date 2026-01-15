'use client'

// components
import StationLogo from '@/components/StationLogo/StationLogo';

// lib files
import { useState, useCallback } from 'react';
import useDidMount from '@/lib/hooks/useDidMount';

// types
import { StationData } from '@/lib/types/api/stations-data';

// styles
import styles from './StationTile.module.scss'

interface StationTileProps {
  stationId: string;
  stationName: string;
  callsign: string;
  state: string;
  city: string;
  onChangeSelectedStation: () => void;
  isSelected: boolean;
}

const StationTile = (props: StationTileProps) => {
  const { stationName, stationId, callsign, state, city, onChangeSelectedStation, isSelected } = props;
  const [stationData, setStationData] = useState<StationData>();

  const fetchStationData = useCallback(async () => {
    const response = await fetch(`/api/station/${stationId}/stations-list/`)
    const json = await response.json();
    setStationData(json.stationData);
  }, [stationId])

  useDidMount(fetchStationData)

  return (
    <li className={styles.station_tile} key={callsign}>
      <button
        className={styles.station_tile__button}
        onClick={() => onChangeSelectedStation()}
        aria-pressed={isSelected}
        aria-label={`Select station ${stationName}`}
      >
        { stationData &&
        <StationLogo 
          stationData={stationData}
          className={styles.station_tile__logo}
          loading="eager"
        />}
        <div className={styles.station_tile__info}>
          <span>{stationName}</span>
          <span className={styles.station_tile__location}>
            {`${city}, ${state}`}
          </span>
        </div>
      </button>
    </li>
  )
}

export default StationTile;
