'use client';

// imports
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

// lib files
import { DONATE_FALLBACK_URL, PBS_COOKIE_DOMAIN } from '@/lib/constants';
import { sendPbsGtmEvent } from "@/lib/helpers/send-pbs-gtm-event";
import { stationConfirmedAtom } from '@/lib/atoms/station-confirmed';
import { StationData } from "@/lib/types/api/stations-data";
import { useHasMounted } from "@/lib/hooks";

// components
import LinkButton from '@/components/Button/LinkButton';

// SVG's
import CloseIcon from '@/public/svg/close.svg';
import HeartIcon from '@/public/svg/donate-heart.svg';
import DonateIllustration from '@/public/staticsvg/woman-with-plant-dec-2025.svg';

// styles
import styles from './UrgentMessagePopover.module.scss';

interface UrgentMessagePopoverProps {
  headline?: string;
  stationData: StationData;
  text?: string;
  depIsOpen?: boolean;
}

const HIDE_POPOVER_COOKIE = 'hideUrgentMessagePopover';
const defaultHeadline = 'Protect PBS';
const defaultText = 'Defunded but not defeated. Your support is essential. Help keep your local PBS station strong in their mission to inspire, enrich, and educate.';

const UrgentMessagePopover = (props: UrgentMessagePopoverProps) => {
  const {
    headline = defaultHeadline,
    text = defaultText,
    stationData,
    depIsOpen,
  } = props;

  const {
    attributes: {
      donate_url,
      short_common_name,
    }
  } = stationData;

  const hasMounted = useHasMounted();
  const [stationConfirmed, _] = useAtom(stationConfirmedAtom);
  const [hidden, setHidden] = useState(false);
  const isHiddenCookieSet = depIsOpen !== undefined ? !depIsOpen : Cookies.get(HIDE_POPOVER_COOKIE) === 'true';

  useEffect(() => {
    if (hasMounted && !isHiddenCookieSet && stationConfirmed) {
      sendPbsGtmEvent({
        feature_category: "urgent messaging",
        feature_name: "popover",
        object_name: "popover",
        object_action: "impression",
        object_action_behavior: "display content",
      });
    }
  }, [hasMounted, isHiddenCookieSet, stationConfirmed]);

  // Checks if the component is mounted on the client
  // or if it's hidden
  if (!hasMounted || isHiddenCookieSet || (depIsOpen === undefined && !stationConfirmed)) {
    return null;
  }

  const getExpires = (): Date => {
    // is today on or before 12/30?
    const today = new Date();
    const targetDate = new Date('2025-12-30T23:59:59');

    if (today < targetDate) {
      return targetDate;
    } else {
      return new Date('2026-01-01T23:59:59')
    }
  }

  const hidePopover = () => {
    // Set the cookie to hide the popover
    // after half a second in order to allow
    // the fade out animation.
    setTimeout(() => {
      Cookies.set(HIDE_POPOVER_COOKIE, 'true', {
        domain: PBS_COOKIE_DOMAIN,
        path: '/',
        expires: getExpires(),
        sameSite: 'none',
        secure: true,
      })
    }, 500);
    setHidden(true);

    sendPbsGtmEvent({
      feature_category: "urgent messaging",
      feature_name: "popover",
      object_name: "close button",
      object_type: "button",
      object_action: "click",
      object_action_behavior: "close urgent message",
    });
  };

  return (
    <div className={styles.urgent_message_popover} hidden={hidden}>
      <button
        className={styles.urgent_message_popover_close_button}
        onClick={hidePopover}
        aria-label='Close'
      >
        <CloseIcon />
      </button>

      <div className={styles.urgent_message_popover_content}>
        <h2 className={styles.urgent_message_popover_headline}>{headline}</h2>
        <p
          className={styles.urgent_message_popover_text}
          dangerouslySetInnerHTML={{__html: text}}></p>

        <LinkButton
          href={donate_url || DONATE_FALLBACK_URL}
          target="_blank"
          style="white"
          className={styles.urgent_message_popover_donate_button}
          onClick={() => {
            sendPbsGtmEvent({
              feature_category: "urgent messaging",
              feature_name: "popover",
              object_name: "donate button",
              object_type: "button",
              object_action: "click",
              object_action_behavior: "navigate to donation page",
            });
          }}
          >
          <HeartIcon className={styles.urgent_message_popover_donate_button_heart_icon} />
          Donate
          <span className={styles.urgent_message_popover_donate_button_station}>
            to {short_common_name}
          </span>
        </LinkButton>
      </div>
      <div className={styles.urgent_message_popover_illustration}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.urgent_message_popover_illustration__image}
          loading="lazy"
          src={DonateIllustration}
        />
      </div>
    </div>
  );
};

export default UrgentMessagePopover;
