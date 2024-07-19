import * as functions from "firebase-functions";
import { db } from ".";
import { FieldValue } from "firebase-admin/firestore";

import { Player } from "./player";
import { shuffleTiles, Tile, tiles } from "../tiles";
import { Round } from "./round";

const GAME_MAX_ROUNDS = 2;

export type Game = {
  id: string;
  lobbyId: string;
  round: number;
  players: Player[];
};

// Advances game to next turn via player request

// TODO: Check if all players are ready for next turn
// OR waiting grace period has ended

// - Check continue/exit players
// - If no continuers, end round
// - If continuers, divide reward and deal next tile
export const nextTurn = functions.https.onRequest(async (req, res) => {
  const { roundId, user } = req.body;

  if (!roundId || !user) {
    res.status(400).send("Missing parameters when trying to nextTurn");
    return;
  }

  const roundRef = db.collection("round").doc(roundId);
  const round = (await roundRef.get()).data() as Round;

  if (!round) {
    res.status(404).send("Round not found");
    return;
  }

  if (!round.players.find((player) => player.id === user)) {
    res
      .status(403)
      .send(`Player ${user} not found in round, tried to nextTurn`);
    return;
  }

  const continuingPlayers = getPlayersWhoContinue(round);
  const exitingPlayers = getExitingPlayers(round);

  // END ROUND
  // No players want to continue
  if (continuingPlayers.length === 0) {
    await endRound({
      roundRef,
      round,
      gameId: round.gameId,
      roundCounter: round.counter,
      continuingPlayers,
      exitingPlayers,
    });

    res.status(200).send("endRound successful");
    return;
  }

  // CONTINUE
  // - Deal next tile
  // - Update round with new board and players
  const board = round?.board || [];

  const remainingTiles = tiles.filter((tile) => !board.includes(tile));
  const nextTile = shuffleTiles(remainingTiles)[0];

  // Players exited this round
  // - Update campPlayers with players who claimed reward this round
  // - Reset rewardStack
  if (exitingPlayers.length > 0) {
    const exitingPlayersWithReward = getExitingPlayersWithDistributedReward({
      rewardStack: round.rewardStack,
      exitingPlayers,
    });

    await roundRef.update({
      board: FieldValue.arrayUnion(nextTile),
      rewardStack: [],
      players: continuingPlayers,
      campPlayers: FieldValue.arrayUnion(...exitingPlayersWithReward),
      continuePlayers: [],
    });

    return;
  }

  // No players exited this round
  // - Skip updating campPlayers
  // - Dont reset rewardStack
  await roundRef.update({
    board: FieldValue.arrayUnion(nextTile),
    rewardStack: FieldValue.arrayUnion(nextTile),
    players: continuingPlayers,
    continuePlayers: [],
  });

  res.status(200).send("nextTurn successful");
});

// Player can continue playing if:
// - Player id found in continuePlayers array
// - Have not already exited (is not found in campPlayers array)
const getPlayersWhoContinue = (round: Round) => {
  return round?.players
    .filter((player: Player) =>
      round.continuePlayers.find((p) => p === player.id)
    )
    .filter(
      (player: Player) => !round.campPlayers.find((p) => p.id === player.id)
    );
};

// Player will exit if:
// - Player id not found in continuePlayers array
const getExitingPlayers = (round: Round) => {
  return round?.players.filter(
    (player: Player) => !round?.continuePlayers.includes(player.id)
  );
};

// Divides reward evenly between exiting players
// Returns player array with score
type GetExitingPlayersWithDistributedRewardType = {
  rewardStack: Tile[];
  exitingPlayers: Player[];
};
const getExitingPlayersWithDistributedReward = ({
  rewardStack,
  exitingPlayers,
}: GetExitingPlayersWithDistributedRewardType) => {
  const thisTurnValue = rewardStack
    .map((tile: Tile) => tile.value)
    .reduce((a: number, b: number) => a + b, 0);

  const scorePerPlayer = Math.floor(thisTurnValue / exitingPlayers.length);
  return exitingPlayers.map((player: Player) => ({
    ...player,
    score: scorePerPlayer,
    roundTotalValue: thisTurnValue,
  }));
};

