export type Player = {
  id: string;
  score: number;
};

export const createPlayer = (id: string) => {
  return {
    id,
    score: 0,
  };
};

export const createPlayers = (ids: string[]) => {
  return ids.map((id) => createPlayer(id));
};
