import { setRedirectCookie } from '@/lib/helpers/utils';

export const handleSignOut = () => {
  setRedirectCookie();
  sessionStorage.clear();
  localStorage.removeItem('profile');
  localStorage.removeItem('recommendedShows');
}
