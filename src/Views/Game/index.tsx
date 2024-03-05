import { BASE_ROUND_DURATION, CRITICAL_TIME_LEFT } from "../../constants";
import { GameStatus, Key, Stratagem } from "../../types";

import ArrowUp from "../../assets/keys/arrow_up.svg?react";
import ArrowDown from "../../assets/keys/arrow_down.svg?react";
import ArrowLeft from "../../assets/keys/arrow_left.svg?react";
import ArrowRight from "../../assets/keys/arrow_right.svg?react";
import { CSSProperties } from "react";

import styles from "./styles.module.css";

export const Game = ({
  currentRoundScore,
  currentRoundStratagems,
  currentStratagem,
  gameStatus,
  round,
  timeLeftForRound,
  totalScore,
  currentStratagemKeyIndex,
  wrongKeyPressed,
}: {
  gameStatus: GameStatus;
  round: number;
  totalScore: number;
  currentRoundScore: number;
  currentStratagem: number;
  currentRoundStratagems: (Stratagem & { uid: string })[];
  timeLeftForRound: number;
  currentStratagemKeyIndex: number;
  wrongKeyPressed: boolean;
}) => {
  const renderKey = (key: Key, idx: number) => {
    let style: CSSProperties = {
      fill: "var(--lightgrey)",
    };
    if (idx < currentStratagemKeyIndex) {
      style = {
        fill: "var(--yellow)",
      };
    }
    if (gameStatus === GameStatus.BETWEEN_STRATAGEMS) {
      style = {
        fill: "var(--yellow)",
      };
    }
    if (wrongKeyPressed && idx < currentStratagemKeyIndex) {
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
        className={`${styles.stratagemImagesContainer} ${timeLeftForRound <= CRITICAL_TIME_LEFT ? styles.danger : ""} ${styles.noscrollbar}`}
      >
        {currentRoundStratagems.slice(currentStratagem).map((str, idx) => (
          <div
            className={`${styles.stratagemImage} ${idx === 0 ? styles.active : ""} ${
              timeLeftForRound <= CRITICAL_TIME_LEFT ? styles.danger : ""
            }`}
            key={str.uid}
          >
            <img src={str.image} className={styles.stratagemImage} />
          </div>
        ))}
      </div>
      <div
        className={styles.stratagemName}
        style={{
          backgroundColor:
            timeLeftForRound <= CRITICAL_TIME_LEFT
              ? "var(--danger)"
              : "var(--yellow)",

          color:
            timeLeftForRound <= CRITICAL_TIME_LEFT ? "white" : "var(--dark)",
        }}
      >
        {currentRoundStratagems[currentStratagem].name.toUpperCase()}
      </div>
      <div className={styles.keysContainer}>
        {currentRoundStratagems[currentStratagem].keys.map((key, idx) =>
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
