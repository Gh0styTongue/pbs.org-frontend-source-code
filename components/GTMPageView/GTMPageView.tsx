'use client'
// imports
import { useEffect, useRef } from 'react';

// lib files
import { PAGE_VIEW_EVENT_WITH_PAGE_TRACKING_ID } from '@/lib/constants';
import { StationData } from "@/lib/types/api/stations-data";

interface GTMPageViewProps {
  analyticsTitle?: string;
  isSVP: boolean;
  pageTrackingId?: string;
  showTitle?: string;
  videoTitle?: string;
  videoType?: string;
  videoTPMediaId?: string;
  stationData?: StationData;
}

interface GTMDataLayer {
  CurrentPage: string;
  PageTrackingId?: string;
  ShowTitle?: string;
  VideoTitle?: string;
  VideoTPMediaId?: string;
  VideoType?: string;
  StationTrackingId?: string;
  Station?: string;
  event?: string;
}

const GTMPageView = (props: GTMPageViewProps) => {
  const {
    analyticsTitle,
    pageTrackingId,
    showTitle,
    videoTitle,
    videoType,
    videoTPMediaId,
    isSVP,
    stationData
  } = props;

  let stationPageTracking = null;
  let callSign = null;

  if (stationData) {
    stationPageTracking = stationData.attributes.page_tracking;
    callSign = stationData.attributes.call_sign;
  }

  // setting a ref so that we dont' fire the useEffect twice in dev
  const pageViewRef = useRef(false);

  useEffect(() => {
      const GTMDataLayer = window.GTMDataLayer || [];

      // Resetting the data layer on every page change so that we don't do things like
      // set a show title on one page view, then report it again on a non-show page.
      // https://developers.google.com/tag-platform/tag-manager/datalayer#reset
      GTMDataLayer.push(function() {
        // @ts-ignore
        this.reset();
      })

      const dataLayerPayload: GTMDataLayer = {
        CurrentPage: analyticsTitle ? analyticsTitle : `Unspecified Page: ${window.location}`,
      };

      if (pageTrackingId) {
        dataLayerPayload.PageTrackingId = pageTrackingId;
        // if a page tracking id was passed we want to use this special event name
        // so the gtm tags can be listening for this
        dataLayerPayload.event = PAGE_VIEW_EVENT_WITH_PAGE_TRACKING_ID;
      }

      // ShowTitle is used for:
      // - Show Pages
      // - Franchise Pages
      // - Video Playback pages - the show the video belongs to
      if (showTitle) {
        dataLayerPayload.ShowTitle = showTitle;
      }

      if (videoTitle) {
        dataLayerPayload.VideoTitle = videoTitle;
      }

      if (videoTPMediaId) {
        dataLayerPayload.VideoTPMediaId = videoTPMediaId;
      }

      if (videoType) {
        // Report the VideoType as a capitalized string - e.g. "Preview"
        dataLayerPayload.VideoType = videoType.charAt(0).toUpperCase() + videoType.slice(1);
      }

      // this logic is a bit confusing:
      // 1. If we're on an SVP
      // 2. And we have a station page tracking ID
      // 3. And the station tracking ID is not the same as the page tracking ID
      //    - we do this last check because sometimes stations & producers are the same
      //    and this will prevent double registering of page views
      if (isSVP && stationPageTracking && (stationPageTracking !== pageTrackingId)) {
        dataLayerPayload.StationTrackingId = stationPageTracking;
      }

      if (callSign) {
        dataLayerPayload.Station = callSign;
      }

      // We don't *actually* send a page_view event, we only update the data layer.
      // There is a GTM Tag that actually registers the page view.
      if (!pageViewRef.current) {
        GTMDataLayer?.push({
          ...dataLayerPayload,
        });
        pageViewRef.current = true;
      }
  },
  [
  analyticsTitle,
  callSign,
  isSVP,
  pageTrackingId,
  showTitle,
  stationData,
  stationPageTracking,
  videoTitle,
  videoTPMediaId,
  videoType,
  pageViewRef,
  ]);

  return <></>
};

export default GTMPageView;
