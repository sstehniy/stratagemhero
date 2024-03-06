import {
  BASE_ROUND_DURATION,
  CRITICAL_TIME_LEFT,
  TIME_INTERVAL_DECREMENT,
} from "../../constants";
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
  handleRetry,
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
  handleRetry: () => void;
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
            maxWidth: `${(timeLeftForRound / BASE_ROUND_DURATION) * 100}%`,
            width: "100%",
            transition: `max-width ${TIME_INTERVAL_DECREMENT}ms linear`,
            backgroundColor:
              timeLeftForRound <= CRITICAL_TIME_LEFT
                ? "var(--danger)"
                : "var(--yellow)",
          }}
        ></div>
      </div>
      <div>
        <button
          className={styles.retryButton}
          tabIndex={1}
          onClick={handleRetry}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M7.32.029a8 8 0 0 1 7.18 3.307V1.75a.75.75 0 0 1 1.5 0V6h-4.25a.75.75 0 0 1 0-1.5h1.727A6.5 6.5 0 0 0 1.694 6.424A.75.75 0 1 1 .239 6.06A8 8 0 0 1 7.319.03Zm-3.4 14.852A8 8 0 0 0 15.76 9.94a.75.75 0 0 0-1.455-.364A6.5 6.5 0 0 1 2.523 11.5H4.25a.75.75 0 0 0 0-1.5H0v4.25a.75.75 0 0 0 1.5 0v-1.586a8 8 0 0 0 2.42 2.217"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
