import { SOCIAL_MEDIA_LINKS } from "../constants";

/**
  * Filters out a list of links to only those that are social media related
*/
export interface SocialLinkElement {
    value:      string;
    profile:    string;
    updated_at: string | Date;
}

const getSocialLinks = (links: SocialLinkElement[]): SocialLinkElement[] => {
  // @TODO we do a lot of work around social links throughoutht the site, and have
  // a few different data shapes. We should smooth that out - here would be the place to do it.
  return links.filter((link) => SOCIAL_MEDIA_LINKS.includes(link.profile));
}

export { getSocialLinks }
