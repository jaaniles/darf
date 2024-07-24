import { useNavigate } from "@remix-run/react";
import { doc, onSnapshot } from "firebase/firestore";
import { Game } from "functions/src/game";
import { Round } from "functions/src/round";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";
import { Button } from "~/ui/Button/Button";
import { Fieldset } from "~/ui/form/Fieldset";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  gameId: string;
  userId: string;
};

export default function GamePage({ gameId, userId }: Props) {
  const [roundId, setRoundId] = useState<string | null>(null);
  const [state, setState] = useState<Round | null>(null);
  const navigate = useNavigate();

  // Subscribe to realtime game state
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game", gameId), (doc) => {
      const data = doc.data() as Game | undefined;

      if (!data) {
        return;
      }

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

  const isInNudgeList = state?.nudge.includes(userId);
  const hasChosenAction =
    state?.continuePlayers.includes(userId) ||
    state?.exitPlayers.includes(userId);

  return (
    <div>
      <h1>Round {roundId}</h1>
      <p>You are: {userId}</p>
      <p>Game id: {gameId}</p>

      <div
        style={{
          border: isInNudgeList ? "1px solid red" : "1px solid transparent",
        }}
      >
        <p>Choose your action this turn:</p>
        <p>{state?.continuePlayers.includes(userId) && "✅"}</p>
        <p>{state?.exitPlayers.includes(userId) && "❌"}</p>
        <form
          method="POST"
          action={`/game/${gameId}/round/${roundId}/playerAction`}
        >
          <Fieldset>
            <Stack spacing={16} direction="horizontal">
              <input type="hidden" name="userId" value={userId} />
              <Button
                type="submit"
                name="action"
                value="continue"
                text="Delve deeper"
                variant="secondary"
              />
              <Button
                type="submit"
                name="action"
                value="exit"
                text="Go to camp"
                variant="secondary"
              />
            </Stack>
          </Fieldset>
        </form>
      </div>

      <hr />
      {hasChosenAction && (
        <div>
          <p>Next turn</p>
          <form
            method="POST"
            action={`/game/${gameId}/round/${roundId}/nextTurn`}
          >
            <input type="hidden" name="userId" value={userId} />
            <Button type="submit" text="Next turn" />
          </form>
        </div>
      )}

      <hr />
      <h2>Board:</h2>
      {state?.board.map((tile, i) => <div key={i}>{tile.name}</div>)}

      <hr />

      <h3>State</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
