import * as admin from "firebase-admin";

import { createLobby, joinLobby, exitLobby, startGameFromLobby } from "./lobby";
import { playerAction, nextTurn } from "./game";
import { onCreateNewRound } from "./round";

admin.initializeApp();
export const db = admin.firestore();

export {
  createLobby,
  joinLobby,
  exitLobby,
  startGameFromLobby,
  playerAction,
  nextTurn,
  onCreateNewRound,
};
