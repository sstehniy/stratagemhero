import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./App.module.css";
import { GameStatus, Stratagem } from "./types";

import { GetReady } from "./Views/GetReady";
import { StartScreen } from "./Views/StartScreen";
import introAudio from "./assets/audio/intro.mp3";
import gameAudio from "./assets/audio/game_sound.mp3";
import clickAudio from "./assets/audio/click.mp3";
import roundStatAudio from "./assets/audio/round_stats.mp3";
import stratagemCompletionAudio from "./assets/audio/strat_completed.mp3";
import stratagemErrorAudio from "./assets/audio/strat_failed.mp3";
import gameEndedAudio from "./assets/audio/game_ended.mp3";
import getReadyAudio from "./assets/audio/get_ready.mp3";

import {
  BASE_ROUND_BONUS,
  BASE_ROUND_DURATION,
  BASE_STRATAGEM_COUNT,
  FINISHED_SCREEN_DURATION,
  FOLLOWING_ROUND_BONUS_ADDITION,
  GET_READY_DURATION,
  PERFECT_ROUND_BONUS,
  SHOW_ROUND_STATS_DURATION,
  STRATAGEM_COMPLETION_BONUS_PER_KEY,
  TIME_BETWEEN_ROUNDS,
  TIME_INTERVAL_DECREMENT,
} from "./constants";
import { RoundStats } from "./Views/RoundStats";
import { GameFinished } from "./Views/GameFinished";
import { shuffleStratagems, triggerKeydownEvent, waitForTimeout } from "./util";
import { Game } from "./Views/Game";
import { Misc } from "./components/Misc";
import { useSwipeable } from "react-swipeable";
import { useGamepadInput } from "./hooks/useGamepad";
import { useSound } from "./hooks/useSound";

const playSound = (allowed: boolean, sound: () => void) => {
  if (allowed) {
    sound();
  }
};

