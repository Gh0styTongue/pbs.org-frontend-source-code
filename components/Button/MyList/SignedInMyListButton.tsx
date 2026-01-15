'use client'

// imports
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

// lib files
import {
  addFavoriteShow,
  addFavoriteVideo,
  removeFavoriteShow,
  removeFavoriteVideo
} from '@/lib/helpers/favorites';
import { myListShowsAtom } from '@/lib/atoms/myListShows';
import { myListVideosAtom } from '@/lib/atoms/myListVideos';
import {
  PersonalFavoriteShowsContent,
  PersonalFavoriteVideosContent,
  ProfileData,
} from '@/lib/types/api/profile-data';
import { ShowRowContent, ShowDetails } from '@/lib/types/api/show-data';
import { userProfile } from '@/lib/atoms/profile';
import { VideoClass } from '@/lib/types/api/video';

// components
import MyListButtonProps from '@/components/Button/MyList/MyListTypes';

// svg's
import PlusIcon from '@/public/svg/add.svg';
import MinusIcon from '@/public/svg/minus.svg';
import CheckIcon from '@/public/svg/check.svg';

// styles
import styles from './MyListButton.module.scss';

type Profile = ProfileData | undefined | null

const SignedInMyListButton = (props: MyListButtonProps) => {
  const { video, show, style } = props;
  const [ myListShowsData, setMyListShowsData] = useAtom(myListShowsAtom);
  const [ myListVideosData, setMyListVideosData] = useAtom(myListVideosAtom);
  const [isInList, setIsInList] = useState(false);

  let profile: Profile = props?.profileStub;

  if(!profile) {
    // The below line is exceptional for the case of the lint in that var is the
    // proper use case for block scoping setProfile outside of the if block
    var [atomProfile, setProfile] = useAtom(userProfile)
    profile = atomProfile
  }

  useEffect(() => {
    if(show && myListShowsData) {
      setIsInList(myListShowsData.some(s => s.slug === show.slug))
    } else if(video && myListVideosData) {
      setIsInList(myListVideosData.some(v => v.slug === video.slug))
    }
  }, [myListShowsData, myListVideosData, show, video,])

  const handleRemoveFavoriteShow = async (show: ShowRowContent | ShowDetails) => {
    // 1. Update local state so this is not in the list
    setIsInList(false)
    // 2. Update MyListShowsData in session storage to delete this show
    const updatedShowsList = myListShowsData?.filter(s => s.slug !== show.slug);
    setMyListShowsData(updatedShowsList);
    // 3. Side Effect: Update CS / Profile to remove the show from user's profile
    await removeFavoriteShow(show.cid)
    // 4. Side Effect: Update the profile object in local storage
    // @TODO: is this really still necessary? We don't use this data for our app now.
    const newProfile = { ...profile } as ProfileData
    const content = newProfile.personal_data.favorite_shows.content as PersonalFavoriteShowsContent[]
    const filteredContent = content.filter(x => x.id !== show.slug)
    newProfile.personal_data.favorite_shows.content = filteredContent;
    setProfile(newProfile)
  }

  const handleAddFavoriteShow = async (show: ShowRowContent | ShowDetails) => {
    // 1. Update local state so that this is in the list
    setIsInList(true)
    // 2. Update MyListShowsData in session storage to add this show
    // this inserts the show at the beginning of my list
    setMyListShowsData([show, ...myListShowsData || []])
    // 3. Side Effect: Update CS / Profile to add the show to user's profile
    await addFavoriteShow(show.cid)
    // 4. Side Effect: Update the profile object in local storage
    // @TODO: is this really still necessary? We don't use this data for our app now.
    const newProfile = { ...profile } as ProfileData
    newProfile.personal_data.favorite_shows.content.push({ id: show.slug })
    setProfile(newProfile)
  }

  const handleRemoveFavoriteVideo = async (video: VideoClass) => {
    // 1. Update local state so this is not in the list
    setIsInList(false)
    // 2. Update myListVideosData in session storage to delete this video
    const updatedVideosList = myListVideosData?.filter(v => v.slug !== video.slug);
    setMyListVideosData(updatedVideosList);
    // 3. Side Effect: Update CS / Profile to remove the video from user's profile
    await removeFavoriteVideo(video.cid)
    // 4. Side Effect: Update the profile object in local storage
    // @TODO: is this really still necessary? We don't use this data for our app now.
    const newProfile = { ...profile } as ProfileData
    const content = newProfile.personal_data.favorite_videos.content as PersonalFavoriteVideosContent[]
    const filteredContent = content.filter(x => x.id !== video.slug)
    newProfile.personal_data.favorite_videos.content = filteredContent;
    setProfile(newProfile)
  }

  const handleAddFavoriteVideo = async(video: VideoClass) => {
    // 1. Update local state so that this is in the list
    setIsInList(true)
    // 2. Update myListVideosData in session storage to add this video
    // this inserts the video at the beginning of my list
    setMyListVideosData([video, ...myListVideosData || []])
    // 3. Side Effect: Update CS / Profile to add the video to user's profile
    await addFavoriteVideo(video.cid)
    // 4. Side Effect: Update the profile object in local storage
    // @TODO: is this really still necessary? We don't use this data for our app now.
    const newProfile = { ...profile } as ProfileData
    newProfile.personal_data.favorite_videos.content.push({ id: video.slug })
    setProfile(newProfile)
  }

  const handleClick = async () => {
    switch(true) {
      case show !== undefined && isInList:
        await handleRemoveFavoriteShow(show)
        break;
      case show !== undefined && !isInList:
        await handleAddFavoriteShow(show as ShowRowContent)
        break;
      case video !== undefined && isInList:
        await handleRemoveFavoriteVideo(video as VideoClass)
        break;
      case video !== undefined && !isInList:
        await handleAddFavoriteVideo(video as VideoClass)
        break;
      default:
        break;
    }
  }

  let content = (<></>);
  let buttonClass = styles.my_list_button;

  switch(true) {
    case style === 'iconOnly' && isInList:
      buttonClass = styles.my_list_button__icon_only;
      content = (
        <>
          <CheckIcon />
          <span className="visuallyhidden">Remove from My List</span>
        </>
      )
      break;
    case style === 'iconOnly' && !isInList:
      buttonClass = styles.my_list_button__icon_only;
      content = (
        <>
          <PlusIcon />
          <span className="visuallyhidden">Add to My List</span>
        </>
      )
      break;
    case style === 'kabobMenu' && isInList:
      buttonClass = styles.my_list_button__kabob_menu;
      content = (
        <>
          <MinusIcon />
          <span>Remove from My List</span>
        </>
      )
      break;
    case style === 'kabobMenu' && !isInList:
      buttonClass = styles.my_list_button__kabob_menu;
      content = (
        <>
          <PlusIcon />
          <span>Add to My List</span>
        </>
      )
      break;
  }

  return (
    <button className={buttonClass} onClick={handleClick}>
      {content}
    </button>
  )
}

export default SignedInMyListButton
