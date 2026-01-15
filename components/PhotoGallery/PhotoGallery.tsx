'use client'

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { DEFAULT_SPLIDE_OPTIONS } from '@/lib/constants';
import styles from './PhotoGallery.module.scss';
import ContentRowTitleDescription from '@/components/ContentRowTitleDescription/ContentRowTitleDescription';

import { PhotoGalleryContent } from '@/lib/types/api/show-data';
import GalleryPhoto from './GalleryPhoto';

export interface PhotoGalleryProps {
  photos: PhotoGalleryContent[]
  title?: string;
}

export default function PhotoGallery(props: PhotoGalleryProps) {
  const { photos, title } = props

  const options = {
    ...DEFAULT_SPLIDE_OPTIONS,
    perPage: 1,
    gap: '12px',
    classes: {
      arrow: `splide__arrow ${styles.photo_gallery__splide_arrow}`
    }
  }

  return (
    <div className={styles.photo_gallery__container}>
      { title && (
        <ContentRowTitleDescription title={title} />
      )}
      <div className={styles.photo_gallery}>
        <Splide aria-label='Photo Gallery' tag="section" options={options} className={styles.photo_gallery__photos} >
          {photos.map((photo, index) => (
            <SplideSlide key={index} className={styles.splide__slide}>
              <figure className={styles.photo_gallery__figure}>
                <GalleryPhoto photo={photo} />
                <figcaption className={styles.photo_gallery__figcaption_container}>
                  <p className={styles.photo_gallery__caption_text}>
                    {photo.caption_text}
                  </p>
                  <p className={styles.photo_gallery__figcaption_pagination}>
                    {`${index+1}/${photos.length}`}
                  </p>
                  <p className={styles.photo_gallery__figcaption_credit_text}>
                    {photo.credit_text}
                  </p>
                </figcaption>
              </figure>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  )
}
