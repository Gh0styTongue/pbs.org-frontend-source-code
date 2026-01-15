import { atom } from 'jotai';

// Should be:
// 'false' | 'true' | 'trueWithMyListBlurb'
export enum SignInModalStateEnum {
  False = 'false',
  True = 'true',
  TrueWithMyListBlurb = 'trueWithMyListBlurb',
}

export const signinModalAtom = atom(SignInModalStateEnum.False)
