"use client";

// imports
import { useState } from 'react';

// lib files
import { CLOSED_CAPTIONING_SUPPORT_URL } from '@/lib/constants';
import { VideoClass } from '@/lib/types/api/video';

// components
import ReportAProblemModal from '@/components/ReportAProblemModal/ReportAProblemModal';

// styles
import styles from './VideoHelp.module.scss';

interface VideoHelpProps {
  video: VideoClass;
  className?: string;
}

const VideoHelp = (props: VideoHelpProps) => {
  const { className, video } = props;

  const [isReportAProblemModalOpen, setIsReportAProblemModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsReportAProblemModalOpen(true);
  }

  const handleModalClosed = () => {
    setIsReportAProblemModalOpen(false)
  }

  return (
    <>
      <p className={`${className} ${styles.video_help}`}>
        Problems playing video?&nbsp;&nbsp;
        <button className={styles.report_a_problem_button} onClick={handleOpenModal}>
          Report a Problem
        </button>
        &nbsp;|&nbsp;
        <a href={CLOSED_CAPTIONING_SUPPORT_URL} target="_blank">Closed Captioning Feedback</a>
      </p>

      <ReportAProblemModal isOpen={isReportAProblemModalOpen} onClose={handleModalClosed} video={video} />
    </>
  );
}

export default VideoHelp;
