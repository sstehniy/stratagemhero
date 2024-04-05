import { InfoOverlayButton } from "../InfoOverlay";
import { ToggleSoundButton } from "../SoundToggleButton";
import styles from "./styles.module.css";

export const Misc = ({
  onAudioToggle,
  audioEnabled,
}: {
  onAudioToggle: () => void;
  audioEnabled: boolean;
}) => {
  return (
    <div className={styles.miscContainer}>
      <ToggleSoundButton onToggle={onAudioToggle} enabled={audioEnabled} />
      <InfoOverlayButton />
    </div>
  );
};
