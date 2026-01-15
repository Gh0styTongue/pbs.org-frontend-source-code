import LinkButton from '@/components/Button/LinkButton';
import PBSLearningMediaWhiteBlueFill from '@/public/svg/pbs-learning-media-white-blue-fill.svg';
import styles from './LearningMediaBadge.module.scss';

interface LearningMediaBadgeProps {
  learningMediaURL: string;
  showTitle: string;
  className?: string;
}


const LearningMediaBadge: React.FC<LearningMediaBadgeProps> = (props) => {
    const { learningMediaURL, showTitle, className } = props;
    const copyLong = `Find curriculum-aligned teaching resources for ${showTitle}`
    const copyShort = `Teaching resources for ${showTitle}`
    let classNames = `${styles.learning_media_badge}`

    if (className) {
      classNames += ` ${className}`;
    }

    return (
      <div className={classNames}>
        <PBSLearningMediaWhiteBlueFill className={styles.learning_media_logo}/>
        {<span className={styles.learning_media_badge__copy_long}>{copyLong}</span>}
        {<span className={styles.learning_media_badge__copy_short}>{copyShort}</span>}
        <LinkButton className={styles.learning_media_badge__button} href={learningMediaURL} style={'white_ghost'} title={showTitle}>
            Explore Free Resources
        </LinkButton>
      </div>
    );
};

export default LearningMediaBadge;
