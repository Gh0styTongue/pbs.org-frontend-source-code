'use client';

// lib files
import { getBestStationWhiteLogo } from '@/lib/helpers/get-best-station-white-logo';
import { StationData } from "@/lib/types/api/stations-data";

// components
import ITSImage from '@/components/ITSImage/ITSImage';

// styles
import styles from './StationLogo.module.scss';

type StationLogoProps = {
  stationData: StationData;
  className?: string;
  width?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

const StationLogo =  (props: StationLogoProps) => {
  const { stationData, className, width = 135, loading = 'lazy', fetchPriority } = props;
  const stationCommonName = stationData?.attributes?.short_common_name || 'PBS';
  const stationImages = stationData?.attributes?.images
  const stationLogoSrc = getBestStationWhiteLogo(stationImages);

  let classNames = `${styles.station_logo}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <div className={classNames}>
      {stationLogoSrc ? (
        <ITSImage
          src={stationLogoSrc}
          alt={stationCommonName}
          width={width}
          loading={loading}
          fetchPriority={fetchPriority}
        />
      ) : (
        <>
          {stationCommonName}
        </>
      )}
    </div>
  );
}

export default StationLogo;
