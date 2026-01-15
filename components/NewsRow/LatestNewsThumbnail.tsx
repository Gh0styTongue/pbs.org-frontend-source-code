
import { FeaturedArticle } from '@/lib/types/api/home-data';
import styles from './LatestNewsThumbnail.module.scss';
import Link from 'next/link';
import ITSImage from '../ITSImage/ITSImage';
export interface LatestNewsThumbnailProps {
  newsItem: FeaturedArticle;
}

export default function LatestNewsThumbnail(props: LatestNewsThumbnailProps) {
  const { newsItem } = props
  const { image, source_url, source_title, story_title, story_url} = newsItem;

  return (
    <div className={styles.latest_news_thumbnail_wrapper}>
      <Link 
        href={story_url}
        className={styles.latest_news_thumbnail}
       >
        <ITSImage
          src={image}
          alt={story_title}
          width={640}
          height={361}
          srcSetSizes={[[140, 79], [640, 361]]}
          resizeWithCrop={true}
          className={styles.latest_news_thumbnail_image}
        />
      </Link>
      <div className={styles.latest_news_thumbnail_overlay}>
        <Link href={source_url} >
          <span className={styles.latest_news_thumbnail_overlay_source}>
            {source_title}
          </span>
        </Link>
        <Link href={story_url} >
          <span className={styles.latest_news_thumbnail_overlay_story}>
            {story_title}
          </span>
        </Link>
      </div>
    </div>
  )
}