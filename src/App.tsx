import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./App.module.css";
import { GameStatus, Stratogem } from "./types";

import { GetReady } from "./Views/GetReady";
import { StartScreen } from "./Views/StartScreen";
import {
  BASE_ROUND_BONUS,
  BASE_ROUND_DURATION,
  BASE_STRATOGEM_COUNT,
  FINISHED_SCREEN_DURATION,
  FOLLOWING_ROUND_BONUS_ADDITION,
  GET_READY_DURATION,
  PERFECT_ROUND_BONUS,
  SHOW_ROUND_STATS_DURATION,
  STRATOGEM_COMPLETION_BONUS_PER_KEY,
  TIME_BETWEEN_ROUNDS,
  TIME_INTERVAL_DECREMENT,
} from "./constants";
import { RoundStats } from "./Views/RoundStats";
import { GameFinished } from "./Views/GameFinished";
import { shuffleStratogems, waitForTimeout } from "./util";
import { Game } from "./Views/Game";
import { Misc } from "./components/Misc";
import { useSwipeable } from "react-swipeable";

const triggerKeydownEvent = (key: string) => {
  const event = new KeyboardEvent("keydown", { key });
  window.dispatchEvent(event);
};

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
  const handlers = useSwipeable({
    delta: 50,
    onSwipedDown: () => {
      if (gameStatus === GameStatus.NONE) {
        handleStartGame();
      } else if (gameStatus === GameStatus.STARTED) {
        triggerKeydownEvent("s");
      }
    },
    onSwipedLeft: () => {
      if (gameStatus === GameStatus.NONE) {
        handleStartGame();
      } else if (gameStatus === GameStatus.STARTED) {
        triggerKeydownEvent("a");
      }
    },
    onSwipedRight: () => {
      if (gameStatus === GameStatus.NONE) {
        handleStartGame();
      } else if (gameStatus === GameStatus.STARTED) {
        triggerKeydownEvent("d");
      }
    },
    onSwipedUp: () => {
      if (gameStatus === GameStatus.NONE) {
        handleStartGame();
      } else if (gameStatus === GameStatus.STARTED) {
        triggerKeydownEvent("w");
      }
    },
  });
  const intervalRef = useRef<number | null>(null);
  const isMobile = useRef(
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  );

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
        await waitForTimeout(FINISHED_SCREEN_DURATION);
        setGameStatus(GameStatus.NONE);
        return;
      }

      if (gameStatus === GameStatus.GET_READY) {
        await waitForTimeout(GET_READY_DURATION);

        setGameStatus(GameStatus.STARTED);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);

      if (gameStatus === GameStatus.STARTED) {
        window.addEventListener("keydown", handleKeyStroke);

        intervalRef.current = setInterval(() => {
          setTimeLeftForRound((prev) => {
            const newTime = prev - Math.min(prev, TIME_INTERVAL_DECREMENT);
            if (newTime === 0) {
              setGameStatus(GameStatus.FINISHED);
            }
            return newTime;
          });
        }, TIME_INTERVAL_DECREMENT);
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
    <div
      {...handlers}
      style={{ height: "100svh", display: "flex", alignItems: "center" }}
    >
      <Misc />

      <div className={styles.mainContainer}>
        {gameStatus === GameStatus.GET_READY && <GetReady round={round} />}
        {gameStatus === GameStatus.NONE && (
          <StartScreen isMobile={isMobile.current} />
        )}
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
      </div>
    </div>
  );
}

export default App;
