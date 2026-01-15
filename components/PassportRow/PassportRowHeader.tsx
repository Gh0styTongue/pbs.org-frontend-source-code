'use client'

// imports
import { useAtom } from 'jotai';
import Link from 'next/link';

// lib files
import { DONATE_FALLBACK_URL } from '@/lib/constants';
import { userProfile } from '@/lib/atoms/profile';
import { StationData } from '@/lib/types/api/stations-data';
import { useHasMounted } from '@/lib/hooks';

// components
import DonateLinkButton from '@/components/Button/DonateLinkButton';
import LinkButton from '@/components/Button/LinkButton';

// styles
import styles from './PassportRowHeader.module.scss';

interface PassportRowHeaderProps {
  stationData: StationData;
  depIsPassportMember?: boolean;
  displayDonateCTA?: boolean;
  displayLearnMoreCTA?: boolean;
}

const PassportRowHeader = (props: PassportRowHeaderProps) => {
  const hasMounted = useHasMounted();

  const [profile] = useAtom(userProfile)
  // Checks if component is mounted on the client before attempting to
  // hydrate, otherwise a hydration error occurs
  if (!hasMounted) {
    return null;
  }

  const {
    stationData,
    depIsPassportMember = false,
    displayLearnMoreCTA = true,
    displayDonateCTA = true,
  } = props;

  const { attributes: station_info } = stationData;

  const {
    short_common_name,
    passport_url,
    learn_more_passport_url,
    video_portal_url
  } = station_info;

  const isPassportMember =
    // did we pass the depIsPassportMember prop (e.g. from storybook or tests)
    depIsPassportMember ||
    // are they is_passport
    profile?.personal_data?.is_passport;

  let passportLearnMoreUrl = null;

  if (learn_more_passport_url) {
    passportLearnMoreUrl = learn_more_passport_url;
  } else if (video_portal_url) {
    passportLearnMoreUrl = `${video_portal_url}/passport/learn-more/`;
  }

  const donateUrl = passport_url ? passport_url : DONATE_FALLBACK_URL;

  if (isPassportMember) {
  return (
    <div className={styles.passport_row_header}>
      <h2 className={styles.passport_row_title}>
        Available with your {short_common_name} Passport benefit
      </h2>
      <p className={styles.passport_row_description}>
        Thank you for being a member! You are supporting America’s largest classroom, the nation’s largest stage for the arts and a trusted window into the world.
      </p>
      <div className={styles.passport_row_ctas}>
        <LinkButton
          href="/explore/passport/"
          className={styles.passport_row_explore_button}
        >
          Explore the Best of Passport
        </LinkButton>
      </div>
    </div>
  )} else {
    return (
      <div className={styles.passport_row_header}>
        <h2 className={styles.passport_row_title}>
          Watch with {short_common_name} Passport
        </h2>
        <p className={styles.passport_row_description}>
          {"Support your local station and get extended access to your favorite PBS shows & films.   "}
          {passportLearnMoreUrl && displayLearnMoreCTA && (
            <Link
              href={passportLearnMoreUrl}
              className={styles.passport_row_learn_more_link}
            >
              What is Passport?
            </Link>
          )}
        </p>
        {(displayDonateCTA || displayLearnMoreCTA) && (
          <div className={styles.passport_row_ctas}>
            {displayDonateCTA && (
              <DonateLinkButton
                href={donateUrl}
                style={'light_blue'}
                className={styles.passport_row_donate_button}
                gtmEventData={{
                  feature_category: "passport row",
                  feature_name: "passport row donate link",
                  object_text: "Donate & Start Watching",
                  object_url: donateUrl,
                }}
              >
                Donate & Start Watching
              </DonateLinkButton>
            )}
            {displayLearnMoreCTA && passportLearnMoreUrl && (
              <LinkButton
                href={passportLearnMoreUrl}
                className={styles.passport_row_learn_more_link_button}
              >
                What is Passport?
              </LinkButton>
            )}
        </div>
        )}
      </div>
    )
  };
};

export default PassportRowHeader;
