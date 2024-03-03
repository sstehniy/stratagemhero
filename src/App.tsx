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
const SHOW_ROUND_STATS_DURATION = 5000;
const CRITICAL_TIME_LEFT = 2000;

const shuffleStratogems = (count: number): (Stratogem & { uid: string })[] => {
  const shuffled: (Stratogem & { uid: string })[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * stratogems.length);
    const stratogem = { ...stratogems[randomIndex], uid: v4() };
    shuffled.push(stratogem);
  }
  return shuffled;
};

const waitForTimeout = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const getFontBasedOnLength = (num: number) => {
  if (num < 1000) return 60;
  if (num < 10000) return 50;
  if (num < 100000) return 45;
  if (num < 1000000) return 35;
};

enum GameStatus {
  NONE,
  STARTED,
  FINISHED,
  ROUND_ENDED,
  BETWEEN_STRATOGEMS,
  GET_READY,
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
    <div className="main-container">
      <div
        style={{
          position: "fixed",
          bottom: 5,
          left: 5,
          fontSize: 12,
          color: "var(--lightgrey)",
          width: 400,
        }}
      >
        <p>
          Check out Helldivers 2 on{" "}
          <a
            href="https://store.steampowered.com/app/553850/HELLDIVERS_2/"
            target="_blank"
          >
            Steam
          </a>{" "}
          and{" "}
          <a
            href="https://www.playstation.com/en-us/games/helldivers-2/"
            target="_blank"
          >
            Playstation
          </a>
          !<br />
        </p>
        Report an issue{" "}
        <a
          href="https://github.com/sstehniy/stratagemhero/issues"
          target="_blank"
        >
          here
        </a>
        <br />
        Not affiliated with Helldivers, Arrowhead Studios, or Playstation
        Studios.
        <br />
        This project is just a fan-made game to practice skills for spreading
        democrary across the universe. Not for profit!!!
      </div>
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
      {gameStatus === GameStatus.GET_READY && (
        <>
          <div
            style={{
              color: "var(--light)",
              fontWeight: "bolder",
              fontSize: 120,
              marginBottom: 77,
              marginTop: 200,
            }}
          >
            GET READY
          </div>
          <h5
            style={{
              fontSize: 50,
              color: "var(--light)",
            }}
          >
            Round
          </h5>
          <h5
            style={{
              fontSize: 90,
              color: "var(--yellow)",
            }}
          >
            {round}
          </h5>
        </>
      )}
      {gameStatus === GameStatus.NONE && (
        <>
          <h1
            style={{
              color: "var(--light)",
              fontSize: 120,
              marginBottom: 100,
              marginTop: 125,
              fontWeight: "bolder",
            }}
          >
            STRATAGEM HERO
          </h1>
          <h5 style={{ color: "var(--yellow)", fontSize: 50 }}>
            Input any Stratagem Input to Start!
          </h5>
          <div
            style={{ display: "flex", gap: 10, position: "fixed", bottom: 40 }}
          >
            <div
              style={{
                fontSize: 20,
                backgroundColor: "var(--yellow)",
                padding: "8px 15px",
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              w
            </div>
            <div
              style={{
                fontSize: 20,
                backgroundColor: "var(--yellow)",
                padding: "8px 15px",
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              a
            </div>
            <div
              style={{
                fontSize: 20,
                backgroundColor: "var(--yellow)",
                padding: "8px 15px",
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              s
            </div>
            <div
              style={{
                fontSize: 20,
                backgroundColor: "var(--yellow)",
                padding: "8px 15px",
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              d
            </div>
          </div>
        </>
      )}
      {gameStatus === GameStatus.ROUND_ENDED && (
        <div style={{ width: "clamp(1000px,75vw, 2000px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: 40,
                color: "var(--light)",
                fontWeight: "bold",
              }}
            >
              Round Bonus
            </span>
            <span
              style={{
                fontSize: 80,
                color: "var(--yellow)",
                fontWeight: "bold",
              }}
            >
              {currentRoundBaseBonus}
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="hidden first"
          >
            <span
              style={{
                fontSize: 40,
                color: "var(--light)",
                fontWeight: "bold",
              }}
            >
              Time Bonus
            </span>
            <span
              style={{
                fontSize: 80,
                color: "var(--yellow)",
                fontWeight: "bold",
              }}
            >
              {currentRoundTimeBonus}
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="hidden second"
          >
            <span
              style={{
                fontSize: 40,
                color: "var(--light)",
                fontWeight: "bold",
              }}
            >
              Pefect Bonus
            </span>
            <span
              style={{
                fontSize: 80,
                color: "var(--yellow)",
                fontWeight: "bold",
              }}
            >
              {isPerfectRound ? PERFECT_ROUND_BONUS : 0}
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="hidden third"
          >
            <span
              style={{
                fontSize: 40,
                color: "var(--light)",
                fontWeight: "bold",
              }}
            >
              Total Score
            </span>
            <span
              style={{
                fontSize: 80,
                color: "var(--yellow)",
                fontWeight: "bold",
              }}
            >
              {totalScore}
            </span>
          </div>
        </div>
      )}
      {gameStatus === GameStatus.FINISHED && (
        <>
          <div
            style={{
              color: "var(--light)",
              fontWeight: "bolder",
              fontSize: 120,
              marginBottom: 77,
              marginTop: 200,
            }}
          >
            GAME OVER
          </div>
          <h5
            style={{
              fontSize: 50,
              color: "var(--light)",
            }}
          >
            YOUR FINAL SCORE
          </h5>
          <h5
            style={{
              fontSize: 90,
              color: "var(--yellow)",
              marginTop: -20,
            }}
          >
            {totalScore}
          </h5>
        </>
      )}
      {(gameStatus === GameStatus.STARTED ||
        gameStatus === GameStatus.BETWEEN_STRATOGEMS ||
        gameStatus === GameStatus.GET_READY) && (
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
                  fontSize: getFontBasedOnLength(
                    totalScore + currentRoundScore,
                  ),
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
      )}
    </div>
  );
}

export default App;
