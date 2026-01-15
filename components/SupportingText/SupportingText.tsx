'use client'

// imports
import React, { useState } from 'react';

// lib files
import { SupportingText as SupportingTextProps } from '@/lib/types/api/show-data';

// components
import Button from '@/components/Button/Button';

// styles
import styles from '@/components/SupportingText/SupportingText.module.scss';

function SupportingText({ title, text, text_secondary, className }: SupportingTextProps) {
  const [showSecondary, setShowSecondary] = useState(false)
  const handleToggle = () => setShowSecondary(prevState => !prevState)

  let secondaryTextStyles = styles.secondary_text

  if(!showSecondary) {
    secondaryTextStyles += ` ${styles.hidden}`
  }

  let classNames = `${styles.supporting_text}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <div className={classNames}>
      <h3 className={styles.title}>{title}</h3>
       { text && (
         <div dangerouslySetInnerHTML={{ __html: text}} />
       )}

      {text_secondary && (
      <>
        <Button
          style='white_ghost'
          onClick={handleToggle}
          iconAfter={showSecondary ? 'up' : 'down'}
          className={styles.toggle_button}
        >
          {showSecondary ? `Read Less` : `Read More`}
        </Button>

        <div className={secondaryTextStyles} dangerouslySetInnerHTML={{ __html: text_secondary}} />
      </>
      )}
    </div>
  )
}

export default SupportingText
