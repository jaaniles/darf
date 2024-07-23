import * as admin from "firebase-admin";

import {
  createLobby,
  joinLobby,
  exitLobby,
  startGameFromLobby,
  kickFromLobby,
  lobbyPlayerReady,
} from "./lobby";
import { playerAction, nextTurn } from "./game";
import { onCreateNewRound } from "./round";

admin.initializeApp();
export const db = admin.firestore();

export {
  createLobby,
  joinLobby,
  exitLobby,
  kickFromLobby,
  lobbyPlayerReady,
  startGameFromLobby,
  playerAction,
  nextTurn,
  onCreateNewRound,
};
