'use client'

// imports
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';

// constants
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';

// lib files
import { FeaturedArticle } from '@/lib/types/api/home-data';

// components
import ITSImage from '../ITSImage/ITSImage';
import Link from 'next/link';

// styles
import styles from './Articles.module.scss';
import '@splidejs/splide/dist/css/splide.min.css';

interface ArticlesProps {
  articles: FeaturedArticle[];
  title?: string;
}

const Articles = (props: ArticlesProps) => {
  const { articles, title = "Features, Articles & More" } = props;

  if (!articles || articles.length === 0) return null;

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 2,
    gap: '8px',
    breakpoints: {
      1024: {
        gap: '12px',
      },
      1440: {
        gap: '16px',
        perPage: 3,
      }
    },
    classes: {
      list: `splide__list ${styles.splide__list}`,
      arrow: `splide__arrow ${styles.splide__arrow}`
    }
  }

  return (
    <div className={styles.articles}>
      <h2 className={styles.articles_title}>{title}</h2>
      <Splide options={options} className={styles.articles_carousel}>
        {articles.map((article, index) => (
          <SplideSlide key={index} className={styles.splide__slide}>
            <div className={styles.article_thumbnail}>
              <Link href={article.story_url} className={styles.article_image_link}>
                <ITSImage
                  className={styles.article_image}
                  src={article.image}
                  alt=""
                  width={475}
                  resizeWithCrop={true}
                  srcSetSizes={[[140,78], [348,195], [475, 267], [640,360]]}
                />
              </Link>
              <Link href={article.source_url}>
                <h2 className={styles.article_over_title}>
                  {article.source_title}
                </h2>
              </Link>
              <Link href={article.story_url}>
                <h2 className={styles.article_headline}>
                  {article.story_title}
                </h2>
              </Link>
              <p className={styles.article_description}>
                {article.description}
              </p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Articles;
