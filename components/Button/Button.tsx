// imports
import { ReactNode } from "react";

// SVG's
import AddIcon from '@/public/svg/add.svg';
import CheckIcon from '@/public/svg/check.svg';
import DownIcon from '@/public/svg/down.svg';
import DonateHeartIcon from '@/public/svg/donate-heart.svg';
import PlayIcon from '@/public/svg/play.svg';
import ShuffleIcon from '@/public/svg/shuffle.svg';
import UpIcon from '@/public/svg/up.svg';

import styles from './Button.module.scss';

export interface ButtonProps {
  children: ReactNode;
  cid?: string;
  className?: string;
  disabled?: boolean;
  gtmLabel?: string;
  style?: "white_ghost" | "blue_ghost" | "white" | "blue" | "light_blue" | "yellow" | "red";
  onClick?: () => void;
  iconBefore?: "play" | "add" | "check" | "add-toggle" | "heart";
  iconAfter?: "up" | "down" | "shuffle"
  title?: string;
  size?: 'responsive' | 'min' | 'max';
}

const Button = (props: ButtonProps) => {
  const {
    children,
    cid,
    className,
    disabled,
    gtmLabel,
    style = "white_ghost",
    title,
    onClick,
    iconBefore,
    iconAfter,
    size = 'responsive'
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
      IconBefore = <DonateHeartIcon />;
      break;
  }

  let IconAfter = null;

  switch (iconAfter) {
    case 'up':
      IconAfter = <UpIcon />;
      break;
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

  return (
    <button
      className={classNames}
      title={title}
      disabled={disabled}
      onClick={() => onClick?.()}
      data-cid={cid}
      data-gtm-label={gtmLabel}
    >
      { IconBefore }
      { children }
      { IconAfter }
    </button>
  )
}

export default Button;
