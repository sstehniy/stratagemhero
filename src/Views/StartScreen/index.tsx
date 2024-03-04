import styles from "./styles.module.css";

export const StartScreen = () => {
  return (
    <>
      <h1 className={styles.title}>STRATAGEM HERO</h1>
      <h5 className={styles.subtitle}>Input any Stratagem Input to Start!</h5>
      <div className={styles.controlsContainer}>
        <div className={styles.control}>w</div>
        <div className={styles.control}>a</div>
        <div className={styles.control}>s</div>
        <div className={styles.control}>d</div>
      </div>
    </>
  );
};
