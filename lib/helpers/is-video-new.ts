import { NEW_VIDEO_THRESHOLD_IN_DAYS } from '@/lib/constants';
import { VideoClass, VideoTypeEnum } from '@/lib/types/api/video';

/**
 * Helper function to determine if a video should be considered "new" in the UI.
 * @param {VideoClass} [video] - video object
 * @param {boolean} [depIsNew] - dependency for storybook purposes
 * @returns {boolean}
*/
const isVideoNew = (video: VideoClass, depIsNew?: boolean): boolean => {
  const { premiere_date, available_date, video_type } = video;

  if (depIsNew) return true;

  if (
    video_type === VideoTypeEnum.Preview ||
    video_type === VideoTypeEnum.Clip ||
    video_type === VideoTypeEnum.Video ||
    !(premiere_date || available_date)
  ) {
    return false;
  }

  let dateToUse;

  switch (true) {
    // if both premiere_date and available_date are set, use the older one
    case premiere_date !== undefined && available_date !== undefined:
      const premDate = new Date(premiere_date);
      const availDate = new Date(available_date);
      dateToUse = new Date(Math.min(premDate.getTime(), availDate.getTime()));
      break;
    case premiere_date !== undefined:
      dateToUse = premiere_date;
      break;
    case available_date !== undefined:
      dateToUse = available_date;
      break;
    default:
      return false;
  }

  const now = new Date();
  const dateAsString = dateToUse.toString();
  const videoDate = new Date(dateAsString);
  const diffInDays = (now.getTime() - videoDate.getTime()) / (1000 * 3600 * 24);
  // If the difference is negative, it means the video is available in the future
  if (diffInDays < 0) {
    return false;
  } else {
    return Math.ceil(diffInDays) <= NEW_VIDEO_THRESHOLD_IN_DAYS;
  }
}

export { isVideoNew };
