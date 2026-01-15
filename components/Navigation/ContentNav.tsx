// imports
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { usePathname } from 'next/navigation';

// data
import { contentNavLinks } from '@/components/Navigation/nav-data';

// svgs
import PassportCompass from '@/public/svg/compass-rose.svg';

// styles
import styles from '@/components/Navigation/ContentNav.module.scss';

interface PropType {
  isSVP: boolean;
  atTop: boolean;
  scrollDirection: 'up' | 'down';
}

const ContentNav = (props: PropType) => {
  const { isSVP, atTop, scrollDirection } = props;

  let style = `${styles.content_nav}`

  if(!atTop && scrollDirection === 'down') {
    style += ` ${styles.content_nav__scrolled}`
  }

  const pathname = usePathname()
  const links = contentNavLinks({ isSVP })

  const filteredLinks = links.filter(link => (Object.prototype.hasOwnProperty.call(link, 'condition') ? link.condition : true));

  return (
    <nav className={style}>
      <Splide className={styles.content_nav_list} options={
        {
          drag: true,
          pagination: false,
          perPage: 7,
          padding: { right: 85 },
          mediaQuery: "min",
          rewind: false,
          slideFocus: false,
          fixedWidth: 'max-content',
          breakpoints: {
            1870: { // custom breakpoint where splide is disabled and all items are shown
              padding: { right: 0 },
            },
          },
          gap: '44px',
          omitEnd: true,
          classes: {
            arrow: `splide__arrow ${styles.content_nav__splide_arrow}`
          }
        }
      }>
        {filteredLinks.map((link, index) => {
          let linkClassNames = styles.content_nav_link;
          const isActiveLink = pathname === link.href;
          if (isActiveLink) {
            linkClassNames += ` ${styles.content_nav_link__active}`;
          }
          return (
            <SplideSlide key={index} className={styles.content_nav_item}>
              {link.include_passport_icon && <PassportCompass className={styles.passport_compass} />}
              <Link href={link.href} className={linkClassNames}>
                {link.label}
              </Link>
            </SplideSlide>
          )
        })}
      </Splide>
    </nav>
  );
}

export default ContentNav;