// Ends a single round
// Updates round with current player status and score
// Updates game score according to round results
// If this is last round, calls function to end the game
type EndRoundProps = {
  roundRef: FirebaseFirestore.DocumentReference;
  round: Round;
  gameId: string;
  roundCounter: number;
  continuingPlayers: Player[];
  exitingPlayers: Player[];
};
const endRound = async ({
  roundRef,
  round,
  gameId,
  continuingPlayers,
  exitingPlayers,
}: EndRoundProps) => {
  const exitingPlayersWithReward = getExitingPlayersWithDistributedReward({
    rewardStack: round.rewardStack,
    exitingPlayers,
  });

  console.log("End round. Updating round result..");
  await roundRef.update({
    players: continuingPlayers,
    campPlayers: FieldValue.arrayUnion(...exitingPlayersWithReward),
  });

  console.log("... updating game score");
  await handleUpdateGameScore({
    roundId: roundRef.id,
    gameId: gameId,
  });

  // If this is last round, end game
  if (round.counter >= GAME_MAX_ROUNDS) {
    console.log("GAME OVER, all rounds have been played");
    return;
  }
};

// - Update player score
// - Increments game round
const handleUpdateGameScore = async ({
  roundId,
  gameId,
}: {
  roundId: string;
  gameId: string;
}) => {
  const gameRef = db.collection("game").doc(gameId);
  const game = (await gameRef.get()).data() as Game;
  const roundRef = db.collection("round").doc(roundId);
  const round = (await roundRef.get()).data() as Round;

  const currentScore = game?.players || [];
  const newScore = round.campPlayers.map((player: Player) => {
    const existingPlayer = currentScore.find((p) => p.id === player.id);
    const score = existingPlayer?.score || 0;

    return {
      id: player.id,
      score: score + player.score,
    };
  });

  await gameRef.update({
    players: newScore,
  });
};

/*
console.log("Creating new round..");
const newRoundRef = db.collection("round").doc();
await newRoundRef.create({
  gameId: roundStateData?.gameId,
  roundStateId: roundStateRef.id,
  board: [],
  players: createPlayers(roundStateData?.players),
  continuePlayers: [],
  campPlayers: [],
  counter: round.counter + 1,
});
console.log("New round created:", newRoundRef.id);
*/

// Modifies round continuePlayers array
// Based on player action: "continue" or "exit"
export const playerAction = functions.https.onRequest(async (req, res) => {
  const { roundId, user } = req.body;
  const { action } = req.query;

  if (!roundId || !user || !action) {
    res.status(400).send("Missing parameters when trying to playerAction");
    return;
  }

  const roundRef = db.collection("round").doc(roundId);
  const round = (await roundRef.get()).data() as Round;

  if (!round) {
    res.status(404).send("Round not found");
    return;
  }

  if (!round.players.find((player) => player.id === user)) {
    res
      .status(403)
      .send(`Player ${user} not found in round, tried to continue`);
    return;
  }

  switch (action) {
    case "continue":
      await roundRef.update({
        continuePlayers: FieldValue.arrayUnion(user),
      });

      res.status(200).send("roundActionContinue successful");
      break;
    case "exit":
      await roundRef.update({
        continuePlayers: FieldValue.arrayRemove(user),
      });

      res.status(200).send("roundActionExit successful");
      break;
    default:
      res.status(400).send("Invalid action");
      return;
  }
});

/* DEPRECATED
export const roundActionContinue = functions.https.onRequest(
  async (req, res) => {
    const { roundId, user } = req.body;

    if (!roundId || !user) {
      res
        .status(400)
        .send("Missing parameters when trying to roundActionContinue");
      return;
    }

    const roundRef = db.collection("round").doc(roundId);
    const round = (await roundRef.get()).data() as Round;

    if (!round) {
      res.status(404).send("Round not found");
      return;
    }

    if (!round.players.find((player) => player.id === user)) {
      res
        .status(403)
        .send(`Player ${user} not found in round, tried to continue`);
      return;
    }
  }
);

export const roundActionExit = functions.https.onRequest(async (req, res) => {
  const { roundId, user } = req.body;

  if (!roundId || !user) {
    res.status(400).send("Missing parameters when trying to roundActionExit");
    return;
  }

  const roundRef = db.collection("round").doc(roundId);

  await roundRef.update({
    continuePlayers: FieldValue.arrayRemove(user),
  });

  res.status(200).send("roundActionExit successul");
});
*/
