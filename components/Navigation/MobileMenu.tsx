// imports
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useState, forwardRef, ForwardedRef } from 'react';

// lib files
import { handleSignOut } from '@/lib/helpers/handle-sign-out';
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';
import { DONATE_FALLBACK_URL, ORIGIN_STRING } from '@/lib/constants';
import { ProfileData } from '@/lib/types/api/profile-data';
import { setRedirectCookie } from '@/lib/helpers/utils';
import { ssoLogoutLink } from '@/lib/helpers/sso-links';
import { StationData } from "@/lib/types/api/stations-data";
import { useCurrentUrl, useHasMounted } from '@/lib/hooks';
import { userProfile } from '@/lib/atoms/profile';

// components
import MobileMenuButton from '@/components/Navigation/MobileMenuButton';
import NavLink  from '@/components/Navigation/NavLink';
import SignInButton from '@/components/Navigation/SignInButton';
import UserImageInitial from '@/components/Navigation/UserImageInitial';

// data
import { mobileGenreLinks } from '@/components/Navigation/nav-data';

// svgs
import BackIcon from '@/public/svg/caret-prev.svg';
import DonateIcon from '@/public/svg/donate-heart.svg';
import GearIcon from '@/public/svg/gear.svg';
import GenresIcon from '@/public/svg/genres.svg';
import LiveTVEllipse from '@/public/svg/ellipse.svg';
import MyListIcon from '@/public/svg/my-list-check-white.svg';
import MyStationIcon from '@/public/svg/my-station-white.svg';
import PassportCompass from '@/public/svg/compass-rose.svg';
import ShowsIcon from '@/public/svg/shows-white.svg';

// styles
import styles from './MobileMenu.module.scss';

interface MobileMenuGenresProps {
  onClick: () => void;
}

const MobileMenuGenres = (props: MobileMenuGenresProps) => {
  const { onClick } = props;

  return (
    <ul className={styles.genre_links}>
      {mobileGenreLinks.map((genre, index) => (
        <li key={index}>
          <NavLink
            href={genre.href}
            className={styles.mobile_menu_genre_nav_link}
            onClick={onClick}
          >
            { genre.passport && <PassportCompass className={styles.passport_compass} /> }
            {genre.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
interface MobileMenuProfileProps {
  profile: ProfileData;
}

const MobileMenuProfile = (props: MobileMenuProfileProps) => {
  const { profile } = props;
  return (
    <div className={styles.mobile_menu_profile}>
      <UserImageInitial profile={profile} />

      <div className={styles.name_sign_out}>
        <a href={`${ORIGIN_STRING}/sso/profile-link`}
          onClick={() => setRedirectCookie()}
          className={styles.profile_name}
        >
          {profile.profile?.first_name} {profile.profile?.last_name}
        </a>

        <a
          href={ssoLogoutLink}
          onClick={handleSignOut}
          className={styles.sign_out}
        >
          Sign Out
        </a>
      </div>

      <NavLink href="/settings" aria-label="Settings">
        <GearIcon className={styles.gear_icon} />
      </NavLink>
    </div>
  )
}

interface MobileMenuProps {
  profileStub?: ProfileData | null;
  stationData?: StationData;
  depIsOpen?: boolean;
  isUS: boolean;
  isSVP: boolean;
}

const MobileMenu = forwardRef(function MobileMenu(props: MobileMenuProps, ref: ForwardedRef<HTMLDivElement>) {
  const { profileStub, depIsOpen, stationData, isUS, isSVP } = props;
  const [ navigation, setNavigation ] = useAtom(navigationAtom);
  const [ profile, setProfile] = useAtom(userProfile);
  const [ genresOpen, setGenresOpen ] = useState(false);
  const isOpen = depIsOpen || navigation === NavigationStateEnum.MobileMenuOpen;
	const donate_url = stationData?.attributes.donate_url;
  const isLocalized = stationData?.id;

  const genreClickHandler = () => {
    setNavigation(NavigationStateEnum.Default)
  }

  const hasMounted = useHasMounted();

  const currentUrl = useCurrentUrl() || '';
  const baseDonateUrl = donate_url || DONATE_FALLBACK_URL;

  const donateUrl = (() => {
    try {
      const url = new URL(baseDonateUrl);
      if (currentUrl) {
        url.searchParams.set('referrer', currentUrl);
      }
      return url.toString();
    } catch {
      return baseDonateUrl;
    }
  })();

  // this weird block of code is really here for the storybook
  // we only pass `null` if we want to show the logged out state
  if (profileStub === null) {
    setProfile(null);
  } else if (profileStub) {
    setProfile(profileStub);
  }

  let classNames = `${styles.mobile_menu}`

  if (isOpen) {
    classNames += ` ${styles.is_open}`
  }

  if (genresOpen) {
    classNames += ` ${styles.genres_open}`
  }

  return (
    <div className={styles.mobile_menu_wrapper} ref={ref}>
      <MobileMenuButton />
      <nav className={classNames} >
        <div className={styles.mobile_menu_inner}>
        <div className={styles.genres_toggle}>
            { genresOpen ? (
              <button
                onClick={() => setGenresOpen(!genresOpen)}
                aria-label="Close Genres Menu"
                className={styles.back_button}
                role="button"
              >
                <BackIcon />
              </button>
            ) : (
            <GenresIcon className={styles.genres_icon} />
            )}

            <button
              onClick={() => setGenresOpen(!genresOpen)}
              className={styles.genres_button}
              role="button"
            >
            Genres
            </button>
        </div>

        <MobileMenuGenres onClick={genreClickHandler} />

        <ul className={styles.links}>
          { isUS && isLocalized && (
            <li>
              <NavLink href="/livestream/">
                <LiveTVEllipse className={styles.live_tv_icon} />
                Live TV
              </NavLink>
            </li>
          )}
          <li>
            <NavLink href="/shows/">
              <ShowsIcon className={styles.shows_icon} />
              Shows
            </NavLink>
          </li>
          { !isSVP && isLocalized && (
          <li>
            <NavLink href="/my-station/">
              <MyStationIcon className={styles.my_station_icon} />
              My Station
            </NavLink>
          </li>
          )}
          <li>
            <NavLink href="/my-list/shows/">
              <MyListIcon className={styles.my_list_icon} />
              My List
            </NavLink>
          </li>

          {	donateUrl && (
          <li className={styles.push}>
            <Link
              href={donateUrl}
              className={styles.donate_link}
              prefetch={false}
            >
              <DonateIcon className={styles.donate_icon} />
              Donate
            </Link>
          </li>
          )}

          <li className={styles.personal}>
            { profile && hasMounted ? (
              <MobileMenuProfile profile={profile}/>
            ) : (
              <SignInButton className={styles.sign_in} size="max" />
            )}
          </li>
        </ul>
        </div>
      </nav>
    </div>
  );
});

export default MobileMenu;
