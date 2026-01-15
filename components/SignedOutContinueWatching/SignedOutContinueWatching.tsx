'use client'
import { useAtom } from 'jotai';
import { userProfile } from '@/lib/atoms/profile';

import styles from './SignedOutContinueWatching.module.scss';
import Image from 'next/image';
import signedOutContinueWatchingSixPosters from '@/public/images/continue_watching/signed-out-continue-watching-posters-6.png';
import signedOutContinueWatchingThreePosters from '@/public/images/continue_watching/signed-out-continue-watching-posters-3.png';
import Button from '../Button/Button';
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';
import { useHasMounted } from '@/lib/hooks';

const SignedOutContinueWatching = () => {
  const hasMounted = useHasMounted();
  const [_, setSigninModalOpen] = useAtom(signinModalAtom)
  const [ profile ] = useAtom(userProfile);

  // Checks if component is mounted on the client before attempting to
  // hydrate, otherwise a hydration error occurs
  if (!hasMounted) {
    return null;
  }

  // we only want this to render if we aren't signed in
  if (!profile) {
    return (
      <div className={styles.signed_out_continue_watching}>
        <h2>Continue Watching</h2>
        <div className={styles.signed_out_continue_watching_image_wrapper}>
          <Image
            src={signedOutContinueWatchingSixPosters}
            alt=""
            width={1395}
            height={370}
            className={styles.signed_out_continue_watching_image_large}
          />
          <Image
            src={signedOutContinueWatchingThreePosters}
            alt=""
            width={750}
            height={408}
            className={styles.signed_out_continue_watching_image_small}
          />

          <div className={styles.signed_out_continue_watching_overlay}>
            <p>Dive back in right where you left off.</p>

            <Button
              className={styles.signed_out_continue_watching_button}
              onClick={() => setSigninModalOpen(SignInModalStateEnum.True)}
              >
              <span>Sign In to Access</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return null;
}

export default SignedOutContinueWatching;
