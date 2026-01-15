// imports
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

// lib files
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';

// components
import NavLink from '@/components/Navigation/NavLink';

// styles
import styles from './SearchButtonLink.module.scss';

interface SearchButtonLinkProps {
  linkClassName?: string;
}

const SearchButtonLink = (props: SearchButtonLinkProps) => {
  const { linkClassName } = props;

  const [navigation, setNavigation] = useAtom(navigationAtom);
  const isOpen = navigation === NavigationStateEnum.SearchMenuOpen;

  // in order to handle the transition delays the way we need,
  // we need three states for the button: default, open, closed
  const [buttonState, setButtonState] = useState('default');

  const handleClick = () => {
    setNavigation(isOpen ? NavigationStateEnum.Default : NavigationStateEnum.SearchMenuOpen);
    setButtonState(isOpen ? 'closed' : 'open');
  };

  useEffect(() => {
    if (isOpen) {
      setButtonState('open');
    } else {
      setButtonState('closed');
    }
  }, [isOpen]);

  const ariaLabel = isOpen ? 'Close Search Menu' : 'Open Search Menu';

  let classNames = styles.search_button;

  if (isOpen) {
    classNames += ` ${styles.is_open}`;
  }

  if (buttonState === 'closed') {
    classNames += ` ${styles.is_closed}`;
  }

  const searchIcon = (
    <div className={styles.search_icon} aria-hidden={true}>
      <div className={styles.circle}></div>
      <div className={styles.line_1}></div>
      <div className={styles.line_2}></div>
      <div className={styles.line_3}></div>
    </div>
  );

  return (
    <>
      {/* // button */}
      <button aria-label={ariaLabel} role="button" onClick={handleClick} className={classNames}>
        {searchIcon}
      </button>

      {/* // link on :hover & above md */}
      <NavLink href="/search/" className={`${styles.search_link} ${linkClassName}`}>
        <span className="visuallyhidden">Search</span>
        {searchIcon}
      </NavLink>
    </>
  );
};

export default SearchButtonLink;
