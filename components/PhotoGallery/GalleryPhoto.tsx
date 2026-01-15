import ITSImage from '@/components/ITSImage/ITSImage';
import { PhotoGalleryContent } from '@/lib/types/api/show-data';

import styles from './GalleryPhoto.module.scss';

interface GalleryPhotoProps {
  photo: PhotoGalleryContent;
}

const GalleryPhoto: React.FC<GalleryPhotoProps> = (props) => {
  const { photo: {image_url, alt_text} } = props;

  return (
    <div className={styles.photo_gallery__photo_wrapper}>
      <ITSImage
        width={0}
        src={image_url}
        srcSetSizes={[[320,180],[480,270],[768,432],[1024,576],[1216,684]]}
        alt={alt_text}
        loading="lazy"
        className={styles.photo_gallery__photo}
      />
    </div>
  );
}

export default GalleryPhoto;
