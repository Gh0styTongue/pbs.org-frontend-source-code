// lib files
import { VideoClass } from '@/lib/types/api/video';

// components
import SponsorshipText from '@/components/SponsorshipText/SponsorshipText';
import SponsorshipLogos from '@/components/SponsorshipLogos/SponsorshipLogos';
import VideoHelp from '@/components/VideoHelp/VideoHelp';

// styles
import styles from './SponsorshipVideoHelpRow.module.scss';
export interface Sponsor {
  url: string;
  image: string;
  title: string;
}
interface SponsorshipVideoHelpRowProps {
  id?: string;
  className?: string;
  title: string;
  source: {
    local_content_stations?: string[];
    funder_message?: string;
    sponsor_logos?: Sponsor[];
  };
  sponsorInfoLink?: string;
  sponsorshipLogosPagePosition: 'top' | 'bottom';
  // the absence of one of these props means that it should be visible at all breakpoints
  sponsorshipRowVisbility?: 'mobile' | 'desktop';
  sponsorshipTextVisibility?: 'mobile' | 'desktop';
  includeVideoHelp?: boolean;
  video?: VideoClass;
}

const SponsorshipVideoHelpRow: React.FC<SponsorshipVideoHelpRowProps> = (props) => {
  const {
    className,
    id,
    includeVideoHelp = false,
    source,
    sponsorInfoLink,
    sponsorshipLogosPagePosition,
    sponsorshipRowVisbility,
    sponsorshipTextVisibility,
    title,
    video,
  } = props;

  let responsiveClass = '';

  if (sponsorshipRowVisbility === 'mobile') {
    responsiveClass = ' visible_below_sm';
  } else if (sponsorshipRowVisbility === 'desktop') {
    responsiveClass = ' visible_above_sm';
  }

  const shouldRender =
    includeVideoHelp ||
    source.funder_message != '' ||
    (source.sponsor_logos && source.sponsor_logos?.length > 0) ||
    (source.local_content_stations && source.local_content_stations?.length > 0);

  if (shouldRender) {
    return (
      <div className={`${styles.sponsorship_video_help_row}${className ? ` ${className}` : ''}${responsiveClass}`} id={id}>
        <div>
          { includeVideoHelp && video && <VideoHelp className={styles.sponsorship_video_help_row_video_help} video={video} /> }
          <SponsorshipText
            title={title}
            source={source}
            sponsorInfoLink={sponsorInfoLink}
            className={styles.sponsorship_video_help_row_text}
            sponsorshipTextVisibility={sponsorshipTextVisibility} />

        </div>
        <SponsorshipLogos
          sponsorshipLogos={source.sponsor_logos}
          sponsorshipLogosPagePosition={sponsorshipLogosPagePosition} />
      </div>
    );
  } else {
    return null;
  }
};

export default SponsorshipVideoHelpRow;
