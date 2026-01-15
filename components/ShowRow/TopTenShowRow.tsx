'use client'

import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import showRowSplideStyles from './ShowRowSplide.module.scss';
import styles from './ShowRow.module.scss';

import { ShowRowContent } from '@/lib/types/api/show-data';
import ContentRowTitleDescription from '@/components/ContentRowTitleDescription/ContentRowTitleDescription';
import ShowPoster from '@/components/ShowPoster/ShowPoster';

export interface TopTenShowRowProps {
  shows: ShowRowContent[];
  title?: string;
}

export default function TopTenShowRow(props: TopTenShowRowProps) {
  let { shows } = props;
  // only take 10 shows
  shows = shows.slice(0, 10)

  const { title } = props;

  const options: Options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 2,
    gap: '0px',
    breakpoints: {
      600: {
        perPage: 3,

      },
      768: {
        perPage: 4,
      },
      1280: {
        perPage: 5,
      }
    },
    classes: {
      list: `splide__list ${showRowSplideStyles.splide__list}`,
      arrow: `splide__arrow ${showRowSplideStyles.splide__arrow}`
    }
  }

  return (
    <div className={`${styles.show_row} ${styles.top_ten_show_row}`}>
      {title && (
        <ContentRowTitleDescription title={title} />
      )}

      <Splide aria-label='Show Row' options={options} >
        {shows.map((show, index) => (
          <SplideSlide key={show.slug} className={styles.splide__slide}>
            <div className={styles.top_ten_item}>
              <span className={styles.top_ten_item__count}>{index+1}</span>
              <ShowPoster show={show} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
