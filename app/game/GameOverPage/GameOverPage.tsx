import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Game } from "functions/src/game";

import { db } from "~/firebase.client";
import { BaseLayout } from "~/ui/Layout/BaseLayout";
import { Link } from "~/ui/Link/Link";
import { UserProfile } from "~/auth/getUserProfile";

type Props = {
  gameId: string;
  user: UserProfile;
};

export default function GameOverPage({ gameId, user }: Props) {
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
    <BaseLayout user={user}>
      <h1>Game over:</h1>
      <p>You are: {user.userId}</p>
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
