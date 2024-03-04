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

const getFontBasedOnLength = (num: number) => {
  if (num < 1000) return 60;
  if (num < 10000) return 50;
  if (num < 100000) return 45;
  if (num < 1000000) return 35;
};

export { shuffleStratogems, waitForTimeout, getFontBasedOnLength };
