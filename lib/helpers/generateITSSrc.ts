import { DEFAULT_IMAGE_FORMAT } from '@/lib/constants';

export interface ITSOptions {
  blur?: number;
  focalcrop?: string;
  format?: 'auto' | 'webp' | 'png' | 'jpg' | 'jpeg' | 'avif';
  height?: number;
  resizeWithCrop?: boolean;
  src: string;
  width: number;
};

const generateITSSrc = (options: ITSOptions, resolution: 1 | 2 = 1): string => {
  const {
    blur,
    focalcrop,
    format = DEFAULT_IMAGE_FORMAT,
    height,
    resizeWithCrop,
    src,
    width,
  } = options;

  // if we get an image that isn't from image.pbs.org, none of the query params below matter
  if (!src.includes('image.pbs.org')) {
    return src;
  }

  const url = new URL(src);
  url.searchParams.set('format', format);
  url.protocol = 'https';

  let resolutionString = `${width * resolution}x${height ? height * resolution : ''}`

  // focal crop will only work if a width _and_ height are specified
  if (focalcrop && height) {
    resolutionString += `x${focalcrop}`;
  }

  // The `crop` query param is used for resizing images with a crop,
  // and the focalcrop function in ITS only works with `crop`.
  // When using `crop` (with or without the focal crop), the height is required.
  const cropOrResize = ((resizeWithCrop || focalcrop) && height) ? 'crop' : 'resize';

  url.searchParams.set(cropOrResize, resolutionString);

  if (blur) {
    url.searchParams.set('blur', blur.toString());
  }

  return url.toString();
}

export { generateITSSrc };
