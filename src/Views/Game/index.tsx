import { BASE_ROUND_DURATION, CRITICAL_TIME_LEFT } from "../../constants";
import { GameStatus, Key, Stratogem } from "../../types";

import ArrowUp from "../../assets/keys/arrow_up.svg?react";
import ArrowDown from "../../assets/keys/arrow_down.svg?react";
import ArrowLeft from "../../assets/keys/arrow_left.svg?react";
import ArrowRight from "../../assets/keys/arrow_right.svg?react";
import { CSSProperties } from "react";

import styles from "./styles.module.css";

export const Game = ({
  currentRoundScore,
  currentRoundStratogems,
  currentStratogem,
  gameStatus,
  round,
  timeLeftForRound,
  totalScore,
  currentStratogemKeyIndex,
  wrongKeyPressed,
}: {
  gameStatus: GameStatus;
  round: number;
  totalScore: number;
  currentRoundScore: number;
  currentStratogem: number;
  currentRoundStratogems: (Stratogem & { uid: string })[];
  timeLeftForRound: number;
  currentStratogemKeyIndex: number;
  wrongKeyPressed: boolean;
}) => {
  const renderKey = (key: Key, idx: number) => {
    let style: CSSProperties = {
      fill: "var(--lightgrey)",
    };
    if (idx < currentStratogemKeyIndex) {
      style = {
        fill: "var(--yellow)",
      };
    }
    if (gameStatus === GameStatus.BETWEEN_STRATOGEMS) {
      style = {
        fill: "var(--yellow)",
      };
    }
    if (wrongKeyPressed && idx < currentStratogemKeyIndex) {
      style = {
        fill: "var(--danger)",
      };
    }

    const mergedStyles = {
      ...style,
      width: "auto",
      transition: "all 0.1s ease",
    };
    switch (key) {
      case Key.UP:
        return (
          <ArrowUp className={styles.key} style={mergedStyles} key={idx} />
        );
      case Key.DOWN:
        return (
          <ArrowDown className={styles.key} style={mergedStyles} key={idx} />
        );
      case Key.LEFT:
        return (
          <ArrowLeft className={styles.key} style={mergedStyles} key={idx} />
        );
      case Key.RIGHT:
        return (
          <ArrowRight className={styles.key} style={mergedStyles} key={idx} />
        );
      default:
        return null;
    }
  };
  return (
    <div
      className={styles.gameContainer}
      style={{
        display: gameStatus === GameStatus.GET_READY ? "none" : "block",
      }}
    >
      <div className={styles.roundContainer}>
        <div>
          <div className={styles.roundLabel}>Round</div>
          <div className={styles.roundNumber}>{round}</div>
        </div>
      </div>
      <div className={styles.scoreContainer}>
        <div>
          <div className={styles.scoreValue}>
            {totalScore + currentRoundScore}
          </div>
          <div className={styles.scoreLabel}>SCORE</div>
        </div>
      </div>
      <div
        className={`${styles.stratogemImagesContainer} ${timeLeftForRound <= CRITICAL_TIME_LEFT ? styles.danger : ""} ${styles.noscrollbar}`}
      >
        {currentRoundStratogems.slice(currentStratogem).map((str, idx) => (
          <div
            className={`${styles.stratogemImage} ${idx === 0 ? styles.active : ""} ${
              timeLeftForRound <= CRITICAL_TIME_LEFT ? styles.danger : ""
            }`}
            key={str.uid}
          >
            <img src={str.image} className={styles.stratogemImage} />
          </div>
        ))}
      </div>
      <div
        className={styles.stratogemName}
        style={{
          backgroundColor:
            timeLeftForRound <= CRITICAL_TIME_LEFT
              ? "var(--danger)"
              : "var(--yellow)",

          color:
            timeLeftForRound <= CRITICAL_TIME_LEFT
              ? "var(--light)"
              : "var(--dark)",
        }}
      >
        {currentRoundStratogems[currentStratogem].name.toUpperCase()}
      </div>
      <div className={styles.keysContainer}>
        {currentRoundStratogems[currentStratogem].keys.map((key, idx) =>
          renderKey(key, idx),
        )}
      </div>
      <div className={styles.timeBarContainer}>
        <div
          className={styles.timeBar}
          style={{
            width: `${(timeLeftForRound / BASE_ROUND_DURATION) * 100}%`,
            backgroundColor:
              timeLeftForRound <= CRITICAL_TIME_LEFT
                ? "var(--danger)"
                : "var(--yellow)",
          }}
        ></div>
      </div>
    </div>
  );
};
