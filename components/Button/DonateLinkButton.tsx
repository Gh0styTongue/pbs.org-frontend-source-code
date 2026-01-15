'use client';

// imports
import { ReactNode, useEffect, useState } from 'react';

// lib files
import { DONATE_FALLBACK_URL, DONATE_OBJECT_NAME } from '@/lib/constants';
import { EventData } from '@/lib/helpers/send-pbs-gtm-event';
import { sendPbsGtmEvent } from '@/lib/helpers/send-pbs-gtm-event';


// components
import LinkButton, { LinkButtonProps } from '@/components/Button/LinkButton';

type DonateLinkButtonProps = {
  className?: string;
  children: ReactNode;
  gtmEventData: EventData;
  gtmLabel?: string;
  href: string;
  iconBefore?: "play" | "add" | "check" | "heart";
  onClick?: () => void;
  style?: LinkButtonProps['style'];
  size?: LinkButtonProps['size'];
  target?: LinkButtonProps['target'];
};

/**
 * DonateLinkButton component that wraps LinkButton and adds Google Tag Manager (GTM) event tracking functionality.
 *
 * @param DonateLinkButtonProps
 * @returns
 */
export default function DonateLinkButton(props: DonateLinkButtonProps) {
  const { className, children, href: hrefProp, onClick, style, gtmEventData, size, gtmLabel, iconBefore } = props;
  const [href, setHref] = useState(hrefProp);

  // Combine passed gtmEventData with default values
  const passedGtmEventData = {
    ...gtmEventData,
    object_name: DONATE_OBJECT_NAME,
    object_type: "link",
    object_action: "click",
    object_action_behavior: "send user to donate link url"
  }

  useEffect(() => {
    let donateUrl: URL;

    try {
      donateUrl = new URL(hrefProp);
    } catch (_error) {
      donateUrl = new URL(DONATE_FALLBACK_URL);
    }

    if (window?.location?.href) {
      donateUrl.searchParams.append('referrer', window.location.href);
      setHref(donateUrl.toString());
    }
  }, [hrefProp])

  return (
    <LinkButton
      className={className}
      href={href}
      onClick={
        () => {
          sendPbsGtmEvent(passedGtmEventData);

          if (onClick) {
            onClick();
          }
        }
      }
      style={style}
      size={size}
      gtmLabel={gtmLabel}
      iconBefore={iconBefore}
    >
      {children}
    </LinkButton>
  );
}
