'use client';

// imports
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState, useEffect } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

// lib files
import { ContentServiceEvent } from '@/lib/types/api/content-service';
import { StationData } from "@/lib/types/api/stations-data";
import useThrottledCallback from '@/lib/hooks/useThrottledCallback';
import useWindowResize from '@/lib/hooks/useWindowResize';

// components
import Button from '@/components/Button/Button';
import Event from './Event';

// styles
import styles from './Events.module.scss';

 interface EventsProps {
  events: Array<ContentServiceEvent>;
  stationData?: StationData;
  title?: string;
  depNow?: Date;
}

// Breakpoint where we shift layout
const min = 1024

const getPaginateByNumber = (): 3 | 6 => {
  return window.matchMedia(`(min-width: ${min}px)`).matches ? 6 : 3;
}

const Events = (props: EventsProps) => {
  const { events, stationData, title = 'Events', depNow } = props;

  const timezone = stationData?.attributes.timezone;

  // if we don't have a station timezone, we'll guess the user's timezone
  const primaryTimezone = timezone ? timezone : dayjs.tz.guess();

  // because dayjs() is essentially a call to Date.now(), we need to set it in state
  // to avoid hydration errors
  const [now, _] = useState(depNow ? dayjs(depNow).tz(primaryTimezone) : dayjs().tz(primaryTimezone));
  // Filter events that have already ended
  // CS should take care of this, but adding just in case,
  // plus this lets us use depNow + storybook for testing
  const filteredEvents = events.filter(event => dayjs(event.end).tz(primaryTimezone) > now);
  const defaultNumber = 3;
  const hasMoreThanDefaultEvents = filteredEvents.length > defaultNumber;
  const defaultEvents = filteredEvents.slice(0, defaultNumber);

  const [ expandable, setExpandable ] = useState(hasMoreThanDefaultEvents)
  const [ page, setPage ] = useState(0);
  const [ eventsToDisplay, setEventsToDisplay ] = useState(defaultEvents);
  const [ paginateByNumber, setPaginateByNumber ] = useState(3);

  useEffect(() => {
    setPaginateByNumber(getPaginateByNumber())
  }, [setPaginateByNumber]);

  const onWindowResize = useWindowResize();

  // adjust pagination number on resize
  onWindowResize(useThrottledCallback(() => {
    setPaginateByNumber(getPaginateByNumber())
  }));

  useEffect(() => {
    const newEventsToDisplay = filteredEvents.slice(0, (defaultNumber + (page * paginateByNumber)))
    setEventsToDisplay(newEventsToDisplay)
    setExpandable(filteredEvents.length > newEventsToDisplay.length);
  // We only want this useEffect to run when `page` updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleExpandButtonClick = () => {
    if (expandable) {
      setPage(page + 1);
    } else {
      setPage(0)
    }
  }

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className={styles.events_wrapper}>
      <h2 className={styles.events_title}>{ title }</h2>
      <ul className={styles.events}>
        {eventsToDisplay.map((event, index) => (
          <Event
            event={event}
            key={index}
            depNow={depNow}
          />
        ))}
      </ul>

      { hasMoreThanDefaultEvents && (
        <Button
          onClick={() => handleExpandButtonClick()}
          iconAfter={expandable ? 'down' : 'up'}
          className={styles.events_expand_button}
        >
          {expandable ? "View More Events" : "View Fewer Events"}
        </Button>
      )}
    </div>
  );
};

export default Events;
