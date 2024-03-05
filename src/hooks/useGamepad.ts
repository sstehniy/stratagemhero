import { useCallback, useEffect, useRef, useState } from "react";
import { triggerKeydownEvent } from "../util";

const buttonMap = { 12: "w", 13: "s", 14: "a", 15: "d" };

export const useGamepadInput = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const requestRef = useRef<number | null>(null);

  const handleGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    if (!gamepad || !gamepads[gamepad.index]) return;

    const gp = gamepads[gamepad.index];

    let buttonPressed = false;
    for (const [buttonIndex, key] of Object.entries(buttonMap)) {
      const index = parseInt(buttonIndex);
      if (!gp) return;
      if (gp.buttons[index].pressed) {
        buttonPressed = true;
        if (!isButtonPressed) {
          triggerKeydownEvent(key);
          console.log("triggered key", key);
        }
        break;
      }
    }
    setIsButtonPressed(buttonPressed);
    requestRef.current = requestAnimationFrame(handleGamepadInput);
  }, [gamepad, isButtonPressed]);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log(
        `Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}. ${e.gamepad.buttons.length} buttons, ${e.gamepad.axes.length} axes.`,
      );
      if (e.gamepad.axes.length === 4) {
        setGamepad(e.gamepad);
      }
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log(
        `Gamepad disconnected at index ${e.gamepad.index}: ${e.gamepad.id}.`,
      );
      if (gamepad && e.gamepad.index === gamepad.index) {
        setGamepad(null);
      }
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnected,
      );
    };
  }, [gamepad]);

  useEffect(() => {
    if (gamepad) {
      requestRef.current = requestAnimationFrame(handleGamepadInput);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gamepad, handleGamepadInput]);

  return null; // Or any other value you might need to return
};
