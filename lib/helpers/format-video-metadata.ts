import { fromSeconds } from '@/lib/helpers/from-seconds';

export type FormatOptions = "short" | "long" | "shortEpOnly";

export interface Show {
  season?: number;
  display_episode_number?: boolean;
  seasons_count?: number;
  episode?: number | string;
}
export interface VideoMetadata {
  show?: Show;
  video_type: string;
  parent_type: string;
  duration: number;
}

function formatVideoMetadata (  
  video: VideoMetadata,
  format: FormatOptions = "short",
  includeDuration: boolean = true
): string {
  const { show, video_type, parent_type, duration } = video;

  let seasonPrefix: string;
  let episodePrefix: string;
  let durationString: string | null;

  switch(format) {
    case "shortEpOnly":
      seasonPrefix = "S";
      episodePrefix = "Ep";
      durationString = null;
      break;
    case "long":
      seasonPrefix = "Season ";
      episodePrefix = "Episode ";
      durationString = fromSeconds(duration);
      break;
    case "short":
    default:
      seasonPrefix = "S";
      episodePrefix = "Ep";
      durationString = fromSeconds(duration);
      break;
  }

  const video_qualifier = ["preview", "clip"].includes(video_type) ? video_type.charAt(0).toUpperCase() + video_type.slice(1) : null;
  let video_episode: string | null = null;

  switch(true) {
    case parent_type === "season":
      video_episode = `${seasonPrefix}${show?.season}`;
      break;
    case parent_type === "special":
      video_episode = parent_type.charAt(0).toUpperCase() + parent_type.slice(1);
      break;
    case parent_type === "episode":
    case (parent_type === 'show' && video_type != 'clip' && video_type != 'preview'):
      if (show) {
          const { display_episode_number, seasons_count, season, episode } = show;

          const formatted_season = `${seasonPrefix}${season ? season : ''}`;
          const formatted_episode = `${episodePrefix}${episode}`;
          if (!display_episode_number) {
            video_episode = episode?.toString() || '';
          } else if (seasons_count === 1) {
            video_episode = formatted_episode;
          } else {
            video_episode = `${formatted_season} ${formatted_episode}`;
          }
      }
      break;
  }

  const pre = [video_qualifier, video_episode].filter((i) => i).join(": ");
  const summary = includeDuration ? [pre, durationString].filter((i) => i).join(" | ") : pre;

  return summary;
}

export { formatVideoMetadata };

