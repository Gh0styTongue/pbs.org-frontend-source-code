// imports
import { useAtom } from 'jotai';
import { forwardRef, ForwardedRef } from 'react';
import Link from 'next/link';

// lib files
import { StationData } from '@/lib/types/api/stations-data';
import StationLogo from '../StationLogo/StationLogo';
import { navigationAtom, NavigationStateEnum } from '@/lib/atoms/navigation';

// components
import ChangeStationButton from '@/components/Localization/ChangeStationModal/ChangeStationButton';
import ConfirmStationPopup from '@/components/Localization/ConfirmStationPopup/ConfirmStationPopup';
import DonateLinkButton from '@/components/Button/DonateLinkButton';
import StationButton from './StationButton';
import NoStationNavButton from '../NoStationNavButton/NoStationNavButton';

// svgs
import MyStationIcon from '@/public/svg/my-station-white.svg';
import NextIcon from '@/public/svg/caret-next.svg';

// styles
import styles from './StationMenu.module.scss';
import { shouldPrefetch } from '@/lib/helpers/should-prefetch';

interface StationMenuProps {
  depIsOpen?: boolean;
  stationData?: StationData;
  isSVP: boolean;
}

const StationMenu = forwardRef(function StationMenu(props: StationMenuProps, ref: ForwardedRef<HTMLDivElement>) {
  const { depIsOpen, stationData, isSVP } = props;
  const [navigation] = useAtom(navigationAtom);
  const shortCommonName = stationData?.attributes.short_common_name;
  const stationId = stationData?.id
  const donateUrl = stationData?.attributes.donate_url;
  const stationLinks = stationData?.links;

  const isOpen = depIsOpen || navigation === NavigationStateEnum.StationMenuOpen;

  let classNames = `${styles.station_menu}`

  if (isOpen) {
    classNames += ` ${styles.is_open}`
  }

  // Don't show the station menu if SVP
  if (isSVP) {
    return null
  }

  // If the user is not localized, show the "Choose Station" button
  // and do not render mega menus
  if (!stationData) {
    return (<NoStationNavButton />)
  }

  return (
    <div className={styles.station_menu_item} ref={ref}>
      <StationButton className={styles.station_button} stationData={stationData} />
      {(shortCommonName) && (stationId) && (!isSVP) && (
        <ConfirmStationPopup shortCommonName={shortCommonName} stationId={stationId} />
      )}
      <div className={classNames}>
        <div className={styles.station_menu_inner}>
          <div className={styles.station_menu_info}>
            <h2 className={styles.station_menu_info_title}>
              PBS is brought to you by
            </h2>

            {stationData && <StationLogo stationData={stationData} className={styles.station_menu_logo} width={250}/>}

            <p className={styles.station_menu_description}>
              {shortCommonName} helps your community explore new worlds and ideas through programs that educate, inform and inspire. Your tax-deductible donation helps make it all possible.
            </p>

            {	donateUrl && (
              <DonateLinkButton
                href={donateUrl}
                className={styles.donate_highlight_cta_button}
                style='red'
                target='_blank'
                size='responsive'
                gtmEventData={{
                  feature_category: "station menu",
                  feature_name: "donate cta link",
                  object_text: `Donate to ${shortCommonName}`,
                  object_url: donateUrl,
                }}
              >
                Donate to {shortCommonName}
              </DonateLinkButton>
            )}

            <ChangeStationButton isSVP={isSVP} className={styles.station_menu_change_station_button} />

            <Link href="/my-station/" className={styles.station_menu_explore_more_link}>
              <MyStationIcon className={styles.my_station_icon}/>
              Explore more from your station
            </Link>
          </div>

          <div className={styles.station_menu_more_from_station}>
            <h2>More from {shortCommonName}</h2>

            <ul className={styles.station_menu_links}>
              {stationLinks && stationLinks.map(link => {
                return (
                  <li key={link.title}>
                    <Link
                      className={styles.station_menu_link}
                      href={link.url}
                      prefetch={shouldPrefetch(link.url)}
                    >
                      {link.title}
                      <NextIcon className={styles.next_icon}/>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StationMenu;
