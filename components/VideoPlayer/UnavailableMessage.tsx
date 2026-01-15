import styles from './UnavailableMessage.module.scss';

const UnavailableMessage = () => {
  return (
    <p className={styles.unavailable_message}>
      We&rsquo;re sorry, but this video is not available.
    </p>
  )
}

export default UnavailableMessage;
