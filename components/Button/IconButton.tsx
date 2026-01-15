import KabobIcon from '@/public/svg/kabob.svg';
import AddIcon from '@/public/svg/add.svg';
import PlayIcon from '@/public/svg/play.svg';
import ThumbsupIcon from '@/public/svg/thumbsup.svg';
import FastforwardIcon from '@/public/svg/fastforward.svg';
import CloseIcon from "@/public/svg/close.svg";

import styles from './IconButton.module.scss';

export interface IconButtonProps {
  icon: "kabob" | "play" | "add" | "thumbsup" | "fastforward" | "close";
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const IconButton = (props: IconButtonProps) => {
  const {icon, title, onClick, disabled} = props;

  let Icon = null;

  switch (icon) {
    case 'kabob':
      Icon = <KabobIcon />;
      break;
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

  let classes = styles.icon_button

  if(props?.className) {
    classes += ' ' + props.className
  }

  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick || (() => {})}
      className={classes}
      disabled={disabled}
    >
      {Icon}
    </button>
  )
}

export default IconButton;
