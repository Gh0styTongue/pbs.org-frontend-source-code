import { useAtom } from 'jotai';
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';

import styles from './MobileMenuButton.module.scss';

const MobileMenuButton = () => {
  const [navigation, setNavigation] = useAtom(navigationAtom);
  const isOpen = navigation === NavigationStateEnum.MobileMenuOpen;

  const handleClick = () => {
    setNavigation(isOpen ? NavigationStateEnum.Default : NavigationStateEnum.MobileMenuOpen);
  };

  const ariaLabel = isOpen ? 'Close Main Menu' : 'Open Main Menu';

  let classNames = styles.mobile_menu_button;

  if (isOpen) {
    classNames += ` ${styles.is_open}`;
  }

  return (
    <button aria-label={ariaLabel} role="button" onClick={handleClick} className={classNames}>
      <div aria-hidden="true" className={styles.hamburger}>
        <span className={styles.hamburger_line}></span>
        <span className={styles.hamburger_line}></span>
        <span className={styles.hamburger_line}></span>
        <span className={styles.hamburger_line}></span>
      </div>
    </button>
  );
};

export default MobileMenuButton;
