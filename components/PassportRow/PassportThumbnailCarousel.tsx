'use client'

import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';

import { ShowRowContent } from '@/lib/types/api/show-data';
import PassportThumbnail from './PassportThumbnail';
import styles from './PassportThumbnailCarousel.module.scss';
interface PassportThumbnailCarouselProps {
  shows: ShowRowContent[];
}

const PassportThumbnailCarousel = (props: PassportThumbnailCarouselProps) => {
  const { shows } = props;

  if (!shows) return null;

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

  // Filter out shows that don't have images.background 🥕
  // This was a decision made by Chip Cullen and Laura King on 6/5/2024.
  // This will need to be documented somehow so that content curators
  // understand why a show may not appear if they add it to a list.
  const filteredShows = shows.filter((show) => show.images.background);

  return (
    <Splide options={options} className={styles.passport_thumbnail_carousel}>
      {filteredShows.map((show) => (
        <SplideSlide key={show.slug} className={styles.splide__slide}>
          <PassportThumbnail show={show} />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default PassportThumbnailCarousel;
