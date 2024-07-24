//import { useBeforeUnload, useSubmit } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";
import { jsonPostRequest } from "~/request.client";
import { Button } from "~/ui/Button/Button";

type Props = {
  lobbyId: string;
  userId: string;
};

type Lobby = {
  currentRoundId: string;
  admin: string;
  players: string[];
  users: {
    userId: string;
    displayName: string;
  }[];
  joinCode: string;
  ready?: string[];
  gameId?: string;
};

export default function LobbyPage({ lobbyId, userId }: Props) {
  const [lobbyState, setLobbyState] = useState<Lobby | null>(null);
  const userNotInLobby = !lobbyState?.players.includes(userId);
  const navigate = useNavigate();

  // Game has started, navigate to game page
  useEffect(() => {
    if (lobbyState?.gameId) {
      navigate(`/game/${lobbyState.gameId}`);
    }
  }, [lobbyState?.gameId, navigate]);

  // User has been kicked from lobby, redirect away
  useEffect(() => {
    const lobbyExists = !!lobbyState?.players;

    if (userNotInLobby && lobbyExists) {
      navigate("/");
    }
  }, [userNotInLobby, lobbyState?.players, navigate]);

  // Subscribe to realtime lobby data
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "lobby", lobbyId), (doc) => {
      const data = doc.data() as Lobby | undefined;

      if (!data) {
        return;
      }

      setLobbyState(data);
    });

    return () => unsub();
  }, [lobbyId]);

  const handlePlayerReady = () => {
    const ready = lobbyState?.ready?.includes(userId);

    jsonPostRequest(`/lobbyPlayerReady?ready=${ready ? "cancel" : "ready"}`, {
      userId,
      lobbyId,
    });
  };

  const userIsAdmin = lobbyState?.admin === userId;
  const isReady = !!lobbyState?.ready?.includes(userId);
  const allReady = lobbyState?.players.length === lobbyState?.ready?.length;

  return (
    <div>
      <h1>Welcome to lobby</h1>
      <p>{lobbyId}</p>

      <p>Join with code: {lobbyState?.joinCode}</p>

      <hr />

      <h2>Ready?</h2>
      <Button
        type="button"
        text={isReady ? "Cancel" : "Ready"}
        onClick={handlePlayerReady}
      />

      <h2>Users in lobby:</h2>
      <ul>
        {lobbyState?.users.map((user) => (
          <li key={user.userId}>
            <p>
              {user.userId === lobbyState?.admin && "👑"}
              {user.displayName}
              {lobbyState?.ready?.includes(user.userId) && "✅"}
            </p>
            {userIsAdmin && user.userId !== userId && (
              <form method="POST" action={`/lobby/${lobbyId}/kick`}>
                <input type="hidden" name="userToKick" value={user.userId} />
                <input type="hidden" name="userId" value={userId} />
                <Button type="submit" text="Kick" variant="secondary" />
              </form>
            )}
          </li>
        ))}

        {allReady && (
          <form method="POST" action={`/lobby/${lobbyId}/start`}>
            <input type="hidden" name="userId" value={userId} />
            <Button type="submit" text="Start expedition" variant="secondary" />
          </form>
        )}
      </ul>
    </div>
  );
}

/*
      <form method="POST" action={`/lobby/${lobbyId}/ready`}>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="ready" value={isReady ? "true" : "false"} />
        <Button type="submit" text={isReady ? "Cancel" : "Ready"} />
      </form>
      */
