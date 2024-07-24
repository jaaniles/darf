import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { playerAction } from "~/game/playerAction.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { roundId, gameId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const action = formData.get("action") as "continue" | "exit";

  if (!userId || !action || !roundId) {
    return redirect("/");
  }

  const response = await playerAction({ userId, roundId, action });

  if (!response) {
    console.error("Player action failed");
  }

  return redirect(`/game/${gameId}`);
};
