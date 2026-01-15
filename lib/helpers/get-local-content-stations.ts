import { Audience as VideoAudience } from "../types/api/video";
import { Audience as ShowAudience } from "../types/api/show-data";
import { PUBLISHED_TEST_STATION_IDS } from "../constants";

/**
 * Takes an Audience object and returns a list of local station short common names.
 * Matching what was done in the pbsorg django codebase
 * @param {VideoAudience[] | ShowAudience[]} audiences
 * @returns {string[]}
*/

const getLocalContentStations = (audiences: VideoAudience[] | ShowAudience[]): string[] => {
  const localContentStations = [] as string[];

  audiences.forEach(audience => {
    const isLocal = audience.scope === "local";
    const station = audience.station;
    const notTestStation = !PUBLISHED_TEST_STATION_IDS.includes(station && station.cid || "");

    if (isLocal && notTestStation && station) {
      localContentStations.push(station.short_common_name);
    }
  });

  // Remove duplicates and sort alphabetically
  return Array.from(new Set(localContentStations)).sort()
}

export { getLocalContentStations }
