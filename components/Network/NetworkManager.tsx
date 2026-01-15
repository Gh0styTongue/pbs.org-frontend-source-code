'use client'

import { usePathname } from 'next/navigation';

// lib files
import { StationData } from '@/lib/types/api/stations-data';

// components
import NetworkProfile from '@/components/Network/NetworkProfile';
import NetworkMyListShows from '@/components/Network/NetworkMyListShows';
import NetworkMyListVideos from '@/components/Network/NetworkMyListVideos';
import NetworkMyListViewingHistory from '@/components/Network/NetworkMyListViewingHistory'
import NetworkContinueWatching from '@/components/Network/NetworkContinueWatching';
import NetworkCountry from '@/components/Network/NetworkCountry';
import NetworkLocalization from '@/components/Network/NetworkLocalization';
import NetworkStation from '@/components/Network/NetworkStation';

type NetworkComponentMap = {
  [key: string]: React.ComponentType;
};

// This list will need to be updated if other personalized data is needed in the future
const pathnameToNetworkMap: NetworkComponentMap = {
  '/my-list/viewing-history/': () => <NetworkMyListViewingHistory />
}

interface NetworkManagerProps {
  stationData: StationData;
  isSVP: boolean;
}

const NetworkManager = (props: NetworkManagerProps) => {
  const { stationData, isSVP } = props;
  const pathname = usePathname()

  const PageSpecificNetworkComponent = pathnameToNetworkMap[pathname]
  const hasComponentToRender = PageSpecificNetworkComponent !== undefined

  return (
    <>
      <NetworkProfile />
      <NetworkMyListShows />
      <NetworkMyListVideos />
      <NetworkContinueWatching />
      <NetworkCountry />
      { !isSVP && (
        <NetworkLocalization initialStationId={stationData?.id} />
      )}
      <NetworkStation stationData={stationData} />
      { hasComponentToRender && (
        <PageSpecificNetworkComponent/>
      )}
    </>
  )
}

export default NetworkManager
