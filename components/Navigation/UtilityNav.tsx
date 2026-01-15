// imports
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// lib files
import { getBestStationWhiteLogo } from '@/lib/helpers/get-best-station-white-logo';
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';
import { StationData } from "@/lib/types/api/stations-data";
import { useOutsideClick } from '@/lib/hooks/useOutsideClick';

// components
import DonateMenuItem from '@/components/Navigation/DonateMenuItem';
import ITSImage from '@/components/ITSImage/ITSImage';
import MobileMenu from '@/components/Navigation/MobileMenu';
import MyListMenuItem from '@/components/Navigation/MyListMenuItem';
import NavLink  from '@/components/Navigation/NavLink';
import SignInOrProfile from '@/components/Navigation/SignInOrProfile';
import SearchMenu from '@/components/Navigation/SearchMenu';
import SearchMenuAutocomplete from '@/components/Navigation/SearchMenuAutocomplete';
import StationMenu from '@/components/Navigation/StationMenu';

// svgs
import LiveTVEllipse from '@/public/svg/ellipse.svg';
import MyStationIcon from '@/public/svg/my-station-white.svg';
import PBSLogotype from '@/public/svg/pbs-logotype-white--blue-fill-face.svg';
import PBSPatrioticLogo from '@/public/svg/pbs_patriotic_logo.svg';
import ShowsIcon from '@/public/svg/shows-white.svg';

// styles
import styles from '@/components/Navigation/UtilityNav.module.scss';

interface UtilityNavProps {
  stationData?: StationData;
  isSVP: boolean;
  isUS: boolean;
  atTop: boolean;
  isPBSPatrioticLogoEnabled?: boolean;
  searchAutocompleteEnabled?: boolean;
}

const getActiveClassName = (currentPathname: string, linkUrl: string): string => {
  return currentPathname.startsWith(linkUrl) ? styles.utility_nav_link_active : '';
}

const UtilityNav = (props: UtilityNavProps) => {
  const { stationData, isSVP, isUS, atTop, isPBSPatrioticLogoEnabled = false, searchAutocompleteEnabled = false } = props;

  const [ _, setNavigation ] = useAtom(navigationAtom);

  const isLocalized = stationData?.id;

  const className = atTop ? `${styles.utility_nav}` : `${styles.utility_nav} ${styles.utility_nav__scrolled}`;

  const pathname = usePathname();

  // this closes the menu on any path change (e.g. navigation)
  // regardless of it's in the menu or on the page
  useEffect(() => {
    setNavigation(NavigationStateEnum.Default);
  }, [pathname, setNavigation]);

  // The following bit provides refs for the various
  // sub menus so we can close them when clicking outside any of them
  const closeMenus = () => {
    setNavigation(NavigationStateEnum.Default);
  }

  const searchMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const stationMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const refs = [searchMenuRef, mobileMenuRef, stationMenuRef, userMenuRef];

  useOutsideClick(refs, closeMenus);

  let homeLinkClassName = `${styles.home_link}`;

  if (isSVP) {
    homeLinkClassName += ` ${styles.svp_home_link}`;
  }

  const stationLogo = stationData && getBestStationWhiteLogo(stationData.attributes.images);

  let logoToShow = null;

  switch(true) {
    case isSVP === true && stationLogo !== undefined:
      logoToShow =
        (<ITSImage
            src={stationLogo}
            alt={stationData?.attributes?.short_common_name || 'PBS'}
            loading="eager"
            width={170}
            className={styles.svp_station_logo}
          />)
      break;
    case isSVP === false && isPBSPatrioticLogoEnabled === true:
      logoToShow =
        (<PBSPatrioticLogo className={styles.pbs_head_logo} />);
      break;
    default:
      logoToShow =
        (<PBSLogotype className={styles.pbs_head_logo} />);
  }

  return (
    <nav className={className}>
      <NavLink href={'/'} className={homeLinkClassName}>
        { logoToShow }
      </NavLink>

      <ul className={styles.utility_nav_links}>
        { isUS && isLocalized && (
          <li className={getActiveClassName(pathname, "/livestream/")}>
            <NavLink href="/livestream/">
              <LiveTVEllipse className={styles.live_tv_icon} />
              Live TV
            </NavLink>
          </li>
        )}

        <li className={getActiveClassName(pathname, "/shows/")}>
          <NavLink href="/shows/">
            <ShowsIcon className={styles.shows_icon} />
            Shows
          </NavLink>
        </li>

        { !isSVP && isLocalized && (
          <li className={getActiveClassName(pathname, "/my-station/")}>
            <NavLink href="/my-station/">
              <MyStationIcon className={styles.my_station_icon} />
              My Station
            </NavLink>
          </li>
        )}

        <MyListMenuItem className={getActiveClassName(pathname, "/my-list/shows/")}/>

        { stationData?.attributes.donate_url && (
          <DonateMenuItem stationData={stationData} className={styles.push} />
        )}
      </ul>

      <StationMenu ref={stationMenuRef} stationData={stationData} isSVP={isSVP} />

      <SignInOrProfile ref={userMenuRef} isSVP={isSVP} stationData={stationData} />
      { searchAutocompleteEnabled ?
      <SearchMenuAutocomplete ref={searchMenuRef} stationId={stationData?.id} /> :
      <SearchMenu ref={searchMenuRef} />
      }

      <MobileMenu ref={mobileMenuRef} stationData={stationData} isUS={isUS} isSVP={isSVP} />
    </nav>
  );
}

export default UtilityNav;
