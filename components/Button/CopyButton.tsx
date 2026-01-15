'use client'

// imports
import { useState, useEffect } from 'react';

// lib files
import { useCurrentUrl } from '@/lib/hooks';

// svgs
import LinkIcon from '@/public/svg/link.svg';
import CheckIcon from '@/public/svg/check.svg';

// styles
import styles from './CopyButton.module.scss';

interface CopyButtonProps {
  className?: string;
  copyText?: string;
  copyCurrentURL?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const { className, copyText, copyCurrentURL = false } = props;

  const [isCopied, setIsCopied] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  const currentUrl = useCurrentUrl() || '';
  const textToCopy = copyCurrentURL ? currentUrl : copyText || currentUrl;

  let classNames = `${styles.copy_button}`;

  if (className) {
    classNames += ` ${className}`;
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
    } catch (error) {
      console.log("Error", error)
    }
  }

  let copiedTextStyles = styles.copy_button__copied_text;

  if (showCallout) {
    copiedTextStyles += ` ${styles.show}`;
  }

  useEffect(() => {
    if (isCopied) {
      setShowCallout(true);
      const timeoutID = setTimeout(()=>{
        setIsCopied(false);
        setShowCallout(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutID);
      };
    }
  }, [isCopied]);

  return (
    <div className={classNames}>
      <button 
        onClick={handleCopyClick} 
        title="Copy link to video"
        disabled={isCopied}
        >
        {isCopied ? <CheckIcon /> : <LinkIcon />}
      </button>
      <span 
        className={copiedTextStyles}
        aria-live="polite"
        aria-hidden={!showCallout}>
        Link Copied to Clipboard
      </span>
    </div>
  )
}

export default CopyButton;
