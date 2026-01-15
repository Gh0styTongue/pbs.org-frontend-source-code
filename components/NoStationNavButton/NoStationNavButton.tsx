// imports
import { useAtom } from 'jotai';

// lib files
import { changeStationModalAtom } from '@/lib/atoms/change-station-modal';
import { openChangeStationModal } from '@/lib/helpers/open-change-station-modal';

// components
import Button from '@/components/Button/Button'

// styles
import styles from '@/components/NoStationNavButton/NoStationNavButton.module.scss';

function NoStationNavButton() {
  const [, setChangeStationModalOpen] = useAtom(changeStationModalAtom)

  return (
    <div className={styles.choose_station_button}>
      <Button
        style='white_ghost'
        onClick={() => openChangeStationModal(setChangeStationModalOpen)}
        className={styles.choose_station_button}
        size={'min'}
      >
        Choose Station
      </Button>
    </div>
  )
}

export default NoStationNavButton
