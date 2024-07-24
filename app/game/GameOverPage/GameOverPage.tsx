import { doc, onSnapshot } from "firebase/firestore";
import { Game } from "functions/src/game";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";
import { BaseLayout } from "~/ui/Layout/BaseLayout";
import { Link } from "~/ui/Link/Link";

type Props = {
  gameId: string;
  userId: string;
};

export default function GameOverPage({ gameId, userId }: Props) {
  const [state, setState] = useState<Game | null>(null);

  // Subscribe to realtime game state
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game", gameId), (doc) => {
      const data = doc.data() as Game | undefined;

      if (!data) {
        return;
      }

      setState(data);
    });

    return () => unsub();
  }, [gameId]);

  return (
    <BaseLayout>
      <h1>Game over:</h1>
      <p>You are: {userId}</p>
      <p>Game id: {gameId}</p>

      <Link to="/">Index</Link>

      <div>
        <h2>Players</h2>
        <ul>
          {state?.players.map((player) => (
            <li key={player.id}>
              <p>Player: {player.id}</p>
              <p>Score: {player.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </BaseLayout>
  );
}
