import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { stratogems } from "./config";
import "./App.css";
import { Key, Stratogem } from "./types";
import { v4 } from "uuid";

import ArrowUp from "./assets/keys/arrow_up.svg?react";
import ArrowDown from "./assets/keys/arrow_down.svg?react";
import ArrowLeft from "./assets/keys/arrow_left.svg?react";
import ArrowRight from "./assets/keys/arrow_right.svg?react";

const BASE_ROUND_BONUS = 75;
const BASE_STRATOGEM_COUNT = 6;
const BASE_ROUND_DURATION = 1000 * 10; // 10 seconds
const STRATOGEM_COMPLETION_BONUS_PER_KEY = 86; // 86 ms per key
const TIME_BETWEEN_ROUNDS = 300; // 300 ms
const PERFECT_ROUND_BONUS = 100;
const FOLLOWING_ROUND_BONUS_ADDITION = 25;

const shuffleStratogems = (count: number): (Stratogem & { uid: string })[] => {
  const shuffled = stratogems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((s) => ({ ...s, uid: v4() }));
};

enum GameStatus {
  NONE,
  STARTED,
  FINISHED,
  ROUND_ENDED,
  BETWEEN_STRATOGEMS,
}

function App() {
  const [totalScore, setTotalScore] = useState(0);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
  const [currentRoundBaseBonus, setCurrentRoundBaseBonus] = useState(0);
  const [currentRoundTimeBonus, setCurrentRoundTimeBonus] = useState(0);
  const [round, setRound] = useState(1);
  const [isPerfectRound, setIsPerfectRound] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NONE);
  const [currentRoundStratogems, setCurrentRoundStratogems] = useState<
    (Stratogem & { uid: string })[]
  >([]);
  const [currentStratogem, setCurrentStratogem] = useState(0);
  const [timeLeftForRound, setTimeLeftForRound] = useState(BASE_ROUND_DURATION);
  const [currentStratogemKeyIndex, setCurrentStratogemKeyIndex] = useState(0);
  const [wrongKeyPressed, setWrongKeyPressed] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleStartGame = () => {
    console.log("handleStartGame");
    setRound(1);
    const roundStratogems = shuffleStratogems(
      BASE_STRATOGEM_COUNT + (round - 1),
    );
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setCurrentRoundStratogems(roundStratogems);
    setCurrentStratogem(0);
    setCurrentStratogemKeyIndex(0);
    setGameStatus(GameStatus.STARTED);
  };

  const updateScoreOnRoundCompletion = useCallback(() => {
    console.log("updateScoreOnRoundCompletion");
    //calculate total score
    const baseBonus =
      BASE_ROUND_BONUS + (round - 1) * FOLLOWING_ROUND_BONUS_ADDITION;
    const perfectBonus = isPerfectRound ? PERFECT_ROUND_BONUS : 0;
    const timeBonus = parseFloat(Math.ceil(timeLeftForRound / 100).toFixed(2));
    setCurrentRoundBaseBonus(baseBonus);
    setCurrentRoundTimeBonus(timeBonus);
    setTotalScore(
      (prev) => prev + currentRoundScore + baseBonus + perfectBonus + timeBonus,
    );
  }, [currentRoundScore, isPerfectRound, round, timeLeftForRound]);

  const startNextRound = useCallback(() => {
    console.log("startNextRound");
    setRound((prev) => prev + 1);
    setCurrentRoundScore(0);
    setCurrentRoundStratogems(shuffleStratogems(BASE_STRATOGEM_COUNT + round));
    setCurrentStratogem(0);
    setIsPerfectRound(true);
    setCurrentStratogemKeyIndex(0);
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setGameStatus(GameStatus.STARTED);
  }, [round]);

  const handleKeyStroke = useCallback(
    (e: KeyboardEvent) => {
      setWrongKeyPressed(false);
      const currentStratogemObject = currentRoundStratogems[currentStratogem];
      const currentStratogemKey =
        currentStratogemObject.keys[currentStratogemKeyIndex];
      // e.key === currentStratogemKey && currentStratogemKeyIndex === currentStratogemObject.keyCount - 1 &&
      if (e.key === currentStratogemKey) {
        // last key in current stratogem of current round
        if (currentStratogemKeyIndex === currentStratogemObject.keyCount - 1) {
          console.log("last key in stratogem");
          // current stratogem is the last in current round
          if (currentStratogem === currentRoundStratogems.length - 1) {
            console.log("last stratogem in round");
            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratogemObject.keyCount *
                  STRATOGEM_COMPLETION_BONUS_PER_KEY,
            );
            setGameStatus(GameStatus.ROUND_ENDED);
            window.removeEventListener("keydown", handleKeyStroke);
            updateScoreOnRoundCompletion();
            setTimeout(startNextRound, 5000);
          } else {
            console.log("not last stratogem in round");
            // move to next stratogem in current round
            const roundScore = currentStratogemObject.keyCount * 5;
            setCurrentRoundScore((prev) => prev + roundScore);

            setCurrentStratogemKeyIndex(0);
            setCurrentStratogem(currentStratogem + 1);
            // add bonus time to current round
            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratogemObject.keyCount *
                  STRATOGEM_COMPLETION_BONUS_PER_KEY,
            );
            setGameStatus(GameStatus.BETWEEN_STRATOGEMS);
            setTimeout(() => {
              setGameStatus(GameStatus.STARTED);
            }, TIME_BETWEEN_ROUNDS);
          }
        } else {
          setCurrentStratogemKeyIndex((prev) => prev + 1);
        }
      } else if (["w", "a", "s", "d"].includes(e.key)) {
        setWrongKeyPressed(true);
        setIsPerfectRound(false);
      }
    },
    [
      currentRoundStratogems,
      currentStratogem,
      currentStratogemKeyIndex,
      updateScoreOnRoundCompletion,
      startNextRound,
    ],
  );

  useEffect(() => {
    if (gameStatus === GameStatus.NONE) return;
    if (
      gameStatus === GameStatus.ROUND_ENDED ||
      gameStatus === GameStatus.FINISHED ||
      gameStatus === GameStatus.BETWEEN_STRATOGEMS
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyStroke);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (gameStatus === GameStatus.STARTED) {
      window.addEventListener("keydown", handleKeyStroke);

      intervalRef.current = setInterval(() => {
        setTimeLeftForRound((prev) => {
          const newTime = Math.max(0, prev - 10);
          if (newTime === 0) {
            setGameStatus(GameStatus.FINISHED);
          }
          return newTime;
        });
      }, 10);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener("keydown", handleKeyStroke);
      };
    }
  }, [
    currentRoundStratogems,
    currentStratogem,
    currentStratogemKeyIndex,
    gameStatus,
    handleKeyStroke,
  ]);

  const renderKey = (key: Key, idx: number) => {
    const style: CSSProperties =
      idx < currentStratogemKeyIndex
        ? { fill: "green" }
        : idx === currentStratogemKeyIndex
          ? { fill: wrongKeyPressed ? "red" : "#D6D6D6" }
          : { fill: "#D6D6D6" };
    const mergedStyles = { ...style, width: 70, height: "auto" };
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
    <>
      <div>
        <h1>Stratogems</h1>
        <h2>Round: {round}</h2>
        <h2>Score: {totalScore}</h2>
        <hr />
        <h2>Current stratogem: {currentStratogem}</h2>
        <h2>Current stratogem key index: {currentStratogemKeyIndex}</h2>
        <h2>Time left: {timeLeftForRound}</h2>
      </div>
      {gameStatus === GameStatus.NONE && (
        <button onClick={handleStartGame}>start game</button>
      )}
      {gameStatus === GameStatus.ROUND_ENDED && (
        <div>
          <div>Round Score: {currentRoundScore}</div>
          <div>Bonus: {currentRoundBaseBonus}</div>
          <div>Time bonus: {currentRoundTimeBonus}</div>
          <div>Perfect: {isPerfectRound ? 100 : 0}</div>
          <div>Total: {totalScore}</div>
        </div>
      )}
      {gameStatus === GameStatus.FINISHED && (
        <div>
          Game finished, total score: {totalScore} <br />
          <button onClick={handleStartGame}>retry</button>
        </div>
      )}
      {(gameStatus === GameStatus.STARTED ||
        gameStatus === GameStatus.BETWEEN_STRATOGEMS) && (
        <div>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            {currentRoundStratogems.slice(currentStratogem).map((str, idx) => (
              <div
                style={{
                  height: 100,
                  width: 100,
                  border: idx === 0 ? "2px solid red" : "none",
                }}
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
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            {currentRoundStratogems[currentStratogem].keys.map((key, idx) =>
              renderKey(key, idx),
            )}
          </div>
          <div
            style={{
              width: 700,
              height: 50,
              position: "relative",
              backgroundColor: "grey",
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "100%",
                top: 0,
                left: 0,
                width: `${(timeLeftForRound / BASE_ROUND_DURATION) * 100}%`,
                backgroundColor: "yellow",
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
