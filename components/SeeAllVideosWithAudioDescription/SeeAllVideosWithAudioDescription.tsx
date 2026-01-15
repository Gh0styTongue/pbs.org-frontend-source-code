// imports
import Link from 'next/link';

// components
import { Icon as AccessibilityIcon} from '@/components/AccessibilityIcons/AccessibilityIcons';

// svg’s
import NextIcon from '@/public/svg/caret-next.svg';

// styles
import styles from './SeeAllVideosWithAudioDescription.module.scss';

interface SeeAllVideosWithAudioDescriptionProps {
  className?: string;
}

const SeeAllVideosWithAudioDescription = (props: SeeAllVideosWithAudioDescriptionProps) => {
  const { className } = props;
  let classes = styles.video_audio_description;

  if (className) {
    classes += ` ${className}`
  }

  return (
    <Link 
      href="/search/?q=audio+description"
      className={classes} 
      >
      See all videos with Audio Description
      <AccessibilityIcon 
        text="AD"
        showAdIcon={true}
      />
      <NextIcon className={styles.caret_prev_icon} />
    </Link>
  )
}

export default SeeAllVideosWithAudioDescription;