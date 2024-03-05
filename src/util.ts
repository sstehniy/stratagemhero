import { v4 } from "uuid";
import { stratagems } from "./config";
import { Stratagem } from "./types";

const shuffleStratagems = (count: number): (Stratagem & { uid: string })[] => {
  const shuffled: (Stratagem & { uid: string })[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * stratagems.length);
    const stratagem = { ...stratagems[randomIndex], uid: v4() };
    shuffled.push(stratagem);
  }
  return shuffled;
};

const waitForTimeout = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const triggerKeydownEvent = (key: string) => {
  const event = new KeyboardEvent("keydown", { key });
  window.dispatchEvent(event);
};

export { shuffleStratagems, waitForTimeout, triggerKeydownEvent };
