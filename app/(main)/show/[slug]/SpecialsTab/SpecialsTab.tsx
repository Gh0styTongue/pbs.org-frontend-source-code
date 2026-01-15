'use client';

// imports
import { useState, useCallback } from "react";
import useDidMount from '@/lib/hooks/useDidMount';

// lib files
import { VideoClass } from '@/lib/types/api/video';
import { ShowDetails } from '@/lib/types/api/show-data';

// components
import LearningMediaBadge from '@/components/LearningMediaBadge/LearningMediaBadge';
import SponsorshipUnit from "@/components/SponsorshipUnit/SponsorshipUnit";
import VideoDetailThumbnail from "@/components/VideoDetailThumbnail/VideoDetailThumbnail";

// styles
import styles from './SpecialsTab.module.scss';

interface SpecialsTabProps {
  adUnit: string;
  learningMediaUrl?: string | null;
  show: ShowDetails;
  specials: VideoClass[];
}

async function fetchAllSpecials(showSlug: string) {
  const url = `/api/show/${showSlug}/specials/`
  const response = await fetch(url)
  return await response.json()
}

const SpecialsTab = (props: SpecialsTabProps) => {
  const {
    adUnit,
    learningMediaUrl,
    show,
    specials,
  } = props;

  const [ allSpecials, setAllSpecials ] = useState<VideoClass[]>(specials);

  const getAllSpecialsData = useCallback(async () => {
    try {
      const response = await fetchAllSpecials(show.slug);
      setAllSpecials(response)
    } catch(error) {
      console.error({ error })
      // @TODO make an error state?
    }
  }, [show])

  useDidMount(getAllSpecialsData);

  return (
    <>
      <div className={styles.specials_tab}>
        <div className={styles.specials_list}>
        {allSpecials.map((special, index: number) => {
          return (
            <VideoDetailThumbnail video={special} key={index} />
          )
        })}
        </div>

        <SponsorshipUnit
          adUnit={adUnit}
          size={[[300, 250], [300, 600]]}
          id="medium-rectangle-half-page-specials-tab"
        />
      </div>

      { learningMediaUrl && (
        <LearningMediaBadge
          learningMediaURL={learningMediaUrl!}
          showTitle={show.title}/>
      )}
    </>
  );
};

export default SpecialsTab;
