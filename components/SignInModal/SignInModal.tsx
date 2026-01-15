'use client';

// imports
import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';

// lib files
import { INTERNALLY_NAVIGATING_KEY } from '@/lib/constants';
import { setRedirectCookie } from '@/lib/helpers/utils';
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';
import { isEmpty } from '@/lib/helpers/empty';

// constants
import { ORIGIN_STRING } from "@/lib/constants";

// components
import Modal from '@/components/Modal/Modal';

// svgs
import AppleLogo from '@/public/svg/apple.svg';
import FacebookLogo from '@/public/svg/facebook-circle.svg';
import GoolgeLogo from '@/public/svg/google.svg';
import PBSLogotype from '@/public/svg/pbs-logotype-white--blue-fill-face.svg';

// styles
import styles from '@/components/SignInModal/SignInModal.module.scss';
import { useHasMounted } from '@/lib/hooks';
import { canAccessStorage } from '@/lib/helpers/is-storage-available';
import { SocialLogin } from '@/lib/types/sso/login';
import { ssoLoginLink, ssoRegisterLink } from '@/lib/helpers/sso-links';

export interface SignInModalProps {
  depIsOpen?: SignInModalStateEnum;
  onClose?: () => void;
  onLinkClick?: (behavior?: string) => void;
  returnPath?: string;
  activation?: boolean;
}

function SignInModal(props: SignInModalProps) {
  const { depIsOpen, onClose, onLinkClick, returnPath, activation = false } = props;

  const [isSigninModalOpen, setSigninModalOpen] = useAtom(signinModalAtom)
  const hasMounted = useHasMounted();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // if we have a showSignIn query param, open the modal
    if (params.get('showSignIn') === 'true') {
      setSigninModalOpen(SignInModalStateEnum.True);
      // remove only the showSignIn query param, and keep other params
      params.delete('showSignIn');
      const newParams = params.toString();
      const newUrl = window.location.pathname + (newParams ? '?' + newParams : '');
      window.history.replaceState({}, '', newUrl);
    }
  }, [isSigninModalOpen, setSigninModalOpen])

  const showModal =
    depIsOpen && depIsOpen !== SignInModalStateEnum.False ? true :
    isSigninModalOpen !== SignInModalStateEnum.False;

  const showMyListBlurb =
    depIsOpen && depIsOpen === SignInModalStateEnum.TrueWithMyListBlurb ? true :
    isSigninModalOpen === SignInModalStateEnum.TrueWithMyListBlurb;

  const signInLink = useCallback((social?: SocialLogin) => {
    if(!hasMounted) return
    return ssoLoginLink({ activation, social })
  }, [hasMounted, activation])

  const registerLink = useCallback(() => {
    if(!hasMounted) return
    return ssoRegisterLink({ activation })
  }, [hasMounted, activation])

  const handleLinkClick = useCallback((behavior: string) => {
    const params = new URLSearchParams(window.location.search);

    let signInReturnURL: string | undefined = window.location.href;

    if ((returnPath && returnPath !== '')) {
      const hostname = isEmpty(ORIGIN_STRING) ? `https://${window.location.host}` : ORIGIN_STRING
      signInReturnURL = `${hostname}${returnPath}`;
    } else if (params.get('returnURL')) {
      signInReturnURL = params.get('returnURL') || undefined;
    }

    if (onLinkClick) {
      onLinkClick(behavior);
    }
    if (canAccessStorage('sessionStorage')) {
      sessionStorage.setItem(INTERNALLY_NAVIGATING_KEY, 'false');
    }
    setRedirectCookie(signInReturnURL);
  }, [returnPath, onLinkClick]);

  const handleModalClose = () => {
    if (onClose) {
      onClose();
    }
    setSigninModalOpen(SignInModalStateEnum.False);
  }

  return (
    <Modal
      isOpen={showModal}
      className={styles.signin_modal}
      innerClassName={styles.signin_modal_inner}
      onClose={handleModalClose}
    >
      <PBSLogotype className={styles.pbs_head_logo} />

      { showMyListBlurb && (
        <p className={styles.my_list_blurb}>
          Sign in to add shows and videos to My List and save watch progress across any device.
        </p>
      )}

      {/* Using <a> so that next doesn't append a trailing slash to these sso routes */}
      <a href={signInLink()} onClick={() => handleLinkClick('email sign in')} className={styles.email_btn}>
        Sign in with Email
      </a>

      <p className={styles.create_account}>
        New to PBS?<>&nbsp;</>
        {/* Using <a> so that next doesn't append a trailing slash to these sso routes */}
        <a href={registerLink()} onClick={() => handleLinkClick('create account')}>
          Create an account
        </a>
      </p>
      <p className={styles.or}>or</p>

      {/* Using <a> so that next doesn't append a trailing slash to these sso routes */}
      <a href={signInLink('google')} onClick={() => handleLinkClick('google')} className={styles.social_btn}>
        <GoolgeLogo className={styles.google_logo} />
        Continue with Google
      </a>

      {/* Using <a> so that next doesn't append a trailing slash to these sso routes */}
      <a href={signInLink('facebook')} onClick={() => handleLinkClick('facebook')} className={styles.social_btn}>
        <FacebookLogo className={styles.facebook_logo} />
        Continue with Facebook
      </a>

      {/* Using <a> so that next doesn't append a trailing slash to these sso routes */}
      <a href={signInLink('apple')} onClick={() => handleLinkClick('apple')} className={styles.social_btn}>
        <AppleLogo className={styles.apple_logo} />
        Continue with Apple
      </a>

      <p className={styles.disclaimer}>
      By creating an account, you acknowledge that PBS may share your information with our member stations and our respective service providers, and that you have read and understand the<>&nbsp;</>
        <Link
          href="https://www.pbs.org/about/policies/privacy-policy/"
          target="_blank"
          prefetch={false}
          rel="noopener noreferrer">Privacy Policy</Link>
      <>&nbsp;</>and<>&nbsp;</>
        <Link
          href="https://www.pbs.org/about/policies/terms-of-use/"
          target="_blank"
          prefetch={false}
          rel="noopener noreferrer">Terms of Use</Link>.
      </p>
    </Modal>
  )
}

export default SignInModal;
