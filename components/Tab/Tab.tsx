'use client'

import React from 'react';
import styles from './Tab.module.scss';

interface Tab {
  title: string;
  handleClick: React.MouseEventHandler<HTMLAnchorElement>;
  handleKeyPress: React.KeyboardEventHandler<HTMLAnchorElement>;
  isActive: boolean;
  onDefaultTab: boolean;
  index: number;
}

const Tab: React.FC<Tab> = ({title, handleClick, handleKeyPress, isActive, index, onDefaultTab}) => {
    return (
      <li role={'presentation'}>
        <a
          id={`tab${index}`}
          aria-selected={(isActive && !onDefaultTab) ? 'true': undefined}
          className={`${styles.tab_link} ${isActive && styles.is_active}`}
          href={`#${title}`}
          onClick={handleClick}
          onKeyDown={handleKeyPress}
          tabIndex={!isActive ? -1 : undefined}
          role={'tab'}
          >
            {title}
        </a>
      </li>
    );
}

export default Tab;
