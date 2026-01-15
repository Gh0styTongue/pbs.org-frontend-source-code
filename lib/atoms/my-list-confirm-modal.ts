import { atom } from 'jotai';

export enum MyListConfirmModalTypeEnum {
  SHOW = 'show',
  VIDEO = 'video',
  VIEWING_HISTORY = 'viewing-history',
  DEFAULT = '',
}
export interface MyListConfirmModalState {
  isOpen: boolean;
  id: string | null;
  slug: string | null;
  title: string | null;
  type: MyListConfirmModalTypeEnum;
}

export const defaultMyListConfirmModalState = {
  isOpen: false,
  id: null,
  slug: null,
  title: null,
  type: MyListConfirmModalTypeEnum.DEFAULT,
}

export const myListConfirmModalAtom = atom<MyListConfirmModalState>(defaultMyListConfirmModalState)
