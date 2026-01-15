'use client'

import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import showRowSplideStyles from './ShowRowSplide.module.scss';
import styles from './ShowRow.module.scss';

import { SHOW_ROW_SPLIDE_OPTIONS } from '@/lib/constants';
import ContentRowTitleDescription from '@/components/ContentRowTitleDescription/ContentRowTitleDescription';

import { ShowRowContent } from '@/lib/types/api/show-data';
import { Franchise } from '@/lib/types/api/franchise-data';

import ShowPoster from '@/components/ShowPoster/ShowPoster';

export interface ShowRowProps {
  shows: Array<ShowRowContent | Franchise>;
  title?: string;
  description?: string;
  logo?: string;
  logo_alt?: string;
  className?: string;
  overRideOptions?: Options;
  onShowPosterClick?: (show: ShowRowContent) => void;
}

export default function ShowRow(props: ShowRowProps) {
  const { shows, title, description, logo, logo_alt, className, overRideOptions, onShowPosterClick } = props

  let options: Options = {
    ...SHOW_ROW_SPLIDE_OPTIONS,
    classes: {
      list: `splide__list ${showRowSplideStyles.splide__list}`,
      arrow: `splide__arrow ${showRowSplideStyles.splide__arrow}`
    }
  }

  if (overRideOptions) {
    options = {
      ...options,
      ...overRideOptions
    }
  }

  let classNames = styles.show_row;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <div className={classNames}>
      { title && (
        <ContentRowTitleDescription
          title={title}
          description={description}
          logo={logo}
          logo_alt={logo_alt}
        />
      )}

      <Splide options={options}>
        {shows.map((show, index) => (
          <SplideSlide key={`${index}${show.slug}`} className={styles.splide__slide}>
            <ShowPoster show={show} onClick={onShowPosterClick} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  )
}
