import { useCallback, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { stratogems } from "./config";
import "./App.css";
import { Key, Stratogem } from "./types";

const BASE_ROUND_BONUS = 75;
const BASE_STRATOGEM_COUNT = 6;
const BASE_ROUND_DURATION = 1000 * 10; // 10 seconds
const STRATOGEM_COMPLETION_BONUS_PER_KEY = 86; // 86 ms per key
const TIME_BETWEEN_ROUNDS = 30; // 30 ms
const PERFECT_ROUND_BONUS = 100;
const FOLLOWING_ROUND_BONUS_ADDITION = 25;

const shuffleStratogems = (count: number) => {
  const shuffled = stratogems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

enum GameStatus {
  NONE,
  STARTED,
  FINISHED,
}

function App() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isPerfectRound, setIsPerfectRound] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NONE);
  const [currentRoundStratogems, setCurrentRoundStratogems] = useState<
    Stratogem[]
  >([]);
  const [currentStratogem, setCurrentStratogem] = useState(0);
  const currentRoundTimer = useRef<number | null>(null);
  const [timeLeftForRound, setTimeLeftForRound] = useState(BASE_ROUND_DURATION);
  const [currentStratogemKeyIndex, setCurrentStratogemKeyIndex] = useState(0);
  const [wrongKeyPressed, setWrongKeyPressed] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleStartGame = () => {
    setRound(1);
    const roundStratogems = shuffleStratogems(
      BASE_STRATOGEM_COUNT + (round - 1),
    );
    setCurrentRoundStratogems(roundStratogems);
    setCurrentStratogem(0);
    setCurrentStratogemKeyIndex(0);
    setGameStatus(GameStatus.STARTED);
  };

  const handleKeyStroke = useCallback(
    (e: KeyboardEvent) => {
      setWrongKeyPressed(false);
      const currentStratogemObject = currentRoundStratogems[currentStratogem];
      const currentStratogemKey =
        currentStratogemObject.keys[currentStratogemKeyIndex];
      if (e.key === currentStratogemKey) {
        if (currentStratogemKeyIndex === currentStratogemObject.keyCount - 1) {
          // update score
          const roundScore = currentStratogemObject.keyCount * 5;
          setScore((prev) => prev + roundScore);
          // add bonus time to current stratogem
          setTimeLeftForRound(
            (prev) => prev + currentStratogemObject.keyCount * 85.7,
          );
          setCurrentStratogem((prev) => prev + 1);
        } else {
          setCurrentStratogemKeyIndex((prev) => prev + 1);
        }
      } else if (["w", "a", "s", "d"].includes(e.key)) {
        setWrongKeyPressed(true);
      }
    },
    [currentRoundStratogems, currentStratogem, currentStratogemKeyIndex],
  );

  useEffect(() => {
    if (gameStatus === GameStatus.NONE) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (gameStatus === GameStatus.FINISHED) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyStroke);
    }
    if (gameStatus === GameStatus.STARTED) {
      window.addEventListener("keydown", handleKeyStroke);

      intervalRef.current = setInterval(() => {
        setTimeLeftForRound((prev) => {
          const newTime = Math.max(0, prev - 50);
          if (newTime === 0) {
            setGameStatus(GameStatus.FINISHED);
          }
          return newTime;
        });
      }, 50);
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

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
