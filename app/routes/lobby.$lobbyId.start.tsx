import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { lobbyStart } from "~/lobby/lobbyStart.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { lobbyId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId || !lobbyId) {
    return redirect("/");
  }

  const response = await lobbyStart({
    userId,
    lobbyId,
  });

  if (!response) {
    console.error("Failed to start lobby");
    return redirect("/");
  }

  return redirect(`/game/${response.gameId}`);
};
