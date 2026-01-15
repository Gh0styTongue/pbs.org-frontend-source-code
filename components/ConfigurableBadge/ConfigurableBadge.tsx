"use client";

// imports
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useEffect, useState } from "react";

// lib files
import { useHasMounted } from '@/lib/hooks';
import { userProfile } from '@/lib/atoms/profile';
import { StationData } from '@/lib/types/api/stations-data';

// components
import ITSImage from '@/components/ITSImage/ITSImage';
import PassportLockup from "@/components/PassportLearnMore/PassportLockup/PassportLockup";

// svgs
import NextIcon from '@/public/svg/caret-next.svg';
import CloseIcon from '@/public/svg/close.svg';

// styles
import styles from './ConfigurableBadge.module.scss';

export type ConfigurableBadgeColors =  "teal" | "yellow" | "red" | "light_blue" | undefined;
export type ConfigurableBadgeSizes = "default" | "quarter" | "half" | undefined;
interface ConfigurableBadgeProps {
  configurableBadgeShowLogoUrl: string;
  configurableBadgeShowLogoAlt: string;
  configurableBadgeCTAUrl: string;
  configurableBadgeCTAText: string;
  configurableBadgeHeadline: string;
  configurableBadgePassportCTAText: string;
  configurableBadgePassportHeadline: string;
  configurableBadgeDisplayPassportLockup: boolean;
  stationData: StationData;
  depIsPassportMember?: boolean;
  color?: ConfigurableBadgeColors;
  size?: ConfigurableBadgeSizes;
}

const ConfigurableBadge = (props: ConfigurableBadgeProps) => {
    const [profile] = useAtom(userProfile)
    const [hidden, setHidden] = useState(false);
    const hasMounted = useHasMounted();
    const {
      configurableBadgeShowLogoUrl,
      configurableBadgeShowLogoAlt,
      configurableBadgeCTAUrl,
      configurableBadgeCTAText,
      configurableBadgeHeadline,
      configurableBadgeDisplayPassportLockup,
      configurableBadgePassportCTAText,
      configurableBadgePassportHeadline,
      stationData,
      depIsPassportMember = false,
      color = "teal",
      size = "default"
    } = props;
    const isPassportMember =
      // did we pass the depIsPassportMember prop (e.g. from storybook or tests)
      depIsPassportMember ||
      // are they is_passport
      profile?.personal_data?.is_passport;
    const hideBadgeCookieAge = "604800" // expires in 7 days
    const hideBadge = () => {
      document.cookie = `hideConfigurableBadge=true; path=/; max-age=${hideBadgeCookieAge}`;
      setHidden(true);
    };

    useEffect(() => {
      if (document.cookie.includes('hideConfigurableBadge=true')) {
        setHidden(true);
      }
    }, []);

    let classes = styles.configurable_badge;

    switch(size) {
      case "quarter":
        classes = `${classes} ${styles.quarter}`;
        break
      case "half":
        classes = `${classes} ${styles.half}`;
        break
      default:
        break
    }

    let ctaText;
    let headline;

    // if the user is a PassportMember and the Passport Lockup should be displayed
    if (configurableBadgeDisplayPassportLockup && isPassportMember) {
      // use Passport-specific CTA & headlines
      ctaText = configurableBadgePassportCTAText;
      headline = configurableBadgePassportHeadline;
    } else {
      // otherwise, use the default
      ctaText = configurableBadgeCTAText;
      headline = configurableBadgeHeadline;
    }

    const shortCommonName = stationData?.attributes.short_common_name || 'PBS';

    // Checks if component is mounted OR if the badge is hidden
    // on the client before attempting to hydrate, otherwise a hydration error occurs
    if (!hasMounted || hidden) {
      return null;
    }

    return (
      <div className={`${styles.configurable_badge__wrapper} ${styles[color]}`}>
        <div className={`${classes} ${styles[color]}`}>
          <button
            className={styles.configurable_badge__close_button}
            onClick={hideBadge}
            aria-label='Close'
          >
            <CloseIcon />
          </button>
          <Link
            className={styles.configurable_badge__show_logo}
            href={configurableBadgeCTAUrl}
            >
            <ITSImage
              src={configurableBadgeShowLogoUrl}
              alt={configurableBadgeShowLogoAlt}
              width={240}
            />
          </Link>
          <span className={styles.configurable_badge__headline}>
            {headline}
            { ctaText.length > 0 && headline.length > 0 && (
              <PassportLockup
                shortCommonName={shortCommonName}
                element={"h6"}
                className={styles.passport_lockup}
              />
            )}
          </span>
          <Link
            className={styles.configurable_badge__cta}
            href={configurableBadgeCTAUrl}
            title={ctaText}>
            {ctaText}
            <NextIcon className={styles.next_icon} />
          </Link>
        </div>
      </div>
    );
};

export default ConfigurableBadge;
