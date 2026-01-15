'use client'

// imports
import { useAtom } from 'jotai';

// lib files
import { userProfile } from '@/lib/atoms/profile';
import { useHasMounted } from '@/lib/hooks';

// components
import NavLink from '@/components/Navigation/NavLink';
import SignInButton from '@/components/Navigation/SignInButton';

// svgs
import MyListIcon from '@/public/svg/my-list-check-white.svg';

// styles
import styles from './MyListMenuItem.module.scss';

interface MyListMenuItemPropType {
  className?: string;
}

const MyListMenuItem = (props: MyListMenuItemPropType) => {
  const hasMounted = useHasMounted();
  const [profile] = useAtom(userProfile);
  const { className } = props;

  const showMyListMenu = !profile && hasMounted;

  let classNames = styles.my_list_menu_item;

  if (showMyListMenu) {
    classNames += ` ${styles.has_drop_down}`;
  }

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <li className={classNames}>
      <NavLink href="/my-list/" className={styles.my_list_link}>
        <MyListIcon className={styles.my_list_icon} />
        My List
      </NavLink>

      { showMyListMenu && (
        <div className={styles.my_list_menu}>
          <div className={styles.my_list_menu_inner}>
            <p className={styles.my_list_menu_intro}>
            Sign in to save your favorite shows and dive back in right where you left off.
            </p>

            <SignInButton size="max" />
          </div>
        </div>
      )}
    </li>
  );
};

export default MyListMenuItem;
