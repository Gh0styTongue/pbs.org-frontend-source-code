import NewsletterList from "@/lib/types/newsletters"

import styles from '@/components/Newsletter/Newsletter.module.scss'

interface NewsletterImageProps {
  list?: NewsletterList
}

export default function NewsletterImage(props: NewsletterImageProps) {
  switch (props.list) {
    case NewsletterList.drama:
      var sources = dramaNewsletterSources()
      break;
    case NewsletterList.science:
      var sources = scienceNewsletterSources()
      break;
    case NewsletterList.civics:
      var sources = civicsNewsletterSources()
      break;
    default:
      var sources = defaultNewsletterSources()
  }

  return (
    <picture className={styles.background} aria-hidden="true">
      {sources}
    </picture>
  )
}

function dramaNewsletterSources() {
  return (<>
    <source media="(min-width: 1440px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_1440@2x.jpg 2x, /images/newsletter/drama/drama-newsletter-signup-background_1440@1x.jpg 1x"/>
    <source media="(min-width: 1280px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_1280@2x.jpg 2x, /images/newsletter/drama/drama-newsletter-signup-background_1280@1x.jpg 1x"/>
    <source media="(min-width: 1024px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_1024@2x.jpg 2x, /images/newsletter/drama/drama-newsletter-signup-background_1024@1x.jpg 1x"/>
    <source media="(min-width: 768px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_768@2x.jpg 2x, /images/newsletter/drama/drama-newsletter-signup-background_768@1x.jpg 1x"/>
    <source media="(min-width: 450px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_375@2x.jpg 1x" />
    <source media="(max-width: 449px)" srcSet="/images/newsletter/drama/drama-newsletter-signup-background_375@2x.jpg 2x, /images/newsletter/drama/drama-newsletter-signup-background_375@1x.jpg 1x" />
    <img alt="" src="/images/newsletter/drama/drama-newsletter-signup-background_1024@1x.jpg" loading="lazy"></img>
  </>)
}

function scienceNewsletterSources() {
  return (<>
    <source media="(min-width: 1440px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_1440@2x.jpg 2x, /images/newsletter/science/science-newsletter-signup-background_1440@1x.jpg 1x"/>
    <source media="(min-width: 1280px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_1280@2x.jpg 2x, /images/newsletter/science/science-newsletter-signup-background_1280@1x.jpg 1x"/>
    <source media="(min-width: 1024px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_1024@2x.jpg 2x, /images/newsletter/science/science-newsletter-signup-background_1024@1x.jpg 1x"/>
    <source media="(min-width: 768px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_768@2x.jpg 2x, /images/newsletter/science/science-newsletter-signup-background_768@1x.jpg 1x"/>
    <source media="(min-width: 450px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_375@2x.jpg 1x"/>
    <source media="(max-width: 449px)" srcSet="/images/newsletter/science/science-newsletter-signup-background_375@2x.jpg 2x, /images/newsletter/science/science-newsletter-signup-background_375@1x.jpg 1x"/>
    <img alt="" src="/images/newsletter/science/science-newsletter-signup-background_1024@1x.jpg" loading="lazy"></img>
  </>)
}

function civicsNewsletterSources() {
  return (<>
    <source media="(min-width: 1440px)" srcSet="/images/newsletter/civics/civics-1440@2x.jpg 2x, /images/newsletter/civics/civics-1440@1x.jpg 1x"/>
    <source media="(min-width: 1280px)" srcSet="/images/newsletter/civics/civics-1280@2x.jpg 2x, /images/newsletter/civics/civics-1280@1x.jpg 1x"/>
    <source media="(min-width: 1024px)" srcSet="/images/newsletter/civics/civics-1024@2x.jpg 2x, /images/newsletter/civics/civics-1024@1x.jpg 1x"/>
    <source media="(min-width: 768px)" srcSet="/images/newsletter/civics/civics-768@2x.jpg 2x, /images/newsletter/civics/civics-768@1x.jpg 1x"/>
    <source media="(min-width: 450px)" srcSet="/images/newsletter/civics/civics-375@2x.jpg 1x"/>
    <source media="(max-width: 449px)" srcSet="/images/newsletter/civics/civics-375@2x.jpg 2x, /images/newsletter/civics/civics-375@1x.jpg 1x"/>
    <img alt="" src="/images/newsletter/civics/civics-1024@1x.jpg" loading="lazy"></img>
  </>)
}

function defaultNewsletterSources() {
  return (<>
    <source media="(min-width: 1440px)" srcSet="/images/newsletter/general/newsletter-signup-background_1440@2x.jpg 2x, /images/newsletter/general/newsletter-signup-background_1440@1x.jpg 1x"/>
    <source media="(min-width: 1280px)" srcSet="/images/newsletter/general/newsletter-signup-background_1280@2x.jpg 2x, /images/newsletter/general/newsletter-signup-background_1280@1x.jpg 1x"/>
    <source media="(min-width: 1024px)" srcSet="/images/newsletter/general/newsletter-signup-background_1024@2x.jpg 2x, /images/newsletter/general/newsletter-signup-background_1024@1x.jpg 1x"/>
    <source media="(min-width: 768px)" srcSet="/images/newsletter/general/newsletter-signup-background_768@2x.jpg 2x, /images/newsletter/general/newsletter-signup-background_768@1x.jpg 1x"/>
    <source media="(min-width: 450px)" srcSet="/images/newsletter/general/newsletter-signup-background_375@2x.jpg 1x"/>
    <source media="(max-width: 449px)" srcSet="/images/newsletter/general/newsletter-signup-background_375@2x.jpg 2x, /images/newsletter/general/newsletter-signup-background_375@1x.jpg 1x"/>
    <img alt="" src="/images/newsletter/general/newsletter-signup-background_1024@1x.jpg" loading="lazy"></img>
  </>)
}
