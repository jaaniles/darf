import { useNavigate } from "@remix-run/react";
import stylex from "@stylexjs/stylex";
import { doc, onSnapshot } from "firebase/firestore";
import { Game } from "functions/src/game";
import { Round } from "functions/src/round";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";
import { jsonPostRequest } from "~/request.client";
import { Button } from "~/ui/Button/Button";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";
import { Text } from "~/ui/typography/Text";

type Props = {
  gameId: string;
  userId: string;
};

export default function GamePage({ gameId, userId }: Props) {
  const [roundId, setRoundId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<Game | null>(null);
  const [state, setState] = useState<Round | null>(null);
  const navigate = useNavigate();

  // Subscribe to realtime game state
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game", gameId), (doc) => {
      const data = doc.data() as Game | undefined;

      if (!data) {
        return;
      }

      setGameState(data);

      if (data.gameOver) {
        navigate(`/game/${gameId}/results`);
        return;
      }

      setRoundId(data.currentRoundId);
    });

    return () => unsub();
  }, [gameId, navigate]);

  // Subscribe to realtime round state
  useEffect(() => {
    if (!roundId) {
      return;
    }

    const unsub = onSnapshot(doc(db, "round", roundId), (doc) => {
      const data = doc.data() as Round | undefined;

      if (!data) {
        return;
      }

      setState(data);
    });

    return () => unsub();
  }, [roundId]);

  const handlePlayerContinue = () => {
    jsonPostRequest(`/playerAction?action=continue`, {
      roundId,
      user: userId,
    });
  };

  const handlePlayerExit = () => {
    jsonPostRequest(`/playerAction?action=exit`, {
      roundId,
      user: userId,
    });
  };

  const handleNextTurn = () => {
    jsonPostRequest(`/nextTurn`, {
      roundId,
      user: userId,
    });
  };

  const isInNudgeList = state?.nudge.includes(userId);
  const hasChosenAction =
    state?.continuePlayers.includes(userId) ||
    state?.exitPlayers.includes(userId);

  if (!state) {
    return null;
  }

  const board = state?.board.reverse() || [];

  return (
    <Stack spacing={16}>
      <Headline size="sm" as="h2">
        Round {gameState?.round}
      </Headline>
      <div
        style={{
          border: isInNudgeList ? "1px solid red" : "1px solid transparent",
        }}
      ></div>

      <Headline as="h2" size="sm" weight="bold">
        Board:
      </Headline>
      <div {...stylex.props(styles.board)}>
        <Stack spacing={8}>
          {board.map((tile, i) => (
            <Text key={i}>{tile.name}</Text>
          ))}
        </Stack>
      </div>

      <Stack spacing={8}>
        <Text>
          Action: {state?.continuePlayers.includes(userId) && "✅"}{" "}
          {state?.exitPlayers.includes(userId) && "❌"}
        </Text>

        <Stack spacing={16} direction="horizontal">
          <Button
            type="button"
            text="Continue"
            onClick={handlePlayerContinue}
          />
          <Button type="button" text="Exit" onClick={handlePlayerExit} />
        </Stack>
      </Stack>

      {hasChosenAction && (
        <Button type="submit" text="Next turn" onClick={handleNextTurn} />
      )}
    </Stack>
  );
}

const styles = stylex.create({
  board: {
    overflow: "auto",
  },
});
