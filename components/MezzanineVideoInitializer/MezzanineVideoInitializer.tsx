// imports
import Link from 'next/link';

// lib files
import { VideoTypeEnum } from '@/lib/types/api/video';

// components
import ITSImage from '@/components/ITSImage/ITSImage';
import WatchVideoButton from '@/components/WatchVideoButton/WatchVideoButton';

// styles
import styles from './MezzanineVideoInitializer.module.scss';

interface MezzanineVideoInitializerBaseProps {
  videoType?: VideoTypeEnum;
  imgSrc: string;
  alt: string;
  showWatchButton?: boolean;
  verticalOffsetButton: boolean;
  width: number;
  className?: string;
}
interface MezzanineVideoInitializerLinkProps extends MezzanineVideoInitializerBaseProps {
  href: string;
  onClick?: never;
  prefetch?: boolean;
}
interface MezzanineVideoInitializerClickHandlerProps extends MezzanineVideoInitializerBaseProps {
  href?: never;
  onClick: () => void;
  prefetch?: never;
}

type MezzanineVideoInitializerProps =
  MezzanineVideoInitializerLinkProps | MezzanineVideoInitializerClickHandlerProps;

const MezzanineVideoInitializer = (props: MezzanineVideoInitializerProps) => {
  const {
    videoType,
    showWatchButton = true,
    alt,
    onClick,
    href,
    prefetch = true,
    imgSrc,
    verticalOffsetButton,
    width,
    className } = props;

  const aspectRatio = 9 / 16; // 0.5625

  let listOfSizes = [320, 480, 768, 1024, 1280, 1440]

  // loop through list of sizes and remove those above width prop
  listOfSizes = listOfSizes.filter((size) => size <= width)

  // add width prop to list of sizes
  listOfSizes.push(width)

  // create array of tuples where each item is a pair of the size and the size times the aspect ratio
  const srcSetSizes: Array<[number, number]> = listOfSizes.map((size) => [size, (size * aspectRatio)!])

  let classNames = styles.mezzanine_video_initializer;

  if (className) {
    classNames += ` ${className}`;
  }

  if (onClick) {
    return (
      <div className={classNames}>
        <ITSImage
          src={imgSrc}
          alt={alt}
          width={width}
          height={width * aspectRatio}
          srcSetSizes={srcSetSizes}
          format="webp"
          loading="eager"
          fetchPriority="high"
          />
        { showWatchButton && (
          <WatchVideoButton
            videoType={videoType || VideoTypeEnum.Video}
            onClick={() => onClick()}
            verticalOffset={verticalOffsetButton}
          />
        )}
      </div>
    );
  } else if (href) {
    return (
      <Link className={classNames} href={href} prefetch={prefetch}>
        <ITSImage
          src={imgSrc}
          alt={alt}
          width={width}
          height={width * aspectRatio}
          srcSetSizes={srcSetSizes}
          loading="eager"
          fetchPriority="high"
          />
        { showWatchButton && (
          <WatchVideoButton
            videoType={videoType || VideoTypeEnum.Video}
            onClick={null}
            verticalOffset={verticalOffsetButton}
          />
        )}
      </Link>
    );
  }
}

export default MezzanineVideoInitializer;
