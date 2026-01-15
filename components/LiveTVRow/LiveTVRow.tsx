'use client';

// imports
import Link from "next/link";
import { useState, useCallback } from "react";
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';

// constants
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import { LIVESTREAM_SCHEDULE_FETCH_INTERVAL } from "@/lib/constants";

// lib files
import { Channel} from "@/lib/types/api/multi-livestream";
import { StationData } from "@/lib/types/api/stations-data";
import useInterval from "@/lib/hooks/useInterval";
import useDidMount from '@/lib/hooks/useDidMount';

// components
import ChannelThumbnail from "@/components/LiveTVRow/ChannelThumbnail";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

// styles
import '@splidejs/splide/dist/css/splide.min.css';
import styles from './LiveTVRow.module.scss';

interface LiveTVRowProps {
   stationData: StationData;
   depChannels?: Channel[];
   depNow?: Date;
}

const LiveTVRow = (props: LiveTVRowProps) => {
  const { stationData, depChannels, depNow } = props;

  const { attributes, id: stationId } = stationData;
  const { short_common_name } = attributes;

  const [channels, setChannels] = useState<Channel[]>(depChannels || []);
  const [dataFetchError, setDataFetchError] = useState(false);

  const getScheduleData = useCallback(async () => {
    if(depChannels) return

    try {
      const response = await fetch(`/api/station/${stationId}/livestream/`)
      const json = await response.json();
      const channelsData = json.schedule.content[0]?.channels;
      setChannels(channelsData)
    } catch(error) {
      console.error({ error })
      setDataFetchError(true)
    }
  }, [stationId, depChannels])

  useDidMount(getScheduleData)

  useInterval(getScheduleData, LIVESTREAM_SCHEDULE_FETCH_INTERVAL)

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 2,
    gap: '8px',
    breakpoints: {
      768: {
        perPage: 4,
      },
      1024: {
        gap: '12px',
      },
      1440: {
        gap: '16px',
        perPage: 5,
      }
    },
    classes: {
      list: `splide__list ${styles.splide__list}`,
      arrow: `splide__arrow ${styles.livetv_row__splide_arrow}`
    }
  }

  if (dataFetchError || channels.length === 0) {
    return null;
  }

  return (
    <div className={styles.livetv_row}>

      <h2 className={styles.livetv_row_title}>
        <Link href='/livestream/'>
          {short_common_name} Live TV
        </Link>
      </h2>

      { channels && channels.length > 0 ? (
        <Splide aria-label={`${short_common_name} Live TV`} tag="div" options={options} className={styles.channels} >
          {channels.map((channel: Channel) => {
            return (
            <SplideSlide key={channel.feed_cid} className={styles.channel}>
                <ChannelThumbnail channel={channel} depNow={depNow} />
            </SplideSlide>
          )})}
        </Splide>
      ) : (
        <div className={styles.livetv_row__loading}>
          <LoadingSpinner
            text="Loading Live TV Schedule..."
          />
        </div>
      )}
   </div>
  );
};

export default LiveTVRow;
