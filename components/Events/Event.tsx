'use client';

// imports
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

// lib files
import { ContentServiceEvent } from '@/lib/types/api/content-service';

// components
import Time from '@/components/ReactTime/ReactTime';

// svgs
import CalenderIcon from '@/public/svg/calendar.svg';
import ExternalLinkIcon from '@/public/svg/external-link.svg';
import LocationIcon from '@/public/svg/location.svg';

// styles
import styles from './Event.module.scss';

interface EventProps {
  event: ContentServiceEvent;
  depNow?: Date;
}

const Event = (props: EventProps) => {
  const { event, depNow  } = props;

  const {
    city,
    end_localized: end,
    link,
    name,
    start_localized: start,
    state,
    timezone,
    virtual_location,
  } = event;

  const startInStationTimezone = dayjs(start).tz(timezone);
  const endInStationTimezone = dayjs(end).tz(timezone);

  const startDay = startInStationTimezone.format('MMM D');
  const endDay = endInStationTimezone.format('MMM D');

  // because dayjs() is essentially a call to Date.now(), we need to set it in state
  // to avoid hydration errors
  const [now, _] = useState(depNow ? dayjs(depNow).tz(timezone) : dayjs().tz(timezone));

  const isMultiDay = startDay !== endDay;
  const isBeforeMultiDay = startInStationTimezone.isAfter(now) && endInStationTimezone.isAfter(now);
  const isDuringMultiDay = startInStationTimezone.isBefore(now) && endInStationTimezone.isAfter(now);

  let dateBlock;

  switch(true) {
    case isMultiDay && isBeforeMultiDay:
      dateBlock = (
        <div className={styles.event_date}>
          <span className={styles.event_pre}>starts</span>
          <span className={styles.event_month}>
          { startInStationTimezone.format('MMM') }
          </span>
          <span className={styles.event_day}>
          { startInStationTimezone.format('D') }
          </span>
        </div>
      );
      break;
    case isMultiDay && isDuringMultiDay:
      dateBlock = (
        <div className={styles.event_date}>
          <span className={styles.event_pre}>ends</span>
          <span className={styles.event_month}>
          { endInStationTimezone.format('MMM') }
          </span>
          <span className={styles.event_day}>
          { endInStationTimezone.format('D') }
          </span>
        </div>
      );
      break;
    default:
      dateBlock = (
        <div className={styles.event_date}>
          <span className={styles.event_month}>
          { startInStationTimezone.format('MMM') }
          </span>
          <span className={styles.event_day}>
          { startInStationTimezone.format('D') }
          </span>
        </div>
      );
      break;
  }

  let details;

  switch(true) {
    case !link:
      details = <p className={styles.event_details}><i>Come back soon for details</i></p>;
      break;
    case isMultiDay:
      details = <p className={styles.event_details}><CalenderIcon className={styles.event_calendar_icon}/>{`${startDay} - ${endDay}`}</p>;
      break;
    default:
      details = (
      <p className={styles.event_details}>
        <CalenderIcon className={styles.event_calendar_icon}/>
        <span>
          <Time
            dateTime={startInStationTimezone.format()}
            format="ddd, h:mm A"
            timezone={timezone}
            enableAnimation={false}
          />
          {` - `}
          <Time
            dateTime={endInStationTimezone.format()}
            format="h:mm A z"
            timezone={timezone}
            enableAnimation={false}
          />
        </span>
      </p>
      );
      break;
  }

  const eventContent = (
    <div className={styles.event_content}>
      { dateBlock }
      <div className={styles.event_info}>
        <h3 className={styles.event_name}>{name}</h3>
        { details }
        <p className={styles.event_location}>
          <LocationIcon className={styles.event_location_icon} />
          <span>{virtual_location ? 'Virtual' : `${city}, ${state}`}</span>
        </p>
      </div>
    </div>
  );

  let wrapperClassName= styles.event;

  if (link) {
    wrapperClassName += ' ' + styles.event_with_link;
    return (
      <li className={wrapperClassName}>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.event_link}>
          {eventContent}
          <ExternalLinkIcon className={styles.event_link_icon}/>
        </a>
      </li>
    )
  } else {
    wrapperClassName += ' ' + styles.event_without_link;
    return (
      <li className={wrapperClassName}>
        {eventContent}
      </li>
    )
  }
};

export default Event;
