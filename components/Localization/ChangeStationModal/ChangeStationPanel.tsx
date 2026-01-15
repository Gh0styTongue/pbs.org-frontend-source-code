// components
import Button from '@/components/Button/Button';
import StationTile from '@/components/Localization/ChangeStationModal/StationTile';

// types
import { LocalizationServiceV3StationData } from '@/lib/types/api/stations-data';

// svgs
import MyStationIcon from '@/public/svg/my-station-white.svg';

// styles
import styles from './ChangeStationPanel.module.scss'
interface ChangeStationPanelProps {
  currentPanel: string;
  stationsList: LocalizationServiceV3StationData[];
  onChangeModalPanel: (newPanel: string) => void;
  onChangeSelectedStation: (newStation: LocalizationServiceV3StationData) => void;
  onConfirmStation: (station: LocalizationServiceV3StationData) => void;
  selectedStation: LocalizationServiceV3StationData;
}

const ChangeStationPanel = (props: ChangeStationPanelProps) => {
  const {
    currentPanel,
    selectedStation,
    stationsList,
    onChangeModalPanel,
    onChangeSelectedStation,
    onConfirmStation
  } = props;

  return (
    <div className={styles.change_station_panel}>
      <h2 className={styles.change_station_panel__header}>
        Select Your Local Station
      </h2>
      <ul className={styles.change_station_panel__stations_list}>
        {stationsList.map((stationData, index) => {
          const {
            callsign,
            city,
            state,
            common_name_full,
            station_id: stationId
         } = stationData
          return (
            <StationTile
              stationName={common_name_full}
              stationId={stationId}
              callsign={callsign}
              state={state}
              city={city}
              onChangeSelectedStation={() => onChangeSelectedStation(stationData)}
              isSelected={selectedStation.station_id === stationId}
              key={index}
            />
          );
        })}
      </ul>
      <div className={styles.change_station_panel__buttons}>
        <Button
          style="white"
          onClick={() => onConfirmStation(selectedStation)}
          size="min"
        >
          <MyStationIcon />
          {`Confirm ${selectedStation.common_name_short}`}
        </Button>
        <Button
          onClick={() => {onChangeModalPanel('station-lookup-panel')}}
          className={styles.change_station_panel__button}
          size="min"
        >
          {currentPanel === 'change-station-panel' ? "See More Stations" : "Go Back"}
        </Button>
      </div>
    </div>
  )
}

export default ChangeStationPanel;
