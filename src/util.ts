import { v4 } from "uuid";
import { stratogems } from "./config";
import { Stratogem } from "./types";

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

const triggerKeydownEvent = (key: string) => {
  const event = new KeyboardEvent("keydown", { key });
  window.dispatchEvent(event);
};

export { shuffleStratogems, waitForTimeout, triggerKeydownEvent };
