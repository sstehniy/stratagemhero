import { BASE_ROUND_DURATION, CRITICAL_TIME_LEFT } from "../constants";
import { GameStatus, Key, Stratogem } from "../types";
import { getFontBasedOnLength } from "../util";

import ArrowUp from "../assets/keys/arrow_up.svg?react";
import ArrowDown from "../assets/keys/arrow_down.svg?react";
import ArrowLeft from "../assets/keys/arrow_left.svg?react";
import ArrowRight from "../assets/keys/arrow_right.svg?react";
import { CSSProperties } from "react";

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
      height: 50,
      width: "auto",
      transition: "all 0.1s ease",
    };
    switch (key) {
      case Key.UP:
        return <ArrowUp style={mergedStyles} key={idx} />;
      case Key.DOWN:
        return <ArrowDown style={mergedStyles} key={idx} />;
      case Key.LEFT:
        return <ArrowLeft style={mergedStyles} key={idx} />;
      case Key.RIGHT:
        return <ArrowRight style={mergedStyles} key={idx} />;
      default:
        return null;
    }
  };
  return (
    <div
      style={{
        display: gameStatus === GameStatus.GET_READY ? "none" : "block",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -15,
          left: -180,
          right: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 40,
              color: "var(--light)",
              fontWeight: "bold",
            }}
          >
            Round
          </div>
          <div
            style={{
              fontSize: 50,
              marginLeft: 15,
              color: "var(--yellow)",
              fontWeight: "bolder",
            }}
          >
            {round}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -15,
          right: -180,
        }}
      >
        <div>
          <div
            style={{
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              fontSize: getFontBasedOnLength(totalScore + currentRoundScore),
              color: "var(--yellow)",
              fontWeight: "bold",
            }}
          >
            {totalScore + currentRoundScore}
          </div>
          <div
            style={{
              marginTop: -20,
              fontSize: 45,
              color: "var(--light)",
              fontWeight: "bolder",
            }}
          >
            SCORE
          </div>
        </div>
      </div>
      <div className="stratogem-images-container">
        {currentRoundStratogems.slice(currentStratogem).map((str, idx) => (
          <div
            className={`stratogem-image ${idx === 0 ? "active" : ""} ${
              timeLeftForRound <= CRITICAL_TIME_LEFT ? "danger" : ""
            }`}
            key={str.uid}
          >
            <img
              src={str.image}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          textAlign: "center",
          backgroundColor:
            timeLeftForRound <= CRITICAL_TIME_LEFT
              ? "var(--danger)"
              : "var(--yellow)",
          fontSize: 36,
          padding: 0,
          fontWeight: "bolder",
          color:
            timeLeftForRound <= CRITICAL_TIME_LEFT
              ? "var(--light)"
              : "var(--dark)",
          marginTop: -5,
          letterSpacing: 1.5,
        }}
      >
        {currentRoundStratogems[currentStratogem].name.toUpperCase()}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          margin: "15px 0px 60px 0px",
        }}
      >
        {currentRoundStratogems[currentStratogem].keys.map((key, idx) =>
          renderKey(key, idx),
        )}
      </div>
      <div
        style={{
          width: 660,
          height: 30,
          position: "relative",
          backgroundColor: "var(--darkerlightgrey)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "absolute",
            height: "100%",
            top: 0,
            left: 0,
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
