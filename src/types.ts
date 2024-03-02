export enum Key {
  UP = "w",
  DOWN = "s",
  LEFT = "a",
  RIGHT = "d",
}

export type Stratogem = {
  name: string;
  image: string;
  keys: Key[];
  keyCount: number;
};
