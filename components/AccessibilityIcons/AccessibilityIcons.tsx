import { VideoClass, Audio } from '@/lib/types/api/video';
import AudioDescriptionIcon from '@/public/svg/audio-description.svg';
import styles from './AccessibilityIcons.module.scss';

interface AccessibilityIconsProps {
 video: VideoClass;
 preceedWithPipe?: boolean;
}

// Icons
// They are really spans with some text, and for some, inclusion of the svg icon
interface IconProps {
  text: string;
  showAdIcon?: boolean;
}

export const Icon = (props: IconProps) => {
  const { text, showAdIcon } = props;
  return (
    <span className={styles.icon}>
      {text}
      {showAdIcon && <AudioDescriptionIcon />}
    </span>
  )
}

// @TODO if more accessibility video options are added, we will need to update this list
// Per the description in https://projects.pbs.org/jira/browse/OCTO-10819,
// the options are non-enhanced, ead-english, ead-spanish, asl, oc-english, oc-spanish
const accessibleVideoProfilesToLabels = {
  asl: 'ASL',
  'ead-english': 'Extended Audio Description',
  // Thanks to Esteban Amas and Mateo Otalvaro for their help with the Spanish translations
  'ead-spanish': 'Descripciones de Sonido Extendidos',
  'oc-english': 'Open Captions',
  'oc-spanish': 'Subtítulos Abiertos',
};

const accessibleVideoProfilesToIcons = {
  asl: <Icon text="ASL" key="asl"/>,
  'ead-english': <Icon text="EAD" showAdIcon={true} key="ead-english"/>,
  'ead-spanish': <Icon text="EAD" showAdIcon={true} key="ead-spanish"/>,
  'oc-english': <Icon text="OC" key="oc-english"/>,
  'oc-spanish': <Icon text="OC" key="oc-spanish"/>,
};

const doAudioTracksHaveAudioDescription = (audioTracks: Audio[]) => {
  return audioTracks?.some((audioTrack) => audioTrack.descriptive === true);
}

const AccessibilityIcons = (props: AccessibilityIconsProps) => {
  const { video, preceedWithPipe = true } = props;

  const {
    related_accessibility_videos,
    audio,
    has_audio_description,
    closed_captions,
    flags } = video;

  const accessibilityFeatureStrings = [];
  const accessibilityFeatureIcons = [];

  switch(true){
    case has_audio_description:
    case doAudioTracksHaveAudioDescription(audio):
      accessibilityFeatureStrings.push('Audio Description');
      accessibilityFeatureIcons.push(<Icon text="AD" showAdIcon={true} key="audio_description"/>);
      break;
    case related_accessibility_videos && related_accessibility_videos.length > 0:
      related_accessibility_videos?.forEach((video) => {
        const { accessibility_profile } = video;
        if (accessibility_profile !== 'non-enhanced') {
          accessibilityFeatureStrings.push(accessibleVideoProfilesToLabels[accessibility_profile]);
          accessibilityFeatureIcons.push(accessibleVideoProfilesToIcons[accessibility_profile]);
        }
      });
      break;
    case flags.has_captions:
    case closed_captions && closed_captions?.length > 0:
      accessibilityFeatureStrings.push('Closed Captions');
      accessibilityFeatureIcons.push(<Icon text="CC" key="closed_captions"/>);
      break;
    default:
      break;
  }

  if (accessibilityFeatureStrings.length > 0) {
    return (
      <span className={styles.accessibility_icons}>
        <span className="visuallyhidden">Video has { accessibilityFeatureStrings.join(', ') }</span>
        <span aria-hidden="true" className={styles.accessibility_icons_icons}>
          { preceedWithPipe && ' | ' }
          { accessibilityFeatureIcons }
        </span>
      </span>
      );
  } else {
    return null;
  }
};

export default AccessibilityIcons;
