'use client'

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userProfile } from '@/lib/atoms/profile';
import SignedInMyListButton from '@/components/Button/MyList/SignedInMyListButton'
import SignedOutMyListButton from '@/components/Button/MyList/SignedOutMyListButton'
import { ProfileData } from '@/lib/types/api/profile-data';
import MyListButtonProps from '@/components/Button/MyList/MyListTypes';

type Profile = ProfileData | undefined | null

const MyListButton = (props: MyListButtonProps) => {
  let profile: Profile = props?.profileStub

  if(!profile) {
    // React Hooks must be called in the exact same order in every component render.
    // However this is neccessary to force in a stub, and will not change client side
    // in production at run time, making this a safe exception.
    [profile] = useAtom(userProfile)
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if(isClient) {
    if(profile) {
      return <SignedInMyListButton {...props} />
    } else {
      return <SignedOutMyListButton {...props} />
    }
  }

  return <></>
}

export default MyListButton
