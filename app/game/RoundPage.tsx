import { doc, onSnapshot } from "firebase/firestore";
import { Round } from "functions/src/round";
import { useEffect, useState } from "react";
import { db } from "~/firebase.client";

type Props = {
  roundId: string;
  userId: string;
};

export default function RoundPage({ roundId, userId }: Props) {
  const [state, setState] = useState<Round | null>(null);

  useEffect(() => {
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

  return (
    <div>
      <h1>Round {roundId}</h1>
      <p>You are: {userId}</p>

      <div
        style={{
          border: isInNudgeList ? "1px solid red" : "1px solid transparent",
        }}
      >
        <p>Choose your action this turn:</p>
        <form method="POST" action={`/game/${roundId}/playerAction`}>
          <input type="hidden" name="userId" value={userId} />
          <button type="submit" name="action" value="continue">
            Continue
          </button>
          <button type="submit" name="action" value="exit">
            Exit
          </button>
        </form>
      </div>

      <hr />
      <p>Next turn</p>
      <form method="POST" action={`/game/${roundId}/nextTurn`}>
        <input type="hidden" name="userId" value={userId} />
        <button type="submit">Continue</button>
      </form>

      <hr />
      <h2>Board:</h2>
      {state?.board.map((tile, i) => <div key={i}>{tile.name}</div>)}

      <hr />
      <h2>Data</h2>

      <h3>State</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre>

      <h3>Board</h3>
      <pre>{JSON.stringify(state?.board, null, 2)}</pre>
    </div>
  );
}
