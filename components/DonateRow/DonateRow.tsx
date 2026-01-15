'use client'

// imports
import Image from 'next/image';
import { useEffect, useState } from 'react';

// lib files
import { DONATE_FALLBACK_URL, DONATE_OBJECT_NAME } from '@/lib/constants';
import { sendPbsGtmEvent } from '@/lib/helpers/send-pbs-gtm-event';
// components
import Button from '@/components/Button/Button';

// types
import { StationData } from '@/lib/types/api/stations-data';

// svg's
import ExploringNature from '@/public/staticsvg/exploring_nature.svg';

// styles
import styles from './DonateRow.module.scss';

export interface DonateRowProps {
  stationData: StationData;
}

export function DonateRow(props: DonateRowProps) {

  const { stationData } = props;

  const { attributes: station_info } = stationData;

  const {
    short_common_name: shortCommonName,
    donate_url,
  } = station_info;

  const [href, setHref] = useState(donate_url || DONATE_FALLBACK_URL);

  useEffect(() => {
    const donateUrl = new URL(href);
    if (window?.location?.href) {
      donateUrl.searchParams.append('referrer', window.location.href);
      setHref(donateUrl.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a
      href={href}
      className={styles.donate_row}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
      sendPbsGtmEvent({
        feature_category: "evergreen donation row",
        feature_name: "row",
        object_name: DONATE_OBJECT_NAME,
        object_text: `Donate to ${shortCommonName}`,
        object_type: "link",
        object_action: "click",
        object_action_behavior: "send user to link donate url",
        object_url: href,
      });
    }}
      >
      <div className={styles.donate_row__inner}>
        <Image
          alt=""
          aria-hidden="true"
          width={192}
          height={94}
          className={styles.donate_row__foreground_image}
          loading="lazy"
          src={ExploringNature}
        />
        <div className={styles.donate_row__background}>
          <div className={styles.donate_row__content}>
            <h2 className={styles.donate_row__title}>Keep Your Station Strong</h2>
              <Button
                style='white'
                size='responsive'
                iconBefore='heart'
                className={styles.donate_row__button}
                onClick={() => {
                  sendPbsGtmEvent({
                    feature_category: "evergreen donation row",
                    feature_name: "cta button",
                    object_name: DONATE_OBJECT_NAME,
                    object_text: `Donate to ${shortCommonName}`,
                    object_type: "link",
                    object_action: "click",
                    object_action_behavior: "send user to link donate url",
                    object_url: href,
                    });
                  }}
              >
              <div>
                Donate
                <span className={styles.donate_row__button_text}>
                  {` to ${shortCommonName}`}
                </span>
              </div>
              </Button>
          </div>
        </div>
      </div>
    </a>
  )
}
