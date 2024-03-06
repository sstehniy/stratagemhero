export enum Key {
  UP = "w",
  DOWN = "s",
  LEFT = "a",
  RIGHT = "d",
}

export type Stratagem = {
  name: string;
  image: string;
  keys: Key[];
  keyCount: number;
};

export enum GameStatus {
  NONE,
  STARTED,
  FINISHED,
  ROUND_ENDED,
  BETWEEN_STRATAGEMS,
  GET_READY,
  WELCOME,
}
