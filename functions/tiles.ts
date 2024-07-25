export enum Trap {
  SNAKE = "SNAKE",
  LAVA = "LAVA",
}

export type Tile = {
  id: number;
  name: string;
  value: number;
  trap: Trap | null;
};

export const shuffleTiles = (tiles: Tile[]) => {
  return tiles.sort(() => Math.random() - 0.5);
};

export const tiles = [
  {
    id: 1,
    name: "Small deposit of diamonds (10)",
    value: 10,
    trap: null,
  },
  {
    id: 2,
    name: "Tiny deposit of diamonds (5)",
    value: 5,
    trap: null,
  },
  {
    id: 3,
    name: "Deposit of diamonds (12)",
    value: 12,
    trap: null,
  },
  {
    id: 4,
    name: "Spare Diamond (1)",
    value: 1,
    trap: null,
  },
  {
    id: 5,
    name: "Large deposit of diamonds (15)",
    value: 15,
    trap: null,
  },
  {
    id: 6,
    name: "Enormous deposit of diamonds (20)",
    value: 20,
    trap: null,
  },
  {
    id: 7,
    name: "Giant deposit of diamonds (18)",
    value: 18,
    trap: null,
  },
  {
    id: 8,
    name: "Medium deposit of diamonds (13)",
    value: 13,
    trap: null,
  },
  {
    id: 9,
    name: "Huge deposit of diamonds (17)",
    value: 17,
    trap: null,
  },
  {
    id: 10,
    name: "Massive deposit of diamonds (19)",
    value: 19,
    trap: null,
  },
  {
    id: 11,
    name: "Big deposit of diamonds (16)",
    value: 16,
    trap: null,
  },
  {
    id: 12,
    name: "Small deposit of diamonds (7)",
    value: 7,
    trap: null,
  },
  {
    id: 13,
    name: "Tiny deposit of diamonds (3)",
    value: 3,
    trap: null,
  },
  {
    id: 14,
    name: "Deposit of diamonds (9)",
    value: 9,
    trap: null,
  },
  {
    id: 15,
    name: "Spare Diamond (2)",
    value: 2,
    trap: null,
  },
  {
    id: 16,
    name: "Large deposit of diamonds (8)",
    value: 8,
    trap: null,
  },
  {
    id: 17,
    name: "Enormous deposit of diamonds (10)",
    value: 10,
    trap: null,
  },
  {
    id: 18,
    name: "Giant deposit of diamonds (6)",
    value: 6,
    trap: null,
  },
  {
    id: 19,
    name: "Medium deposit of diamonds (4)",
    value: 4,
    trap: null,
  },
  {
    id: 20,
    name: "Huge deposit of diamonds (5)",
    value: 5,
    trap: null,
  },
  {
    id: 21,
    name: "Massive deposit of diamonds (1)",
    value: 1,
    trap: null,
  },
  {
    id: 22,
    name: "Big deposit of diamonds (10)",
    value: 10,
    trap: null,
  },
  {
    id: 23,
    name: "Small deposit of diamonds (3)",
    value: 3,
    trap: null,
  },
  {
    id: 24,
    name: "Tiny deposit of diamonds (2)",
    value: 2,
    trap: null,
  },
  {
    id: 25,
    name: "Deposit of diamonds (7)",
    value: 7,
    trap: null,
  },
  {
    id: 26,
    name: "Spare Diamond (5)",
    value: 5,
    trap: null,
  },
  {
    id: 27,
    name: "Large deposit of diamonds (9)",
    value: 9,
    trap: null,
  },
  {
    id: 28,
    name: "Enormous deposit of diamonds (6)",
    value: 6,
    trap: null,
  },
  {
    id: 29,
    name: "Giant deposit of diamonds (4)",
    value: 4,
    trap: null,
  },
  {
    id: 30,
    name: "Medium deposit of diamonds (8)",
    value: 8,
    trap: null,
  },
  {
    id: 31,
    name: "Huge deposit of diamonds (1)",
    value: 1,
    trap: null,
  },
  {
    id: 32,
    name: "Snake Trap!!!",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 33,
    name: "Snake Trap!!!",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 34,
    name: "Snake Trap!!!",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 35,
    name: "LAVA Trap!!",
    value: 0,
    trap: Trap.LAVA,
  },
  {
    id: 36,
    name: "LAVA Trap!!",
    value: 0,
    trap: Trap.LAVA,
  },
  {
    id: 37,
    name: "LAVA Trap!!",
    value: 0,
    trap: Trap.LAVA,
  },
  {
    id: 38,
    name: "Snake Trap!!!",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 39,
    name: "Snake Trap!!!",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 40,
    name: "LAVA Trap!!",
    value: 0,
    trap: Trap.LAVA,
  },
  {
    id: 41,
    name: "LAVA Trap!!",
    value: 0,
    trap: Trap.LAVA,
  },
];
