import styles from './SponsorshipLogos.module.scss';
import ITSImage from '@/components/ITSImage/ITSImage';

interface Sponsor {
  url: string;
  image: string;
  title: string;
}
interface SponsorshipLogosProps {
  sponsorshipLogos?: Sponsor[];
  className?: string;
  sponsorshipLogosPagePosition: 'top' | 'bottom';
}

const SponsorshipLogos = (props: SponsorshipLogosProps) => {
  const { sponsorshipLogos, className, sponsorshipLogosPagePosition } = props;

  let shouldReturnComponent = false;
  let shouldShowLogosIntro = false;

  let trimmedSponsorshipLogos: Sponsor[] = [];

  switch(true) {
    case !sponsorshipLogos:
    case sponsorshipLogos?.length === 0:
      shouldReturnComponent = false;
      break;
    // if this is the top of the page logos
    case sponsorshipLogosPagePosition === 'top':
      if (sponsorshipLogos && sponsorshipLogos.length > 0) {
        shouldReturnComponent = true;
        shouldShowLogosIntro = true;
        // we support up to 8 logos
        // we display the first three logos at mobile, an all of them at desktop
        trimmedSponsorshipLogos = sponsorshipLogos?.slice(0, 8);
      }
      break;
    // if this is the bottom of the page logos
    case sponsorshipLogosPagePosition === 'bottom':
      // We only return a component if there are more than 3, and we display 3-8.
      if(sponsorshipLogos && sponsorshipLogos?.length > 3) {
        shouldReturnComponent = true;
        trimmedSponsorshipLogos = sponsorshipLogos?.slice(3, 8);
      }
      break;
    default:
      shouldReturnComponent = false;
      break;
  }

  const getSponsorLinkClassName = (index: number) => {
    let returnedClassName = styles.sponsor_link;
    if (sponsorshipLogosPagePosition === 'top' && index > 2) {
      // if this is more than the 3rd logo, make it visible above $sm
      // see global class in _base.scss
      returnedClassName += ' visible_above_sm';
    }
    return returnedClassName;
  }

  if (shouldReturnComponent) {
    return (
      <div className={`${styles.sponsorship_logos_wrapper}${className ? ` ${className}` : ''}`}>
        {shouldShowLogosIntro &&  (
          <p className={styles.sponsorship_logos_intro}>Support provided by:</p>
        )}
        <div className={styles.sponsor_logos}>
          {trimmedSponsorshipLogos.map((sponsor, index) => (
            <a className={getSponsorLinkClassName(index)} href={sponsor.url} key={index}>
              <ITSImage
                src={sponsor.image}
                alt={sponsor.title}
                width={75}
                className={styles.sponsor_logo}
              />
            </a>
          ))}
        </div>
      </div>
    );
  }
};

export default SponsorshipLogos;
