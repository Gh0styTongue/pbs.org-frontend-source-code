import { VideoClass } from '@/lib/types/api/video';
import { formatDate } from '@/lib/helpers/format-date';
import { isDateInPast } from '@/lib/helpers/is-date-in-past';

import styles from './AiringExpiringRating.module.scss';
interface AiringExpiringProps {
  video: VideoClass;
  className?: string;
}

const AiringExpiringRating = (props: AiringExpiringProps) => {
  const { video, className } = props;

  const { premiere_date, expire_date, content_rating } = video;

  const stringArray = [];

  if (premiere_date) {
    // RWEB-9318 this used to say "Aired" or "Airing" but, since a lot of our content
    // doesn't actually broadcast over the airwaves, that's not really accurate.
    stringArray.push(formatDate(premiere_date));
  }

  if (expire_date) {
    const expirePrefix = isDateInPast(expire_date) ? 'Expired' : 'Expires';
    stringArray.push(`${expirePrefix} ${formatDate(expire_date)}`);
  }

  if (content_rating && content_rating !== '') {
    stringArray.push(`Rating ${content_rating}`);
  }

  const joinedStrings = stringArray.join(' | ');

  return (
    <p className={`${styles.aired_expired_rating}${className ? ` ${className}` : ''}`}>
      {joinedStrings}
    </p>
  )
}

export default AiringExpiringRating;
