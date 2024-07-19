import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { arrayUnion } from "firebase/firestore";
import { db } from "~/firebase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const lobbyId = formData.get("lobbyId") as string;

  if (!lobbyId) {
    return redirect("/");
  }

  const success = await db
    .collection("lobbies")
    .doc(lobbyId)
    .set(
      {
        players: arrayUnion("player123"),
      },
      { merge: true }
    );

  console.log("Successore?", success);
};
