'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INTERNALLY_NAVIGATING_KEY } from '@/lib/constants';
import CloseIcon from '@/public/svg/close.svg';

import styles from './BackButton.module.scss';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { className } = props;

  const router = useRouter();

  const [isInternallyNavigating, setIsInternallyNavigating] = useState(false);

  useEffect(() => {
    if(canAccessStorage('sessionStorage')) {
      setIsInternallyNavigating(sessionStorage.getItem(INTERNALLY_NAVIGATING_KEY) === 'true')
    }
  }, [])

  let classNames = `${styles.back_button}`;

  if (className) {
    classNames += ` ${className}`;
  }

  if (isInternallyNavigating) {
    return (
      <button onClick={() => router.back()} aria-label="Go Back" className={classNames}>
        <CloseIcon />
      </button>
    )
  } else {
    return (
      <Link href="/" className={classNames} aria-label="Go Home">
        <CloseIcon />
      </Link>
    )
  }
}

export default BackButton;
