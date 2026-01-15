'use client';

// imports
import Cookies from 'js-cookie'
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';

// lib files
import { changeStationModalAtom } from '@/lib/atoms/change-station-modal';
import { confirmedStationIdAtom } from '@/lib/atoms/confirmed-station-id';
import {
  LOCALIZATION_SERVICE,
  USER_ID_COOKIE,
} from '@/lib/constants';
import { setFavoriteStation } from '@/lib/profile';
import { useHasMounted } from '@/lib/hooks';
import { setStationCookie } from '@/lib/helpers/set-station-cookie';

// types
import { LocalizationServiceV3StationData } from '@/lib/types/api/stations-data';

// components
import ChangeStationPanel from '@/components/Localization/ChangeStationModal/ChangeStationPanel';
import ChangeStationErrorPanel from './ChangeStationErrorPanel';
import Modal from '@/components/Modal/Modal';
import StationLookupPanel from './StationLookupPanel';

// styles
import styles from './ChangeStationModal.module.scss';

type ChangeStationModalProps = {
  depIsOpen?: boolean;
  onClose?: () => void;
  handleConfirmStationClick?: (station: LocalizationServiceV3StationData) => void;
}

export type ChangeStationError = false | 'data-error' | 'zip-error' | 'state-error';

function ChangeStationModal(props: ChangeStationModalProps) {
  const { depIsOpen, onClose } = props;
  const [modalPanelOrClose, setModalPanelOrClose] = useAtom(changeStationModalAtom)
  const [_, setConfirmedStationId] = useAtom(confirmedStationIdAtom)
  const [autoLocalizedStations, setAutoLocalizedStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState<LocalizationServiceV3StationData>(autoLocalizedStations[0]);
  const [stationResults, setStationResults] = useState<LocalizationServiceV3StationData[]>([]);
  const [dataError, setDataError] = useState<ChangeStationError>(false);

  const hasMounted = useHasMounted();

  const showModal = depIsOpen || modalPanelOrClose !== false;

  // when a station is selected, set the station cookie and refresh the page
  const defaultHandleConfirmStationClick = (station: LocalizationServiceV3StationData) => {
    const pid = Cookies.get(USER_ID_COOKIE)
    const { station_id: stationId } = station;

    setStationCookie(station);
    setConfirmedStationId(stationId)

    if(pid) {
      setFavoriteStation(stationId).then(() => {
        window.location.reload();
      })
    } else {
      window.location.reload();
    }
  }

  let handleConfirmStationClick

  if (!handleConfirmStationClick) {
    handleConfirmStationClick = defaultHandleConfirmStationClick
  }

  // handler to reset the component
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setModalPanelOrClose(false);
    setSelectedStation(autoLocalizedStations[0]);
  }

  const handleChangeModalPanel = (newPanel: string) => {
    setModalPanelOrClose(newPanel)
  }

  const handleChangeSelectedStation = (newStation: LocalizationServiceV3StationData) => {
    setSelectedStation(newStation)
  }

  const handleSetStationResults = (newResults: LocalizationServiceV3StationData[]) => {
    setStationResults(newResults)
  }

  const handleError = (status: ChangeStationError) => {
    setDataError(status);
  }

  // on load, get autolocalized stations to display as options
  useEffect(() => {
    if (modalPanelOrClose === 'change-station-panel') {
      try {
        const getAutoLocalizedStations = async () => {
          const localizationUrl = `${LOCALIZATION_SERVICE}/v3/auto/`;
          const res = await fetch(localizationUrl);
          const json = await res.json();
          const stationsData = json.stations;
          setAutoLocalizedStations(stationsData);
          setSelectedStation(stationsData[0]);
          setDataError(false);
        }
        getAutoLocalizedStations();
      } catch(error) {
        console.error(error);
        setDataError('data-error')
      }
    }
  }, [modalPanelOrClose]);

  if (!hasMounted) {
    return null;
  }

  let changeStationModalPanel;

  switch (true) {
    case dataError === 'data-error':
      changeStationModalPanel = (
        <ChangeStationErrorPanel
          title="Localization is Temporarily Unavailable"
          description="We&rsquo;re having trouble displaying stations right now. Please try refreshing the page or check back shortly. We will be back online as soon as possible."
          showBackButton={false}
        />
      )
      break
    case dataError === 'zip-error':
      changeStationModalPanel = (
        <ChangeStationErrorPanel
          title="No Results Found"
          description="There are no stations available for your selected Zip Code. Please double-check and ensure you’ve entered it correctly."
          setDataError={handleError}
        />
      )
      break
    case dataError === 'state-error':
      changeStationModalPanel = (
        <ChangeStationErrorPanel
          title="No Results Found"
          description="There are no stations available for your selected state or territory. Please double-check and ensure you’ve entered it correctly."
          setDataError={handleError}
        />
      )
      break
    case modalPanelOrClose === 'change-station-panel' && autoLocalizedStations.length > 0:
      changeStationModalPanel = (
        <ChangeStationPanel
          currentPanel={modalPanelOrClose}
          selectedStation={selectedStation}
          stationsList={autoLocalizedStations}
          onChangeModalPanel={handleChangeModalPanel}
          onChangeSelectedStation={handleChangeSelectedStation}
          onConfirmStation={handleConfirmStationClick}
        />
      )
      break
    case modalPanelOrClose === 'station-lookup-panel':
      changeStationModalPanel = (
        <StationLookupPanel
          setStationResults={handleSetStationResults}
          setModalPanel={setModalPanelOrClose}
          setDataError={handleError}
          setSelectedStation={handleChangeSelectedStation}
        />
      )
      break
    case modalPanelOrClose === 'station-results-panel' && stationResults.length > 0:
      changeStationModalPanel = (
        <ChangeStationPanel
          currentPanel={modalPanelOrClose}
          selectedStation={selectedStation}
          stationsList={stationResults}
          onChangeModalPanel={handleChangeModalPanel}
          onChangeSelectedStation={handleChangeSelectedStation}
          onConfirmStation={handleConfirmStationClick}
        />
      )
      break
  }

  return (
    <Modal
      isOpen={showModal}
      className={styles.change_station_dialog}
      innerClassName={styles.change_station_dialog__inner}
      onClose={() => handleClose()}
    >
      {changeStationModalPanel}
    </Modal>
  );
}

export default ChangeStationModal;
