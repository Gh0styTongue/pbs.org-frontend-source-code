// imports
import sanitizeHtml from 'sanitize-html';
import { useAtom } from 'jotai';
import { useCallback, useRef, useState, } from 'react';

// lib files
import { clientMetricLogger } from '@/lib/logger-client';
import { REPORT_A_PROBLEM_METRICS } from '@/lib/metric-strings';
import { useHasMounted } from '@/lib/hooks';
import { userProfile } from "@/lib/atoms/profile";
import { VIDEO_HELP_PAGE_URL } from '@/lib/constants';
import { VideoClass } from '@/lib/types/api/video';

// components
import Button from '@/components/Button/Button';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Modal from '@/components/Modal/Modal';

// styles
import styles from './ReportAProblemModal.module.scss';

interface ReportAProblemModalProps {
  video: VideoClass;
  isOpen: boolean;
  onClose: () => void;
}

enum ReportAProblemModalState {
  DEFAULT = 'default',
  SUBMITTING = 'submitting',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface ReportObject {
  'Problem Type': string;
  'Details': string;
  'Show Title': string;
  'Video Metadata': string;
  'Video Title': string;
  'Video Slug': string;
  'Video Legacy TP Media ID': number;
  'Video Page URL': string;
  'User PID': string;
  'User Name': string;
  'User Email': string;
}

const PROBLEM_TYPES = [
  {
    value: 'does-not-load',
    label: 'Video doesn’t load',
  },
  {
    value: 'does-not-play',
    label: 'Video loads, but doesn’t play',
  },
  {
    value: 'video-jumps-back-forward',
    label: 'Video jumps back/forward',
  },
  {
    value: 'only-audio-is-streaming',
    label: 'Only audio is streaming',
  },
  {
    value: 'sponsorship-playback-error',
    label: 'Sponsorship playback error',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

const ReportAProblemModal = (props: ReportAProblemModalProps) => {
  const { isOpen, onClose: onCloseProp, video } = props;
  const [ reportAProblemModalState, setReportAProblemModalState ] = useState<ReportAProblemModalState>(ReportAProblemModalState.DEFAULT);
  const [ displayOtherTextarea, setDisplayOtherTextArea ] = useState(false);
  const [profile] = useAtom(userProfile);
  const selectRef = useRef<HTMLSelectElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const hasMounted = useHasMounted();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setDisplayOtherTextArea(selectedValue === 'other');
  }

  const onSubmit = useCallback(async () => {
    setReportAProblemModalState(ReportAProblemModalState.SUBMITTING);
    setDisplayOtherTextArea(false);
    const problemValue = selectRef.current?.value;
    const problemText = selectRef.current?.options[selectRef.current.selectedIndex].text || 'No type selected';
    const { slug, title, legacy_tp_media_id, show, summary } = video;
    const { title: showTitle } = show || { title: 'Unknown Show' };
    const currentUrl = window.location.href;
    clientMetricLogger(
      REPORT_A_PROBLEM_METRICS.NAMESPACE,
      REPORT_A_PROBLEM_METRICS.PROBLEM_SUBMITTED,
    );

    const reportObj: ReportObject = {
      'Problem Type': problemText,
      // Start with no details provided / allowed
      'Details': problemValue === 'other' ? 'No details provided' : 'Problem does not accept details',
      'Show Title': showTitle,
      'Video Metadata': summary,
      'Video Title': title,
      'Video Slug': slug,
      'Video Legacy TP Media ID': legacy_tp_media_id,
      'Video Page URL': currentUrl,
      // Start with anonymous users
      'User PID': 'Anonymous',
      'User Name': 'Anonymous',
      'User Email': 'Anonymous',
    }

    // If the user selected "other", add the text area value to the report
    if (problemValue === 'other' && textAreaRef.current?.value && textAreaRef.current?.value !== '') {
      // Sanitize the text area input to prevent XSS attacks
      reportObj['Details'] = sanitizeHtml(textAreaRef.current.value);
    }

    // If the user is logged in, add their profile information to the report
    if (profile) {
      reportObj['User PID'] = profile.profile.pid;
      reportObj['User Name'] = 'No name provided';
      reportObj['User Email'] = profile.profile.email || 'No email provided';

      if (profile.profile.first_name && profile.profile.last_name) {
        reportObj['User Name'] = `${profile.profile.first_name} ${profile.profile.last_name}`;
      }
    }

    try {
      const response = await fetch('/api/report-a-problem/', {
        method: 'POST',
        body: JSON.stringify(reportObj),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        setReportAProblemModalState(ReportAProblemModalState.SUCCESS);
      }
    } catch(_error) {
      setReportAProblemModalState(ReportAProblemModalState.ERROR);
    }
  }, [profile, video]);


  const onClose = () => {
    setReportAProblemModalState(ReportAProblemModalState.DEFAULT);
    setDisplayOtherTextArea(false);
    onCloseProp();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.report_a_problem_modal}>
      <div className={styles.report_a_problem_modal__inner}>
        { reportAProblemModalState === ReportAProblemModalState.DEFAULT && (
          <div className={styles.report_a_problem_modal__default}>
            <h2>Report a Problem</h2>
            <p>Before you submit an error, please consult our <a href={VIDEO_HELP_PAGE_URL} target="_blank">Video Help page</a>.</p>
            <label htmlFor="problem-type">Type of Error</label>
            <select
              className={styles.problem_type_select}
              name="problem-type"
              id="problem-type"
              onChange={onSelectChange}
              ref={selectRef}
              defaultValue="does-not-load"
            >
              { PROBLEM_TYPES.map((problemType) => (
                <option key={problemType.value} value={problemType.value}>
                  {problemType.label}
                </option>
              ))}
            </select>
            { displayOtherTextarea && (
              <>
                <label htmlFor="other-problem-details">Please add more details</label>
                <textarea
                  className={styles.report_a_problem_modal__textarea}
                  name="other-problem-details"
                  id="other-problem-details"
                  cols={30}
                  rows={10}
                  ref={textAreaRef}
                />
              </>
            )}
            { profile && profile.profile.first_name && profile.profile.last_name && hasMounted && (
              <p className={styles.report_a_problem_modal__signed_in}>Signed in as {profile.profile.first_name} {profile.profile.last_name.charAt(0)}.</p>
            )}
            <div className={styles.report_a_problem_modal__buttons}>
              <Button
                className={styles.report_a_problem_modal__submit_button}
                onClick={onSubmit}
                style="white"
              >
                Submit
              </Button>
              <Button
                className={styles.report_a_problem_modal__cancel_button}
                onClick={onClose}
                style="white_ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        { reportAProblemModalState === ReportAProblemModalState.SUBMITTING && (
          <div className={styles.report_a_problem_modal__submitting}>
            <LoadingSpinner
              text="Submitting..."
            />
          </div>
        )}
        { reportAProblemModalState === ReportAProblemModalState.SUCCESS && (
          <div className={styles.report_a_problem_modal__success}>
            <h2>Thank you{ profile && profile.profile.first_name && (
              <>, {profile.profile.first_name}</>
            )}!</h2>
            <p>Your report has been successfully submitted! Thank you for helping us improve PBS.</p>
            <Button
              className={styles.report_a_problem_modal__close_button}
              onClick={onClose}
              style="white_ghost"
            >
              Close
            </Button>
          </div>
        )}
        { reportAProblemModalState === ReportAProblemModalState.ERROR && (
          <div className={styles.report_a_problem_modal__error}>
            <h2>Oops!</h2>
            <p>There was an error submitting your report. Please try again later.</p>
            <Button
              className={styles.report_a_problem_modal__close_button}
              onClick={onClose}
              style="white_ghost"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportAProblemModal;
