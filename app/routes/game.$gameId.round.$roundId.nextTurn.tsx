import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { nextTurn } from "~/game/nextTurn.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { roundId, gameId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId || !roundId) {
    return redirect("/");
  }

  const response = await nextTurn({ userId, roundId });

  if (!response) {
    console.error("Next turn failed");
    return null;
  }

  return redirect(`/game/${gameId}`);
};
