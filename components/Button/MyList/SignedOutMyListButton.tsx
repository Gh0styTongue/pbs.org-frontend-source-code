'use client'

import PlusIcon from '@/public/svg/add.svg';
import styles from './MyListButton.module.scss';
import { useAtom } from 'jotai';
import { signinModalAtom, SignInModalStateEnum } from '@/lib/atoms/signin-modal';
import MyListButtonProps from '@/components/Button/MyList/MyListTypes';

const SignedOutMyListButton = (props: MyListButtonProps) => {
  const [_, setSigninModalOpen] = useAtom(signinModalAtom)
  const { style } = props;

  if(style === 'iconOnly') {
    return (
      <button
        className={styles.my_list_button__icon_only}
        onClick={() => setSigninModalOpen(SignInModalStateEnum.TrueWithMyListBlurb)}
        >
        <PlusIcon />
        <span className="visuallyhidden">Sign in to add to My List</span>
      </button>
    )
  } else if (style === 'kabobMenu') {
    return (
      <button
        className={styles.my_list_button__kabob_menu}
        onClick={() => setSigninModalOpen(SignInModalStateEnum.TrueWithMyListBlurb)}
        >
        <PlusIcon />
        <span>Add to My List</span>
      </button>
    )
  } else {
    return (
      <button
        className={styles.my_list_button}
        onClick={() => setSigninModalOpen(SignInModalStateEnum.TrueWithMyListBlurb)}
        >
        <PlusIcon />
        <span className="visuallyhidden">Sign in to add to</span>
        <span>My List</span>
      </button>
    )
  }
}

export default SignedOutMyListButton