function App() {
  const [totalScore, setTotalScore] = useState(0);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
  const [currentRoundBaseBonus, setCurrentRoundBaseBonus] = useState(0);
  const [currentRoundTimeBonus, setCurrentRoundTimeBonus] = useState(0);
  const [round, setRound] = useState(1);
  const [isPerfectRound, setIsPerfectRound] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NONE);
  const [currentRoundStratagems, setCurrentRoundStratagems] = useState<
    (Stratagem & { uid: string })[]
  >([]);
  const [currentStratagem, setCurrentStratagem] = useState(0);
  const [timeLeftForRound, setTimeLeftForRound] = useState(BASE_ROUND_DURATION);
  const [currentStratagemKeyIndex, setCurrentStratagemKeyIndex] = useState(0);
  const [wrongKeyPressed, setWrongKeyPressed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStartGameSound] = useSound(introAudio, {
    loop: false,
    interrupt: true,
    volume: 1,
  });
  const [playGameSound, stopGameSound, isGameSoundPlaying] = useSound(
    gameAudio,
    {
      loop: true,
      interrupt: false,
      volume: 1,
    },
  );
  const [playClick] = useSound(clickAudio, {
    interrupt: false,
    loop: false,
    volume: 0.8,
  });
  const [playRoundStatsSound] = useSound(roundStatAudio, {
    interrupt: true,
    loop: false,
    volume: 0.4,
  });
  const [playStratagemCompletionSound] = useSound(stratagemCompletionAudio, {
    interrupt: true,
    loop: false,
    volume: 1,
  });
  const [playStratagemErrorSound] = useSound(stratagemErrorAudio, {
    interrupt: true,
    loop: false,
    volume: 1,
  });
  const [playGameEndedSound] = useSound(gameEndedAudio, {
    interrupt: true,
    loop: false,
    volume: 1,
  });
  const [playGetReadySound] = useSound(getReadyAudio, {
    interrupt: false,
    loop: false,
    volume: 5,
  });

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

  useGamepadInput();

  const handleStartGame = useCallback(() => {
    playSound(audioEnabled, playStartGameSound);
    setWrongKeyPressed(false);
    setRound(1);
    const roundStratagems = shuffleStratagems(
      BASE_STRATAGEM_COUNT + (round - 1),
    );
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setCurrentRoundStratagems(roundStratagems);
    setTotalScore(0);
    setCurrentRoundScore(0);
    setCurrentStratagem(0);
    setCurrentStratagemKeyIndex(0);
    setGameStatus(GameStatus.GET_READY);
  }, [audioEnabled, playStartGameSound, round]);

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
    playSound(audioEnabled, playGetReadySound);
    setRound((prev) => prev + 1);
    setCurrentRoundScore(0);
    setCurrentRoundStratagems(shuffleStratagems(BASE_STRATAGEM_COUNT + round));
    setCurrentStratagem(0);
    setIsPerfectRound(true);
    setCurrentStratagemKeyIndex(0);
    setTimeLeftForRound(BASE_ROUND_DURATION);
    setGameStatus(GameStatus.GET_READY);
  }, [audioEnabled, playGetReadySound, round]);

  const handleKeyStroke = useCallback(
    async (e: KeyboardEvent) => {
      setWrongKeyPressed(false);
      const currentStratagemObject = currentRoundStratagems[currentStratagem];
      const currentStratagemKey =
        currentStratagemObject.keys[currentStratagemKeyIndex];
      // e.key === currentStratagemKey && currentStratagemKeyIndex === currentStratagemObject.keyCount - 1 &&
      if (e.key === currentStratagemKey) {
        // last key in current stratagem of current round
        if (currentStratagemKeyIndex === currentStratagemObject.keyCount - 1) {
          // current stratagem is the last in current round
          if (currentStratagem === currentRoundStratagems.length - 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            window.removeEventListener("keydown", handleKeyStroke);

            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratagemObject.keyCount *
                  STRATAGEM_COMPLETION_BONUS_PER_KEY,
            );
            setGameStatus(GameStatus.BETWEEN_STRATAGEMS);
            playSound(audioEnabled, playRoundStatsSound);
            await waitForTimeout(TIME_BETWEEN_ROUNDS);
            updateScoreOnRoundCompletion();
            setGameStatus(GameStatus.ROUND_ENDED);
            await waitForTimeout(SHOW_ROUND_STATS_DURATION);

            startNextRound();
            return;
          } else {
            // move to next stratagem in current round
            const roundScore = currentStratagemObject.keyCount * 5;

            // add bonus time to current round
            setTimeLeftForRound(
              (prev) =>
                prev +
                currentStratagemObject.keyCount *
                  STRATAGEM_COMPLETION_BONUS_PER_KEY,
            );
            playSound(audioEnabled, playStratagemCompletionSound);
            setGameStatus(GameStatus.BETWEEN_STRATAGEMS);
            await waitForTimeout(TIME_BETWEEN_ROUNDS);
            setCurrentRoundScore((prev) => prev + roundScore);
            setCurrentStratagemKeyIndex(0);
            setCurrentStratagem(currentStratagem + 1);
            setGameStatus(GameStatus.STARTED);
          }
        } else {
          playSound(audioEnabled, playClick);
          setCurrentStratagemKeyIndex((prev) => prev + 1);
        }
      } else if (["w", "a", "s", "d"].includes(e.key)) {
        playSound(audioEnabled, playStratagemErrorSound);
        window.removeEventListener("keydown", handleKeyStroke);
        setWrongKeyPressed(true);
        setIsPerfectRound(false);
        window.addEventListener("keydown", handleKeyStroke);
        await waitForTimeout(100);
        setCurrentStratagemKeyIndex(0);
        setWrongKeyPressed(false);
      }
    },
    [
      currentRoundStratagems,
      currentStratagem,
      currentStratagemKeyIndex,
      audioEnabled,
      playRoundStatsSound,
      updateScoreOnRoundCompletion,
      startNextRound,
      playStratagemCompletionSound,
      playClick,
      playStratagemErrorSound,
    ],
  );

  useEffect(() => {
    if (
      (gameStatus !== GameStatus.STARTED &&
        gameStatus !== GameStatus.BETWEEN_STRATAGEMS) ||
      !audioEnabled
    ) {
      stopGameSound();
      return;
    }

    if (!isGameSoundPlaying) {
      playSound(audioEnabled, playGameSound);
    }
  }, [
    audioEnabled,
    gameStatus,
    isGameSoundPlaying,
    playGameSound,
    stopGameSound,
  ]);

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
        gameStatus === GameStatus.BETWEEN_STRATAGEMS
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
              playSound(audioEnabled, playGameEndedSound);
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
    audioEnabled,
    currentRoundStratagems,
    currentStratagem,
    currentStratagemKeyIndex,
    gameStatus,
    handleKeyStroke,
    handleStartGameKeyPress,
    playGameEndedSound,
  ]);

  return (
    <div
      {...handlers}
      style={{ height: "100svh", display: "flex", alignItems: "center" }}
    >
      <Misc
        audioEnabled={audioEnabled}
        onAudioToggle={() => {
          setAudioEnabled((prev) => !prev);
        }}
      />

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
          gameStatus === GameStatus.BETWEEN_STRATAGEMS ||
          gameStatus === GameStatus.GET_READY) && (
          <Game
            currentRoundScore={currentRoundScore}
            timeLeftForRound={timeLeftForRound}
            currentStratagemKeyIndex={currentStratagemKeyIndex}
            wrongKeyPressed={wrongKeyPressed}
            currentRoundStratagems={currentRoundStratagems}
            gameStatus={gameStatus}
            round={round}
            totalScore={totalScore}
            currentStratagem={currentStratagem}
          />
        )}
      </div>
    </div>
  );
}

export default App;
