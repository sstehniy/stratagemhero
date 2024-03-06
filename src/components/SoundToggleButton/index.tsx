import styles from "./styles.module.css";

export const ToggleSoundButton = ({
  onToggle,
  enabled,
}: {
  onToggle: () => void;
  enabled: boolean;
}) => {
  return (
    <button
      tabIndex={-1}
      className={styles.toggleButton}
      onClick={() => {
        onToggle();
      }}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
};
