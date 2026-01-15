// imports
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}


// thanks Dan Abramov! https://gist.github.com/gaearon/cb5add26336003ed8c0004c4ba820eae
export const useWindowWidth = (): number => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return width;
};

// listen for post messages from the player for showing/hiding a hero's overlay/gradient
export const useIsUserHoveringOverVideo = () => {
  const [isUserHoveringOverVideo, setIsUserHoveringOverVideo] = useState(true);

  useEffect(() => {
      const handlePostMessage = (event: MessageEvent) => {
          let messageType;

          if (typeof event.data === 'string') {
              const messageData = event.data.match(/"event":"videojs:([^"]+)"/);
              messageType = messageData ? messageData[1] : null;
              if (messageType === 'userIsHoveringOverVideo') {
                  setIsUserHoveringOverVideo(true);
              } else if (messageType === 'userNotHoveringOverVideo') {
                  setIsUserHoveringOverVideo(false);
              }
          }
      }
      window.addEventListener('message', handlePostMessage);
      return () => {
          window.removeEventListener('message', handlePostMessage);
      }
  }, []);

  return isUserHoveringOverVideo;
}

// listen for post messages from the player for adjusting show detail preview video's surrounding page elements
// for better closed captions visibility on Webkit browsers, at mobile breakpoints, when the video is playing
export const useIsPreviewVideoPlayingWebKit = () => {
  const [isPreviewVideoPlayingWebKit, setIsPreviewVideoPlayingWebKit] = useState(false);

  useEffect(() => {
      const handlePostMessage = (event: MessageEvent) => {
          let messageType;

          if (typeof event.data === 'string') {
              const messageData = event.data.match(/"event":"videojs:([^"]+)"/);
              messageType = messageData ? messageData[1] : null;
              if (messageType === 'portalPreviewVideoIsPlayingWebKit') {
                  setIsPreviewVideoPlayingWebKit(true);
              } 
          }
      }
      window.addEventListener('message', handlePostMessage);
      return () => {
          window.removeEventListener('message', handlePostMessage);
      }
  }, []);

  return isPreviewVideoPlayingWebKit;
}

// listen for post messages from the player for showing/hiding a hero's overlay/gradient when 
// the closed captions settings modal is opened/closed.
export const useIsClosedCaptionsSettingsOpen = () => {
  const [isClosedCaptionsSettingsModalOpen, setIsClosedCaptionsSettingsModalOpen] = useState(false);

  useEffect(() => {
      const handlePostMessage = (event: MessageEvent) => {
          let messageType;

          if (typeof event.data === 'string') {
              const messageData = event.data.match(/"event":"videojs:([^"]+)"/);
              messageType = messageData ? messageData[1] : null;
              if (messageType === 'closedCaptionsSettingsOpen') {
                setIsClosedCaptionsSettingsModalOpen(true);
              } else if (messageType === 'closedCaptionsSettingsClosed') {
                setIsClosedCaptionsSettingsModalOpen(false);
              }
          }
      }
      window.addEventListener('message', handlePostMessage);
      return () => {
          window.removeEventListener('message', handlePostMessage);
      }
  }, []);

  return isClosedCaptionsSettingsModalOpen;
}

// listen for post messages from the player that it's ready
export const useIsPlayerReady = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
      const handlePostMessage = (event: MessageEvent) => {
          let messageType;

          if (typeof event.data === 'string') {
              const messageData = event.data.match(/"event":"videojs:([^"]+)"/);
              messageType = messageData ? messageData[1] : null;
              if (messageType === 'playerReady') {
                  setIsPlayerReady(true);
              }
          }
      }
      window.addEventListener('message', handlePostMessage);
      return () => {
          window.removeEventListener('message', handlePostMessage);
      }
  }, []);

  return isPlayerReady;
}

// Assembles the current full URL from base url + pathname + search params
// AND updates when the user navigates to a new page. Sadly, NextJS doesn't provide a 
// convenient way to do this: https://github.com/vercel/next.js/discussions/64986
export const useCurrentUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const baseUrl = window.location.origin;
    const query = searchParams?.toString();
    const fullUrl = `${baseUrl}${pathname}${query ? `?${query}` : ''}`;

    setUrl(fullUrl);
  }, [pathname, searchParams]);

  return url;
};