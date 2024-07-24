//import { useBeforeUnload, useSubmit } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";
import { Button } from "~/ui/Button/Button";

type Props = {
  lobbyId: string;
  userId: string;
};

type Lobby = {
  currentRoundId: string;
  admin: string;
  players: string[];
  joinCode: string;
  ready?: string[];
  gameId?: string;
};

export default function LobbyPage({ lobbyId, userId }: Props) {
  const [lobbyState, setLobbyState] = useState<Lobby | null>(null);
  const userNotInLobby = !lobbyState?.players.includes(userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (lobbyState?.gameId) {
      navigate(`/game/${lobbyState.gameId}`);
    }
  }, [lobbyState?.gameId, navigate]);

  useEffect(() => {
    const lobbyExists = !!lobbyState?.players;

    if (userNotInLobby && lobbyExists) {
      navigate("/");
    }
  }, [userNotInLobby, lobbyState?.players, navigate]);

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
      <form method="POST" action={`/lobby/${lobbyId}/ready`}>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="ready" value={isReady ? "true" : "false"} />
        <Button type="submit" text={isReady ? "Cancel" : "Ready"} />
      </form>

      <h2>Users in lobby:</h2>
      <ul>
        {lobbyState?.players.map((player) => (
          <li key={player}>
            <p>
              {player === lobbyState?.admin && "👑"}
              {player}
              {lobbyState?.ready?.includes(player) && "✅"}
            </p>
            {userIsAdmin && player !== userId && (
              <form method="POST" action={`/lobby/${lobbyId}/kick`}>
                <input type="hidden" name="userToKick" value={player} />
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
