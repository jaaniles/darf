import * as logger from "firebase-functions/logger";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { shuffleTiles, Tile, tiles } from "../tiles";
import { getExitingPlayersWithDistributedReward, Player } from "./player";
import { handleUpdateGameScore } from "./game";
import { db } from ".";

export type Round = {
  id: string;
  gameId: string;
  board: Tile[]; // Contains all dealt tiles. For display purposes.
  rewardStack: Tile[]; // Contains tiles that have not been claimed yet. Resets when dividing rewards.
  players: string[];
  continuePlayers: string[]; // Players who have chosen to continue this round
  exitPlayers: string[]; // Players who have chosen to exit this round
  campPlayers: Player[]; // Players who have exited this round
  nudge: string[]; // List of idle players who should be nudged
  counter: number;
  turnTimestamp: Timestamp; // Timestamp of the last turn, used for forcing turns if there's idle players
};

// Triggers when new round is created
// > Deals first tile
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

    const board = round?.board || [];

    const remainingTiles = tiles.filter((tile) => !board.includes(tile.id));
    const nextTile = shuffleTiles(remainingTiles)[0];

    await ref.update({
      board: FieldValue.arrayUnion(nextTile),
      rewardStack: FieldValue.arrayUnion(nextTile),
    });
  }
);

//#region endRound
// Ends a single round
// Updates round with current player status and score
// Updates game score according to round results
// If this is last round, calls function to end the game
type EndRoundProps = {
  roundRef: FirebaseFirestore.DocumentReference;
  round: Round;
  gameId: string;
  roundCounter: number;
  continuingPlayers: string[];
  exitingPlayers: string[];
};

export const endRound = async ({
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
    rewardStack: [],
    nudge: [],
  });

  console.log("... updating game score");
  await handleUpdateGameScore({
    roundId: roundRef.id,
    gameId: gameId,
  });
};

type CreateNewRoundProps = {
  round: Round;
  lobbyId: string;
};

export const createNewRound = async ({
  round,
  lobbyId,
}: CreateNewRoundProps) => {
  const newRoundRef = db.collection("round").doc();

  const props = createRoundProps({
    gameId: round.gameId,
    lobbyId,
    playersFromLobby: round.players,
    counter: round.counter + 1,
  });

  await newRoundRef.create(props);

  return newRoundRef.id;
};

type RoundProps = {
  gameId: string;
  lobbyId: string;
  playersFromLobby: string[];
  counter: number;
};

export const createRoundProps = ({
  lobbyId,
  gameId,
  playersFromLobby,
  counter,
}: RoundProps) => ({
  lobbyId,
  gameId,
  board: [],
  players: playersFromLobby,
  continuePlayers: [],
  exitPlayers: [],
  campPlayers: [],
  rewardStack: [],
  nudge: [],
  counter,
  turnTimestamp: Timestamp.now(),
});
