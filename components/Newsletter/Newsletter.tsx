'use client'

// imports
import { useState, useCallback } from 'react'

// lib files
import NewsletterList from '@/lib/types/newsletters'

// components
import Button from '@/components/Button/Button'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import NewsletterImage from '@/components/Newsletter/NewsletterImage'

// styles
import styles from '@/components/Newsletter/Newsletter.module.scss'

enum NewsletterState {
  initial,
  submitting,
  error,
  success
}

export interface NewsletterProps {
  list?: NewsletterList;
}

async function postEmail(email: string, list: NewsletterList) {
  const body = JSON.stringify({ email, list })
  const response = await fetch('/api/newsletter/signup/', { method: 'POST', body })
  return response.ok
}

function Newsletter(props: NewsletterProps) {
  const list = props?.list || NewsletterList.default

  const [email, setEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState(NewsletterState.initial);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewsletterState(NewsletterState.submitting)

    try {
      if(await postEmail(email, list)) {
        setNewsletterState(NewsletterState.success)
      } else {
        setNewsletterState(NewsletterState.error)
      }
    } catch(_error) {
      setNewsletterState(NewsletterState.error)
    }
  }, [email, list])

  const isSubmitting = newsletterState === NewsletterState.submitting;
  const showInput = newsletterState === NewsletterState.initial || newsletterState === NewsletterState.error;
  const showMessage = newsletterState === NewsletterState.success || newsletterState === NewsletterState.error;

  return (
    <div className={styles.newsletter}>
      <NewsletterImage list={list} />

      <div className={styles.inner}>
        <NewsletterHeader list={list} />
        <NewsletterText list={list} />
        <form className={styles.inner_form} onSubmit={handleSubmit}>
          {showInput ? (<>
            <input
              className={styles.form__input}
              type='email'
              id='newsletter_form__email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />

            <Button style='white' className={styles.form__submit_button}>
              Sign Up
            </Button>
          </>) : (<></>)}

          {isSubmitting ? (
            <LoadingSpinner
              className={styles.loading_indicator}
              text="Submitting..."
              spinnerOnly={true}
            />
          ) : (<></>)}

          {showMessage ? (<>
            <NewsletterMessage state={newsletterState} />
          </>) : (<></>)}
        </form>
      </div>
    </div>
  )
}

function NewsletterHeader({ list }: { list: NewsletterList }) {
  if(list === NewsletterList.drama) {
    var headerText = 'Escape the ordinary. Sign up for the PBS Drama Digest'
  } else if(list === NewsletterList.civics) {
    var headerText = 'The latest in civics and journalism, straight to your inbox.'
  } else {
    var headerText = 'The best of PBS, straight to your inbox.'
  }

  return (
    <h2 className={styles.inner_header}>{headerText}</h2>
  )
}

function NewsletterText({ list }: { list: NewsletterList }) {
  if(list === NewsletterList.drama) {
    var text = 'Explore breathtaking period dramas, gripping crime thrillers, and captivating international shows from MASTERPIECE and other PBS favorites.'
  } else {
    var text = 'Be the first to know about what to watch, exclusive previews, and updates from PBS.'
  }

  return(
    <p className={styles.inner_text}>{text}</p>
  )
}

function NewsletterMessage(props: { state: NewsletterState }) {
  const { state: newsletterState } = props;

  if(newsletterState === NewsletterState.success) {
    var message = 'Thank you for signing up!'
  } else {
    var message = 'Something went wrong. Please try again later.'
  }

  return (
    <p className={styles.form__message}>{message}</p>
  )
}

export default Newsletter
