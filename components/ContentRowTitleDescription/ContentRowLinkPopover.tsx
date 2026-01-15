// imports
import { useState, RefObject } from 'react';

// lib files
import { getContentLink } from '@/lib/helpers/get-content-link';

// styles
import styles from './ContentRowLinkPopover.module.scss';

interface ContentRowLinkPopoverProps {
  id: string;
  anchorId: string;
  ref: RefObject<HTMLDivElement | null>;
}

const ContentRowLinkPopover = (props: ContentRowLinkPopoverProps) => {
  const { anchorId, id, ref } = props;
  const defaultText = 'Copy Link to Row';
  const successText = 'Link Copied!';
  const errorText = 'Copy failed';
  const timeOutDuration = 1000;
  const contentLink = getContentLink(id);

  const [copyButtonText, setCopyButtonText] = useState(defaultText);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(contentLink);
      setCopyButtonText(successText);
    } catch (error) {
      setCopyButtonText(errorText)
      console.error('Error copying snippet to clipboard', error)
    }

    setTimeout(() => {
      setCopyButtonText(defaultText)
      ref.current?.hidePopover();
    }, timeOutDuration);
  };

  return (
    <div
      className={styles.content_row_link_popover}
      popover=""
      ref={ref}
      // @ts-ignore React styles types don't yet have positionAnchor
      style={{ positionAnchor: anchorId}}
    >
      <button
        onClick={handleCopyClick}
        className={styles.copy_button}
      >
      {copyButtonText}
      </button>
    </div>
  );
};

export default ContentRowLinkPopover;
