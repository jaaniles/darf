import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

import { db } from "./index";
import { createPlayers } from "./player";

/* Create a new lobby 
/  body: user
*/
export const createLobby = functions.https.onRequest(async (req, res) => {
  const user = req.body.user;

  const docRef = db.collection("lobbiesv2").doc();

  await docRef.create({
    admin: user,
    players: [user],
  });

  res.send({ lobbyId: docRef.id });
});

/* User joins a lobby
/  body: user, lobbyId
*/
export const joinLobby = functions.https.onRequest(async (req, res) => {
  const { user, lobbyId } = req.body;

  const lobbyRef = db.collection("lobbiesv2").doc(lobbyId);

  console.log(`user: ${user}, joining lobbyId: ${lobbyId}`);

  const userId = user || uuidv4();

  await lobbyRef.update({
    players: FieldValue.arrayUnion(userId),
  });

  res.status(200).send({ lobbyId: lobbyRef.id, userId });
});

/* User exits lobby
/  body: user, lobbyId
*/
export const exitLobby = functions.https.onRequest(async (req, res) => {
  const { user, lobbyId } = req.body;

  const lobbyRef = db.collection("lobbiesv2").doc(lobbyId);

  console.log(`user: ${user}, leaving lobbyId: ${lobbyId}`);

  await lobbyRef.update({
    players: FieldValue.arrayRemove(user),
  });

  res.send({ lobbyId: lobbyRef.id });
});

export const startGameFromLobby = functions.https.onRequest(
  async (req, res) => {
    const { lobbyId, user } = req.body;

    if (!lobbyId || !user) {
      res
        .status(400)
        .send("Missing required fields, aborting startGameFromLobby");
      return;
    }

    const lobbyRef = db.collection("lobbiesv2").doc(lobbyId);
    const lobby = await lobbyRef.get();

    if (!lobby.exists) {
      res.status(404).send("Lobby not found, aborting startGameFromLobby");
      return;
    }

    const lobbyAdmin = lobby.data()?.admin;

    if (lobbyAdmin !== user) {
      res.status(403).send("Only the admin can start the game");
      return;
    }

    const playersFromLobby = lobby.data()?.players;
    const players = createPlayers(playersFromLobby);

    const newGameRef = db.collection("game").doc();
    const newRoundRef = db.collection("round").doc();

    newRoundRef.create({
      gameId: newGameRef.id,
      board: [],
      players,
      continuePlayers: [],
      campPlayers: [],
      rewardStack: [],
      counter: 1,
    });

    newGameRef.create({
      lobbyId,
      players,
      round: 1,
      currentRoundId: newRoundRef.id,
    });

    res
      .status(200)
      .send(
        `Game started with gameId: ${newGameRef.id}, roundId: ${newRoundRef.id}`
      );
  }
);

// DEPRECATED
/* Admin starts game from lobby
/  body: user, lobbyId
*/
/* 
export const startGameFromLobby = functions.https.onRequest(
  async (req, res) => {
    const { lobbyId, user } = req.body;

    if (!lobbyId || !user) {
      res
        .status(400)
        .send("Missing required fields, aborting startGameFromLobby");
      return;
    }

    const lobbyRef = db.collection("lobbiesv2").doc(lobbyId);
    const lobby = await lobbyRef.get();

    if (!lobby.exists) {
      res.status(404).send("Lobby not found, aborting startGameFromLobby");
      return;
    }

    const lobbyAdmin = lobby.data()?.admin;

    if (lobbyAdmin !== user) {
      res.status(403).send("Only the admin can start the game");
      return;
    }

    const playersFromLobby = lobby.data()?.players;
    const players = createPlayers(playersFromLobby);

    const newGameRef = db.collection("game").doc();
    const newRoundState = db.collection("roundState").doc();
    const newRoundRef = db.collection("round").doc();

    newRoundRef.create({
      gameId: newGameRef.id,
      roundStateId: newRoundState.id,
      board: [],
      players,
      continuePlayers: [],
      campPlayers: [],
      counter: 1,
    });

    newGameRef.create({
      lobbyId,
      players,
      round: 1,
      currentRoundId: newRoundRef.id,
    });

    newRoundState.create({
      roundId: newRoundRef.id,
      gameId: newGameRef.id,
      counter: 0,
      players: playersFromLobby,
    });

    res
      .status(200)
      .send(
        `Game started with gameId: ${newGameRef.id}, roundId: ${newRoundRef.id}`
      );
  }
);
*/
