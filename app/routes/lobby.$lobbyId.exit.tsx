import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { exitLobby } from "~/lobby/exitLobby.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { lobbyId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId || !lobbyId) {
    return redirect("/");
  }

  const response = await exitLobby({ userId, lobbyId });

  if (!response) {
    console.error("Failed to exit lobby");
    return redirect("/");
  }

  return redirect(`/`);
};
