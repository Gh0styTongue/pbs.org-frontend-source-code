'use client'

// imports
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import React, { ReactElement, useState, useRef, useEffect, KeyboardEvent } from 'react';

// lib files
import { continueWatchingAtom } from '@/lib/atoms/continueWatching';
import { ShowDetails } from '@/lib/types/api/show-data';
import { userProfile } from '@/lib/atoms/profile';

// components
import Tab from '@/components/Tab/Tab';

// styles
import styles from './TabContainer.module.scss';

export interface TabData {
  title: string;
  content: ReactElement;
}
export interface TabContainerProps {
  tabs: TabData[];
  defaultActiveTab?: number;
  show?: ShowDetails;
}

const TabContainerProps: React.FC<TabContainerProps> = ({tabs, defaultActiveTab = 1, show}) => {
  const [continueWatchingData] = useAtom(continueWatchingAtom);
  const [profile] = useAtom(userProfile)
  // defaults selected tab to be the first in the list
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [onDefaultTab, setOnDefaultTab] = useState(true);
  const pathname = usePathname();
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<number>(activeTab);

  const handleTabClick = (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    // prevents the page from jumping to the corresponding section on tab clicks
    event.preventDefault();
    setOnDefaultTab(false);
    // update current tab to be the active tab
    setActiveTab(index)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    // left arrow moves one tab to the left
    if (event.key === 'ArrowLeft' && activeTab > 1) {
      setActiveTab(activeTab - 1)
      setOnDefaultTab(false);
    // right arrow moves one tab to the right
    } else if (event.key === 'ArrowRight' && activeTab < tabs.length) {
      setActiveTab(activeTab + 1)
      setOnDefaultTab(false);
    // shift + tab moves focus to active tab
    } else if (event.key === 'ArrowDown') {
      // Find the active tab's panel
      const activePanelId = `section${activeTab}`;
      const activePanel = document.getElementById(activePanelId);
      if (activePanel) {
        activePanel.focus();
      };
    };
  };

  useEffect(() => {
    // Sets the active tab (on first render only) to the specials tab if all the following conditions are met:
    // 1. The user is logged in
    // 2. The current page is a show page
    // 3. The show is in the continue watching list
    // 4. The continue watching video is a special
    const continueWatchingVideo = continueWatchingData?.find((video) => {
      return video.show.slug === show?.slug;
    });
    const isLoggedIn = profile !== undefined;
    const isShowPage = pathname.startsWith("/show/");
    const isShowInContinueWatchingData = continueWatchingVideo !== undefined;
    const shouldDefaultToSpecialsTab = (
      isLoggedIn &&
      isShowInContinueWatchingData &&
      continueWatchingVideo.parent.resource_type === 'special' &&
      isShowPage
    );

    const specialsTabIndex = tabs.findIndex((tab) => {
      const title = tab.title.toLowerCase();
      return title === 'specials' || title === 'special';
    });

    if (shouldDefaultToSpecialsTab) {
      setActiveTab(specialsTabIndex + 1);
    }
    // deliberately only running this after the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update focus to currently selected tab by finding the
    // element with aria-selected="true" and focusing on it
    const selectedTabElement = tabsRef.current?.querySelector('[aria-selected="true"]') as HTMLElement;
    if (selectedTabElement) {
      selectedTabElement.focus();
    }
    activeTabRef.current = activeTab;
  }, [activeTab]);

  return (
    <div className={styles.tab_container} ref={tabsRef}>
        <ul className={styles.tabs} role={'tablist'}>
          {tabs.map((tab, index)=>{
            // Using one-based indexing here since it translates to better
            // readbility for the user when assigning ARIA labels
            index++
            if (tab.title && tab.content) {
              return (
                <Tab
                  key={`tab-${index}`}
                  title={tab.title}
                  handleClick={(e)=>{handleTabClick(e, index)}}
                  handleKeyPress={(e) => handleKeyPress(e)}
                  onDefaultTab={onDefaultTab}
                  isActive={activeTab === index}
                  index={index}
                />
              )
            }
          })}
        </ul>
        <div className={styles.tab_sections}>
          {tabs.map((tab, index)=>{
            index++
            const isActive = index === activeTab
            if (tab.title && tab.content) {
              return (
                <section
                  key={`$tab-panel-${index}`}
                  aria-labelledby={`tab${index}`}
                  hidden={!isActive ? true : undefined}
                  className={styles.tab_panel}
                  id={`section${index}`}
                  role="tabpanel"
                  tabIndex={-1} >
                {tab.content}
                </section>
              )
            }
          })}
        </div>
      </div>
    );
}

export default TabContainerProps;
