// imports
import { useEffect, useRef, useState } from "react";
import useThrottledCallback from '@/lib/hooks/useThrottledCallback';
import useWindowResize from "@/lib/hooks/useWindowResize";

// styles
import styles from "./ExpandableText.module.scss"

interface ExpandableTextProps {
  text: string;
  className?: string;
}

const ExpandableText = ({ text, className }: ExpandableTextProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const onWindowResize = useWindowResize();
  
  // Detects if the text is truncated
  // by checking if the scrollHeight is greater than the clientHeight
  // https://github.com/closeio/use-is-truncated/blob/master/src/index.js
  const checkTruncation = () => {
    const el = textRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  };

  const resetAndCheckTruncation = () => {
    setExpanded(false); 
    checkTruncation();
  };

  // The initial check for truncation
  useEffect(() => {
    checkTruncation();  
  });

  // Then, if the window is resized, we collapse the text and check the truncation again
  // to prevent the button from showing when it shouldn't.
  onWindowResize(useThrottledCallback(() => {
    resetAndCheckTruncation();
  }));
  
  return (
    <div className={className}>
      <p
        ref={textRef}
        className={`${expanded ? styles.expanded : ""}`}
      >
        {text}
      </p>
      {isTruncated && (
        <button
          className={styles.expandable_toggle_button}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;