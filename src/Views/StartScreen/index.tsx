import styles from "./styles.module.css";

export const StartScreen = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      <h1 className={styles.title}>STRATAGEM HERO</h1>
      <h5 className={styles.subtitle}>Input any Stratagem Input to Start!</h5>
      {isMobile ? (
        <div className={styles.controlsContainer}>
          Swipe the screen to start the game
        </div>
      ) : (
        <div className={styles.controlsContainer}>
          <div className={styles.control}>w</div>
          <div className={styles.control}>a</div>
          <div className={styles.control}>s</div>
          <div className={styles.control}>d</div>
        </div>
      )}
    </>
  );
};
