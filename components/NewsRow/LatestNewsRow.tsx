
'use client'
import styles from './LatestNewsRow.module.scss';
import { TopNews, FeaturedArticle } from '@/lib/types/api/home-data';
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import LatestNewsThumbnail from './LatestNewsThumbnail';
import '@splidejs/splide/dist/css/splide.min.css';

export interface LatestNewsRowProps {
  top_news: TopNews;
}

export default function LatestNewsRow(props: LatestNewsRowProps) {
  const { top_news } = props;

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 2,
    gap: '0',
    classes: {
      arrow: `splide__arrow ${styles.latest_news_row_splide_arrow}`,
    }
  }

  return (
    <div className={styles.latest_news_row}>
      <h2 className={styles.latest_news_row_title}>
        Catch Up on the Latest News
      </h2>
      <Splide aria-label='Latest News Row' options={options}>
        {top_news.content.map((newsItem: FeaturedArticle, index: number) => (
          <SplideSlide key={index} className={styles.splide__slide}>
            <LatestNewsThumbnail
              newsItem={newsItem}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
