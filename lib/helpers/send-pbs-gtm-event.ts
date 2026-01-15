import { sendGTMEvent } from '@next/third-parties/google';

import { GOOGLE_EVENT_NAME } from '@/lib/constants';
import { VideoTypeEnum } from '@/lib/types/api/video';

// These options are based on this document as a model for tracking events:
// https://pbsdigital.atlassian.net/wiki/spaces/PROD/pages/167382660/GA4+GA+Apps+Guide#167392682
// *This* function does not include "screen_name" or "station_localization"
// as options in EventData. That is because we're using other existing data layer values.
// - "screen_name" is set with "CurrentPage"
// - "station_localization" is set with "Station"
// See GTMPageView.tsx for more details.
// Our Google Analytics infrastructure is already expecting these values and will allow
// them to show up in reports.

export type EventData = {
  // ID in Profile Service; should always match 'signed_in_user'. e.g. "516f21b9-40a4-4251-9fb8-b87756b77ce2"
  user_id?: string | null;
  // ID in Profile Service. Should agree with user_id. e.g. "516f21b9-40a4-4251-9fb8-b87756b77ce2"
  signed_in_user?: string | null;
  // Call letters of the station(s) the user is a member of. e.g. "WETA,WHUT"
  passport_station?: string | null;
  // Authentication status of the user at the time of interaction. e.g. true or false
  signed_in_status?: boolean | null;
  // Name of the platform the user was on at the time of interaction. e.g. "PBS.org", "SVP".
  // Or "Samsung TV", "VIZIO TV" in the case of device activation.
  pbs_platform?: string | null;
  // Show title associated with the item that was selected. e.g. "Sanditon"
  show_title?: string | null;
  // Slug for the item that was selected. e.g. "episode-2-dsuf6f"
  pbs_content_id?: string | null;
  // Title of the video that was selected. e.g. "Episode 2"
  video_title?: string | null;
  // TP Media ID for the video that was selected. e.g. "32958623"
  video_tp_media_id?: string | null;
  // Type of video that was selected. e.g. "episode", "clip", "special"
  // See VideoTypeEnum for more details.
  video_type?: VideoTypeEnum | null;
  // Feed CID for the live channel that was selected.
  pbs_livestream_channel_content_id?: string | null;
  // Full name of the live channel that was selected.
  livestream_channel_name?: string | null;
  // Franchise title associated with the item that was selected. e.g. "Masterpiece"
  franchise_title?: string | null;
  // Name of the item that was selected. e.g. "up next - play"
  object_name?: string | null;
  // Type of item that was selected. e.g. "button", "link"
  object_type?: string | null;
  // Ordinal position of the item within the module. e.g. 1, 2, 3
  object_position?: number | null;
  // Location of the item on the screen. e.g. "up next - modal"
  object_location?: string | null;
  // Text or call to action of the item as it's displayed to the user. e.g. "Watch Now"
  object_text?: string | null;
  // Action taken by the user when they selected the item. e.g. "click"
  object_action?: string | null;
  // Behavior/result of the action taken by the user when they selected the item.
  // e.g. "navigate to passport learn more"
  object_action_behavior?: string | null;
  // The URL if the item selected. e.g. "https://watch.weta.org/passport/learn-more"
  object_url?: string | null;
  // Query that the user entered as part of this action. e.g. "123456"
  field_entry_value?: string | null;
  // Name of the feature associated with the item that was selected. e.g. "up next - passport promo"
  feature_name?: string | null;
  // Category of the feature associated with the item that was selected. e.g. "continuous play"
  feature_category?: string | null;
};

// used to reset values on every push
const defaultEventData: EventData = {
  user_id: undefined,
  signed_in_user: undefined,
  passport_station: undefined,
  signed_in_status: undefined,
  pbs_platform: undefined,
  show_title: undefined,
  pbs_content_id: undefined,
  video_title: undefined,
  video_tp_media_id: undefined,
  video_type: undefined,
  pbs_livestream_channel_content_id: undefined,
  livestream_channel_name: undefined,
  franchise_title: undefined,
  object_name: undefined,
  object_type: undefined,
  object_position: undefined,
  object_location: undefined,
  object_text: undefined,
  object_action: undefined,
  object_action_behavior: undefined,
  object_url: undefined,
  field_entry_value: undefined,
  feature_name: undefined,
  feature_category: undefined,
}

/**
 * Sends events to Google Tag Manager formatted in a way our GA setup expects.
 * NOTE - only set the fields that make sense for a given event.
 * A field that is not included will appear as "undefined" in GA4 events.
 * This is designed to work hand in hand with this GTM tag:
 * https://tagmanager.google.com/?hl=en#/container/accounts/54129/containers/416832/workspaces/1000657/tags/1193
 * @param {EventData} eventData - object of parameters to send to GTM.
 * @returns {void}
*/
const sendPbsGtmEvent = (eventData: EventData) => {
  sendGTMEvent({
    event: GOOGLE_EVENT_NAME,
    // Yeah, this is kinda weird, but if we don't do this,
    // previous pushes to the data layer will persist, resulting in
    // events with erroneous values.
    ...defaultEventData,
    ...eventData,
  });
};

export { sendPbsGtmEvent }
