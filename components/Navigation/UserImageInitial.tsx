'use client'

// imports
import Image from 'next/image';
import { useState, useEffect } from 'react';

// lib files
import { isEmpty } from '@/lib/helpers/empty';
import { ProfileData } from "@/lib/types/api/profile-data";

// svgs
import PassportCompass from '@/public/svg/compass-rose.svg';

// styles
import styles from './UserImageInitial.module.scss';

interface UserImageInitialProps {
  profile: ProfileData;
  className?: string;
}

const UserImageInitial = (props: UserImageInitialProps) => {
  const {
    profile,
    className,
  } = props;

  const { personal_data, profile: profileData } = profile;

  const [isPassport, setIsPassport] = useState(false)
  const [userInitial, setUserInitial] = useState('')
  const [profileImage, setProfileImage] = useState('')

  // variable effect
  useEffect(() => {
    if(profile && !isEmpty(profile)) {
      setIsPassport(personal_data?.is_passport)
      setProfileImage(profileData?.thumbnail_url)
      setUserInitial(profileData?.first_name?.[0])
    }
  }, [profile, profileData, personal_data?.is_passport, profileData?.thumbnail_url, profileData?.first_name])

  return (
    <div className={`${styles.user} ${className}`}>
      { profileImage ?
        <Image
          alt={profileData.first_name}
          src={profileImage}
          className={styles.profile_icon}
          width={64}
          height={64}
        />
      :
        <span className={styles.profile_initial_thumbnail}>{userInitial}</span>
      }

      { isPassport  && (
        <PassportCompass className={styles.profile_passport_compass} />
      )}
    </div>
  );
};

export default UserImageInitial;
