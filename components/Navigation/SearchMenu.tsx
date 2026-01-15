// imports
import { useAtom } from 'jotai';
import { forwardRef, ForwardedRef } from 'react';

// lib files
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';

// components
import SearchButtonLink from '@/components/Navigation/SearchButtonLink';

// svgs
import SearchIcon from '@/public/svg/magnifying-glass.svg';

// styles
import styles from './SearchMenu.module.scss';

interface SearchMenuProps {
  depIsOpen?: boolean;
}

const SearchMenu = forwardRef(function SearchMenu(props: SearchMenuProps, ref: ForwardedRef<HTMLDivElement>) {
  const { depIsOpen } = props;
  const [ navigation ] = useAtom(navigationAtom);

  const isOpen = depIsOpen || navigation === NavigationStateEnum.SearchMenuOpen;

  let classNames = `${styles.search_menu}`

  if (isOpen) {
    classNames += ` ${styles.is_open}`
  }

  return (
    <div className={styles.search_menu_wrapper} ref={ref}>
      <SearchButtonLink linkClassName={styles.search_link} />

      <div className={classNames}>
        <div className={styles.search_menu_inner}>
          <form action="/search/" className={styles.search_form}>
            <input
              type="search"
              aria-label="Search PBS"
              autoComplete="off"
              placeholder="Search"
              name="q"
              className={styles.search_input}
            />
            <button type="submit" aria-label="Go" className={styles.search_submit_button}>
              <SearchIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

});

export default SearchMenu;
