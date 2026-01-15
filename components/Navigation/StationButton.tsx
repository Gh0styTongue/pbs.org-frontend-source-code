// imports
import { useAtom } from 'jotai';

// lib files
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';
import { StationData } from '@/lib/types/api/stations-data';
import { stationConfirmedAtom } from '@/lib/atoms/station-confirmed';

// components
import StationLogo from '../StationLogo/StationLogo';

// svgs
import UpIcon from '@/public/svg/up.svg';
import DownIcon from '@/public/svg/down.svg';

// styles
import styles from './StationButton.module.scss';

interface StationButtonProps {
  stationData: StationData;
  className?: string;
}

const StationButton = (props: StationButtonProps) => {
  const { stationData, className} = props;

  const [navigation, setNavigation] = useAtom(navigationAtom);
  const [ _, setStationConfirmed ] = useAtom(stationConfirmedAtom);
  const isOpen = navigation === NavigationStateEnum.StationMenuOpen;

  const handleClick = () => {
    setNavigation(isOpen ? NavigationStateEnum.Default : NavigationStateEnum.StationMenuOpen);
  };

  const ariaLabel = isOpen ? 'Close Station Menu' : 'Open Station Menu';

  let classNames = styles.station_button;

  if (isOpen) {
    classNames += ` ${styles.is_open}`;
  }

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <button aria-label={ariaLabel} onClick={handleClick} className={classNames} onMouseEnter={() => setStationConfirmed(true)}>
      <StationLogo stationData={stationData} width={150} loading="eager" fetchPriority="high" />
      { isOpen ?
        <UpIcon className={styles.up_icon} /> :
        <DownIcon className={styles.down_icon} />
      }
    </button>
  );
};

export default StationButton;
