'use client'

// imports
import Link from 'next/link';
import Image from 'next/image';

// lib files
import { DONATE_FALLBACK_URL, DONATE_OBJECT_NAME } from '@/lib/constants';
import { sendPbsGtmEvent } from '@/lib/helpers/send-pbs-gtm-event';
import { StationData } from "@/lib/types/api/stations-data";
import { useCurrentUrl } from '@/lib/hooks';

// components
import DonateLinkButton from '@/components/Button/DonateLinkButton';
import ITSImage from '@/components/ITSImage/ITSImage';

// svgs
import DonateIcon from '@/public/svg/donate-heart.svg';

// styles
import styles from './DonateMenuItem.module.scss';

// Static SVG for Image component with lazy loading
import DONATE_ILLUSTRATION_URL from '@/public/staticsvg/woman-with-plant.svg';

interface DonateMenuItemProps {
  stationData: StationData;
  className: string;
}

const DonateMenuItem = (props: DonateMenuItemProps) => {
  const { stationData, className } = props;
  const { attributes } = stationData;

  const {
    donate_url,
    short_common_name,
    images,
  } = attributes;

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

  const stationLogo = images.find((image) => image.profile === 'white-cobranded-logo');
  const stationLogoSrc = stationLogo?.url;

  return (
    <li className={`${className} ${styles.donate_menu_item}`}>
      <Link
        href={donateUrl}
        prefetch={false}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.donate_link}
        onClick={() => {
          sendPbsGtmEvent({
            feature_category: "utility nav donate link",
            feature_name: "utility nav donate link",
            object_name: DONATE_OBJECT_NAME,
            object_text: "Donate",
            object_type: "link",
            object_action: "click",
            object_action_behavior: "send user to link donate url",
            object_url: donateUrl,
        })}}
      >
        <DonateIcon className={styles.donate_icon} />
        Donate
      </Link>

      <div className={styles.donate_menu}>
        <div className={styles.donate_menu_inner}>

          { stationLogoSrc && (
            <ITSImage
              src={stationLogoSrc}
              alt={short_common_name}
              className={styles.donate_station_logo}
              width={165}
            />
          )}

          <p className={styles.donate_menu_intro}>
          Support your local PBS station in our mission to inspire, enrich, and educate.
          </p>

          <DonateLinkButton
            href={donateUrl}
            style="red"
            target="_blank"
            size="max"
            gtmEventData={{
              feature_category: "donate menu item",
              feature_name: "donate menu item link",
              object_text: `Donate to ${short_common_name}`,
              object_url: donateUrl,
            }}
          >
            Donate to {short_common_name}
          </DonateLinkButton>

          <Image
            src={DONATE_ILLUSTRATION_URL}
            alt=""
            width={285}
            height={223}
            className={styles.donate_illustration}
            aria-hidden="true"
          />
        </div>
      </div>
    </li>
  );
};

export default DonateMenuItem;
