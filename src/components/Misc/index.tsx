import { InfoModalButton } from "../InfoModal";
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
      <InfoModalButton />
    </div>
  );
};
