import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";

export const loader: LoaderFunction = async ({ params }) => {
  const { lobbyId } = params;

  if (!lobbyId) {
    redirect("/");
    return;
  }

  return {
    lobbyId,
  };
};

type Card = {
  id: number;
  value: string;
  name: string;
};

type GameState = {
  state: "string";
  FINISHED?: boolean;
  shuffledCards: Card[];
  deck: Card[];
  counter: number;
  players: string[];
};

export default function OngoingLobby() {
  const { lobbyId } = useLoaderData<typeof loader>();
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "lobbies", lobbyId), (doc) => {
      const data = doc.data() as GameState | undefined;

      if (!data) {
        return;
      }

      console.log("Current data: ", data);
      setGameState(data);
    });

    return () => unsub();
  }, [lobbyId]);

  return (
    <div className="font-sans p-4">
      <h1>Game state</h1>

      <div>
        {gameState?.players.map((player) => <p key={player}>{player}</p>)}
      </div>

      <ul>
        {gameState && (
          <>
            <li>State: {gameState.state}</li>
            <li>Counter: {gameState.counter}</li>
          </>
        )}
      </ul>
    </div>
  );
}
