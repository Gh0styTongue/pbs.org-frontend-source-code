'use client';

// lib file
import { VideoClass } from '@/lib/types/api/video';
import { StationData } from "@/lib/types/api/stations-data";
import { useHasMounted } from '@/lib/hooks';

// components
import LiveEventHero from '@/components/LiveEventHero/LiveEventHero';
import VideoHero from '@/components/VideoHero/VideoHero';

interface WhichHeroProps {
  liveEventHeroDescription?: string;
  liveEventHeroHeadline?: string;
  liveEventHeroImageAlt: string;
  liveEventHeroImageUrl?: string;
  liveEventHeroScheduleEnd?: string;
  liveEventHeroScheduleStart?: string;
  liveEventHeroShowLogoAlt: string;
  liveEventHeroShowLogoUrl?: string;
  liveEventHeroUrl?: string;
  normalizedVideoHeroVideo: VideoClass | null | undefined;
  stationData: StationData | undefined;
}

/**
 * This is a homepage-specific component that makes a decision about which hero to show.
 * @param {WhichHeroProps} - data needed to render the component
 * @returns {React Node} - JSX element
*/
const WhichHero = (props: WhichHeroProps) => {
  const {
    liveEventHeroDescription,
    liveEventHeroHeadline,
    liveEventHeroImageAlt,
    liveEventHeroImageUrl,
    liveEventHeroScheduleEnd,
    liveEventHeroScheduleStart,
    liveEventHeroShowLogoAlt,
    liveEventHeroShowLogoUrl,
    liveEventHeroUrl,
    normalizedVideoHeroVideo,
    stationData,
  } = props;

  // Still need useHasMounted to avoid hydration mismatch
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return null;
  }

  // Is a Live Event Hero scheduled?
  const liveEventHeroScheduleStartDate =
    liveEventHeroScheduleStart ?
    new Date(liveEventHeroScheduleStart)
    : null;
  const liveEventHeroScheduleEndDate =
    liveEventHeroScheduleEnd ?
    new Date(liveEventHeroScheduleEnd)
    : null;
  const now = new Date();

  const liveEventHeroEnabled =
    // Do we have all of the necessary data?
    (
      liveEventHeroDescription &&
      liveEventHeroHeadline &&
      liveEventHeroImageUrl &&
      liveEventHeroScheduleEndDate &&
      liveEventHeroScheduleStartDate &&
      liveEventHeroShowLogoUrl &&
      liveEventHeroUrl
    )
    &&
    // Are we in the scheduled window?
    (liveEventHeroScheduleStartDate <= now && now <= liveEventHeroScheduleEndDate)

  return (
    <>
      {/* If our Live Event is enabled, show that hero */}
      { liveEventHeroEnabled && (
          <LiveEventHero
            liveEventHeroShowLogoUrl={liveEventHeroShowLogoUrl}
            liveEventHeroShowLogoAlt={liveEventHeroShowLogoAlt}
            liveEventHeroUrl={liveEventHeroUrl}
            liveEventHeroHeadline={liveEventHeroHeadline}
            liveEventHeroDescription={liveEventHeroDescription}
            liveEventHeroImageUrl={liveEventHeroImageUrl}
            liveEventHeroImageAlt={liveEventHeroImageAlt}
          />
      )}

      {/* Otherwise, show the Video Hero */}
      { !liveEventHeroEnabled && normalizedVideoHeroVideo && (
        <VideoHero stationData={stationData} video={normalizedVideoHeroVideo} isSVP={false}/>
      )}

      {/* TODO: switch here based on whether it's a show or video */}
    </>
  );
};

export default WhichHero;
