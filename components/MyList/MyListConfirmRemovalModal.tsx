"use client"

// imports
import { useAtom } from 'jotai';

// lib files
import {
  defaultMyListConfirmModalState,
  myListConfirmModalAtom,
  MyListConfirmModalTypeEnum
} from '@/lib/atoms/my-list-confirm-modal';
import { myListShowsAtom } from '@/lib/atoms/myListShows';
import { myListVideosAtom } from '@/lib/atoms/myListVideos';
import { myListViewingHistoryAtom } from '@/lib/atoms/myListViewingHistory';
import { PersonalFavoriteShowsContent, PersonalFavoriteVideosContent, ProfileData } from '@/lib/types/api/profile-data';
import { removeFavoriteShow, removeFavoriteVideo, removeWatchedVideo } from '@/lib/helpers/favorites';
import { userProfile } from '@/lib/atoms/profile';

// components
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';

// styles
import styles from './MyListConfirmRemovalModal.module.scss';


const MyListConfirmRemovalModal = () => {
  const [ modalState, setModalState ] = useAtom(myListConfirmModalAtom);
  const [ myListShowsData, setMyListShowsData] = useAtom(myListShowsAtom);
  const [ myListVideosData, setMyListVideosData] = useAtom(myListVideosAtom);
  const [ myListViewingHistory, setMyListViewingHistory] = useAtom(myListViewingHistoryAtom);
  const [ profile, setProfile ] = useAtom(userProfile);
  const { id, isOpen, slug, title, type } = modalState;

  const handleRemove = async () => {
    if (!id || !slug) {
      console.error('id or slug is missing');
      return;
    };

    switch (type) {
      case MyListConfirmModalTypeEnum.SHOW:
        await removeFavoriteShow(id);
        const updatedShowsList = myListShowsData?.filter(show => show.slug !== slug);
        setMyListShowsData(updatedShowsList);
        removeFavoriteFromProfileObjectInStorage();
        break;
      case MyListConfirmModalTypeEnum.VIDEO:
        await removeFavoriteVideo(id);
        removeFavoriteFromProfileObjectInStorage();
        const updatedVideosList = myListVideosData?.filter(video => video.slug !== slug);
        setMyListVideosData(updatedVideosList);
        removeFavoriteFromProfileObjectInStorage();
        break;
      case MyListConfirmModalTypeEnum.VIEWING_HISTORY:
        await removeWatchedVideo(id);
        const updatedViewingHistoryList = myListViewingHistory?.filter(video => video.slug !== slug);
        setMyListViewingHistory(updatedViewingHistoryList);
        break;
      default:
        break;
    }

    setModalState(defaultMyListConfirmModalState);
  }

  // @TODO - do we still need to do this? We don't use this data in our app.
  const removeFavoriteFromProfileObjectInStorage = () => {
    if (type !== (MyListConfirmModalTypeEnum.SHOW || MyListConfirmModalTypeEnum.VIDEO)) {
      return;
    }

    const key = type === MyListConfirmModalTypeEnum.SHOW ? 'favorite_shows' : 'favorite_videos';
    const newProfile = { ...profile } as ProfileData
    const content = newProfile.personal_data[key].content as
      PersonalFavoriteShowsContent[] | PersonalFavoriteVideosContent[];
    const filteredContent = content.filter(x => x.id !== slug)
    newProfile.personal_data[key].content = filteredContent
    setProfile(newProfile)
  }

  let contentString = `Are you sure you want to remove ${title} from My List?`;

  if (type === MyListConfirmModalTypeEnum.VIEWING_HISTORY) {
    contentString = `Are you sure you want to remove ${title} from your Viewing History?`;
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        className={styles.my_list_confirm_removal_modal}
        innerClassName={styles.my_list_confirm_removal_modal_inner}
        onClose={() => setModalState(defaultMyListConfirmModalState)}
      >
        <p className={styles.my_list_confirm_removal_modal_text}>
          {contentString}
        </p>

        <div className={styles.my_list_confirm_removal_modal_buttons}>
          <Button onClick={handleRemove} style="white">
            Remove
          </Button>
          <Button onClick={() => setModalState(defaultMyListConfirmModalState)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MyListConfirmRemovalModal;
