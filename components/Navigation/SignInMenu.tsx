// imports
import { StationData } from '@/lib/types/api/stations-data';

// styles
import styles from './SignInMenu.module.scss';

interface SignInMenuProps {
  stationData?: StationData;
  className: string;
}

const SignInMenu = (props: SignInMenuProps) => {
  const { stationData, className } = props;

  const stationName = stationData?.attributes?.short_common_name || 'your station';

  return (
    <div className={`${className} ${styles.sign_in_menu}`}>
      <div className={styles.sign_in_menu_inner}>
        Sign in to keep track of what you watch, save appearance settings, and access {stationName} Passport benefits.
      </div>
    </div>
  );
};

export default SignInMenu;
