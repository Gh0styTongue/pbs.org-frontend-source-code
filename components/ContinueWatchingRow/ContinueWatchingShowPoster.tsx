// imports
import { Dispatch, SetStateAction } from 'react';
import Link from "next/link";

// lib files
import { ContinueWatchingContent } from "@/lib/types/api/home-data";
import { ProfileData } from '@/lib/types/api/profile-data';
import { ShowRowContent } from "@/lib/types/api/show-data";

// components
import Badge from "@/components//Badge/Badge";
import IconButton from "@/components//Button/IconButton";
import ITSImage from "@/components//ITSImage/ITSImage";
import UserProgressBar from "@/components/UserProgressBar/UserProgressBar";

// svgs
import CloseIcon from "@/public/svg/close.svg";
import PagesIcon from "@/public/svg/pbs-pages.svg";
import PlayIcon from "@/public/svg/play.svg";

// styles
import styles from '@/components/ContinueWatchingRow/ContinueWatchingShowPoster.module.scss';

interface ContinueWatchingShowPosterProps {
  show: ContinueWatchingContent["show"] | ShowRowContent;
  type: 'continueWatching' | 'myListShow';
  video?: ContinueWatchingContent;
  isOpen: boolean;
  setPosterWithOpenMenu: Dispatch<SetStateAction<string>>;
  profileStub?: ProfileData;
  handleRemoveShowClick?: (show: ShowRowContent, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CONTINUE_WATCHING_TYPES = {
  continueWatching: "Continue Watching",
  myListShow: "My List",
}

const ContinueWatchingShowPoster: React.FC<ContinueWatchingShowPosterProps> = (props) => {
  const { show, type, video, isOpen, setPosterWithOpenMenu, handleRemoveShowClick } = props;
  const isContinueWatching = type === "continueWatching";
  const title = show.title;
  let videoURL;
  let showURL;
  let linkHref;
  let slug;
  let image;
  let menuText;
  let menuTextLong;

  if (isContinueWatching && video) {
    slug = video?.slug;
    videoURL = `/video/${slug}/`;
    showURL = `/show/${show.slug}/`;
    linkHref = videoURL;

    if(video.parent.season?.ordinal) {
      menuText = menuTextLong = `S${video.parent.season.ordinal} Ep${video.parent.ordinal}`;
    } else {
      menuText = menuTextLong = 'Start Watching'
    }
    
    if ("show-poster2x3" in show) {
      image = show["show-poster2x3"]
    }
  } else {
    slug = show.slug;
    showURL = `/show/${slug}/`;
    linkHref = showURL;
    menuText = 'Watch';
    menuTextLong = 'Start Watching';
    if ((show as ShowRowContent).images?.['show-poster2x3']) {
      image = (show as ShowRowContent).images['show-poster2x3'];
    } else if ((show as ShowRowContent).images?.['asset-kids-mezzanine1-16x9']){
      image = (show as ShowRowContent).images['asset-kids-mezzanine1-16x9'];
    } else if ((show as ShowRowContent).image) {
      image = (show as ShowRowContent).image;
    }
  }

  const handleKabobClick = () => {
    // Set or unset clicked show as posterWithOpenMenu
    if (isOpen) {
      // if the menu is already open, the menu will close
      setPosterWithOpenMenu('');
    } else {
      // if the menu is not open;
      // open it by setting a video or show title
      if (video) {
        setPosterWithOpenMenu(video.title)
      } else {
        setPosterWithOpenMenu(show.title)
      }
    }
  }

    return (
      <div className={styles.continue_watching_show_poster}>
        <Link href={linkHref} className={styles.continue_watching_show_poster__wrapper}>
          {image ? (
            <ITSImage
              src={image}
              alt={title}
              width={227}
              height={340}
            />
          ) : (
            <div className={styles.continue_watching_show_poster__fallback}>
              <span>{title}</span>
            </div>
          )}
          <div className={styles.badges}>
            {isContinueWatching ?
              (
                <>
                  <Badge
                    style="coral_midnight"
                    className={styles.continue_watching_show_poster__badge_long_cw}
                  >
                  {`${CONTINUE_WATCHING_TYPES[type]}`}
                  </Badge>
                  <Badge
                    style="coral_midnight"
                    className={styles.continue_watching_show_poster__badge_short_cw}
                  >
                    CONTINUE
                  </Badge>
                </>
              ) : (
                <Badge
                  style="teal_midnight"
                  className={styles.continue_watching_show_poster__badge_my_list}
                >
                  {`${CONTINUE_WATCHING_TYPES[type]}`}
                </Badge>
              )
            }
          </div>
          {isContinueWatching && video &&
            <UserProgressBar
              slug={video.slug}
              className={styles.continue_watching_show_poster__progress_bar}
            />
          }
          </Link>
          {isOpen && isContinueWatching && (
            <div>
              <ul className={styles.continue_watching_menu__wrapper}>
                <li>
                  <Link 
                    href={linkHref}
                    className={styles.continue_watching_menu__link}
                    >
                    <PlayIcon />
                    <span className={styles.continue_watching_menu__text_long}>Continue Watching</span>
                    <span className={styles.continue_watching_menu__text}>Continue</span>
                  </Link>
                </li>
                {/* TODO: Pass show's preview video url
                  from CS and add here if it exists */}
                <li>
                  <Link 
                    href={showURL}
                    className={styles.continue_watching_menu__link}
                    >
                    <PagesIcon />
                    <span className={styles.continue_watching_menu__text_long}>Explore Show</span>
                    <span className={styles.continue_watching_menu__text}>Explore</span>
                  </Link>
                </li>
              </ul>
            </div>
         )}
         {isOpen && !isContinueWatching &&
          (<div>
            <ul className={styles.continue_watching_menu__wrapper}>
              <li>
                <Link 
                  href={linkHref}
                  className={styles.continue_watching_menu__link}
                  >
                  <PlayIcon />
                  <span className={styles.continue_watching_menu__text_long}>Start Watching</span>
                  <span className={styles.continue_watching_menu__text}>Watch</span>
                </Link>
              </li>
              {/* TODO: Pass show's preview video url
                from CS and add here if it exists */}
              <li>
                <Link 
                  href={showURL}
                  className={styles.continue_watching_menu__link}
                  >
                  <PagesIcon />
                  <span className={styles.continue_watching_menu__text_long}>Explore Show</span>
                  <span className={styles.continue_watching_menu__text}>Explore</span>
                </Link>
              </li>
              <li>
                <a
                  href={"#"}
                  onClick={(e) => handleRemoveShowClick?.(show as ShowRowContent, e)}
                  className={styles.continue_watching_menu__link}
                  >
                    <CloseIcon />
                    Remove
                </a>
              </li>
            </ul>
          </div>
          )}

        <div className={styles.continue_watching_menubar__wrapper}>
          <Link href={linkHref} className={`${styles.continue_watching_menubar__text} ${styles.continue_watching_menu__link}`}>
            <PlayIcon className={styles.continue_watching_menubar__play_icon}/>
            <span className={styles.continue_watching_menubar__menu_text}>{menuText}</span>
            {menuTextLong && <span className={styles.continue_watching_menubar__menu_text_long}>{menuTextLong}</span>}
          </Link>
          <div className={styles.continue_watching_menubar__icons} onClick={handleKabobClick}>
              {isOpen ?
                (
                  <IconButton
                    icon="close"
                    title="Toggle Menu"
                    className={styles.continue_watching_menubar__close_icon}
                  />
                  ) : (
                  <IconButton
                    icon="kabob"
                    title="Toggle Menu"
                    className={styles.continue_watching_menubar__kabob_icon}
                  />
                )
              }
          </div>
        </div>
      </div>
    );
  }

export default ContinueWatchingShowPoster;
