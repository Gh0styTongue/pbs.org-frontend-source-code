'use client'

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'

import styles from './ContentMetadata.module.scss';
import EmbedIcon from '@/public/svg/embed-lg.svg';
import EmbedModal from '@/components/EmbedModal/EmbedModal';
import { VideoClass } from '@/lib/types/api/video';
import { LOCAL_PLAYER_HOST, PORTAL_PLAYER_HOST } from '@/lib/constants';

interface EmbedModalButtonProps {
  video: VideoClass;
  className?: string;
}

const EmbedModalButton: React.FC<EmbedModalButtonProps> = ({ className, video }) => {
  const queryParameters = useSearchParams()
  const useLocalPlayer = queryParameters.get('localPlayer') ||
                         false

  const [isModalOpen, setIsModalOpen] = useState(false);

  const embedModalVideoProps = {
    image: video.image,
    ancestor_title: video.ancestor_title,
    title: video.title,
    show: {
      season: Number(video.show?.season),
      episode: Number(video.show?.episode),
    },
    legacy_tp_media_id: video.legacy_tp_media_id.toString(),
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleModalClosed = () => {
    setIsModalOpen(false)
  }

  let classNames = `${styles.content_metadata}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <li>
      <button
        onClick={handleOpenModal}
        className={classNames}
      >
        <EmbedIcon />
      </button>

      <EmbedModal
        video={embedModalVideoProps}
        playerEmbedHost={useLocalPlayer ? LOCAL_PLAYER_HOST : PORTAL_PLAYER_HOST}
        isOpen={isModalOpen}
        onClose={handleModalClosed}
      />
    </li>
  );
};

export default EmbedModalButton;
