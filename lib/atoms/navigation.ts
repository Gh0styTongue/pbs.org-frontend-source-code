import { atom } from 'jotai';


export enum NavigationStateEnum {
  Default = 'default',
  MobileMenuOpen = 'MobileMenuOpen',
  SearchMenuOpen = 'SearchMenuOpen',
  StationMenuOpen = 'StationMenuOpen',
  MyListMenuOpen = 'MyListMenuOpen',
  DonateMenuOpen = 'DonateMenuOpen',
  UserMenuOpen = 'UserMenuOpen',
  SignInMenuOpen = 'SignInMenuOpen',
}

export const navigationAtom = atom(NavigationStateEnum.Default);
