import { ExploreTopicLabelEnum, ExploreTopicRouteEnum } from "@/lib/constants";
interface ConditionalTypes {
  isSVP: boolean;
}

export const contentNavLinks = (conditions: ConditionalTypes) => ([
  { label: 'My Station', href: '/', condition: conditions.isSVP },
  { label: 'Featured', href: '/', condition: !conditions.isSVP},
  { label: ExploreTopicLabelEnum.Drama, href: ExploreTopicRouteEnum.Drama },
  { label: ExploreTopicLabelEnum.DocumentariesAndIndieFilms, href: ExploreTopicRouteEnum.DocumentariesAndIndieFilms },
  { label: ExploreTopicLabelEnum.History, href: ExploreTopicRouteEnum.History },
  { label: ExploreTopicLabelEnum.NewsAndPublicAffairs, href: ExploreTopicRouteEnum.NewsAndPublicAffairs },
  { label: ExploreTopicLabelEnum.ScienceAndNature, href: ExploreTopicRouteEnum.ScienceAndNature },
  { label: ExploreTopicLabelEnum.Passport, href: ExploreTopicRouteEnum.Passport, include_passport_icon: true },
  { label: ExploreTopicLabelEnum.Arts, href: ExploreTopicRouteEnum.Arts},
  { label: ExploreTopicLabelEnum.Food, href: ExploreTopicRouteEnum.Food },
  { label: ExploreTopicLabelEnum.Culture, href: ExploreTopicRouteEnum.Culture },
  { label: ExploreTopicLabelEnum.HomeAndHowTo, href: ExploreTopicRouteEnum.HomeAndHowTo},
  { label: ExploreTopicLabelEnum.HenryLouisGatesJr, href: ExploreTopicRouteEnum.HenryLouisGatesJr},
  { label: ExploreTopicLabelEnum.AmericaAt250, href: ExploreTopicRouteEnum.AmericaAt250},
])

const allGenreLinks = {
  genres: [
    { label: ExploreTopicLabelEnum.Arts, href: ExploreTopicRouteEnum.Arts},
    { label: ExploreTopicLabelEnum.Culture, href: ExploreTopicRouteEnum.Culture},
    { label: ExploreTopicLabelEnum.DocumentariesAndIndieFilms, href: ExploreTopicRouteEnum.DocumentariesAndIndieFilms },
    { label: ExploreTopicLabelEnum.Drama, href: ExploreTopicRouteEnum.Drama },
    { label: ExploreTopicLabelEnum.Food, href: ExploreTopicRouteEnum.Food },
    { label: ExploreTopicLabelEnum.History, href: ExploreTopicRouteEnum.History },
    { label: ExploreTopicLabelEnum.HomeAndHowTo, href: ExploreTopicRouteEnum.HomeAndHowTo},
    { label: ExploreTopicLabelEnum.NewsAndPublicAffairs, href: ExploreTopicRouteEnum.NewsAndPublicAffairs},
    { label: ExploreTopicLabelEnum.ScienceAndNature, href: ExploreTopicRouteEnum.ScienceAndNature },
  ],
  featured: [
    { label: ExploreTopicLabelEnum.Passport, href: ExploreTopicRouteEnum.Passport, include_passport_icon: true},
    { label: ExploreTopicLabelEnum.HenryLouisGatesJr, href: ExploreTopicRouteEnum.HenryLouisGatesJr},
    { label: ExploreTopicLabelEnum.AmericaAt250, href: ExploreTopicRouteEnum.AmericaAt250},
  ]
}

const mobileGenreLinks = [
  { label: ExploreTopicLabelEnum.Passport, href: ExploreTopicRouteEnum.Passport, passport: true},
  { label: ExploreTopicLabelEnum.Arts, href: ExploreTopicRouteEnum.Arts},
  { label: ExploreTopicLabelEnum.Culture, href: ExploreTopicRouteEnum.Culture },
  { label: ExploreTopicLabelEnum.DocumentariesAndIndieFilms, href: ExploreTopicRouteEnum.DocumentariesAndIndieFilms },
  { label: ExploreTopicLabelEnum.Drama, href: ExploreTopicRouteEnum.Drama },
  { label: ExploreTopicLabelEnum.HenryLouisGatesJr, href: ExploreTopicRouteEnum.HenryLouisGatesJr},
  { label: ExploreTopicLabelEnum.AmericaAt250, href: ExploreTopicRouteEnum.AmericaAt250},
  { label: ExploreTopicLabelEnum.Food, href: ExploreTopicRouteEnum.Food },
  { label: ExploreTopicLabelEnum.History, href: ExploreTopicRouteEnum.History },
  { label: ExploreTopicLabelEnum.HomeAndHowTo, href: ExploreTopicRouteEnum.HomeAndHowTo},
  { label: ExploreTopicLabelEnum.NewsAndPublicAffairs, href: ExploreTopicRouteEnum.NewsAndPublicAffairs},
  { label: ExploreTopicLabelEnum.ScienceAndNature, href: ExploreTopicRouteEnum.ScienceAndNature },
]

export { allGenreLinks, mobileGenreLinks };
