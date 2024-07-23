import { Tile } from "../tiles";
import { Round } from "./round";

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

export const getIdlePlayers = (round: Round) => {
  return round.players.filter(
    (playerId: string) =>
      !round.continuePlayers.includes(playerId) &&
      !round.exitPlayers.includes(playerId)
  );
};

// Player can continue playing if:
// - Player id found in continuePlayers array
// - Player has not already exited (is not found in campPlayers array)
export const getContinuePlayers = (round: Round) => {
  return (
    round?.continuePlayers.filter(
      (playerId: string) => !round.campPlayers.find((p) => p.id === playerId)
    ) || []
  );
};

// Player will exit if:
// - Player id found in exitPlayers array
// - Player id is not found in continuePlayers (idle check)
export const getExitPlayers = (round: Round) => {
  return round.players.filter((playerId: string) => {
    const hasChosenExit = round.exitPlayers.includes(playerId);
    const hasNotChosenAction =
      !round.continuePlayers.includes(playerId) &&
      !round.exitPlayers.includes(playerId);

    return hasNotChosenAction || hasChosenExit;
  });
};

// Divides reward evenly between exiting players
// Returns player array with score
type GetExitingPlayersWithDistributedRewardType = {
  rewardStack: Tile[];
  exitingPlayers: string[];
};
export const getExitingPlayersWithDistributedReward = ({
  rewardStack,
  exitingPlayers,
}: GetExitingPlayersWithDistributedRewardType) => {
  const thisTurnValue = rewardStack
    .map((tile: Tile) => tile.value)
    .reduce((a: number, b: number) => a + b, 0);

  const scorePerPlayer = Math.floor(thisTurnValue / exitingPlayers.length);
  return exitingPlayers.map((playerId: string) => ({
    id: playerId,
    score: scorePerPlayer,
    roundTotalValue: thisTurnValue,
  }));
};
