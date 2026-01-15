'use client'
// imports
import { useAtom } from 'jotai';

// lib files
import { DONATE_FALLBACK_URL } from '@/lib/constants';
import { userProfile } from '@/lib/atoms/profile';
import { stationDataAtom } from '@/lib/atoms/station-data';

// components
import DonateLinkButton from '@/components/Button/DonateLinkButton';

// styles
import styles from './PassportHoverOverlay.module.scss';

interface PassportHoverOverlayProps {
  className: string;
}

const PassportHoverOverlay = (props: PassportHoverOverlayProps) => {
  const { className } = props;
  const [profile] = useAtom(userProfile);
  const [stationData] = useAtom(stationDataAtom);

  if (
    !stationData ||
    (stationData && profile?.personal_data?.is_passport)
  ) {
    return null;
  }

  const { attributes: {
    passport_url,
    short_common_name,
  } } = stationData!;

  const donateUrl = passport_url ? passport_url : DONATE_FALLBACK_URL;

  return (
    <div className={`${styles.passport_hover_overlay} ${className}`}>
      <p className={styles.passport_hover_overlay_text}>Watch this video with<br />{short_common_name} Passport.</p>

      <DonateLinkButton
        href={donateUrl}
        className={styles.passport_button}
        size='min'
        gtmEventData={{
          feature_category: "passport video thumbnail",
          feature_name: "passport video thumbnail hover overlay donate link",
          object_text: "Donate & Start Watching",
          object_url: donateUrl,
        }}
      >
        Donate & Start Watching
      </DonateLinkButton>

    </div>
  );
};

export default PassportHoverOverlay;
