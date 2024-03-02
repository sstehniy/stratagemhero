export enum Key {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type Stratogem = {
  name: string;
  image: string;
  keys: Key[];
  keyCount: number;
};
