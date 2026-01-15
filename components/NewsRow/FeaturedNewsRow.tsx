'use client'

import styles from './FeaturedNewsRow.module.scss';
import { FeaturedArticle } from '@/lib/types/api/home-data';
import { Splide, SplideSlide, Options} from '@splidejs/react-splide';
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import FeaturedNewsThumbnail from './FeaturedNewsThumbnail';
import '@splidejs/splide/dist/css/splide.min.css';
export interface FeaturedNewsRowProps {
  featured_articles: FeaturedArticle[];
}

export default function FeaturedNewsRow(props: FeaturedNewsRowProps) {
  const { featured_articles } = props

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 3,
    gap: '0',
    classes: {
      arrow: `splide__arrow ${styles.featured_news_row_splide_arrow}`,
    }
  }

  return (
    <div className={styles.featured_news_row}>
      <h2 className={styles.featured_news_row_title}>
        Featured This Week
      </h2>
      <Splide aria-label='Featured News Row' options={options}>
        {featured_articles.map((newsItem: FeaturedArticle, index: number) => (
          <SplideSlide key={index} className={styles.splide__slide}>
            <FeaturedNewsThumbnail
              newsItem={newsItem}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
