'use client'

// imports
import { useAtom } from 'jotai';
import Link from 'next/link';

// lib files
import { DONATE_FALLBACK_URL } from '@/lib/constants';
import { VideoClass } from '@/lib/types/api/video';
import { stationDataAtom } from '@/lib/atoms/station-data';
import { StationData } from '@/lib/types/api/stations-data';
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';

// components
import DonateLinkButton from '@/components/Button/DonateLinkButton';
import LinkButton from '@/components/Button/LinkButton';

// svgs
import PassportCompass from '@/public/svg/compass-rose.svg';

// styles
import styles from './PassportBenefitScreen.module.scss';


interface PassportBenefitScreenProps {
  video: VideoClass;
  depStationData?: StationData;
}

const PassportBenefitScreen = (props: PassportBenefitScreenProps) => {
  const { video, depStationData } = props;
  const [_, setSigninModalOpen] = useAtom(signinModalAtom)

  let [stationData] = useAtom(stationDataAtom);

  if (!stationData) {
    if (depStationData) {
      stationData = depStationData;
    } else {
      return null;
    }
  }

  const { attributes: {
    passport_url,
    short_common_name,
    learn_more_passport_url,
    video_portal_url
  } } = stationData!;

  let passportLearnMoreUrl = null;

  if (learn_more_passport_url) {
    passportLearnMoreUrl = learn_more_passport_url;
  } else if (video_portal_url) {
    passportLearnMoreUrl = `${video_portal_url}/passport/learn-more/`;
  }

  const donateUrl = passport_url ? passport_url : DONATE_FALLBACK_URL;

  const gtmLabel = `${video.show?.title} | ${video.title} | ${video.legacy_tp_media_id} | ${video.video_type}`;

  return (
    <div className={styles.passport_benefit_screen}>
      <h2 className={styles.passport_benefit_headline}>
        <span className={styles.passport_benefit_headline_intro}>Watch this video with</span>
        <span className={styles.passport_benefit_station_lockup}>
          {short_common_name}
          <PassportCompass className={styles.passport_benefit_screen_passport_compass} />
          Passport
        </span>
      </h2>

      <p className={styles.passport_benefit_explanation}>
        Become a member of {short_common_name}, support your local community, and get extended access to PBS shows, films, and specials, like this one.
      </p>

      {passportLearnMoreUrl && (
      <Link href={passportLearnMoreUrl} className={`${styles.passport_benefit_plm_link_small} an-62_3`} data-gtm-label={gtmLabel}>
        What is Passport?
      </Link>
      )}

      <div className={styles.passport_benefit_screen_ctas}>
        <DonateLinkButton
          href={donateUrl}
          style='light_blue'
          size='min'
          className='an-62_1'
          gtmEventData={{
            feature_category: "passport benefit screen",
            feature_name: "passport benefit screen donate link",
            object_text: "Donate & Start Watching",
            object_url: donateUrl,
          }}
        >
          Donate & Start Watching
        </DonateLinkButton>

        {passportLearnMoreUrl && (
        <LinkButton href={passportLearnMoreUrl} size='min' className={`${styles.passport_benefit_plm_link_lg} an-62_3`} gtmLabel={gtmLabel}>
          What is Passport?
        </LinkButton>
        )}
      </div>

      <p className={styles.passport_benefit_screen_support}>
        Already a Member of {short_common_name}?
        <button
          className={`${styles.passport_benefit_screen_signin_button} an-62_2`}
          onClick={() => setSigninModalOpen(SignInModalStateEnum.True)}
          data-gtm-label={gtmLabel}
        >Sign In</button> or
        <Link
          href="https://www.pbs.org/passport/lookup/"
          target="_blank"
        >Check to see</Link> |
        <Link
          href="https://help.pbs.org/support/solutions/5000121793"
          target="_blank"
          >
          Contact {short_common_name} Support
          </Link>
      </p>
    </div>

  );
};

export default PassportBenefitScreen;
