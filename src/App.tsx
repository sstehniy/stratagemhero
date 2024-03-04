import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./App.module.css";
import { GameStatus, Stratogem } from "./types";

import { GetReady } from "./Views/GetReady";
import { StartScreen } from "./Views/StartScreen";
import {
  BASE_ROUND_BONUS,
  BASE_ROUND_DURATION,
  BASE_STRATOGEM_COUNT,
  FOLLOWING_ROUND_BONUS_ADDITION,
  PERFECT_ROUND_BONUS,
  SHOW_ROUND_STATS_DURATION,
  STRATOGEM_COMPLETION_BONUS_PER_KEY,
  TIME_BETWEEN_ROUNDS,
} from "./constants";
import { RoundStats } from "./Views/RoundStats";
import { GameFinished } from "./Views/GameFinished";
import { shuffleStratogems, waitForTimeout } from "./util";
import { Game } from "./Views/Game";
import { Footer } from "./components/Footer";

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

  const handleStartGame = useCallback(() => {
    setWrongKeyPressed(false);
    setRound(1);
    const roundStratogems = shuffleStratogems(
      BASE_STRATOGEM_COUNT + (round - 1),
    );
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setCurrentRoundStratogems(roundStratogems);
    setTotalScore(0);
    setCurrentRoundScore(0);
    setCurrentStratogem(0);
    setCurrentStratogemKeyIndex(0);
    setGameStatus(GameStatus.GET_READY);
  }, [round]);

  const updateScoreOnRoundCompletion = useCallback(() => {
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
    setRound((prev) => prev + 1);
    setCurrentRoundScore(0);
    setCurrentRoundStratogems(shuffleStratogems(BASE_STRATOGEM_COUNT + round));
    setCurrentStratogem(0);
    setIsPerfectRound(true);
    setCurrentStratogemKeyIndex(0);
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setGameStatus(GameStatus.GET_READY);
  }, [round]);

  const handleKeyStroke = useCallback(
    async (e: KeyboardEvent) => {
      setWrongKeyPressed(false);
      const currentStratogemObject = currentRoundStratogems[currentStratogem];
      const currentStratogemKey =
        currentStratogemObject.keys[currentStratogemKeyIndex];
      // e.key === currentStratogemKey && currentStratogemKeyIndex === currentStratogemObject.keyCount - 1 &&
      if (e.key === currentStratogemKey) {
        // last key in current stratogem of current round
        if (currentStratogemKeyIndex === currentStratogemObject.keyCount - 1) {
          // current stratogem is the last in current round
          if (currentStratogem === currentRoundStratogems.length - 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            window.removeEventListener("keydown", handleKeyStroke);

            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratogemObject.keyCount *
                  STRATOGEM_COMPLETION_BONUS_PER_KEY,
            );
            setGameStatus(GameStatus.BETWEEN_STRATOGEMS);
            await waitForTimeout(TIME_BETWEEN_ROUNDS);
            updateScoreOnRoundCompletion();
            setGameStatus(GameStatus.ROUND_ENDED);
            await waitForTimeout(SHOW_ROUND_STATS_DURATION);

            startNextRound();
            return;
          } else {
            // move to next stratogem in current round
            const roundScore = currentStratogemObject.keyCount * 5;
            setCurrentRoundScore((prev) => prev + roundScore);

            // add bonus time to current round
            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratogemObject.keyCount *
                  STRATOGEM_COMPLETION_BONUS_PER_KEY,
            );
            setGameStatus(GameStatus.BETWEEN_STRATOGEMS);
            await waitForTimeout(TIME_BETWEEN_ROUNDS);
            setCurrentStratogemKeyIndex(0);
            setCurrentStratogem(currentStratogem + 1);
            setGameStatus(GameStatus.STARTED);
          }
        } else {
          setCurrentStratogemKeyIndex((prev) => prev + 1);
        }
      } else if (["w", "a", "s", "d"].includes(e.key)) {
        setWrongKeyPressed(true);
        setIsPerfectRound(false);
        await waitForTimeout(100);
        setCurrentStratogemKeyIndex(0);
        setWrongKeyPressed(false);
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

  const handleStartGameKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!["w", "a", "s", "d"].includes(e.key)) return;
      if (gameStatus === GameStatus.NONE) {
        handleStartGame();
        window.removeEventListener("keydown", handleStartGameKeyPress);
      }
    },
    [gameStatus, handleStartGame],
  );

  useEffect(() => {
    const setup = async () => {
      if (gameStatus === GameStatus.NONE) {
        window.addEventListener("keydown", handleStartGameKeyPress);
        return;
      }
      if (
        gameStatus === GameStatus.ROUND_ENDED ||
        gameStatus === GameStatus.BETWEEN_STRATOGEMS
      ) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener("keydown", handleKeyStroke);
        return;
      }

      if (gameStatus === GameStatus.FINISHED) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener("keydown", handleKeyStroke);
        await waitForTimeout(5000);
        setGameStatus(GameStatus.NONE);
        return;
      }

      if (gameStatus === GameStatus.GET_READY) {
        await waitForTimeout(3000);

        setGameStatus(GameStatus.STARTED);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);

      if (gameStatus === GameStatus.STARTED) {
        window.addEventListener("keydown", handleKeyStroke);

        intervalRef.current = setInterval(() => {
          setTimeLeftForRound((prev) => {
            const newTime = prev - Math.min(prev, 16);
            if (newTime === 0) {
              setGameStatus(GameStatus.FINISHED);
            }
            return newTime;
          });
        }, 16);
      }
    };
    setup();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyStroke);
      window.removeEventListener("keydown", handleStartGameKeyPress);
    };
  }, [
    currentRoundStratogems,
    currentStratogem,
    currentStratogemKeyIndex,
    gameStatus,
    handleKeyStroke,
    handleStartGameKeyPress,
  ]);

  return (
    <div className={styles.mainContainer}>
      <div style={{ position: "fixed", top: 10, right: 10 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 98 96"
          width={25}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open("https://github.com/sstehniy/stratagemhero", "_blank");
          }}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill={"var(--lightgrey)"}
          />
        </svg>
      </div>
      {gameStatus === GameStatus.GET_READY && <GetReady round={round} />}
      {gameStatus === GameStatus.NONE && <StartScreen />}
      {gameStatus === GameStatus.ROUND_ENDED && (
        <RoundStats
          currentRoundBaseBonus={currentRoundBaseBonus}
          currentRoundTimeBonus={currentRoundTimeBonus}
          isPerfectRound={isPerfectRound}
          totalScore={totalScore}
        />
      )}
      {gameStatus === GameStatus.FINISHED && (
        <GameFinished totalScore={totalScore} />
      )}
      {(gameStatus === GameStatus.STARTED ||
        gameStatus === GameStatus.BETWEEN_STRATOGEMS ||
        gameStatus === GameStatus.GET_READY) && (
        <Game
          currentRoundScore={currentRoundScore}
          timeLeftForRound={timeLeftForRound}
          currentStratogemKeyIndex={currentStratogemKeyIndex}
          wrongKeyPressed={wrongKeyPressed}
          currentRoundStratogems={currentRoundStratogems}
          gameStatus={gameStatus}
          round={round}
          totalScore={totalScore}
          currentStratogem={currentStratogem}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
