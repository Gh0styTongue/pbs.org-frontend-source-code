// types
import CompanionState from '@/lib/types/atoms/companionState';

// imports
import { useAtom } from 'jotai';
import { forwardRef, ForwardedRef, useState, useEffect } from 'react';

// lib files
import { StationData } from '@/lib/types/api/stations-data';
import { useHasMounted } from '@/lib/hooks';
import { userProfile, userProfileStatus } from '@/lib/atoms/profile';
import {  navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';

// components
import SignInButton from '@/components/Navigation/SignInButton';
import SignInMenu from '@/components/Navigation/SignInMenu';
import UserImageInitial from '@/components/Navigation/UserImageInitial';
import UserMenu from '@/components/Navigation/UserMenu';

// svgs
import CloseIcon from '@/public/svg/close.svg';

// styles
import styles from '@/components/Navigation/SignInOrProfile.module.scss';

interface SignInOrProfileProps {
  isSVP: boolean;
  stationData?: StationData;
}

const SignInOrProfile = forwardRef(function SignInOrProfile(props: SignInOrProfileProps, ref: ForwardedRef<HTMLDivElement>) {
  const { isSVP, stationData } = props;
  const hasMounted = useHasMounted();

  const [profileStatus] = useAtom(userProfileStatus)
  const [profile] = useAtom(userProfile)
  const defaultClassName = isSVP ? styles.sign_in_or_profile_svp : styles.sign_in_or_profile;
  const [classNames, setClassNames] = useState(`${defaultClassName} ${styles.loading}`);

  const [navigation, setNavigation] = useAtom(navigationAtom);
  const userMenuIsOpen = navigation === NavigationStateEnum.UserMenuOpen;

  const handleClick = () => {
    setNavigation(userMenuIsOpen ? NavigationStateEnum.Default : NavigationStateEnum.UserMenuOpen);
  }

  const ariaLabel = userMenuIsOpen ? 'Close User Menu' : 'Open User Menu';

  const isLoading = profileStatus === CompanionState.IsLoading

  useEffect(() => {
    const isReady = hasMounted && !isLoading
    const hasProfile = profile !== null

    switch (true) {
      case isReady && hasProfile && userMenuIsOpen:
        setClassNames(`${defaultClassName} ${styles.profile} ${styles.user_menu_is_open}`);
        break;
      case isReady && hasProfile:
        setClassNames(`${defaultClassName} ${styles.profile}`);
        break;
      case isReady && !hasProfile:
        setClassNames(`${defaultClassName} ${styles.sign_in}`);
        break;
      default:
        setClassNames(`${defaultClassName} ${styles.loading}`);
        break;
    }
  }, [profile, isLoading, hasMounted, defaultClassName, userMenuIsOpen]);

  return (
    <div className={classNames} ref={ref}>
      {(!hasMounted || isLoading) ? null : (
      <>
        { profile ? (
        <>
          <button aria-label={ariaLabel} onClick={handleClick} className={styles.user_button}>
            <CloseIcon className={styles.close_icon} aria-hidden={true} />
            <UserImageInitial profile={profile} className={styles.user_image_inital} />
          </button>
          <UserMenu className={styles.user_menu} profile={profile} />
        </>
        ) : (
        <>
          <SignInButton size="min" />
          <SignInMenu stationData={stationData} className={styles.sign_in_menu}/>
        </>
        )
        }
      </>
      )}
    </div>
  );
});

export default SignInOrProfile;
