import styles from "./styles.module.css";

export const GameFinished = ({ totalScore }: { totalScore: number }) => {
  return (
    <>
      <div className={styles.gameOverText}>GAME OVER</div>
      <h5 className={styles.finalScoreLabel}>YOUR FINAL SCORE</h5>
      <h5 className={styles.finalScoreValue}>{totalScore}</h5>
    </>
  );
};
