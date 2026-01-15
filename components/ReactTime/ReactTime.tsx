'use client'

// imports
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

// lib files
import { formatTime } from '@/lib/helpers/formatTime';
import { PBSTimezones } from '@/lib/types/api/timezones';
import { secondaryTimezone as secondaryTimezoneAtom } from '@/lib/atoms/secondary-timezone';

// styles
import styles from '@/components/ReactTime/ReactTime.module.scss';

interface TimeProps {
  dateTime: string;
  enableAnimation?: boolean;
  format?: string;
  timezone?: PBSTimezones;
}

const Time: React.FC<TimeProps> = (props) => {
  const {
    dateTime,
    format,
    enableAnimation = true,
    timezone,
  } = props;

  const [secondaryTimezone] = useAtom(secondaryTimezoneAtom)

  let timeString = '';

  const [secondaryTimezoneSelected, setSecondaryTimezoneSelected] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [classNames, setClassNames] = useState(styles.react_time)

  const duration = typeof window !== "undefined" ? parseFloat(getComputedStyle(document.body).getPropertyValue('--duration')) * 1000 : 0;

  useEffect(() => {
    if(animating) {
      setClassNames(`${styles.react_time} ${styles.react_time__animating}`)
    } else {
      setClassNames(styles.react_time)
    }
  }, [animating])

  useEffect(() => {
    // guard clause for animation occuring on mount
    // or if the enableAnimation prop is set to false
    if(isFirstRender || !enableAnimation) {
      setIsFirstRender(false)
      return
    }

    // first we need to start to fade out
    setAnimating(true);

    // then delay by the duration the state switch
    const timeout = setTimeout(() => {
      if (secondaryTimezone) {
        setSecondaryTimezoneSelected(true);
      } else {
        setSecondaryTimezoneSelected(false);
      }
    }, duration);

    // then delay the fade back in
    const animationTimeout = setTimeout(() => {
      setAnimating(false);
    }, duration);

    return () => {
      clearTimeout(timeout)
      clearTimeout(animationTimeout)
    }
  // deliberately leaving out the `isFirstRender` dependency
  // so that the effect runs on every render after the first
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ duration, enableAnimation, secondaryTimezone])

  if (secondaryTimezoneSelected) {
    timeString = formatTime(dateTime, format, secondaryTimezone!) as string;
  } else {
    timeString = formatTime(dateTime, format, timezone) as string;
  }

  return (
    <>
      <span className={classNames}>
        {timeString}
      </span>
    </>
  );
};

export default Time;
