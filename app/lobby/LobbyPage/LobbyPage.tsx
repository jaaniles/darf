//import { useBeforeUnload, useSubmit } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import stylex from "@stylexjs/stylex";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserProfile } from "~/auth/getUserProfile";
import { db } from "~/firebase.client";
import { LobbyPlayer } from "~/lobby/LobbyPlayer/LobbyPlayer";
import { jsonPostRequest } from "~/request.client";
import { spacing } from "~/tokens.stylex";
import { Button } from "~/ui/Button/Button";
import { Callout } from "~/ui/Callout/Callout";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";
import { Text } from "~/ui/typography/Text";

type Props = {
  lobbyId: string;
  userId: string;
};

type Lobby = {
  currentRoundId: string;
  admin: string;
  players: string[];
  users: UserProfile[];
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
    <Stack spacing={48}>
      <Stack spacing={32}>
        <Headline as="h1">Gather your party</Headline>
        <Stack spacing={16}>
          <Text>
            Give this secret phrase to your friend so they can join this
            expedition.
          </Text>
          <Callout variant="info" text={`${lobbyState?.joinCode}`} />
        </Stack>
      </Stack>

      <Stack spacing={8}>
        <Headline as="h2" size="sm" weight="bold">
          Party
        </Headline>
        <ul {...stylex.props(styles.ul)}>
          {lobbyState?.users.map((user) => (
            <LobbyPlayer
              key={user.userId}
              lobbyId={lobbyId}
              userId={userId}
              player={user}
              isReady={!!lobbyState?.ready?.includes(user.userId)}
              playerIsAdmin={user.userId === lobbyState?.admin}
              canKick={userIsAdmin}
            />
          ))}
        </ul>
      </Stack>

      <Stack spacing={16}>
        {allReady && <Text>All players are ready to start.</Text>}
        <Stack spacing={48} direction="horizontal">
          <Button
            type="button"
            text={isReady ? "Cancel" : "I'm ready"}
            onClick={handlePlayerReady}
            variant="secondary"
          />
          {allReady && (
            <form method="POST" action={`/lobby/${lobbyId}/start`}>
              <input type="hidden" name="userId" value={userId} />
              <Button type="submit" text="Start expedition" />
            </form>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

const styles = stylex.create({
  ul: {
    display: "flex",
    flexDirection: "column",

    gap: spacing._8,

    width: "100%",
    margin: 0,
    padding: 0,
  },
});
