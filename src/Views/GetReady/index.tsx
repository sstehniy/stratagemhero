import styles from "./styles.module.css";

export const GetReady = ({ round }: { round: number }) => {
  return (
    <>
      <div className={styles.getReadyText}>GET READY</div>
      <h5 className={styles.roundLabel}>Round</h5>
      <h5 className={styles.roundNumber}>{round}</h5>
    </>
  );
};
