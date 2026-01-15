import styles from './FeaturedNewsThumbnail.module.scss';
import { FeaturedArticle } from '@/lib/types/api/home-data';
import Link from 'next/link';
import ITSImage from '../ITSImage/ITSImage';
export interface FeaturedNewsThumbnailProps {
  newsItem: FeaturedArticle;
}

export default function FeaturedNewsThumbnail(props: FeaturedNewsThumbnailProps) {
  const { newsItem } = props
  const { image, story_title, source_url, source_title, story_url} = newsItem;

  return (
    <div className={styles.featured_news_thumbnail_wrapper}>
      <Link 
        href={story_url} 
        >
        <ITSImage
          src={image}
          alt={story_title}
          width={215}
          height={120}  
          srcSetSizes={[[140, 79], [640, 361]]}
          className={styles.featured_news_thumbnail_image}
        />
      </Link>
      <div className={styles.featured_news_thumbnail_description}>
        <Link href={source_url} >
          <span className={styles.featured_news_thumbnail_description_source}>
            {source_title}
          </span>
        </Link>
        <Link href={story_url} >
          <span className={styles.featured_news_thumbnail_description_story}>
            {story_title}
          </span>
        </Link>
      </div>
    </div>
  )
}