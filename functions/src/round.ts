import * as logger from "firebase-functions/logger";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";

import { shuffleTiles, Tile, tiles } from "../tiles";
import { FieldValue } from "firebase-admin/firestore";
import { db } from ".";
import { createPlayers, Player } from "./player";
import { Game } from "./game";

const GAME_MAX_ROUNDS = 2;
const TURN_WAIT_TIME = 10 * 1000;
const SAFETY_ROUND_MAX_COUNTER = 20;

export type Round = {
  id: string;
  gameId: string;
  roundStateId: string;
  board: Tile[]; // Contains all dealt tiles. For display purposes.
  rewardStack: Tile[]; // Contains tiles that have not been claimed yet. Resets when dividing rewards.
  players: Player[];
  continuePlayers: string[];
  campPlayers: Player[];
  counter: number;
};

export type RoundState = {
  id: string;
  roundId: string;
  gameId: string;
  counter: number;
  players: string[];
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

// Triggers when new round is created
// Deals first tile and ensures roundState is updated
// This will ensure that the game logic is started
export const onCreateNewRound = onDocumentCreated(
  "round/{roundId}",
  async (event) => {
    const round = event.data?.data();
    const ref = event.data?.ref;

    if (!round || !ref) {
      logger.warn("Error in trigger: onDocumentCreated (round) - missing data");
      return;
    }

    //const roundStateRef = db.collection("roundState").doc(round.roundStateId);
    const board = round?.board || [];

    const remainingTiles = tiles.filter((tile) => !board.includes(tile.id));
    const nextTile = shuffleTiles(remainingTiles)[0];

    await ref.update({
      board: FieldValue.arrayUnion(nextTile),
      rewardStack: FieldValue.arrayUnion(nextTile),
    });

    /*
    await roundStateRef.update({
      counter: FieldValue.increment(1),
    });
    */
  }
);

// DEPRECATED
// Handles automatic advancing of Round in turns
/// Todo: replace with logic based on player interaction instead of automatic advancing
/// Todo: handle trap logic
export const onNewTurn = onDocumentUpdated(
  "roundState/{roundStateId}",
  async (event) => {
    const roundStateData = event.data?.after.data();
    const previousRoundStateData = event.data?.before.data();
    const roundStateRef = event.data?.after.ref;

    if (!roundStateRef) {
      logger.warn(
        "Error in trigger: onDocumentUpdated (roundState) - missing eventRef"
      );
      return;
    }

    if (
      roundStateData?.counter === previousRoundStateData?.counter ||
      roundStateData?.counter >= SAFETY_ROUND_MAX_COUNTER
    ) {
      console.log("Data counter:", roundStateData?.counter);
      return null;
    }

    const roundRef = db.collection("round").doc(roundStateData?.roundId);

    // Handle logic for advancing into next turn
    // - Check if players continue or exit
    // - Divide current accumulated reward between exiting players
    // - If no players continue, end round
    const nextTurnCallback = async () => {
      const round = (await roundRef.get()).data() as Round;
      const players = round?.players || [];

      if (!players || players.length === 0) {
        logger.warn(
          "Should not happen, but no players playng and round is still going!"
        );
        return;
      }

      // Player can continue playing if:
      // - Player id found in continuePlayers array
      // - Have not already exited (is not found in campPlayers array)
      const playersWhoContinue = round?.players
        .filter((player: Player) =>
          round.continuePlayers.find((p) => p === player.id)
        )
        .filter(
          (player: Player) => !round.campPlayers.find((p) => p.id === player.id)
        );

      const playersWhoExit = round?.players.filter(
        (player: Player) => !round?.continuePlayers.includes(player.id)
      );

      // Handle exiting players
      // - Divide reward to exiting players
      const thisTurnValue = round?.rewardStack
        .map((tile: Tile) => tile.value)
        .reduce((a: number, b: number) => a + b, 0);
      const reward = Math.floor(thisTurnValue / playersWhoExit.length);
      const campPlayers = playersWhoExit.map(
        (player: Player) =>
          ({
            ...player,
            score: reward,
            roundTotalValue: thisTurnValue,
            exitRound: roundStateData?.counter,
          }) || []
      );

      // End round if no players continue
      // - Update game score
      // - Increment game round
      // - Create new round
      // - Update roundState with new roundId and set counter to 0
      if (!playersWhoContinue || playersWhoContinue.length === 0) {
        console.log("Ending round, no more players to continue");

        await roundRef.update({
          players: playersWhoContinue,
          campPlayers: FieldValue.arrayUnion(...campPlayers),
        });

        handleUpdateGameScore({
          roundId: roundRef.id,
          gameId: roundStateData?.gameId,
        });

        // If this is last round, end game
        console.log("Round counter:", round?.counter);
        if (round?.counter >= GAME_MAX_ROUNDS) {
          console.log(`DEBUG: round ${roundStateData?.counter}, at game over`);
          console.log("GAME OVER, all rounds have been played");
          return;
        }

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

        await roundStateRef?.update({
          counter: 0,
          roundId: newRoundRef.id,
        });

        return;
      }

      // Continue game between continuing players
      // Deal next tile card
      const board = round?.board || [];

      const remainingTiles = tiles.filter((tile) => !board.includes(tile));
      const nextTile = shuffleTiles(remainingTiles)[0];

      console.log(`DEBUG: round ${roundStateData?.counter} continuing..`);
      // Continue to next round
      roundStateRef?.update({
        counter: FieldValue.increment(1),
      });

      const playersExitedThisRound = campPlayers.length > 0;
      if (playersExitedThisRound) {
        await roundRef.update({
          board: FieldValue.arrayUnion(nextTile),
          rewardStack: [],
          players: playersWhoContinue,
          campPlayers: FieldValue.arrayUnion(...campPlayers),
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
        players: playersWhoContinue,
        continuePlayers: [],
      });
    };

    setTimeout(async () => {
      nextTurnCallback();
    }, TURN_WAIT_TIME);

    return null;
  }
);
