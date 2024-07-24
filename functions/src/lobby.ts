import { onRequest } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import pokemon from "pokemon";

import { db } from "./index";
import { createPlayers } from "./player";
import { createRoundProps } from "./round";

type Lobby = {
  currentRoundId: string;
  admin: string;
  players: string[];
  joinCode: string;
  ready?: string[];
  gameId?: string;
};

/* Create a new lobby 
/  body: user
*/
export const createLobby = onRequest(async (req, res) => {
  const { userId, displayName } = req.body;

  console.log("Create lobby.", userId, displayName);

  if (!userId || !displayName) {
    res
      .status(400)
      .send({ userId, error: true, message: "Missing parameters" });
    return;
  }

  const docRef = db.collection("lobby").doc();
  const joinCode = pokemon.random().toLocaleLowerCase();

  await docRef.create({
    admin: userId,
    players: [userId],
    users: [{ userId, displayName }],
    joinCode,
  });

  console.log("Lobby has been created");

  res.status(200).send({
    data: {
      lobbyId: docRef.id,
      joinCode,
    },
  });
});

/* User joins a lobby
/  body: user, joinCode
*/
export const joinLobby = onRequest(async (req, res) => {
  const { userId, displayName, joinCode } = req.body;

  if (!userId || !joinCode) {
    res.status(400).send("Missing required fields, aborting joinLobby");
    return;
  }

  const query = await db
    .collection("lobby")
    .where("joinCode", "==", joinCode.toLocaleLowerCase())
    .get();

  if (query.empty) {
    res.status(404).send("Lobby not found");
    return;
  }

  const lobbyRef = query.docs[0].ref;

  try {
    await lobbyRef.update({
      players: FieldValue.arrayUnion(userId),
      users: FieldValue.arrayUnion({ userId, displayName }),
    });
    res.status(200).send({
      data: {
        lobbyId: lobbyRef.id,
        userId,
      },
    });
  } catch (error) {
    console.error("Error updating lobby players:", error);
    res.status(500).send("Failed in: join lobby");
    return;
  }
});

/* User exits lobby
/  body: user, lobbyId
*/
export const exitLobby = onRequest(async (req, res) => {
  const { userId, lobbyId } = req.body;

  const lobbyRef = db.collection("lobby").doc(lobbyId);

  console.log(`user: ${userId}, leaving lobbyId: ${lobbyId}`);

  try {
    await lobbyRef.update({
      players: FieldValue.arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error updating lobby players:", error);
    res.status(500).send("Failed in: exit lobby");
  }

  res.status(200).send({
    data: {
      lobbyId: lobbyRef.id,
      userId,
    },
  });
});

/* Admin kicks user from lobby
/  body: userId, lobbyId, userToKick
/  requires: userId to be the admin of the lobby
*/
export const kickFromLobby = onRequest(async (req, res) => {
  const { userId, lobbyId, userToKick } = req.body;

  if (!userId || !lobbyId || !userToKick) {
    res.status(400).send("Missing required fields, aborting kickFromLobby");
    return;
  }

  const lobbyRef = db.collection("lobby").doc(lobbyId);
  const lobby = (await lobbyRef.get()).data() as Lobby;

  if (!lobby) {
    res.status(404).send("Lobby not found, aborting kickFromLobby");
    return;
  }

  const lobbyAdmin = lobby.admin;
  if (lobbyAdmin !== userId) {
    res.status(403).send("Only the admin can kick players");
    return;
  }

  if (lobbyAdmin === userToKick) {
    res.status(403).send("Admin cannot kick themselves");
    return;
  }

  try {
    await lobbyRef.update({
      players: FieldValue.arrayRemove(userToKick),
    });

    res.status(200).send({
      data: {
        lobbyId: lobbyRef.id,
        userToKick: userToKick,
      },
    });
  } catch (error) {
    console.error("Error updating lobby players:", error);
    res.status(500).send("Failed in: kick from lobby");
    return;
  }
});

export const lobbyPlayerReady = onRequest(async (req, res) => {
  const { userId, lobbyId } = req.body;
  const { ready } = req.query;

  if (!userId || !lobbyId || !ready) {
    res.status(400).send("Missing required fields, aborting lobbyPlayerReady");
    return;
  }

  const lobbyRef = db.collection("lobby").doc(lobbyId);
  const lobby = (await lobbyRef.get()).data() as Lobby;

  if (!lobby) {
    res.status(404).send("Lobby not found, aborting lobbyPlayerReady");
    return;
  }

  switch (ready) {
    case "ready":
      await lobbyRef.update({
        ready: FieldValue.arrayUnion(userId),
      });

      res.status(200).send({
        data: {
          lobbyId: lobbyRef.id,
          userId,
        },
      });
      break;
    case "cancel":
      await lobbyRef.update({
        ready: FieldValue.arrayRemove(userId),
      });

      res.status(200).send({
        data: {
          lobbyId: lobbyRef.id,
          userId,
        },
      });
      break;
    default:
      res.status(400).send("Invalid action");
      return;
  }
});

/* Game admin starts game from lobby
/ body: user, lobbyId
*/
export const startGameFromLobby = onRequest(async (req, res) => {
  const { lobbyId, user } = req.body;

  if (!lobbyId || !user) {
    res
      .status(400)
      .send("Missing required fields, aborting startGameFromLobby");
    return;
  }

  const lobbyRef = db.collection("lobby").doc(lobbyId);
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
  const users = lobby.data()?.users;

  const newGameRef = db.collection("game").doc();
  const newRoundRef = db.collection("round").doc();

  lobbyRef.update({
    gameId: newGameRef.id,
    currentRoundId: newRoundRef.id,
  });

  newRoundRef.create(
    createRoundProps({
      gameId: newGameRef.id,
      lobbyId,
      playersFromLobby,
      counter: 1,
    })
  );

  newGameRef.create({
    lobbyId,
    players,
    users,
    round: 1,
    currentRoundId: newRoundRef.id,
  });

  res.status(200).send({
    data: {
      gameId: newGameRef.id,
      roundId: newRoundRef.id,
    },
  });
});
