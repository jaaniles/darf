import * as functions from "firebase-functions";
import { db } from ".";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import {
  getContinuePlayers,
  getExitingPlayersWithDistributedReward,
  getExitPlayers,
  getIdlePlayers,
  Player,
} from "./player";
import { shuffleTiles, tiles } from "../tiles";
import { createNewRound, endRound, Round } from "./round";

export const GAME_MAX_ROUNDS = 2;
const TURN_WAIT_TIME = 30 * 1000; // 30 seconds

export type Game = {
  id: string;
  lobbyId: string;
  round: number;
  players: Player[];
  currentRoundId: string;
  gameOver?: boolean;
};

//#region nextTurn
/*
  # ┌────────────────────────────────────────────────────────────────────────────┐
  # │ Advances game to next turn via player request  
  # | 
  # │> Check if all players have chosen an action                                                     
  # │> Takes TURN_WAIT_TIME into account and nudges idle players
  # |> When turn timer is over, idle players will be forced to exit the round
  # │> Get continuers and exiters
  # │> If no continuers, end round                                                                            
  # │> If continuers, divide reward evenly between exiters, rounding down
  # │> Deal next tile, update round state                                                       
  # └────────────────────────────────────────────────────────────────────────────┘
  */
export const nextTurn = functions.https.onRequest(async (req, res) => {
  const { roundId, user } = req.body;

  if (!roundId || !user) {
    res.status(400).send("Missing parameters when trying to nextTurn");
    return;
  }

  const data = {
    roundId,
    userId: user,
  };

  const roundRef = db.collection("round").doc(roundId);
  const round = (await roundRef.get()).data() as Round;

  if (!round) {
    res
      .status(404)
      .send({ data: { ...data, message: "Round not found", error: true } });
    return;
  }

  if (!round.players.find((playerId) => playerId === user)) {
    res
      .status(403)
      .send({ data: { ...data, message: "Player not in round", error: true } });
    return;
  }

  /*
  # ┌────────────────────────────────────────────────────────────────────────────┐
  # │ Check turn timer and idle players                                                     
  # └────────────────────────────────────────────────────────────────────────────┘
  */
  const gracePeriodIsOver =
    Date.now() - round.turnTimestamp.toMillis() > TURN_WAIT_TIME;
  const idlePlayers = getIdlePlayers(round);

  console.log(
    "DEBUG: Turn wait time remaining",
    (TURN_WAIT_TIME - (Date.now() - round.turnTimestamp.toMillis())) / 1000
  );

  /*
  # ┌────────────────────────────────────────────────────────────────────────────┐
  # │ Some players have not taken an action and there's grace period left
  # | > Add idle players to nudge list for a reminder to take an action                                                     
  # └────────────────────────────────────────────────────────────────────────────┘
  */
  if (idlePlayers.length > 0 && !gracePeriodIsOver) {
    await roundRef.update({
      nudge: idlePlayers,
    });

    res
      .status(200)
      .send({ data: { ...data, message: "Nudging idle players" } });

    return;
  }

  const continuingPlayers = getContinuePlayers(round);
  const exitingPlayers = getExitPlayers(round);

  /*
  # ┌────────────────────────────────────────────────────────────────────────────┐
  # │ No players want to continue                                                       
  # │ > End the round
  # │ > If last round, end the game
  # │ > If more rounds, create new round                                                                            
  # └────────────────────────────────────────────────────────────────────────────┘
  */
  if (continuingPlayers.length === 0) {
    await endRound({
      roundRef,
      round,
      gameId: round.gameId,
      roundCounter: round.counter,
      continuingPlayers,
      exitingPlayers,
    });

    const gameRef = db.collection("game").doc(round.gameId);
    // If this is last round, end game
    if (round.counter >= GAME_MAX_ROUNDS) {
      console.log("GAME OVER, all rounds have been played");

      await gameRef.update({
        gameOver: true,
      });

      res.status(200).send({ data: { ...data, message: "Game ended" } });
      return;
    }

    const game = (await gameRef.get()).data() as Game;

    // More rounds to play, create new round
    const newRoundId = await createNewRound({ round, lobbyId: game.lobbyId });

    // Update lobby with new round id
    const lobbyRef = db.collection("lobby").doc(game.lobbyId);
    lobbyRef.update({
      currentRoundId: newRoundId,
    });

    // Update game with new round id and increment round counter
    gameRef.update({
      currentRoundId: newRoundId,
      round: FieldValue.increment(1),
    });

    res
      .status(200)
      .send({ data: { ...data, roundId: newRoundId, message: "Round ended" } });
    return;
  }

  /*
  # ┌────────────────────────────────────────────────────────────────────────────┐
  # │ Some players want to continue                                                       
  # │> Deal next tile                                                            
  # │> Update round with new board and players
  # └────────────────────────────────────────────────────────────────────────────┘
  */
  const board = round?.board || [];
  const remainingTiles = tiles.filter((tile) => !board.includes(tile));
  const nextTile = shuffleTiles(remainingTiles)[0];

  const playersExitedThisRound = exitingPlayers.length > 0;
  switch (playersExitedThisRound) {
    // Players exited this round
    // > Update campPlayers with players who claimed reward this round
    // > Reset rewardStack
    case true: {
      const exitingPlayersWithReward = getExitingPlayersWithDistributedReward({
        rewardStack: round.rewardStack,
        exitingPlayers,
      });

      await roundRef.update({
        board: FieldValue.arrayUnion(nextTile),
        rewardStack: [nextTile],
        players: continuingPlayers,
        continuePlayers: [],
        exitPlayers: [],
        campPlayers: FieldValue.arrayUnion(...exitingPlayersWithReward),
        nudge: [],
        turnTimestamp: Timestamp.now(),
      });

      res.status(200).send({ data });
      return;
    }

    // No players exited this round
    // > Skip updating campPlayers
    // > Dont reset rewardStack
    case false: {
      await roundRef.update({
        board: FieldValue.arrayUnion(nextTile),
        rewardStack: FieldValue.arrayUnion(nextTile),
        players: continuingPlayers,
        continuePlayers: [],
        exitPlayers: [],
        nudge: [],
        turnTimestamp: Timestamp.now(),
      });

      res.status(200).send({ data });
      return;
    }
    default: {
      res.status(400).send({ data: { ...data, message: "Invalid state" } });
      return;
    }
  }
});

// - Update player score
export const handleUpdateGameScore = async ({
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

//#region playerAction
// Player chooses action in round: "continue" or "exit"
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
    console.error("Player action: round not found");
    res.status(404).send("Round not found");
    return;
  }

  if (!round.players.find((playerId) => playerId === user)) {
    console.error("Player action: user not in round");
    res
      .status(403)
      .send(`Player ${user} not found in round, tried to continue`);
    return;
  }

  switch (action) {
    case "continue":
      await roundRef.update({
        continuePlayers: FieldValue.arrayUnion(user),
        exitPlayers: FieldValue.arrayRemove(user),
        nudge: FieldValue.arrayRemove(user),
      });

      res.status(200).send({ data: { roundId, userId: user } });
      break;
    case "exit":
      await roundRef.update({
        continuePlayers: FieldValue.arrayRemove(user),
        exitPlayers: FieldValue.arrayUnion(user),
        nudge: FieldValue.arrayRemove(user),
      });

      res.status(200).send({ data: { roundId, userId: user } });
      break;
    default:
      console.error("Player action: invalid action");
      res.status(400).send("Invalid action");
      return;
  }
});
