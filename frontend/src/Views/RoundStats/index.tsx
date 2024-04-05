import styles from "./styles.module.css";
import { PERFECT_ROUND_BONUS } from "../../constants";

export const RoundStats = ({
  currentRoundBaseBonus,
  currentRoundTimeBonus,
  isPerfectRound,
  totalScore,
}: {
  currentRoundBaseBonus: number;
  currentRoundTimeBonus: number;
  isPerfectRound: boolean;
  totalScore: number;
}) => {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsRow}>
        <span className={styles.label}>Round Bonus</span>
        <span className={styles.value}>{currentRoundBaseBonus}</span>
      </div>
      <div className={`${styles.statsRow} ${styles.hidden} ${styles.first}`}>
        <span className={styles.label}>Time Bonus</span>
        <span className={styles.value}>{currentRoundTimeBonus}</span>
      </div>
      <div className={`${styles.statsRow} ${styles.hidden} ${styles.second}`}>
        <span className={styles.label}>Perfect Bonus</span>
        <span className={styles.value}>
          {isPerfectRound ? PERFECT_ROUND_BONUS : 0}
        </span>
      </div>
      <div className={`${styles.statsRow} ${styles.hidden} ${styles.third}`}>
        <span className={styles.label}>Total Score</span>
        <span className={styles.value}>{totalScore}</span>
      </div>
    </div>
  );
};
