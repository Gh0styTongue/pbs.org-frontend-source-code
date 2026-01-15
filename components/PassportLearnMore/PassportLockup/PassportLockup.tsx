// lib files
import { StationData } from "@/lib/types/api/stations-data";

// imports
import PassportCompass from '@/public/svg/compass-rose.svg';

// styles
import styles from './PassportLockup.module.scss';

interface PassportLockupProps {
  stationData?: StationData;
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  shortCommonName?: string;
  className?: string;
}

const PassportLockup = (props: PassportLockupProps) => {
  const { stationData, element, className, shortCommonName } = props;
  let stationShortCommonName;

  // If there's station data
  if (stationData) {
    // use the short common name from that
    stationShortCommonName = stationData?.attributes.short_common_name;
    // or if there's an explicit short common name
  } else if (shortCommonName) {
    // then use that
    stationShortCommonName = shortCommonName;
  } else {
    // if neither exist, don't display the passport lockup
    return null
  }

  const Element = element;

  let setClassName = styles.passport_lockup;

  if (className) {
    setClassName += ` ${className}`;
  }

  return (
    <Element className={setClassName}>
      {stationShortCommonName}
      <PassportCompass className={styles.passport_compass_rose_icon} />
      Passport
    </Element>
  );
};

export default PassportLockup;
