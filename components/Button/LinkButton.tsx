import { ReactNode, KeyboardEvent, Ref } from "react";
import Link from 'next/link';

// lib files
import { shouldPrefetch } from '@/lib/helpers/should-prefetch';

// svg's
import AddIcon from '@/public/svg/add.svg';
import CheckIcon from '@/public/svg/check.svg';
import DownIcon from '@/public/svg/down.svg';
import HeartIcon from '@/public/svg/donate-heart.svg';
import PlayIcon from '@/public/svg/play.svg';
import ShuffleIcon from '@/public/svg/shuffle.svg';

import styles from './Button.module.scss';

export interface LinkButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  gtmLabel?: string;
  href: string | {
    pathname: string,
    query: {
      [key: string]: string,
    }
  };
  iconBefore?: "play" | "add" | "check" | "heart";
  iconAfter?: "down" | "shuffle";
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLAnchorElement>) => void;
  style?: "white_ghost" | "blue_ghost" | "white" | "blue" | "light_blue" | "yellow" | "red";
  target?: "_blank";
  title?: string;
  size?: 'responsive' | 'min' | 'max';
  wrapperComponent?: 'a' | 'Link';
  tabIndex?: number;
  ref?: Ref<HTMLAnchorElement>;
}

const LinkButton = (props: LinkButtonProps) => {
  const {
    children,
    className,
    disabled = false,
    gtmLabel,
    href,
    onClick,
    onKeyDown,
    style = "white_ghost",
    target,
    title,
    iconBefore,
    iconAfter,
    size = 'responsive',
    wrapperComponent = 'Link',
    tabIndex,
    ref,
  } = props;

  let IconBefore = null;

  switch (iconBefore) {
    case 'play':
      IconBefore = <PlayIcon />;
      break;
    case 'add':
      IconBefore = <AddIcon />;
      break;
    case 'check':
      IconBefore = <CheckIcon />;
      break;
    case 'heart':
      IconBefore = <div className={styles.heart_icon}><HeartIcon /></div>;
      break;
  }

  let IconAfter = null;

  switch (iconAfter) {
    case 'down':
      IconAfter = <DownIcon />;
      break;
    case 'shuffle':
      IconAfter = <ShuffleIcon />;
      break;
  }

  let classNames = `${styles[style]}`;

  if (className) {
    classNames += ` ${className}`;
  }

  if (size !== 'responsive') {
    classNames += ` ${styles[size]}`;
  }

  if (disabled) {
    classNames += ` ${styles.link_button_content_disabled}`;
  }

  const Element = wrapperComponent === 'a' ? 'a' : Link;

  return (
    <Element
      href={href.toString()}
      className={classNames}
      target={target}
      // prefetch is a Link only prop
      prefetch={wrapperComponent === 'a' ? undefined : shouldPrefetch(href)}
      title={title}
      data-gtm-label={gtmLabel}
      rel={ target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-disabled={disabled ? true : undefined}
      ref={ref}
      tabIndex={tabIndex}
    >
      { IconBefore }
      { children }
      { IconAfter }
    </Element>
  )
};

export default LinkButton;
