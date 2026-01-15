'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { percentageWatchedViewingHistoryAtom } from '@/lib/atoms/viewing-history';
import { ViewingHistoryItem } from '@/lib/types/api/viewing-history';

import styles from './UserProgressBar.module.scss';

interface UserProgressBarProps {
  slug: string;
  depPercentageWatched?: number;
  className?: string;
  alwaysVisible?: boolean;
}

const UserProgressBar = (props: UserProgressBarProps) => {
  const { slug, depPercentageWatched, className, alwaysVisible = false } = props;

  const [ userViewingHistory ] = useAtom(percentageWatchedViewingHistoryAtom);
  const [ percentageWatched, setPercentageWatched ] = useState<number>(0);

  let classNames = styles.progress;

  if (className) {
    classNames += ` ${className}`;
  }

  useEffect(() => {
    const found = userViewingHistory?.find(
      (viewingHistoryItem: ViewingHistoryItem) => viewingHistoryItem.slug === slug
    );

    if (depPercentageWatched) {
      setPercentageWatched(depPercentageWatched);
    } else {
      setPercentageWatched(found ? Math.round(found.percentageWatched) : 0);
    }
  }, [slug, depPercentageWatched, userViewingHistory]);

  return (alwaysVisible || percentageWatched > 0) && (
    <progress 
      className={classNames} 
      value={percentageWatched} 
      max="100" 
      aria-label='Percentage Watched'>
        {percentageWatched}%
    </progress>
  )
}

export default UserProgressBar;
