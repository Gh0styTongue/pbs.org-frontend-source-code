import Cookies from 'js-cookie';
import { STATION_ID_COOKIE } from '../constants';

export const openChangeStationModal = (setModalPanel: (panel: string | false) => void): void => {
  const stationId = Cookies.get(STATION_ID_COOKIE);

  if (!stationId) {
    setModalPanel('station-lookup-panel'); // No station id cookie, open the Station Lookup Panel
  } else {
    setModalPanel('change-station-panel'); // Station id cookie exists, open the Change Modal Panel
  }
};
