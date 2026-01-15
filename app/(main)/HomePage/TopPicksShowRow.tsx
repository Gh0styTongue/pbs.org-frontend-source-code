'use client'

// imports
import { useEffect } from 'react';
import { useAtom } from 'jotai';

// lib files
import { handleRecommendedShowClick } from '@/lib/content-services/rec-engine';
import { ProfileData } from '@/lib/types/api/profile-data';
import { recommendedShowsAtom } from '@/lib/atoms/recommended-shows';
import { ShowRowContent } from '@/lib/types/api/show-data';
import { userProfile } from '@/lib/atoms/profile';

// components
import ShowRow from "@/components/ShowRow/ShowRow";
import FeaturedShowsRow from '@/app/(main)/HomePage/FeaturedShowsRow';

interface TopPicksShowRowProps {
  profileStub?: ProfileData;
  depTopPicksShowData?: ShowRowContent[];
  featuredShows?: ShowRowContent[];
}

const TopPicksShowRow = (props: TopPicksShowRowProps) => {
  const { profileStub, depTopPicksShowData, featuredShows } = props;
  const [profile] = useAtom(userProfile)
  const userFirstName = profileStub ? profileStub.profile.first_name : profile?.profile?.first_name;
  const [topPicksData, setTopPicksData] = useAtom(recommendedShowsAtom);

  // Fetch top picks data (recommended shows) when component is loaded 
  useEffect(() => {
    const fetchTopPicksData = async () => {
      try {
        const response = await fetch(`/api/profile/recommended-shows/`)
        const json = await response.json();
        const topPicksResponse = json.recommendedShowsData;
        setTopPicksData(topPicksResponse);
      } catch (error) {
        console.error(error);
      }
    }

    if (depTopPicksShowData) {
      setTopPicksData(depTopPicksShowData)
    } else {
      if (profile) {
        fetchTopPicksData()
      }
    }
  }, [profile, depTopPicksShowData, setTopPicksData]);

  // Falls back to display the featured shows if the top picks data is not available
  return (
    <>
      { (topPicksData && Array.isArray(topPicksData) && topPicksData.length > 0) ? (
        <ShowRow
          shows={topPicksData}
          title={`Top Picks for ${userFirstName ? userFirstName : "You"}`}
          onShowPosterClick={handleRecommendedShowClick}
        />
      ) : (
        featuredShows && <FeaturedShowsRow shows={featuredShows} />
      )}
    </>
  )
}

export default TopPicksShowRow;
