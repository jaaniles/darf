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
    name: "Small Snake Trap",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 13,
    name: "Large Lava Trap",
    value: 0,
    trap: Trap.LAVA,
  },
  {
    id: 14,
    name: "Tiny Snake Trap",
    value: 0,
    trap: Trap.SNAKE,
  },
  {
    id: 15,
    name: "Huge Lava Trap",
    value: 0,
    trap: Trap.LAVA,
  },
];
