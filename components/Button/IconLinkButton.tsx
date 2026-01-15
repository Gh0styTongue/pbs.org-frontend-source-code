import Link from 'next/link';

import AddIcon from '@/public/svg/add.svg';
import PlayIcon from '@/public/svg/play.svg';
import ThumbsupIcon from '@/public/svg/thumbsup.svg';
import FastforwardIcon from '@/public/svg/fastforward.svg';
import CloseIcon from "@/public/svg/close.svg";

import styles from './IconButton.module.scss';

export interface IconLinkButtonProps {
  icon: "play" | "add" | "thumbsup" | "fastforward" | "close";
  title: string;
  className?: string;
  gtmLabel?: string;
  href: string | {
    pathname: string,
    query: {
      [key: string]: string,
    }
  };
  target?: "_blank";
}

const IconLinkButton = (props: IconLinkButtonProps) => {
  const {icon, title, href, gtmLabel, className, target} = props;

  let Icon = null;

  switch (icon) {
    case 'play':
      Icon = <PlayIcon />;
      break;
    case 'add':
      Icon = <AddIcon />;
      break;
    case 'thumbsup':
      Icon = <ThumbsupIcon />;
      break;
    case 'fastforward':
      Icon = <FastforwardIcon />;
      break;
    case 'close':
      Icon = <CloseIcon />;
      break;
  }

  let classNames = styles.icon_button

  if(className) {
    classNames += ' ' + className
  }

  return (
    <Link
      href={href}
      className={classNames}
      title={title}
      data-gtm-label={gtmLabel}
      rel={ target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {Icon}
    </Link>
  )
}

export default IconLinkButton;
