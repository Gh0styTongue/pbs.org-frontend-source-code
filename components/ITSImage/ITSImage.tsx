import { generateITSSrc } from "@/lib/helpers/generateITSSrc";

export interface ITSImageProps {
  src: string;
  srcSetSizes?: Array<[number, number?]>;
  alt: string;
  width: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  format?:  'avif' | 'auto' | 'webp' | 'png' | 'jpg' | 'jpeg';
  resizeWithCrop?: boolean;
  focalcrop?: string;
  blur?: number;
  className?: string;
  ariaHidden?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
};

/**
 * <ITSImage />
 * @param {string} src - an `image.pbs.org` URL
 * @param {string} alt - alt text
 * @param {number} width - a default width for display (used for resizing). Setting to 0 removes this from the markup.
 * @param {number} [height] - a default height for display (used for resizing)
 * @param {string} [loading="lazy"] - loading method, defaults to "lazy". Can also be "eager".
 * @param {string} [format="avif"] - file format, defaults to "avif".
 * @param {array} [srcSetSizes] - an array of arrays that describe the sizes for the srcset attribute. Example: [[1024,576],[1216,684]]
 * @param {boolean} [resizeWithCrop] - should we use the crop method to resize images instead? Defaults to false.
 * @param {string} [focalcrop] - ITS focalcrop param. Format: XXxYY where "XX" and "YY" are percentages. Example: "90x10". Note: if using focalcrop, you *must* supply a width and height.
 * @param {number} [blur] - ITS blur param. Example: "20".
 * @returns {React Component}
*/
const ITSImage: React.FC<ITSImageProps> = (props) => {
  const {
    src,
    alt,
    width,
    height,
    srcSetSizes,
    loading = "lazy",
    className,
    // resizeWithCrop appears unused, but is neeeded in to generateITSSrc
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resizeWithCrop = false,
    ariaHidden,
    fetchPriority,
  } = props;

  const src1x = generateITSSrc(props, 1);
  const src2x = generateITSSrc(props, 2);

  let srcSet = undefined;

  if (src.includes('image.pbs.org')) {
    srcSet = `${src1x} 1x, ${src2x} 2x`;

    if (srcSetSizes) {
      srcSet = srcSetSizes.map((size) => {
        const roundedWidth = Math.round(size[0]);
        const roundedHeight = size[1] ? Math.round(size[1]) : undefined;
        const propsWithSize = { ...props, width: roundedWidth, height: roundedHeight}
        const src = generateITSSrc(propsWithSize, 1);
        return `${src} ${roundedWidth}w`;
      }).join(', ');
    }
  }

  return (
    <img
      src={src1x}
      srcSet={srcSet}
      alt={alt}
      width={width === 0 ? undefined : width}
      height={height}
      loading={loading}
      className={className}
      aria-hidden={ariaHidden}
      fetchPriority={fetchPriority}
    />
  );
}

export default ITSImage;
