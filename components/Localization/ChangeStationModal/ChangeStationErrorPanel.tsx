// components
import Button from '@/components/Button/Button';

// types
import { ChangeStationError } from './ChangeStationModal';

// styles
import styles from './ChangeStationErrorPanel.module.scss'

interface ChangeStationErrorPanelProps {
  title: string;
  description: string;
  setDataError?: (status: ChangeStationError) => void;
  showBackButton?: boolean;
}

const ChangeStationErrorPanel = (props: ChangeStationErrorPanelProps) => {
  const { title, description, setDataError, showBackButton = true } = props;

  return (
    <div className={styles.change_station_error_panel}>
      <h2 className={styles.change_station_error_panel__header}>
        {title}
      </h2>
      <p>{description}</p>
      { showBackButton && setDataError &&
        <Button
          onClick={() => {
            setDataError(false);
          }}
          size="min"
        >
          Go Back
        </Button>
      }
    </div>
  )
}

export default ChangeStationErrorPanel;