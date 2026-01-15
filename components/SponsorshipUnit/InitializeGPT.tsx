'use client'
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import useInterval from "@/lib/hooks/useInterval";

import { userProfile } from '@/lib/atoms/profile';
import { adsReady as adsReadyAtom } from '@/lib/atoms/ads-ready';
import { GPT_STANDARD_URL } from '@/lib/constants';

const turnOnAds = () => {
  if (window.googletag && googletag.apiReady) {
    googletag.cmd.push(() => {
      // Disable initial load, to precisely control when ads are requested.
      googletag.pubads().disableInitialLoad();

      // Enable SRA and services.
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  }
}

if (typeof window !== 'undefined') {
  // Ensure we can interact with the GPT command array.
  window.googletag = window.googletag || { cmd: [] };
}

interface InitializeGPTProps {
  call_sign?: string;
}

const InitializeGPT = (props: InitializeGPTProps) => {
  const { call_sign } = props;
  const [ profile ] = useAtom(userProfile);
  const [ adsTurnedOn, setAdsTurnedOn ] = useState(false);
  const [adsReady, setAdsReady] = useAtom(adsReadyAtom)

  useInterval(() => {
    if(window.googletag && googletag.apiReady && !adsTurnedOn) {
      setAdsReady(true)
    }
  }, 100)

  useEffect(() => {
    if (window.googletag && googletag.apiReady && !adsTurnedOn && adsReady) {
      // Add custom targeting parameters.

      // first, is the user signed in?
      googletag.pubads().setTargeting('pbsuser', profile ? 'yes' : 'no');

      // second, is the user a passport user?
      let passportStatus;
      switch(true) {
        case !profile:
          passportStatus = 'loggedout';
          break;
        case profile?.personal_data?.is_passport === true:
          passportStatus = 'yes';
          break;
        default:
          passportStatus = 'no';
      }

      googletag.pubads().setTargeting('passport', passportStatus);

      // third, what station are they localzied to (as a callsign)?
      if (call_sign) {
        googletag.pubads().setTargeting('station', call_sign.toLowerCase());
      }

      turnOnAds();
      setAdsTurnedOn(true);
    }
  }, [profile, call_sign, adsTurnedOn, adsReady]);

  return (
    <script src={GPT_STANDARD_URL} async />
  );
}

export default InitializeGPT;
