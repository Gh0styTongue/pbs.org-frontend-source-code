'use client'

// imports
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// lib files
import { changeStationModalAtom } from '@/lib/atoms/change-station-modal';
import { stationConfirmedAtom } from '@/lib/atoms/station-confirmed';
import { confirmedStationIdAtom } from '@/lib/atoms/confirmed-station-id';
import { useHasMounted } from '@/lib/hooks';
import { openChangeStationModal } from '@/lib/helpers/open-change-station-modal';

// constants
import { STATION_ID_COOKIE } from '@/lib/constants';

// svgs
import LocationIcon from '@/public/svg/location.svg';

// styles
import styles from './ConfirmStationPopup.module.scss';

interface ConfirmStationPopupProps {
  shortCommonName: string;
  stationId: string;
}

const ConfirmStationPopup = (props: ConfirmStationPopupProps) => {
  const { shortCommonName, stationId } = props;
  const [isChangeStationModalOpen, setChangeStationModalOpen] = useAtom(changeStationModalAtom);
  const [stationConfirmed, setStationConfirmed] = useAtom(stationConfirmedAtom);
  const [confirmedStationId, setConfirmedStationId] = useAtom(confirmedStationIdAtom)
  const hasMounted = useHasMounted();

  const currentStationId = Cookies.get(STATION_ID_COOKIE);

  // we need a static piece of state that doesn't change with stationConfirmed.
  // this prevents a flash of the popup once someone has confirmed,
  // but still lets us toggle stationConfirmed, which is what we need for the animation
  const [shouldDisplay, setShouldDisplay] = useState(!stationConfirmed);

  const handleDocumentAction = useCallback(() => {
    setStationConfirmed(true);
    setConfirmedStationId(stationId)
    setShouldDisplay(false);
  }, [stationId, setStationConfirmed, setConfirmedStationId, setShouldDisplay])

  // Dismiss the popup if the user scrolls or clicks on anything on the page.
  // This includes the popup itself - as you will be clicking the change
  // station button, which opens the change station modal, which hides this anyway
  useEffect(() => {
    if(!stationConfirmed || (confirmedStationId !== currentStationId)) {
      document.addEventListener('click', handleDocumentAction);
      document.addEventListener('scroll', handleDocumentAction);

      return () => {
        document.removeEventListener('click', handleDocumentAction);
        document.removeEventListener('scroll', handleDocumentAction);
      };
    }
  }, [handleDocumentAction, stationConfirmed, confirmedStationId, currentStationId]);

  useEffect(() => {
    if(stationConfirmed && (confirmedStationId !== currentStationId)) {
      // reconfirm
      setShouldDisplay(true)
      setStationConfirmed(false)
    }
  }, [stationConfirmed, confirmedStationId, currentStationId, setShouldDisplay, setStationConfirmed])

  if (isChangeStationModalOpen || !hasMounted || !shouldDisplay) {
    return null;
  }

  return (
    <div className={styles.confirm_station_popup} hidden={stationConfirmed}>
      <span className={styles.confirm_station_name}>{shortCommonName} is your local station.</span>

      <button
        onClick={() => openChangeStationModal(setChangeStationModalOpen)}
        className={styles.change_station_button}
      >
        <LocationIcon className={styles.location_icon} />
        Change
      </button>
    </div>
  );
};

export default ConfirmStationPopup;
