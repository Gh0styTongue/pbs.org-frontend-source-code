'use client'

// imports
import { useState, useEffect } from 'react';

// components
import Button from '@/components/Button/Button';

// svgs
import CloseIcon from "@/public/svg/close.svg";

// types
import { LocalizationServiceV1StationData, LocalizationServiceV3StationData } from '@/lib/types/api/stations-data';
import { ChangeStationError } from './ChangeStationModal';

// lib files
import { LOCALIZATION_SERVICE } from '@/lib/constants';
import { getStateOptions } from '@/lib/helpers/utils';

// styles
import styles from './StationLookupPanel.module.scss'

interface StationLookupPanelProps {
  setSelectedStation: (newStation: LocalizationServiceV3StationData) => void;
  setStationResults: (newResults: LocalizationServiceV3StationData[]) => void;
  setModalPanel: (newPanel: string) => void;
  setDataError: (status: ChangeStationError) => void;
}

const normalizeLocalizationServiceStationData = (station: LocalizationServiceV1StationData):LocalizationServiceV3StationData => {
  const { callsign, membership_url, address, common_name_short, common_name, pbs_id } = station;
  const city = address.split(",")[0];
  const state = address.split(",")[1].trimStart();

  return {
    callsign,
    membership_url,
    city,
    state,
    common_name_short,
    common_name_full: common_name,
    station_id: pbs_id,
  };
}

const StationLookupPanel = (props: StationLookupPanelProps) => {
  const { setStationResults, setModalPanel, setDataError, setSelectedStation } = props;
  const states = getStateOptions(); // states & territories names, abbreviations
  const [zipValue, setZipValue] = useState('');
  const [invalidZip, setInvalidZip] = useState(false);
  const [stateValue, setStateValue] = useState('');
  const [invalidState, setInvalidState] = useState(false);
  const [hasSearchedByZip, setHasSearchedByZip] = useState(false);
  const [hasSearchedByState, setHasSearchedByState] = useState(false);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numerical input and limit length to 5 characters for zipcode
    if (/^\d*$/.test(value) && value.length <= 5) {
      setZipValue(value);
    }
  };

  const handleZipSearch = () => {
    if (zipValue.length < 5 ) {
      setInvalidZip(true);
    } else {
      setStateValue(''); // clear the value of the state/territory search input
      setHasSearchedByZip(true);
    }
  }

  const handleStateSearch = () => {
    if (!stateValue) {
      setInvalidState(true);
    } else {
      setZipValue(''); // clear the value of the ZIP search input
      setHasSearchedByState(true);
    }
  }

    // when user searches by ZIP, get stations for that ZIP code
    useEffect(() => {
      const getStationsByZip = async () => {
        try {
          const zipSearchUrl = `${LOCALIZATION_SERVICE}/zipcode/${zipValue}/`;
          const res = await fetch(zipSearchUrl);
          const json = await res.json();
          const stations = await json.stations;
          if (stations && stations.length > 0) {
            const normalizedStations = stations.map((station: LocalizationServiceV1StationData) => {
              return normalizeLocalizationServiceStationData(station)
            })
            setStationResults(normalizedStations);
            setSelectedStation(normalizedStations[0]);
            setModalPanel('station-results-panel');
          } else {
            setDataError('zip-error');
          }
        } catch (_error) {
          setStationResults([]);
          setDataError('zip-error');
        }
      }
      if (hasSearchedByZip) {
        getStationsByZip();
        setHasSearchedByZip(false); // reset to false to allow a subsequent ZIP search
      }
      // Only run this useEffect when hasSearchedByState changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSearchedByZip]);

    // when user searches by state/territory, get stations for that state/territory
    useEffect(() => {
      const getStationsByState = async () => {
        try {
          const stateSearchUrl = `${LOCALIZATION_SERVICE}/state/${stateValue}/`;
          const res = await fetch(stateSearchUrl);
          const json = await res.json();
          const stations = await json.stations;
          if (stations && stations.length > 0) {
            const normalizedStations = stations.map((station: LocalizationServiceV1StationData) => {
              return normalizeLocalizationServiceStationData(station)
            })
            setStationResults(normalizedStations);
            setSelectedStation(normalizedStations[0]);
            setModalPanel('station-results-panel');
          } else {
            setDataError('state-error')
          }
        } catch (_error) {
          setStationResults([]);
          setDataError('state-error')
        }
      }
      if (hasSearchedByState) {
      getStationsByState();
        setHasSearchedByState(false); // reset to false to allow a subsequent state search
      }
      // Only run this useEffect when hasSearchedByState changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSearchedByState]);

  return (
    <div className={styles.station_lookup_panel}>
      <h2 className={styles.station_lookup_panel__header}>
        Search for a Station
      </h2>
      <div className={styles.station_lookup_panel__form}>
        <div className={styles.station_lookup_panel__form__inner}>
          <input
            className={invalidZip ? styles.invalid : ''}
            onChange={handleZipChange}
            type="text"
            id="zip-input"
            name="zip"
            pattern="[0-9]{5}"
            title="5-digit ZIP code"
            placeholder="Enter ZIP Code"
            value={zipValue}
          />
          <Button
            className={styles.station_lookup_panel__button}
            onClick={() => handleZipSearch()}
            size="min"
          >
            Search ZIP Code
          </Button>
        </div>
      {invalidZip &&
        <div className={styles.invalid_message}>
          <CloseIcon />
          Please enter a valid Zip Code
        </div>
      }
      </div>
      <div className={styles.station_lookup_panel__form}>
        <div className={styles.station_lookup_panel__form__inner}>
          <select
            className={invalidState ? styles.invalid : ''}
            onChange={(e) => setStateValue(e.target.value)}
            value={stateValue}
            name="state"
            id="state-select"
          >
            <option value="">
              Select State
            </option>
            {states.map((state) => {
              return (
                <option value={state.value} key={state.value}>
                { state.name }
                </option>
              );
            })}
          </select>
          <Button
            className={styles.station_lookup_panel__button}
            onClick={() => handleStateSearch()}
            size="min"
          >
            Search State
          </Button>
        </div>
        {invalidState &&
          <div className={styles.invalid_message}>
            <CloseIcon />
            Please enter a valid State
          </div>
        }
      </div>
    </div>
  )
}

export default StationLookupPanel;
