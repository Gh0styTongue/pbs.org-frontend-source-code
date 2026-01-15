// styles
import styles from './LoadingSpinner.module.scss';
interface LoadingSpinnerProps {
  className?: string;
  text?: string;
  depReducedMotion?: boolean;
  spinnerOnly?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  const { className, text, depReducedMotion = false, spinnerOnly = false } = props;
  const DEFAULT_LOADING_TEXT = 'Loading...';

  const loadingText = text || DEFAULT_LOADING_TEXT;

  let classNames = `${styles.loading_spinner}`;

  if (className) {
    classNames += ` ${className}`;
  }

  return (
    <div className={classNames} role="status">
      {!depReducedMotion && (
        <svg className={styles.loading_spinner_svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91.79 91.34">
          <circle cx="49.51" cy="11.33" r="11.33"/>
          <circle cx="76.11" cy="26.99" r="11.33"/>
          <circle cx="80.45" cy="57.55" r="11.33"/>
          <circle cx="59.27" cy="80" r="11.33"/>
          <circle cx="28.51" cy="77.43" r="11.33"/>
          <circle cx="11.33" cy="51.79" r="11.33"/>
          <circle cx="20.68" cy="22.37" r="11.33"/>
        </svg>
      )}
      { !spinnerOnly && (
        <span className={`${styles.loading_spinner__text} ${depReducedMotion && styles.loading_spinner__dep_reduced_motion}`}>
          {loadingText}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
