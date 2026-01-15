'use client'

// imports
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

// lib files
import { continueWatchingAtom } from '@/lib/atoms/continueWatching';
import { ContinueWatchingData, MyListShowsData } from '@/lib/types/api/home-data';
import {
  MyListConfirmModalTypeEnum,
  myListConfirmModalAtom
} from '@/lib/atoms/my-list-confirm-modal';
import { myListShowsAtom } from '@/lib/atoms/myListShows';
import { ProfileData } from '@/lib/types/api/profile-data';
import { ShowRowContent } from '@/lib/types/api/show-data';
import { SHOW_ROW_SPLIDE_OPTIONS } from '@/lib/constants';
import { userProfile } from '@/lib/atoms/profile';

// components
import ContinueWatchingShowPoster from './ContinueWatchingShowPoster';

// styles
import styles from './ContinueWatchingRow.module.scss';

interface ContinueWatchingRowProps {
  profileStub?: ProfileData;
  depIsLoggedIn?: boolean;
  depContinueWatchingData?: ContinueWatchingData["content"];
  depMyListShowsData?: MyListShowsData["content"];
}

export default function ContinueWatchingRow(props: ContinueWatchingRowProps) {
  const { profileStub, depIsLoggedIn, depContinueWatchingData, depMyListShowsData } = props;
  let [profile] = useAtom(userProfile)
  const [ continueWatchingData, setContinueWatchingData ] = useAtom(continueWatchingAtom);
  const [ myListShowsData, setMyListShowsData ] = useAtom(myListShowsAtom);
  const [ isLoggedIn, setIsLoggedIn ] = useState(depIsLoggedIn || false);
  const [ posterWithOpenMenu, setPosterWithOpenMenu ] = useState('');
  const [ _, setConfirmModalState ] = useAtom(myListConfirmModalAtom);

  if(!profile && profileStub) {
    profile = profileStub
  }

  const handleRemoveShowClick = async (show: ShowRowContent, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const modalState = {
      id: show.cid,
      isOpen: true,
      slug: show.slug,
      title: show.title,
      type: MyListConfirmModalTypeEnum.SHOW,
    }
    setConfirmModalState(modalState);
  }

  // Set data for storybook and login state
  useEffect(() => {
    if (depIsLoggedIn || profile) {
      if (depContinueWatchingData) {
        setContinueWatchingData(depContinueWatchingData)
      }
      if (depMyListShowsData) {
        setMyListShowsData(depMyListShowsData)
      }
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [depIsLoggedIn, profile, depContinueWatchingData, depMyListShowsData, setContinueWatchingData, setMyListShowsData]);

  const options = {
    ...SHOW_ROW_SPLIDE_OPTIONS,
    classes: {
      arrow: `splide__arrow ${styles.continue_watching_row__splide_arrow}`
    }
  }

  return ( isLoggedIn && (continueWatchingData || myListShowsData) ? (
    <div className={styles.continue_watching_row}>
      <h3>
        <Link
          href={"/my-list-viewing-history/"}
          className={styles.continue_watching_row__title}
        >
          Continue Watching
        </Link>
      </h3>

      <Splide aria-label='Continue Watching Row' options={options} >
        {continueWatchingData?.map((video, index) => (
          <SplideSlide key={index}  className={styles.splide__slide}>
            <ContinueWatchingShowPoster
              show={video.show}
              type={'continueWatching'}
              video={video}
              isOpen={video.title === posterWithOpenMenu}
              setPosterWithOpenMenu={setPosterWithOpenMenu}
            />
          </SplideSlide>
        ))}
        {myListShowsData?.map((show, index) => {
          return (
            <SplideSlide key={index} className={styles.splide__slide}>
              <ContinueWatchingShowPoster
                show={show as ShowRowContent}
                type={'myListShow'}
                isOpen={show.title === posterWithOpenMenu}
                setPosterWithOpenMenu={setPosterWithOpenMenu}
                handleRemoveShowClick={handleRemoveShowClick}
              />
            </SplideSlide>
          )})}
      </Splide>
    </div>
  ) : null )
}
