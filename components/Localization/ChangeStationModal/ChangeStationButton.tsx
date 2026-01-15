'use client'

// imports
import { useAtom } from 'jotai';

// lib files
import { changeStationModalAtom } from '@/lib/atoms/change-station-modal';
import { INTERNALLY_NAVIGATING_KEY } from '@/lib/constants';
import { openChangeStationModal } from '@/lib/helpers/open-change-station-modal';

// svgs
import GearIcon from '@/public/svg/gear.svg';

// styles
import styles from './ChangeStationButton.module.scss'
import { useEffect, useState } from 'react';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

interface ChangeStationButtonProps {
  isSVP: boolean;
  className?: string;
  showOnlyOnFirstNavigation?: boolean;
}

const ChangeStationButton = (props: ChangeStationButtonProps) => {
  const { isSVP, className, showOnlyOnFirstNavigation = false } = props;
  const [_, setChangeStationModalOpen] = useAtom(changeStationModalAtom)
  const [isInternallyNavigating, setIsInternallyNavigating] = useState(false);

  useEffect(() => {
    if(canAccessStorage('sessionStorage')) {
      setIsInternallyNavigating(sessionStorage.getItem(INTERNALLY_NAVIGATING_KEY) === 'true')
    }
  }, [])

  // Only show the change station button when it's pbs.org
  let showChangeStationButton = !isSVP;

  // And if the showOnlyOnFirstNavigation prop is true
  // also check that the user is not internally navigating
  if (showOnlyOnFirstNavigation) {
    showChangeStationButton = !isSVP && !isInternallyNavigating;
  }

  let classNames = `${styles.change_station_button}`

  if (className) {
    classNames += ` ${className}`;
  }

  if(showChangeStationButton) {
    return(
      <button
      onClick={() => openChangeStationModal(setChangeStationModalOpen)}
      className={classNames}
    >
      <GearIcon className={styles.gear_icon} />
      Change your local station
    </button>
    )
  }

  return null
}

export default ChangeStationButton;
