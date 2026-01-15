// lib files
import { ORIGIN_STRING } from '@/lib/constants';
import { setRedirectCookie } from '@/lib/helpers/utils';
import { handleSignOut } from '@/lib/helpers/handle-sign-out';
import { ProfileData } from '@/lib/types/api/profile-data';

// components
import NavLink  from '@/components/Navigation/NavLink';

// svgs
import GearIcon from '@/public/svg/gear.svg';
import UserIcon from '@/public/svg/user.svg';
import PassportCompass from '@/public/svg/compass-rose.svg';


// styles
import styles from './UserMenu.module.scss';
import { ssoLogoutLink } from '@/lib/helpers/sso-links';

interface UserMenuProps {
  className: string;
  profile: ProfileData;
}

const UserMenu = (props: UserMenuProps) => {
  const { className, profile } = props;

  return (
    <div className={`${className} ${styles.user_menu}`}>
      <div className={styles.user_menu_inner}>
        <a
          href={`${ORIGIN_STRING}/sso/profile-link`}
          onClick={() => setRedirectCookie()}
          className={styles.profile_name}
        >
          <UserIcon className={styles.user_icon} /> Profile
        </a>

        <NavLink href="/settings">
          <GearIcon className={styles.gear_icon} /> Site Settings
        </NavLink>

        {profile.personal_data.is_passport && (
          <NavLink href="/explore/passport">
            <PassportCompass /> Best of PBS Passport
          </NavLink>
        )}

        <a
          href={ssoLogoutLink}
          onClick={handleSignOut}
          className={styles.sign_out}
        >
          Sign Out
        </a>
      </div>
    </div>
  );
};

export default UserMenu;
