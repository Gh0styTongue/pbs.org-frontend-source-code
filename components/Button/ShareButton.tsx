
'use client';

// imports
import { useEffect, useState } from 'react';

// lib files
import { useCurrentUrl } from '@/lib/hooks';

// svgs
import ShareIcon from '@/public/svg/share.svg';

// styles
import styles from './ShareButton.module.scss';

interface ShareButtonProps {
  className?: string;
  assetType: 'video' | 'show';
  depStoryBook?: boolean;
  title: string;
  text: string;
}

const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { className, assetType, title, text, depStoryBook = false } = props;
  const [canShare, setCanShare] = useState(false);
  const currentUrl = useCurrentUrl() || '';

  const handleShareButtonClick = async () => {
    try {
      await navigator.share({
        title, 
        text, 
        url: currentUrl
      });
    } catch (error) {
      // swallowing here makes sense as the API throws
      // an error if the user cancels the share action
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // check if the WebShare API is supported 
    // (it is currently not supported in Firefox)
    if (navigator.share !== undefined) {
      setCanShare(true);
    }
  }, []);

  if (!canShare) {
    return null; 
  }

  let classNames = `${styles.share_button}`;

  if (className) {
    classNames += ` ${className}`;
  }

  const ShareButtonComponent = (
    <div className={classNames}>
      <button 
        title={`Share link to ${assetType}`} 
        onClick={handleShareButtonClick}
      >
        <ShareIcon />
      </button>
    </div>
  )

  return depStoryBook ? (
    ShareButtonComponent
    ) : (
      <li>
        {ShareButtonComponent}
      </li>
    )
}

export default ShareButton;
