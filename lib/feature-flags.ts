// Example usage:

// export enum FeatureFlagNamesEnum {
//   TEST_FEATURE_ENABLED = 'TEST_FEATURE_ENABLED',
// }

// export const featureFlags = {
//   TEST_FEATURE_ENABLED: process.env.TEST_FEATURE_ENABLED?.toLowerCase() === 'true',
// }

// If checking for a flag on a *page* level, you can do something like this:

// import { FeatureFlagNamesEnum, featureFlags } from "@/lib/feature-flags"
// ...
// const isTestFeatureEnabled = featureFlags[FeatureFlagNamesEnum.TEST_FEATURE_ENABLED];
// if (!isTestFeatureEnabled) {
//   return notFound();
// }

// For feature flags at the component level, you can use the Feature component.
// NOTE - this only works in server components. If any component in the tree is a client component,
// this will *not* work in beta.pbs.org and www.pbs.org. Confusingly this will work in our amplify environments.
// You need to pass the feature flag as a prop from a server component to the root client component.

// import { FeatureFlagNamesEnum } from "@/lib/feature-flags"
// import Feature from '@/components/Feature/Feature';
// ...
// <Feature featureFlag={FeatureFlagNamesEnum.TEST_FEATURE_ENABLED} enabled>
//   <h2>Look Ma, this feature is enabled!</h2>
// </Feature>
// <Feature featureFlag={FeatureFlagNamesEnum.TEST_FEATURE_ENABLED} disabled>
//   <h2>Look Ma, no feature!</h2>
// </Feature>

export enum FeatureFlagNamesEnum {
  KETCH_FOOTER_ENABLED = 'KETCH_FOOTER_ENABLED',
  PBS_PATRIOTIC_LOGO_SCHEDULE_END = 'PBS_PATRIOTIC_LOGO_SCHEDULE_END',
  EVENTS_ENABLED = 'EVENTS_ENABLED',
  NEXT_SSO_ENABLED = 'NEXT_SSO_ENABLED',
  PBS_PATRIOTIC_LOGO_SCHEDULE_START = 'PBS_PATRIOTIC_LOGO_SCHEDULE_START',
  THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_END = 'THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_END',
  THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_START = 'THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_START',
  EVERGREEN_DONATION_ROW_ENABLED = 'EVERGREEN_DONATION_ROW_ENABLED',
  LIVESTREAM_FUTURE_DATES_ENABLED = 'LIVESTREAM_FUTURE_DATES_ENABLED',
  URGENT_MESSAGE_POPOVER_SCHEDULE_END = 'URGENT_MESSAGE_POPOVER_SCHEDULE_END',
  URGENT_MESSAGE_POPOVER_SCHEDULE_START = 'URGENT_MESSAGE_POPOVER_SCHEDULE_START',
  SEARCH_AUTOCOMPLETE_ENABLED = 'SEARCH_AUTOCOMPLETE_ENABLED',
  PAGINATED_SHOW_SEARCH_RESULTS_ENABLED = 'PAGINATED_SHOW_SEARCH_RESULTS_ENABLED',
  DISABLE_SPONSORSHIP = 'DISABLE_SPONSORSHIP',
};

export const featureFlags = {
  KETCH_FOOTER_ENABLED: process.env.NEXT_PUBLIC_KETCH_FOOTER_ENABLED?.toLowerCase() === 'true',
  PBS_PATRIOTIC_LOGO_SCHEDULE_END: process.env.NEXT_PUBLIC_PBS_PATRIOTIC_LOGO_SCHEDULE_END,
  EVENTS_ENABLED: process.env.NEXT_PUBLIC_EVENTS_ENABLED?.toLowerCase() === 'true',
  NEXT_SSO_ENABLED: process.env.NEXT_PUBLIC_SSO_ENABLED?.toLowerCase() === 'true',
  PBS_PATRIOTIC_LOGO_SCHEDULE_START: process.env.NEXT_PUBLIC_PBS_PATRIOTIC_LOGO_SCHEDULE_START,
  THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_END: process.env.NEXT_PUBLIC_THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_END,
  THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_START: process.env.NEXT_PUBLIC_THE_AMERICAN_REVOLUTION_PROMO_SCHEDULE_START,
  EVERGREEN_DONATION_ROW_ENABLED: process.env.NEXT_PUBLIC_EVERGREEN_DONATION_ROW_ENABLED?.toLowerCase() === 'true',
  LIVESTREAM_FUTURE_DATES_ENABLED: process.env.NEXT_PUBLIC_LIVESTREAM_FUTURE_DATES_ENABLED?.toLowerCase() === 'true',
  URGENT_MESSAGE_POPOVER_SCHEDULE_END: process.env.NEXT_PUBLIC_URGENT_MESSAGE_POPOVER_SCHEDULE_END,
  URGENT_MESSAGE_POPOVER_SCHEDULE_START: process.env.NEXT_PUBLIC_URGENT_MESSAGE_POPOVER_SCHEDULE_START,
  SEARCH_AUTOCOMPLETE_ENABLED: process.env.NEXT_PUBLIC_SEARCH_AUTOCOMPLETE_ENABLED?.toLowerCase() === 'true',
  PAGINATED_SHOW_SEARCH_RESULTS_ENABLED: process.env.NEXT_PUBLIC_PAGINATED_SHOW_SEARCH_RESULTS_ENABLED?.toLowerCase() === 'true',
  DISABLE_SPONSORSHIP: process.env.NEXT_PUBLIC_DISABLE_SPONSORSHIP?.toLowerCase() === 'true',
};
